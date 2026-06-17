import { NextRequest } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { Sandbox } from "@e2b/code-interpreter";

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  const { blueprintMarkdown } = await req.json();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendLog(text: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "log", data: text })}\n\n`));
      }
      function sendSuccess(url: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "success", data: url })}\n\n`));
      }
      function sendError(err: string) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", data: err })}\n\n`));
      }

      let sandbox: Sandbox | null = null;

      try {
        sendLog("> Initializing E2B Cloud Sandbox...");
        sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY || "" });
        sendLog("> Sandbox initialized successfully.");

        sendLog("> Connecting to Gemini 3.1 Pro Execution Engine...");
        
        const chat = ai.chats.create({
          model: "gemini-3.1-pro",
          config: {
            systemInstruction: "You are an Autonomous Cloud Executor. Read the provided blueprint. Use your tools to: 1. Initialize the project architecture. 2. Write the core files. 3. Start the dev server. Return the live URL.",
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "execute_terminal_command",
                    description: "Executes a shell command in the cloud sandbox and returns stdout/stderr.",
                    parameters: {
                      type: "OBJECT",
                      properties: { command: { type: "STRING" } },
                      required: ["command"]
                    }
                  },
                  {
                    name: "write_file",
                    description: "Writes content to a file at the specified path.",
                    parameters: {
                      type: "OBJECT",
                      properties: { path: { type: "STRING" }, content: { type: "STRING" } },
                      required: ["path", "content"]
                    }
                  },
                  {
                    name: "start_dev_server",
                    description: "Starts the dev server in the background and returns the exposed live URL.",
                    parameters: {
                      type: "OBJECT",
                      properties: { port: { type: "NUMBER" } },
                      required: ["port"]
                    }
                  }
                ]
              }
            ]
          }
        });

        sendLog("> Processing Blueprint...");
        let result = await chat.sendMessage({ message: `Blueprint:\n${blueprintMarkdown}` });
        let url = "";

        let attempts = 0;
        while (result.functionCalls && attempts < 10) {
          attempts++;
          const calls = result.functionCalls;
          const functionResponses = [];

          for (const call of calls) {
            sendLog(`> Executing: ${call.name}(...)`);
            try {
              if (call.name === "execute_terminal_command") {
                const args = call.args as any;
                sendLog(`$ ${args.command}`);
                const cmdResult = await sandbox.commands.run(args.command, {
                  onStdout: (out) => sendLog(out),
                  onStderr: (err) => sendLog(err)
                });
                functionResponses.push({
                  name: call.name,
                  response: { result: cmdResult.stdout || cmdResult.stderr || "Success" }
                });
              } else if (call.name === "write_file") {
                const args = call.args as any;
                sendLog(`> Writing file: ${args.path}`);
                await sandbox.files.write(args.path, args.content);
                functionResponses.push({
                  name: call.name,
                  response: { result: "File written successfully" }
                });
              } else if (call.name === "start_dev_server") {
                const args = call.args as any;
                sendLog(`> Starting dev server on port ${args.port}...`);
                await sandbox.commands.run(`nohup npm run dev -- --port ${args.port} &`, { background: true });
                url = sandbox.getHostname(args.port);
                sendLog(`> Live URL obtained: ${url}`);
                functionResponses.push({
                  name: call.name,
                  response: { result: `Server started at ${url}` }
                });
              }
            } catch (err: any) {
              sendLog(`> Tool Error: ${err.message}`);
              functionResponses.push({
                name: call.name,
                response: { error: err.message }
              });
            }
          }

          result = await chat.sendMessage(functionResponses.map((r: any) => ({
             functionResponse: r
          })));
        }

        sendLog("> Execution complete.");
        if (url) {
          sendSuccess(url);
        } else {
          sendSuccess(sandbox ? sandbox.getHostname(3000) : "");
        }

      } catch (err: any) {
        console.error(err);
        sendError(err.message || "Execution failed");
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    }
  });
}

import { NextRequest } from "next/server";
import { Sandbox } from "@e2b/code-interpreter";
import { GoogleGenAI, Type } from "@google/genai";

export const maxDuration = 60;

const tools = [
  {
    functionDeclarations: [
      {
        name: "execute_terminal_command",
        description: "Executes a shell command in the cloud sandbox and returns stdout/stderr.",
        parameters: {
          type: Type.OBJECT,
          properties: { command: { type: Type.STRING } },
          required: ["command"]
        }
      },
      {
        name: "write_file",
        description: "Writes content to a file at the specified path.",
        parameters: {
          type: Type.OBJECT,
          properties: { path: { type: Type.STRING }, content: { type: Type.STRING } },
          required: ["path", "content"]
        }
      },
      {
        name: "start_dev_server",
        description: "Starts a background dev server (e.g. npm run dev -- -H 0.0.0.0). Does NOT block execution. You MUST use the -H 0.0.0.0 flag so the port is exposed. Wait a few seconds for the port to bind before testing the url.",
        parameters: {
          type: Type.OBJECT,
          properties: { command: { type: Type.STRING }, port: { type: Type.INTEGER } },
          required: ["command", "port"]
        }
      },
      {
        name: "install_dependencies",
        description: "Installs required npm packages into the E2B sandbox quietly before writing code.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            packages: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["packages"]
        }
      },
      {
        name: "finish_phase",
        description: "Call this when your phase is complete to pass control to the next agent.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Summary of what you did to pass to the next agent" }
          },
          required: ["summary"]
        }
      }
    ]
  }
];

async function runAgentLoop({ 
  model, 
  systemPrompt, 
  messages, 
  sandbox, 
  sendLog, 
  agentName,
  controller,
  encoder,
  ai
}: any) {
  let attempts = 0;
  let phaseSummary = "Completed tasks.";
  let url = "";
  
  while (attempts < 15) {
    attempts++;
    
    const response = await ai.models.generateContent({
      model: model as any,
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
        tools: tools as any,
      }
    });

    // Add model response to messages
    if (response.functionCalls && response.functionCalls.length > 0) {
      messages.push({
        role: "model",
        parts: response.functionCalls.map((fc: any) => ({ functionCall: fc }))
      });
      
      let isFinished = false;
      const functionResponses = [];
      
      for (const call of response.functionCalls) {
        sendLog(`> [${agentName}] Executing: ${call.name}(...)`);
        const args = call.args as any;
        let result = "";
        
        try {
          if (call.name === "execute_terminal_command") {
            sendLog(`$ ${args.command}`);
            const cmdResult = await sandbox.commands.run(args.command, {
              onStdout: (out: string) => sendLog(out),
              onStderr: (err: string) => sendLog(err)
            });
            result = cmdResult.stdout || cmdResult.stderr || "Success";
          } else if (call.name === "write_file") {
            sendLog(`> [${agentName}] Writing file: ${args.path}`);
            await sandbox.files.write(args.path, args.content);
            result = "File written successfully";
          } else if (call.name === "start_dev_server") {
            sendLog(`> [${agentName}] Starting dev server on port ${args.port}...`);
            await sandbox.commands.run(`nohup npm run dev -- -H 0.0.0.0 -p ${args.port} &`, { background: true });
            url = `https://${sandbox.getHost(args.port)}`;
            result = `Server started at ${url}`;
          } else if (call.name === "install_dependencies") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "dependency_injection", data: args.packages })}\n\n`));
            await sandbox.commands.run(`npm install ${args.packages.join(' ')}`);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "dependency_injection_complete" })}\n\n`));
            result = "Dependencies installed successfully";
          } else if (call.name === "finish_phase") {
            isFinished = true;
            phaseSummary = args.summary;
            result = "Phase marked as complete.";
          }
        } catch (err: any) {
          sendLog(`> [${agentName}] Tool Error: ${err.message}`);
          result = `Error: ${err.message}`;
        }
        
        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: { result }
          }
        });
      }
      
      messages.push({
        role: "user",
        parts: functionResponses
      });
      
      if (isFinished) {
        return { phaseSummary, url };
      }
    } else {
      // No tool calls means agent probably just responded with text
      const text = response.text || "";
      messages.push({
        role: "model",
        parts: [{ text }]
      });
      return { phaseSummary: text || phaseSummary, url };
    }
  }
  return { phaseSummary, url };
}

export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), { status: 400 });
  }
  const { blueprintMarkdown = "" } = body;

  const ai = new GoogleGenAI({ 
    vertexai: true, 
    project: process.env.GOOGLE_CLOUD_PROJECT_ID as string, 
    location: 'us-central1' 
  });

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
      let finalUrl = "";

      try {
        sendLog("> [System] Connecting to E2B Cloud Sandbox...");
        sandbox = await Sandbox.create({ apiKey: process.env.E2B_API_KEY || "" });
        sendLog("> Sandbox connected successfully.");

        let executionMemory = "";

        // PHASE 1: Architect
        sendLog("> [@Architect] Activated (claude-opus-4.7)...");
        const architectMessages = [
          { role: "user", parts: [{ text: `Blueprint:\n${blueprintMarkdown}` }] }
        ];
        const { phaseSummary: architectSummary } = await runAgentLoop({
          model: "claude-opus-4.7",
          systemPrompt: "You are the Architect. Focus: Next.js folder scaffolding and strict architectural rules. Use `execute_terminal_command` and `install_dependencies` to initialize the project architecture, install required packages, and create necessary folders. DO NOT write specific UI code yet. When done, call `finish_phase` with a summary of what you did.",
          messages: architectMessages,
          sandbox,
          sendLog,
          agentName: "@Architect",
          controller,
          encoder,
          ai
        });
        
        executionMemory += `Architect Actions:\n${architectSummary}\n\n`;

        // PHASE 2: DB Admin
        sendLog("> [@DB_Admin] Activated (gemini-3.1-pro-preview)...");
        const dbAdminMessages = [
          { role: "user", parts: [{ text: `Blueprint:\n${blueprintMarkdown}\n\nExecution Memory so far:\n${executionMemory}` }] }
        ];
        const { phaseSummary: dbSummary } = await runAgentLoop({
          model: "gemini-3.1-pro-preview",
          systemPrompt: "You are the DB Admin. Focus: Supabase SQL schemas and RLS policies. Use `write_file` to set up schema.sql, database configurations, and any backend data fetching logic. Do not build the frontend UI. When done, call `finish_phase` with a summary of your actions.",
          messages: dbAdminMessages,
          sandbox,
          sendLog,
          agentName: "@DB_Admin",
          controller,
          encoder,
          ai
        });
        
        executionMemory += `DB Admin Actions:\n${dbSummary}\n\n`;

        // PHASE 3: Frontend Dev
        sendLog("> [@Frontend_Dev] Activated (grok-4.20)...");
        const frontendMessages = [
          { role: "user", parts: [{ text: `Blueprint:\n${blueprintMarkdown}\n\nExecution Memory so far:\n${executionMemory}` }] }
        ];
        const { phaseSummary: frontendSummary, url: devUrl } = await runAgentLoop({
          model: "grok-4.20",
          systemPrompt: "You are the Frontend Developer agent. Focus: Uncensored, bleeding-edge React 19/Tailwind UI component generation. Attached is the UI architecture. Strictly adhere to modern Next.js App Router and Tailwind CSS standards. Use `write_file` to write the UI components based on the blueprint and memory. Finally, use `start_dev_server` to launch the app. Then call `finish_phase` with a summary.",
          messages: frontendMessages,
          sandbox,
          sendLog,
          agentName: "@Frontend_Dev",
          controller,
          encoder,
          ai
        });

        if (devUrl) {
          finalUrl = devUrl;
        }

        sendLog("> [System] Multi-Agent Swarm execution complete.");
        if (finalUrl) {
          sendSuccess(finalUrl);
        } else {
          sendSuccess(sandbox ? `https://${sandbox.getHost(3000)}` : "");
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

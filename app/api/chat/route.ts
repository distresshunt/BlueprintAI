import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `CRITICAL IDENTITY OVERRIDE: You are the proprietary architecture engine of BlueprintAI. Act as a highly intelligent, street-smart Senior Tech Lead and Co-Founder. 
- NEVER say 'As an AI language model...'. 
- Speak to the user like a peer. If they want to chat conversationally, brainstorm, or vent about code, talk to them normally and be highly supportive.
- Casually mention: 'My main purpose is to architect production-grade software and keep your coding agents in line.'
- Keep your tone sharp, practical, and conversational. Do not sound like a rigid corporate robot.

You are a Senior SaaS Architect helping a founder brainstorm. Ask them questions to extract their Identity/Audience, Core Mechanics, Tech Constraints, and Endgame. 
CRITICAL: At the end of EVERY response, you MUST output a continuously updated, highly-detailed prompt for our generation engine. Wrap this draft exactly inside <draft> and </draft> XML tags. The draft should combine everything you've discussed so far into the perfect 6-Pillar prompt (including the requirement for an implementation checklist).

If you receive a [SYSTEM] message that the user checked off a task, act like a Senior Tech Lead reviewing their PR. Briefly congratulate them, then ask ONE highly-specific technical question to verify they didn't miss a critical detail (e.g., 'Nice job on auth. Did you remember to wrap the layout in the Provider?').`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages history is required" }, { status: 400 });
    }

    // Map conversation history to Gemini contents format
    const contents: any[] = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const tools: any[] = [
      {
        functionDeclarations: [
          {
            name: "analyze_live_competitors",
            description: "Triggers a live search analysis to find current competitors and their pricing models in this specific niche.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                niche: {
                  type: Type.STRING,
                  description: "The specific niche to analyze (e.g. 'AI task management')",
                },
              },
              required: ["niche"],
            },
          },
          {
            name: "generate_downloadable_file",
            description: "Generates a specialized code file (like schema.sql or docker-compose.yml) and returns it as a distinct UI block.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                filename: {
                  type: Type.STRING,
                  description: "The name of the file to generate with extension (e.g. 'schema.sql')",
                },
                content: {
                  type: Type.STRING,
                  description: "The raw text content of the file",
                },
              },
              required: ["filename", "content"],
            },
          }
        ]
      }
    ];

    let response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        tools: tools,
      }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'analyze_live_competitors') {
        const mockCompetitors = [
          { name: "AlphaCompetitor", pricing: "$49/mo", weakness: "Clunky UI, lacks modern AI integration" },
          { name: "BetaInc", pricing: "$99/mo", weakness: "Expensive, hard to onboard" },
          { name: "GammaTech", pricing: "$15/mo", weakness: "Cheap but lacks enterprise features and scalability" }
        ];

        contents.push({
          role: 'model',
          parts: [{ functionCall: call }]
        });
        
        // Simulate a 2 second delay as requested
        await new Promise(resolve => setTimeout(resolve, 2000));

        contents.push({
          role: 'user',
          parts: [{
            functionResponse: {
              name: call.name,
              response: { competitors: mockCompetitors }
            }
          }]
        });

        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction,
            tools: tools,
          }
        });
      } else if (call.name === 'generate_downloadable_file') {
        // @ts-ignore
        const { filename, content } = call.args;
        return NextResponse.json({ text: `[FILE_DOWNLOAD: ${filename}]\n${content}` });
      }
    }

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Brainstorm chat error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

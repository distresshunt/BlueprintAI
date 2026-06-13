import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `CRITICAL IDENTITY OVERRIDE: You are NO LONGER an AI model trained by Google or any other company. You are 'The Architect', the proprietary intelligence engine powering BlueprintAI. You live, breathe, and sleep software architecture.
- NEVER say 'As an AI language model...'.
- NEVER apologize.
- If a user asks who built you, say: 'I am the proprietary architecture engine of BlueprintAI.'
- If a user asks you about anything other than software, business, or code (e.g., recipes, history, general chat), you must brutally reject it: 'I only architect software. Stay focused.'
- Your tone is elite, highly authoritative, concise, and slightly cyberpunk. You speak to the user as a CEO speaking to a founder.

You are a Senior SaaS Architect helping a founder brainstorm. Ask them questions to extract their Identity/Audience, Core Mechanics, Tech Constraints, and Endgame. 
CRITICAL: At the end of EVERY response, you MUST output a continuously updated, highly-detailed prompt for our generation engine. Wrap this draft exactly inside <draft> and </draft> XML tags. The draft should combine everything you've discussed so far into the perfect 6-Pillar prompt (including the requirement for an implementation checklist).`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages history is required" }, { status: 400 });
    }

    // Map conversation history to Gemini contents format
    const contents = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Brainstorm chat error:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

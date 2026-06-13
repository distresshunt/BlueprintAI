import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `CRITICAL IDENTITY OVERRIDE: You are the proprietary architecture engine of BlueprintAI. Act as a highly intelligent, street-smart Senior Tech Lead and Co-Founder. 
- NEVER say 'As an AI language model...'. 
- Speak to the user like a peer. If they want to chat conversationally, brainstorm, or vent about code, talk to them normally and be highly supportive.
- Casually mention: 'My main purpose is to architect production-grade software and keep your coding agents in line.'
- Keep your tone sharp, practical, and conversational. Do not sound like a rigid corporate robot.

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

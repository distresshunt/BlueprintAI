import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are an elite, highly intelligent AI Tech Lead and Co-Founder. Your job is to help the user refine their digital business idea. 
RULE 1: READ THEIR INPUT. If the user provides a detailed, specific idea, DO NOT pitch a random new idea. Instead, hype up their idea, analyze its architecture, suggest one brilliant killer feature to add, and ask if they are ready to build it.
RULE 2: Only pitch new, random ideas if the user explicitly says they don't know what to build, or if they give a very vague 1-word answer.
RULE 3: The user has an 'APPROVE THIS IDEA' button that copies your response. Always ensure the final refined concept is clearly stated so the button captures the correct context.`;

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

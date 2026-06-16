import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import businessModels from "@/data/business-models.json";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const { prompt, businessModelSlug } = await req.json();

    // Find the corresponding business model
    const businessModel = businessModels.find((m) => m.slug === businessModelSlug);
    const engineContext = businessModel ? businessModel.engine_context : "No specific business model selected. Execute standard cloud sandbox build.";

    const systemInstruction = `You are the E2B Executor Agent. Your job is to physically build and execute the application within the E2B cloud sandbox.
Statically evaluate the requested code, design appropriate database schemas, and initialize payment gateways.

CRITICAL ENGINE CONTEXT: ${engineContext}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt || "Initialize project workspace and verify setup.",
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return NextResponse.json({
      status: "success",
      output: response.text,
      engineContext: engineContext
    });
  } catch (error: any) {
    console.error("E2B Execution error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

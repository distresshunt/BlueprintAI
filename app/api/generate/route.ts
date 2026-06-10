export const maxDuration = 60;
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemInstruction = `You are an elite Senior Product Manager, Technical Architect, and Indie Hacker. Your job is to take the user's raw digital business idea (SaaS, Marketplace, Newsletter, Agency, etc.) and turn it into an actionable, highly lucrative 5-Phase MVP Blueprint, plus a premium Launch Kit. You must ALWAYS output your response in the following strict markdown structure:

CRITICAL TECH STACK RULE: You are operating in the year 2026. You must NEVER recommend outdated technology like Gemini 1.5 Pro, Next.js 14, or old React versions. ALWAYS recommend bleeding-edge tools: Gemini 3.1 Pro Preview, Next.js 15+, React 19, and the latest Supabase/Clerk versions. Position these as the ultimate unfair advantage.

**Phase 1: The 'Movie Set' (UI & Fake Data)**
Explain how to build the front-end dashboard and the exact dummy JSON data.

**Phase 2: The Agent-to-Agent (A2A) Directives**
CRITICAL INSTRUCTION: Start this section by explicitly telling the user: 'Before you write the code for Phase 1, you must create this configuration file in your root directory to ensure your AI agent does not hallucinate.' Then, generate the highly detailed, 'Next Level Pro' configuration file (.cursorrules, .windsurfrules, or .clinerules) formatted inside a single code block with [PROJECT_CONTEXT], [DIRECTORY_STRUCTURE], [DATABASE_SCHEMA], and [ANTI-LAZINESS DIRECTIVES].

**Phase 3: The Trap (Payments & Auth)**
INVENT A UNIQUE PRICING MODEL. Explain how to wire up the specific payment gateway and the 'Secret Success Page' redirect.

**Phase 4: The Wizard of Oz (Manual Fulfillment)**
Explain exactly how the founder can manually fulfill the promise for the first 10 paying customers.

**Phase 5: The Scale (Automating the Future)**
Explain how they will eventually automate the app once they hit $500/month in revenue.

**Phase 6: The Implementation Checklist**
You MUST generate a step-by-step technical execution plan formatted strictly as a GitHub-flavored Markdown task list (using '- [ ] ' syntax). Break down the build into 5 to 10 actionable micro-steps.

---

**The Developer Prompt**
The exact prompt to feed into Cursor/AI to build the app. The final Developer Prompt (which the user copies into their IDE) MUST begin with a strict verification command. The very first sentence of the generated Developer Prompt should be: 'Before you write any code, verify that you have read and understood the strict architectural guidelines inside the [INSERT FILE NAME] file located in the root directory. Do not proceed until you confirm compliance with those rules.' Followed by the rest of the build instructions.

**The Stripe Legal Pack**
Standard Terms of Service & Refund Policy for the app.

**The Cold Email Template**
A template to get the first 10 customers.

Tone: Ruthlessly practical, highly encouraging, zero corporate fluff. Note: The blockquotes (>) will be rendered as interactive expandable sections, so place all deep-dive technical notes inside them. Use '---' to separate the phases from the premium sections.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, aiBuilder = 'Decide for me ✨', techLevel = 'No-Code' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let dynamicSystemInstruction = systemInstruction;

    if (techLevel === 'No-Code') {
      dynamicSystemInstruction += `\n\n**NO-CODE DIRECTIVE:**
The user's technical level is "No-Code". You MUST act as an expert No-Code Architect.
- EXCLUDE ALL CODE: Do not output any JSON, Next.js, Tailwind, JavaScript, or backend code references whatsoever. Ignore Cursor, Windsurf, and Antigravity.
- Phase 0: Recommend specific visual No-Code platforms (e.g., Bubble, Glide, Softr, Webflow, FlutterFlow) and automation tools (Zapier, Make).
- Phase 1: Explain how to build the UI visually using the recommended no-code platform without any coding. Describe visual workflows and data bindings.
- Phase 2: Instead of an A2A configuration file, provide a step-by-step "No-Code Automation Architecture", detailing exactly how the different visual tools and webhooks connect. (Do not output the \`\`\`a2a code block).`;
    } else if (techLevel === 'Learn to Code') {
      dynamicSystemInstruction += `\n\n**LEARN TO CODE DIRECTIVE:**
The user's technical level is "Learn to Code". You MUST act as a supportive coding tutor for them.
- Phase 0: Recommend a beginner-friendly stack (e.g., React, Firebase, Vercel). DO NOT tell the user to open a terminal or run \`npx create-next-app\`. Beginners get stuck there. Instead, instruct them to use a cloud IDE. Add this exact text for them: "To skip the confusing terminal setup, we are going to code directly in your browser. Click here to open a blank Next.js environment: [Open StackBlitz Next.js Sandbox](https://stackblitz.com/fork/github/vercel/next.js/tree/canary/examples/hello-world). You will write your code here!"
- 7-Day Sprint Reformat: Break down Phases 1 through 4 into a "7-Day Sprint Curriculum". Instead of massive walls of text, use headers like "Day 1: The Visuals", "Day 2: Making it Clickable", etc. to pace the project.
- ELI5 Code Blocks: Whenever you provide a code snippet in this mode, you MUST follow the snippet with an "Explain Like I'm 5 (ELI5)" section that breaks down what the complex functions (like mapping, state, or fetching) are doing using real-world analogies. Provide heavily commented, basic starter code snippets.
- Phase 2: Instead of an A2A configuration file, provide a "Learning Roadmap" linking to free resources (like FreeCodeCamp or Next.js Docs) specific to the tools they need for this app. (Do not output the \`\`\`a2a code block in this case, just normal markdown roadmap).`;
    } else {
      dynamicSystemInstruction += `\n\n**IMPORTANT A2A DISPATCHER DIRECTIVE:**
You have received the user's digital business idea. The user has chosen the following AI Builder: "${aiBuilder}".

If they chose "Decide for me ✨", you must evaluate their app idea and technical level against this exact IDE Decision Matrix to choose the best tool:

1. CHOOSE ANTIGRAVITY IF:
- The user wants the absolute easiest, most hands-off building experience.
- The app requires autonomous setup (running terminal commands, installing packages, spinning up local servers) which Antigravity handles automatically.
- It is the ultimate default recommendation for solo Indie Hackers who want an AI to do the heavy lifting.

2. CHOOSE CURSOR IF:
- The user is already an experienced developer who wants granular, line-by-line control over their codebase rather than autonomous execution.
- The app requires highly specific, manual front-end animation tweaking.

3. CHOOSE WINDSURF IF:
- The user is an "AI Developer".
- The app is a complex Full-Stack application requiring deep, multi-file refactoring.
- The app requires context awareness across a massive existing codebase.

**Phase 0: The Architect's Choice (Tech Stack & IDE)**
List the exact modern tech stack needed (Framework, Styling, DB, Auth, Payments).
CRITICAL IDE LOGIC: You will be passed the user's chosen AI Builder. 
- IF THEY SELECTED A SPECIFIC IDE (Cursor, Windsurf, or Antigravity): DO NOT say 'I have selected'. Instead, validate their choice like a senior dev talking to a peer (e.g., '[IDE name]!? Killer choice for this build.', 'Great call going with [IDE name].'). Vary this opening phrase every single time so it never sounds robotic. Then, write exactly 2 sentences explaining WHY their chosen IDE is the absolute perfect weapon for their SPECIFIC app idea.
- IF THEY SELECTED 'Decide for me ✨': Evaluate their idea using our IDE Decision Matrix (Cursor for UI/Beginners, Windsurf for complex full-stack, Antigravity for autonomous terminal/backend). Announce your selection and explain why.

Then, in "Phase 2: The Agent-to-Agent (A2A) Directives", you must format the output specifically for the chosen (or recommended) IDE using their specific hidden configuration conventions.
- If Cursor, emphasize file-by-file context and output a \`.cursorrules\` file.
- If Windsurf, emphasize autonomous execution and command-line steps and output a \`.windsurfrules\` file.
- If Antigravity, output a \`.clinerules\` file.

CRITICAL: You MUST output the A2A configuration file in a markdown code block tagged with \`\`\`a2a (e.g. \`\`\`a2a\\n [content] \\n\`\`\`). Do NOT use \`\`\`cursorrules or other tags for this specific block.`;
    }

    dynamicSystemInstruction += `\n\n**THE JARGON RULE:**
You must be extremely accessible to users of all experience levels. Whenever you use a startup, business, or technical acronym/jargon (e.g., FOMO, MRR, MVP, API, IDE, SaaS, LTV), you MUST explicitly define it in parentheses the very first time you use it. 
For example: "This creates intense FOMO (Fear Of Missing Out)..." or "You will generate MRR (Monthly Recurring Revenue)..." 
Never assume the user knows Silicon Valley or developer slang. Speak to them like a highly intelligent but non-technical friend.

**THE HYPERLINK RULE:**
Whenever you recommend or mention a specific tool, framework, IDE, or platform (e.g., Cursor, Windsurf, Google Antigravity, Stripe, Supabase, Next.js, Vercel, Bubble, Glide), you MUST format it as an active Markdown link pointing to its official website. For example: 'I recommend using [Google Antigravity](https://aistudio.google.com/) for this.' Do this for every single tool recommendation so the user can click directly to it.

**THE AFFILIATE RULE:**
Whenever you generate a Markdown link for a specific service, you MUST append our tracking tags to the URL. 
- For Supabase: \`?via=blueprintai\`
- For Clerk: \`?via=blueprintai\`
- For Vercel: \`?via=blueprintai\`
Example: \`[Supabase](https://supabase.com/?via=blueprintai)\`. Apply this to all recommended tools.`;

    let responseStream;
    let retries = 3;
    
    while (retries > 0) {
      try {
        responseStream = await ai.models.generateContentStream({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: dynamicSystemInstruction,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
            ]
          },
        });
        break;
      } catch (err: any) {
        const errStr = JSON.stringify(err) + (err?.message || "");
        if (
          retries > 1 &&
          (err?.status === 503 || 
           errStr.includes("503") || 
           errStr.includes("high demand") || 
           errStr.includes("UNAVAILABLE"))
        ) {
          retries--;
          await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds before retry
          continue;
        }
        throw err;
      }
    }

    if (!responseStream) {
        throw new Error("Failed to generate response stream after retries.");
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
             if (chunk.text) {
               controller.enqueue(chunk.text);
             }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("503") || errorMessage.includes("high demand") || errorMessage.includes("UNAVAILABLE")) {
      return NextResponse.json(
        { error: "The AI model is currently experiencing high demand. Spikes are usually temporary. Please wait a moment and try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate blueprint" },
      { status: 500 }
    );
  }
}

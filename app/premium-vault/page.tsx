"use client";

import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Bot,
  CheckCircle,
  Mic,
  Terminal,
  ChevronUp,
  ChevronDown,
  Copy,
  Rewind,
  Play,
  Pause,
  FastForward,
  Zap,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Sandpack } from "@codesandbox/sandpack-react";
import { Navbar } from "@/components/Navbar";
import { ResourceHub } from "@/components/ResourceHub";
function VaultContent() {
  const { userId } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const isAdmin =
    user?.emailAddresses?.[0]?.emailAddress === "exoscommand@gmail.com";
  const [activeTab, setActiveTab] = useState<"blueprint" | "workspace">(
    "blueprint",
  );
  const [blueprintData, setBlueprintData] = useState<string>("");
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(true);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "ai"; content: string; type?: "thought" | "message" }[]
  >([
    {
      role: "ai",
      content:
        "Welcome to the Premium Vault! I'm your AI Co-Founder. Let me know if you need help executing any phase of your blueprint.",
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState("");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [sandboxCode, setSandboxCode] = useState<string>("");
  const [highlightMenu, setHighlightMenu] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [isHighlightCopied, setIsHighlightCopied] = useState(false);
  const [isNewGeneration, setIsNewGeneration] = useState(false);
  const [ideaPrompt, setIdeaPrompt] = useState<string>("");
  const [techLevel, setTechLevel] = useState<string>("No-Code");
  const [aiBuilder, setAiBuilder] = useState<string>("Cursor");
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const router = useRouter();

  const hasGithub =
    user?.externalAccounts?.some(
      (acc) =>
        (acc.provider as string) === "oauth_github" ||
        (acc.provider as string).includes("github"),
    ) || false;
  const githubAccount = user?.externalAccounts?.find(
    (acc) =>
      (acc.provider as string) === "oauth_github" ||
      (acc.provider as string).includes("github"),
  );
  const githubUsername = githubAccount?.username || githubAccount?.emailAddress;

  const handleGithubDeploy = async () => {
    try {
      setIsGithubLoading(true);

      const res = await fetch("/api/github-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintMarkdown: blueprintData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deploy");

      setGithubRepoUrl(data.url);
      window.open(data.url, "_blank");
    } catch (err: any) {
      console.error("Deploy failed:", err.message);
      alert("Deploy failed: " + err.message);
    } finally {
      setIsGithubLoading(false);
    }
  };

  const cliCommands = useMemo(() => {
    if (!blueprintData) return [];

    const commands: string[] = [];
    // Extract block commands
    const regex = /```(?:bash|sh|shell)([\s\S]*?)```/gi;
    let match;
    while ((match = regex.exec(blueprintData)) !== null) {
      const block = match[1].trim();
      const lines = block.split("\n");
      for (const line of lines) {
        if (line.trim() && !line.trim().startsWith("#")) {
          commands.push(line.trim());
        }
      }
    }

    // Extract inline commands starting with npx, npm, yarn, pnpm
    const inlineRegex = /`([^`]+)`/g;
    let inlineMatch;
    while ((inlineMatch = inlineRegex.exec(blueprintData)) !== null) {
      const code = inlineMatch[1].trim();
      if (/^(npm|npx|yarn|pnpm)\s/.test(code)) {
        commands.push(code);
      }
    }

    return [...new Set(commands)];
  }, [blueprintData]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sessionId = searchParams.get("session_id");
  const isSuccess = searchParams.get("success") === "true";
  const showBanner = sessionId || isSuccess;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    async function loadData() {
      if (id) {
        setIsNewGeneration(false);
        try {
          const { data, error } = await supabase
            .from("blueprints")
            .select("blueprint_markdown, is_unlocked, idea_prompt, tech_level, ai_builder")
            .eq("id", id)
            .single();

          if (data) {
            if (data.is_unlocked === false && !isAdmin) {
              setIsLocked(true);
            } else {
              setIsLocked(false);
            }
            if (data.blueprint_markdown) {
              setBlueprintData(data.blueprint_markdown);
            }
            if (data.idea_prompt) {
              setIdeaPrompt(data.idea_prompt);
            }
            if (data.tech_level) {
              setTechLevel(data.tech_level);
            } else {
              setTechLevel("AI Developer");
            }
            if (data.ai_builder) {
              setAiBuilder(data.ai_builder);
            } else {
              setAiBuilder("Decide for me ✨");
            }

            if (userId) {
              // Mark user as Pro
              supabase
                .from("profiles")
                .upsert({ user_id: userId, is_pro: true })
                .then(({ error: profileError }) => {
                  if (profileError)
                    console.error("Failed to mark as Pro:", profileError);
                });

              // Optimistic Unlock in background
              supabase
                .from("blueprints")
                .update({ is_unlocked: true })
                .eq("user_id", userId)
                .then(({ error: unlockError }) => {
                  if (unlockError) {
                    console.error("Silent unlock failed:", unlockError);
                  }
                });
            }
            return;
          }
        } catch (e) {
          console.error("Failed to load from Supabase:", e);
        }
      }

      const localData = localStorage.getItem("blueprintData");
      const localIdea = localStorage.getItem("ideaPrompt");
      if (localData) {
        setBlueprintData(localData);
        if (localIdea) setIdeaPrompt(localIdea);
        setIsNewGeneration(true);
      } else {
        setBlueprintData(
          "# No Blueprint Found\nPlease generate a blueprint from the home page.",
        );
      }
    }

    loadData();
  }, [id, userId, isAdmin]);

  useEffect(() => {
    if (blueprintData) {
      setDisplayedLength(blueprintData.length);
      setIsCompleted(true);
      setIsPlaying(false);
    }
  }, [blueprintData]);

  useEffect(() => {
    if (!isPlaying || !blueprintData) return;

    const interval = setInterval(() => {
      setDisplayedLength((prev) => {
        // Calculate exact characters to add per tick to prevent jumping
        let charsToAdd = 3; // Default 1x speed (Fast human typing)
        if (playbackSpeed === 0.5) charsToAdd = 1; // Slow reading
        if (playbackSpeed === 2) charsToAdd = 15; // Skimming
        
        let nextLength = prev + charsToAdd;

        const justTyped = blueprintData.substring(prev, nextLength);
        if (justTyped.includes(']')) {
          const bracketIndex = prev + justTyped.indexOf(']');
          const parenEnd = blueprintData.indexOf(')', bracketIndex);
          if (parenEnd !== -1 && blueprintData.substring(bracketIndex, parenEnd).includes('](')) {
            nextLength = parenEnd + 1; // Instantly jump over the hidden URL string
          }
        }

        if (nextLength >= blueprintData.length) {
          clearInterval(interval);
          setIsPlaying(false);
          setIsCompleted(true);
          return blueprintData.length;
        }
        setIsCompleted(false);
        return nextLength;
      });
    }, 20); // 20ms tick rate for buttery smooth 50FPS animation

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, blueprintData]);

  useEffect(() => {
    const handleUpdateSandbox = (e: any) => {
      if (e.detail && e.detail.code) {
        setSandboxCode(e.detail.code);
      }
    };
    window.addEventListener("update-sandbox", handleUpdateSandbox);
    return () => window.removeEventListener("update-sandbox", handleUpdateSandbox);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.highlight-menu')) return;
      setHighlightMenu(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);
  const handlePivot = async (newTechLevel: string, newAiBuilder: string) => {
    if (newTechLevel === techLevel && newAiBuilder === aiBuilder) return;
    
    setTechLevel(newTechLevel);
    setAiBuilder(newAiBuilder);
    setIsRegenerating(true);
    
    const bridgeMessage = `Got it. Branching a new architecture for **${newTechLevel}**${newTechLevel === "AI Developer" ? ` using ${newAiBuilder}` : ""}. Give me 15 seconds...`;
    // @ts-ignore
    setChatHistory(prev => [...prev, { role: "ai", content: bridgeMessage }]);

    try {
      const promptToUse = ideaPrompt || "Build a modern SaaS application.";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: promptToUse, 
          techLevel: newTechLevel, 
          aiBuilder: newAiBuilder 
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");
      const decoder = new TextDecoder();
      let fullText = "";
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setBlueprintData(fullText);
      }

      localStorage.setItem("blueprintData", fullText);
      setDisplayedLength(0);
      setIsPlaying(true);
      
      if (userId && id) {
        const { data: newRow, error } = await supabase.from('blueprints').insert({
          user_id: userId,
          idea_prompt: promptToUse,
          blueprint_markdown: fullText,
          is_unlocked: true,
          tech_level: newTechLevel,
          ai_builder: newTechLevel === 'No-Code' ? 'None' : newAiBuilder
        }).select('id').single();
        
        if (newRow?.id) {
          router.push(`/premium-vault?id=${newRow.id}`);
        }
      }
    } catch (e) {
      console.error(e);
      // @ts-ignore
      setChatHistory(prev => [...prev, { role: "ai", content: "Sorry, the generation failed. Please try again." }]);
    } finally {
      setIsRegenerating(false);
    }
  };


  // Dwell Time Tracking
  const currentActivePhase = useMemo(() => {
    if (!blueprintData) return "INTRO";
    const renderText = blueprintData.substring(0, displayedLength);
    
    const phases = [
      { id: "Phase 6", name: "MASTER IMPLEMENTATION CHECKLIST" },
      { id: "Phase 5", name: "WIZARD OF OZ & SCALE" },
      { id: "Phase 4", name: "MONETIZATION" },
      { id: "Phase 3", name: "DEVELOPER BOILERPLATE PACK" },
      { id: "Phase 2", name: "A2A DIRECTIVES" },
      { id: "Phase 1", name: "MOVIE SET & UI" },
      { id: "Phase 0", name: "ARCHITECTURE" }
    ];

    for (const phase of phases) {
      if (renderText.includes(phase.id)) {
        return `PHASE ${phase.id.split(' ')[1]} (${phase.name})`;
      }
    }
    return "INTRO";
  }, [blueprintData, displayedLength]);

  // Predictive Thought Stream
  const announcedPhases = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    if (!blueprintData) return;

    const phases = [
      { id: "Phase 1", message: "[SYS_EVAL] Parsing DOM component tree. Validating Tailwind utility classes and Shadcn primitives against mock JSON schema..." },
      { id: "Phase 2", message: "[A2A_SYNC] Compiling AST constraints. Verifying .clinerules token density and strict execution directives for target IDE..." },
      { id: "Phase 3", message: "[AUTH_HANDSHAKE] Evaluating webhook payload logic. Verifying Stripe cryptographic signatures and Clerk JWT integration paths..." },
      { id: "Phase 4", message: "[DATA_PIPELINE] Analyzing PostgreSQL relational mapping. Auditing Row Level Security (RLS) policies for payload isolation..." },
      { id: "Phase 5", message: "[SCALE_ARCH] Validating horizontal scaling vectors and memory constraints..." },
      { id: "Phase 6", message: "[COMPILE_CHECK] Finalizing implementation checklist. Ensuring strict step-by-step dependency resolution..." }
    ];

    phases.forEach(phase => {
      const phaseIndex = blueprintData.indexOf(phase.id + ":");
      if (phaseIndex !== -1 && !announcedPhases.current.has(phase.id)) {
        // Trigger if we're rendering new text and approaching this phase, OR if scrolling past it in playback
        if (displayedLength >= phaseIndex - 50 && displayedLength <= phaseIndex + 100) {
          announcedPhases.current.add(phase.id);
          setChatHistory(prev => [
            ...prev,
            {
              role: "ai",
              content: phase.message,
              type: "thought"
            }
          ]);
        }
      }
    });
  }, [displayedLength, blueprintData]);

  const toggleRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setMicError("");
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Browser doesn't support voice input.");
      setTimeout(() => setMicError(""), 5000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        const message = finalTranscript.trim();
        setChatHistory((prev) => [...prev, { role: "user", content: message }]);
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: "ai",
              content: `I heard: "${message}". I am analyzing the blueprint to assist you.`,
            },
          ]);
        }, 1000);
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error !== "no-speech") {
        setMicError(`Mic error: ${event.error}`);
        setTimeout(() => setMicError(""), 5000);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleChatResponse = (data: any) => {
    if (data.text) {
      if (data.text.startsWith("[ACTION: NAVIGATE TO")) {
        const firstLineEnd = data.text.indexOf("\n");
        const actionLine = data.text.substring(0, firstLineEnd > -1 ? firstLineEnd : data.text.length);
        const targetPhase = actionLine.replace("[ACTION: NAVIGATE TO", "").replace("]", "").trim();
        const phaseIndex = blueprintData.indexOf(targetPhase);
        
        if (phaseIndex !== -1) {
          setDisplayedLength(phaseIndex);
          setIsPlaying(false);
          
          setTimeout(() => {
            const mdContainer = document.querySelector(".prose");
            if (mdContainer) {
               mdContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
        
        const msgContent = firstLineEnd > -1 ? data.text.substring(firstLineEnd + 1).trim() : "Pulling that up for you now.";
        if (msgContent) {
          setChatHistory((prev) => [...prev, { role: "ai", content: msgContent }]);
        }
      } else {
        setChatHistory((prev) => [...prev, { role: "ai", content: data.text }]);
      }
    }
  };

  const handleTaskChecked = async (taskText: string) => {
    const systemMsg = `[SYSTEM: The user just completed task: "${taskText}"]`;
    const updatedHistory = [
      ...chatHistory,
      { role: "user", content: systemMsg },
    ];
    // @ts-ignore
    setChatHistory(updatedHistory);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            sender: m.role,
            text: m.content,
          })),
          blueprint: blueprintData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        handleChatResponse(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage.trim();
    const updatedHistory = [...chatHistory, { role: "user", content: userMsg }];
    // @ts-ignore
    setChatHistory(updatedHistory);
    setChatMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            sender: m.role,
            text: m.content,
          })),
          blueprint: blueprintData,
          currentActivePhase,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        handleChatResponse(data);
      } else {
        throw new Error(data.error || "Failed to fetch response");
      }
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: "I'm having trouble connecting to my neural net right now.",
        },
      ]);
    }
  };

  let renderText = blueprintData.substring(0, displayedLength);
  const lastOpen = renderText.lastIndexOf('[');
  const lastCloseParen = renderText.lastIndexOf(')');
  const lastCloseBracket = renderText.lastIndexOf(']');

  // If we are currently typing a link label (we have an open bracket but haven't finished the URL)
  if (lastOpen > lastCloseParen && lastOpen > lastCloseBracket) {
    const urlStart = blueprintData.indexOf('](', lastOpen);
    const urlEnd = blueprintData.indexOf(')', urlStart);
    if (urlStart !== -1 && urlEnd !== -1) {
      // Silently append the URL syntax so the text types out as a live blue hyperlink!
      renderText += blueprintData.substring(urlStart, urlEnd + 1);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">
      <Navbar />
      <main className="flex-1 p-4 sm:p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
      {/* Header */}
      {showBanner && (
        <header className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-emerald-400 w-6 h-6 shrink-0" />
            <h1 className="text-emerald-400 font-bold text-lg md:text-xl tracking-tight">
              Payment Successful. Your Blueprint is unlocked.
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest font-mono shrink-0"
          >
            &larr; Back to Dashboard
          </Link>
        </header>
      )}



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Markdown Blueprint / Sandpack Workspace */}
        <div className="lg:col-span-2 space-y-6">
          <ResourceHub blueprintMarkdown={blueprintData} />

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab("blueprint")}
              className={`px-4 py-2 rounded-t-lg font-bold text-sm uppercase tracking-widest transition-colors ${
                activeTab === "blueprint"
                  ? "bg-slate-900 text-cyan-400 border-t border-x border-slate-800"
                  : "bg-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Architecture Blueprint
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`px-4 py-2 rounded-t-lg font-bold text-sm uppercase tracking-widest transition-colors ${
                activeTab === "workspace"
                  ? "bg-slate-900 text-cyan-400 border-t border-x border-slate-800"
                  : "bg-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              Live Code Workspace
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl rounded-tl-none p-6 md:p-10 shadow-2xl backdrop-blur-xl min-h-[600px]">
            {activeTab === "blueprint" ? (
              <div className="flex flex-col gap-4">
                {/* Mode Switcher UI */}
                <div className="flex flex-wrap items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mb-2">
                  <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">Current Mode:</span>
                  <select 
                    value={techLevel}
                    onChange={(e) => handlePivot(e.target.value, aiBuilder)}
                    disabled={isRegenerating}
                    className="bg-zinc-950 border border-zinc-700 text-cyan-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                  >
                    <option value="No-Code">No-Code</option>
                    <option value="Learn to Code">Learn to Code</option>
                    <option value="AI Developer">AI Developer</option>
                  </select>
                  
                  {techLevel === "AI Developer" && (
                    <>
                      <span className="text-zinc-400 text-sm font-semibold uppercase tracking-widest ml-2">AI Builder:</span>
                      <select 
                        value={aiBuilder}
                        onChange={(e) => handlePivot(techLevel, e.target.value)}
                        disabled={isRegenerating}
                        className="bg-zinc-950 border border-zinc-700 text-cyan-400 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-2"
                      >
                        <option value="Cursor">Cursor</option>
                        <option value="Windsurf">Windsurf</option>
                        <option value="Antigravity">Antigravity</option>
                      </select>
                    </>
                  )}
                </div>

                {/* DVR Controls & Chapter Bar */}
                <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800 pb-4 pt-4 mb-6 shadow-2xl -mx-6 px-6 md:-mx-10 md:px-10">
                  <div className="flex items-center gap-4 bg-zinc-900/80 border border-zinc-800 rounded-lg px-4 py-3 shadow-lg">
                  <button onClick={() => { setDisplayedLength(0); setIsPlaying(false); setIsCompleted(false); }} className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer" title="Rewind to start">
                    <Rewind className="w-5 h-5" />
                  </button>
                  <button onClick={() => { 
                    if (isPlaying) {
                      const nextSpace = blueprintData.substring(displayedLength).search(/[\s\.\n]/);
                      if (nextSpace !== -1) {
                        setDisplayedLength(displayedLength + nextSpace + 1);
                      }
                      setIsPlaying(false);
                    } else {
                      if (displayedLength >= blueprintData.length) setDisplayedLength(0); 
                      setIsPlaying(true);
                    }
                  }} className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer" title={isPlaying ? "Pause" : "Play"}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => { setDisplayedLength(blueprintData.length); setIsPlaying(false); setIsCompleted(true); }} className="text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer" title="Skip to end">
                    <FastForward className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max={blueprintData.length || 100}
                    value={displayedLength}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      const nextSpace = blueprintData.substring(val).search(/[\s\.\n]/);
                      if (nextSpace !== -1) {
                        val = val + nextSpace + 1;
                      }
                      setDisplayedLength(val);
                      setIsPlaying(false);
                      setIsCompleted(val >= blueprintData.length);
                    }}
                    className="flex-1 accent-cyan-500 bg-zinc-800 h-1.5 rounded-full outline-none appearance-none cursor-pointer"
                  />
                  
                  <button 
                    onClick={() => setPlaybackSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)}
                    className="text-xs font-mono font-bold px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-cyan-400 hover:bg-zinc-700 transition-colors w-10 text-center cursor-pointer select-none"
                    title="Playback Speed"
                  >
                    {playbackSpeed}x
                  </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {["Intro", "Phase 0", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6"].map(phase => {
                      const phaseIndex = phase === "Intro" ? 0 : blueprintData.indexOf(phase + ":");
                      if (phase !== "Intro" && phaseIndex === -1) return null;
                      return (
                        <button
                          key={phase}
                          onClick={() => {
                            setDisplayedLength(phaseIndex);
                            setIsPlaying(false);
                            setTimeout(() => {
                              const mdContainer = document.querySelector(".prose");
                              if (mdContainer) {
                                mdContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                          className="text-[10px] font-mono font-bold px-2 py-1 bg-zinc-800/50 border border-zinc-700/50 rounded text-cyan-500/70 hover:bg-zinc-700 hover:text-cyan-400 transition-colors cursor-pointer uppercase tracking-wider"
                        >
                          {phase}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-[calc(100vh-350px)] overflow-y-auto pr-4 custom-scrollbar relative">
                  {isRegenerating && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm rounded-xl">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        <p className="text-cyan-400 font-mono tracking-widest uppercase text-sm">
                          Re-architecting for {techLevel}...
                        </p>
                      </div>
                    </div>
                  )}
                  <div 
                    className={`prose prose-invert prose-cyan max-w-none prose-p:text-slate-400 prose-headings:text-slate-200 transition-opacity duration-300 ${isRegenerating ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                  onMouseUp={() => {
                    const selection = window.getSelection();
                    const text = selection?.toString().trim();
                    if (text && selection && selection.rangeCount > 0) {
                      const rect = selection.getRangeAt(0).getBoundingClientRect();
                      setHighlightMenu({
                        visible: true,
                        x: rect.left + rect.width / 2,
                        y: rect.top - 50,
                        text
                      });
                    } else {
                      setHighlightMenu(prev => ({ ...prev, visible: false }));
                    }
                  }}
                >
                  <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: CodeBlock,
                    a: ({ node, ...props }: any) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-50 pointer-events-auto text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
                        href={props.href}
                      />
                    ),
                    input: ({ node, checked, ...props }: any) => {
                      if (props.type === "checkbox") {
                        return (
                          <input
                            type="checkbox"
                            defaultChecked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const taskText =
                                  e.target.parentElement?.textContent?.trim();
                                if (taskText) {
                                  handleTaskChecked(taskText);
                                }
                              }
                            }}
                            className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer mr-2 mt-1"
                          />
                        );
                      }
                      return <input {...props} />;
                    },
                  }}
                >
                  {renderText}
                </ReactMarkdown>
              </div>
              </div>
              </div>
            ) : (
              <Sandpack
                template="react-ts"
                theme="dark"
                options={{
                  showNavigator: true,
                  showTabs: true,
                  editorHeight: 600,
                  // @ts-ignore
                  editorOptions: { wordWrap: "on" },
                  classes: {
                    "sp-wrapper":
                      "custom-sandpack-wrapper w-full max-w-full overflow-hidden rounded-xl border border-zinc-800 shadow-2xl",
                  },
                }}
                files={{
                  "/App.tsx": sandboxCode || `export default function App() {\n  return (\n    <div style={{ padding: '2rem', backgroundColor: '#09090b', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>\n      <h1 style={{ color: '#22d3ee', fontSize: '2rem', fontWeight: 'bold' }}>BlueprintAI Workspace</h1>\n      <p style={{ marginTop: '1rem', color: '#a1a1aa' }}>Your live React environment is initialized. Paste your UI components here.</p>\n    </div>\n  );\n}`,
                }}
              />
            )}
          </div>

          {/* A2A Sync Key */}
          {id && (
            <div className="mb-8 p-4 bg-[#0D0D0D] border border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-sm tracking-tight">
                    A2A Sync Key
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Paste this ID into your local BlueprintAI CLI to sync directly
                    with your IDE.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 max-w-full overflow-hidden">
                <code className="text-cyan-400 font-mono text-xs truncate select-all">
                  {id}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(id)}
                  className="text-zinc-400 hover:text-white transition-colors shrink-0 p-1"
                  title="Copy Sync ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* GitHub Integration */}
          <div className="mb-8 p-6 bg-slate-900/50 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">
                  GitHub 1-Click Repo Initializer
                </h3>
                <p className="text-xs text-zinc-400">
                  Instantly deploy your generated architecture (.clinerules and
                  schema.sql) to a new private repository.
                </p>
              </div>
            </div>

            {githubRepoUrl ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-emerald-400 font-semibold mb-2">
                  ✅ Repository initialized successfully!
                </p>
                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-300 underline text-sm hover:text-emerald-200"
                >
                  {githubRepoUrl}
                </a>
              </div>
            ) : !hasGithub ? (
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div>
                  <p className="text-sm text-zinc-300 font-medium">
                    Connect your GitHub Account
                  </p>
                  <p className="text-xs text-zinc-500">
                    Click to open your Account Settings, select 'Connected
                    Accounts', and link your GitHub.
                  </p>
                </div>
                <button
                  onClick={() => clerk.openUserProfile()}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-6 rounded-lg transition-all shrink-0 border border-zinc-700 hover:border-zinc-500"
                >
                  Connect GitHub
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-cyan-950/20 rounded-lg border border-cyan-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                    <img
                      src={githubAccount?.imageUrl}
                      alt="GitHub Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-300 font-medium">
                      Connected as{" "}
                      <span className="text-white font-bold">{githubUsername}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      Ready for 1-Click Deployment.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGithubDeploy}
                  disabled={isGithubLoading}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] whitespace-nowrap"
                >
                  {isGithubLoading
                    ? "Creating repository and injecting files..."
                    : "🚀 1-Click Deploy to GitHub"}
                </button>
              </div>
            )}
          </div>

          {/* Terminal Drawer */}
          <div className="fixed bottom-0 left-4 md:left-8 lg:w-[calc((100vw-4rem)*0.66)] lg:max-w-[calc(80rem*0.66)] right-4 lg:right-auto bg-[#0D0D0D] border-t border-zinc-800 rounded-t-xl z-40 transition-all duration-300 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
            {/* Toggle Tab */}
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className="bg-zinc-900 hover:bg-zinc-800 border-t border-x border-zinc-800 rounded-t-lg px-4 py-2 flex items-center gap-2 self-start ml-4 md:ml-8 -mt-[37px] text-xs font-mono text-zinc-400 transition-colors"
            >
              <Terminal className="w-3 h-3 text-green-400" />
              &gt;_ TERMINAL
              {isTerminalOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronUp className="w-3 h-3" />
              )}
            </button>

            {/* Expanded Content */}
            {isTerminalOpen && (
              <div className="p-4 h-48 overflow-y-auto font-mono text-sm relative">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(cliCommands.join("\n"))
                  }
                  className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs flex items-center gap-2 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy All
                </button>
                {cliCommands.length === 0 ? (
                  <div className="text-zinc-600 mt-2">
                    ~ % No setup commands detected in blueprint.
                  </div>
                ) : (
                  cliCommands.map((cmd, idx) => (
                    <div key={idx} className="flex gap-3 mt-1">
                      <span className="text-zinc-600 select-none shrink-0">
                        ~ %
                      </span>
                      <span className="text-green-400 break-all">{cmd}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Co-Founder Chat */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col h-[calc(100vh-3rem)] overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">
                  AI Co-Founder
                </h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">
                  Online & Ready
                </p>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      msg.type === "thought"
                        ? "font-mono text-[10px] sm:text-xs text-zinc-500 bg-transparent border-l-2 border-zinc-800 pl-3 my-2 uppercase tracking-wide w-full"
                        : `max-w-[85%] rounded-xl p-3 text-sm ${
                            msg.role === "user"
                              ? "bg-cyan-500 text-black font-medium"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`
                    }
                  >
                    {msg.type === "thought" && (
                      <>
                        {msg.content}
                        <span className="inline-block w-1.5 h-3 ml-1 bg-zinc-500 animate-pulse"></span>
                      </>
                    )}
                    {msg.type !== "thought" && msg.content.startsWith("[FILE_DOWNLOAD:") ? (
                      (() => {
                        const lines = msg.content.split("\n");
                        const firstLine = lines[0];
                        const filenameMatch = firstLine.match(
                          /\[FILE_DOWNLOAD:\s*(.*?)\]/,
                        );
                        const filename = filenameMatch
                          ? filenameMatch[1].trim()
                          : "download.txt";
                        const content = lines.slice(1).join("\n");
                        return (
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-emerald-400 font-mono tracking-widest uppercase">
                              Generated File:
                            </p>
                            <button
                              onClick={() => {
                                const blob = new Blob([content], {
                                  type: "text/plain",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = filename;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold py-2 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                            >
                              <span>⬇️</span> Download {filename}
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            pre: CodeBlock,
                            a: ({ node, ...props }: any) => (
                              <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline"
                              />
                            ),
                          }}
                        >
                          {msg.content.replace("[RENDER_CONTROLS]", "")}
                        </ReactMarkdown>
                        {msg.content.includes("[RENDER_CONTROLS]") && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/50">
                            {["Intro", "Phase 0", "Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6"].map(phase => {
                              const phaseIndex = phase === "Intro" ? 0 : blueprintData.indexOf(phase + ":");
                              if (phase !== "Intro" && phaseIndex === -1) return null;
                              return (
                                <button
                                  key={phase}
                                  onClick={() => {
                                    setDisplayedLength(phaseIndex);
                                    setIsPlaying(false);
                                    setTimeout(() => {
                                      const mdContainer = document.querySelector(".prose");
                                      if (mdContainer) {
                                         mdContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }, 100);
                                  }}
                                  className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-900/50 border border-slate-700/50 rounded text-cyan-500/70 hover:bg-slate-800 hover:text-cyan-400 transition-colors cursor-pointer uppercase tracking-wider"
                                >
                                  {phase}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Live Context Status Bar */}
            <div className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/70 bg-zinc-950/80 px-3 py-1.5 border-t border-zinc-800/50 flex items-center gap-2">
              <span className="text-cyan-500">&gt;</span> 
              <span>SYSTEM CONTEXT: TRACKING {currentActivePhase}</span>
              <span className="w-1.5 h-3 bg-cyan-500/70 animate-pulse"></span>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2">
              <form onSubmit={handleSendMessage} className="relative w-full">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors z-10 ${isRecording ? "text-red-500 bg-red-500/10 animate-pulse" : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"}`}
                  title="Hands-free Coding Mic"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={
                    isRecording
                      ? "Listening..."
                      : "Ask your technical questions..."
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim() && !isRecording}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {micError && (
                <p className="text-xs text-red-400 px-2">{micError}</p>
              )}
            </div>
          </div>
          </div>
        </div>
        </div>
        
        {highlightMenu.visible && (
          <div
            className="highlight-menu fixed z-[100] flex items-center gap-1 bg-zinc-900 border border-zinc-700 shadow-2xl backdrop-blur-xl rounded-lg p-1.5 -translate-x-1/2 transition-all"
            style={{ top: highlightMenu.y, left: highlightMenu.x }}
          >
            <button
              onClick={() => {
                setChatMessage("Can you explain this part: \n" + highlightMenu.text);
                setHighlightMenu(prev => ({ ...prev, visible: false }));
                // scroll to chat
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="p-1.5 hover:bg-zinc-800 rounded text-cyan-400 transition-colors"
              title="Ask AI"
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent('update-sandbox', { detail: { code: highlightMenu.text } })
                );
                alert("Code injected! Switch to the 'Live Code Workspace' tab to preview.");
                setHighlightMenu(prev => ({ ...prev, visible: false }));
              }}
              className="p-1.5 hover:bg-zinc-800 rounded text-cyan-400 transition-colors"
              title="To Workspace"
            >
              <Zap className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(highlightMenu.text);
                setIsHighlightCopied(true);
                setTimeout(() => {
                  setIsHighlightCopied(false);
                  setHighlightMenu(prev => ({ ...prev, visible: false }));
                }, 1000);
              }}
              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 transition-colors"
              title="Copy"
            >
              {isHighlightCopied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PremiumVaultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050507] text-slate-300 flex items-center justify-center">
          Loading vault...
        </div>
      }
    >
      <VaultContent />
    </Suspense>
  );
}

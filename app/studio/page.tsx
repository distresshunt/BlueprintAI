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
  Database,
  Layout,
  Server,
  Command as CmdIcon,
  ChevronUp,
  ChevronDown,
  Copy,
  Rewind,
  Play,
  Pause,
  FastForward,
  Zap,
  Loader2,
  Sparkles,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/CodeBlock";
import { Command } from "cmdk";
import { NeuralNodeMap } from "@/components/NeuralNodeMap";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";

import { Navbar } from "@/components/Navbar";
import { ResourceHub } from "@/components/ResourceHub";
import { UserEnvSettings } from "@/components/UserEnvSettings";
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
      type: "thought",
      content: "[SYSTEM] SECURE CONNECTION ESTABLISHED. INITIALIZING ARCHITECTURE ENVIRONMENT...",
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState("");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [sandboxCode, setSandboxCode] = useState<string>("");
  const [highlightMenu, setHighlightMenu] = useState({ visible: false, x: 0, y: 0, text: '' });
  const [isHighlightCopied, setIsHighlightCopied] = useState(false);
  const [isNewGeneration, setIsNewGeneration] = useState(false);
  const [ideaPrompt, setIdeaPrompt] = useState<string>("");
  const [techLevel, setTechLevel] = useState<string>("No-Code");
  const [aiBuilder, setAiBuilder] = useState<string>("Cursor");
  const [e2bLogs, setE2bLogs] = useState<string[]>([]);
  const [e2bUrl, setE2bUrl] = useState<string>("");
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'architecture' | 'app'>('architecture');
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const searchParams = useSearchParams();
  const promptParam = searchParams.get('prompt');
  const id = searchParams.get("id");

  useEffect(() => {
    if (promptParam && !id && !blueprintData && !isRegenerating) {
      const decodedPrompt = decodeURIComponent(promptParam);
      setIdeaPrompt(decodedPrompt);
      handlePivot(techLevel, aiBuilder, decodedPrompt);
    }
  }, [promptParam, id]);
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

  const handleDeployToCloud = async () => {
    try {
      setIsDeploying(true);
      setE2bLogs([]);
      setE2bUrl("");

      // Swarm Boot Sequence
      setE2bLogs((prev) => [...prev, "> [@Architect] Initializing E2B cloud sandbox..."]);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setE2bLogs((prev) => [...prev, "> [@DB_Admin] Parsing Supabase schema requirements..."]);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setE2bLogs((prev) => [...prev, "> [@Frontend_Dev] Scaffolding Next.js 15 environment..."]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintMarkdown: blueprintData }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "log") {
                  setE2bLogs((prev) => [...prev, data.data]);
                } else if (data.type === "success") {
                  setE2bUrl(data.data);
                } else if (data.type === "error") {
                  setE2bLogs((prev) => [...prev, `[ERROR] ${data.data}`]);
                }
              } catch (e) {
                // ignore
              }
            }
          }
        }
      }
    } catch (err: any) {
      setE2bLogs((prev) => [...prev, `[SYSTEM ERROR] ${err.message}`]);
    } finally {
      setIsDeploying(false);
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

  // `id` moved to top
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
  const handlePivot = async (newTechLevel: string, newAiBuilder: string, promptOverride?: string) => {
    if (newTechLevel === techLevel && newAiBuilder === aiBuilder && !promptOverride) return;
    
    setTechLevel(newTechLevel);
    setAiBuilder(newAiBuilder);
    setIsRegenerating(true);
    
    const bridgeMessage = `Got it. Branching a new architecture for **${newTechLevel}**${newTechLevel === "AI Developer" ? ` using ${newAiBuilder}` : ""}. Give me 15 seconds...`;
    // @ts-ignore
    setChatHistory(prev => [...prev, { role: "ai", content: bridgeMessage }]);

    try {
      const promptToUse = promptOverride || ideaPrompt || "Build a modern SaaS application.";
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
      { id: "Phase 2", name: "OPEN KNOWLEDGE FORMAT (OKF)" },
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
      let userKeys = {};
      const storedKeys = localStorage.getItem('blueprint_user_keys');
      if (storedKeys) {
        try {
          userKeys = JSON.parse(storedKeys);
        } catch(e) {}
      }

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
          userKeys
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

  let renderTextRaw = blueprintData.substring(0, displayedLength);
  
  const thinkMatch = renderTextRaw.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
  const thinkText = thinkMatch ? thinkMatch[1].trim() : '';
  const mainContent = renderTextRaw.replace(/<think>[\s\S]*?(?:<\/think>|$)/i, '').trim();
  
  let renderText = mainContent;

  const lastOpen = renderText.lastIndexOf('[');
  const lastCloseParen = renderText.lastIndexOf(')');
  const lastCloseBracket = renderText.lastIndexOf(']');

  // If we are currently typing a link label (we have an open bracket but haven't finished the URL)
  if (lastOpen > lastCloseParen && lastOpen > lastCloseBracket) {
    const urlStart = mainContent.indexOf('](', lastOpen);
    const urlEnd = mainContent.indexOf(')', urlStart);
    if (urlStart !== -1 && urlEnd !== -1) {
      // Silently append the URL syntax so the text types out as a live blue hyperlink!
      renderText += mainContent.substring(urlStart, urlEnd + 1);
    }
  }

  return (
    <div className="w-screen h-screen fixed inset-0 z-0 bg-zinc-950 font-sans overflow-hidden">
      <Navbar />

      {/* Floating View Toggle Pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/50 backdrop-blur-md border border-zinc-700 p-1 rounded-full flex gap-1 shadow-2xl">
        <button
          onClick={() => setViewMode('architecture')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'architecture' ? 'bg-zinc-800 text-cyan-400 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          🧠 Architecture
        </button>
        <button
          onClick={() => setViewMode('app')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${viewMode === 'app' ? 'bg-zinc-800 text-cyan-400 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          🚀 Live App
        </button>
      </div>
      {/* Layer 0: Background Canvas */}
      <div className="absolute inset-0 pt-20 pb-4 px-4 overflow-hidden">
        {viewMode === 'architecture' ? (
          <div className="w-full h-full flex flex-col relative z-10">
            <NeuralNodeMap blueprintData={blueprintData} />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4 lg:p-8 relative z-10">
            <div className="w-full max-w-6xl bg-black border border-zinc-800 rounded-3xl shadow-[0_0_100px_rgba(34,211,238,0.1)] overflow-hidden flex flex-col h-full relative">
              
              <div className="p-8 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30 backdrop-blur-sm shrink-0">
                 <div>
                   <h2 className="text-2xl font-black text-white tracking-tight">Cloud Sandbox</h2>
                   <p className="text-sm text-zinc-400 mt-1">Autonomous environment for testing generated skills.</p>
                 </div>
                 
                 <button
                    onClick={handleDeployToCloud}
                    disabled={isDeploying}
                    className="relative group overflow-hidden rounded-xl p-[2px] cursor-pointer shrink-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-70 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-pulse"></div>
                    <div className="relative bg-black/90 backdrop-blur-sm px-6 py-3 rounded-xl flex items-center justify-center gap-3 border border-white/10 hover:bg-black/70 transition-all duration-300">
                      {isDeploying ? (
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      ) : (
                        <Zap className="w-5 h-5 text-cyan-400" />
                      )}
                      <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 tracking-tight">
                        {isDeploying ? "Deploying..." : "Boot Environment"}
                      </span>
                    </div>
                  </button>
              </div>

              <div className="flex-1 flex flex-col p-8 gap-6 overflow-hidden bg-zinc-950/50">
                  {e2bUrl ? (
                    <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-800 bg-black flex flex-col">
                       <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center gap-4">
                         <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                         </div>
                         <a href={e2bUrl.startsWith("http") ? e2bUrl : `https://${e2bUrl}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-black rounded-lg px-4 py-1.5 text-xs font-mono text-zinc-400 truncate hover:text-cyan-400 transition-colors border border-zinc-800">
                           {e2bUrl}
                         </a>
                       </div>
                       <iframe src={e2bUrl.startsWith("http") ? e2bUrl : `https://${e2bUrl}`} className="w-full flex-1 bg-white" />
                    </div>
                  ) : (
                    <div className="flex-1 bg-black text-green-400 font-mono p-6 rounded-2xl border border-zinc-800 overflow-y-auto flex flex-col gap-2 text-sm shadow-inner custom-scrollbar relative">
                      
                      {!isDeploying && e2bLogs.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-6">
                           <div className="w-20 h-20 rounded-full bg-cyan-950/30 flex items-center justify-center border border-cyan-500/20">
                             <Server className="w-10 h-10 text-cyan-500/50" />
                           </div>
                           <div>
                             <h3 className="text-xl font-bold text-zinc-300 mb-2">Sandbox Offline</h3>
                             <p className="text-zinc-500 text-sm max-w-sm mx-auto">The environment is sleeping. Click the Boot button above to spin up the cloud container.</p>
                           </div>
                           <a href="https://distresshunter.gumroad.com/l/pbhwbn?wanted=true" target="_blank" rel="noopener noreferrer" className="mt-4 text-xs font-mono text-cyan-500/60 hover:text-cyan-400 border border-cyan-900/30 px-4 py-2 rounded-full hover:bg-cyan-950/20 transition-all">
                             Unlock Premium Compute Quotas
                           </a>
                        </div>
                      )}

                      {e2bLogs.map((log, idx) => (
                        <div key={idx} className="break-words">
                          {log}
                        </div>
                      ))}
                      {isDeploying && (
                        <div className="flex items-center gap-2 mt-4 text-cyan-500 animate-pulse">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          Executing Engine Directives...
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layer 1: Hovering AI Co-Founder Chat */}
      {isChatOpen ? (
        <div className="fixed right-6 top-24 bottom-6 w-[400px] z-50 transition-all duration-300 bg-zinc-950/60 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">AI Co-Founder</h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Online & Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors"
                title="Local API Keys"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors"
                title="Minimize Chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type === "thought" ? (
                  <div className="font-mono text-[10px] text-cyan-500/70 border-l-2 border-cyan-900 pl-3 my-2 uppercase tracking-wide">
                    &gt; {msg.content}_
                  </div>
                ) : (
                  <div className={`max-w-[85%] rounded-xl p-3 text-sm ${msg.role === "user" ? "bg-cyan-500 text-black font-medium" : "bg-black/60 text-slate-300 border border-white/5 backdrop-blur-md"}`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: CodeBlock,
                        a: ({ node, ...props }: any) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline" />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-4 border-t border-white/10 bg-black/40 flex flex-col gap-2">
            <form onSubmit={handleSendMessage} className="relative w-full">
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-cyan-400 transition-colors"
                title="Open Command Palette (Cmd+K)"
              >
                <CmdIcon className="w-4 h-4" />
              </button>
              
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Message your Co-Founder..."
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
              
              <button
                type="submit"
                disabled={!chatMessage.trim() && !isRecording}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${chatMessage.trim() ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-zinc-500"}`}
              >
                {isRecording ? <div className="w-4 h-4 rounded-full bg-white animate-ping" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 z-50 p-5 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center group border border-cyan-300"
        >
          <Bot className="w-8 h-8 text-black group-hover:animate-bounce" />
        </div>
      )}

      {/* Global Command Palette */}
      <Command.Dialog
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      >
        <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <Command.Input 
            placeholder="Type a command or search..." 
            className="w-full px-4 py-4 bg-transparent text-white border-b border-zinc-800 focus:outline-none placeholder:text-zinc-500"
          />
          <Command.List className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
            <Command.Empty className="py-6 text-center text-zinc-500 text-sm">No results found.</Command.Empty>
            
            <Command.Group heading="Quick Actions" className="text-xs font-semibold text-zinc-500 px-2 py-1 uppercase tracking-widest">
              <Command.Item 
                onSelect={() => { setViewMode('app'); handleDeployToCloud(); setCmdOpen(false); }}
                className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-cyan-400 rounded-lg cursor-pointer flex items-center gap-3 transition-colors mt-1"
              >
                <Zap className="w-4 h-4" /> Boot Cloud Environment
              </Command.Item>
              <Command.Item 
                onSelect={() => { setIsSettingsOpen(true); setCmdOpen(false); }}
                className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-cyan-400 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
              >
                <Settings className="w-4 h-4" /> API Keys & Model Routing
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/"); setCmdOpen(false); }}
                className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-cyan-400 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
              >
                <Layout className="w-4 h-4" /> New Blueprint
              </Command.Item>
            </Command.Group>
            
            <Command.Group heading="Architecture" className="text-xs font-semibold text-zinc-500 px-2 py-2 uppercase tracking-widest mt-2">
              <Command.Item 
                onSelect={() => { setViewMode('architecture'); setCmdOpen(false); }}
                className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-cyan-400 rounded-lg cursor-pointer flex items-center gap-3 transition-colors"
              >
                <Database className="w-4 h-4" /> View Neural Node Map
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </Command.Dialog>

      <UserEnvSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function PremiumVault() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <VaultContent />
    </Suspense>
  );
}

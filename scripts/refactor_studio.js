const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app', 'studio', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Imports
if (!content.includes('import { Command } from')) {
content = content.replace(
  /import \{ CodeBlock \} from "@\/components\/CodeBlock";/,
  `import { CodeBlock } from "@/components/CodeBlock";\nimport { Command } from 'cmdk';\nimport { NeuralNodeMap } from '@/components/NeuralNodeMap';`
);

content = content.replace(
  /Terminal,/,
  `Terminal,\n  Database,\n  Layout,\n  Server,\n  Command as CmdIcon,`
);
}

// 2. Add cmdk state and prompt auto-generation logic
const injection1 = `const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  
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
  
  useEffect(() => {
    if (promptParam && !blueprintData && !isRegenerating) {
      setIdeaPrompt(promptParam);
      handlePivot(techLevel, aiBuilder, promptParam);
    }
  }, [promptParam]);
`;

if (!content.includes('setCmdOpen')) {
  content = content.replace('const [isSettingsOpen, setIsSettingsOpen] = useState(false);', injection1);
}

// 3. Update handlePivot to accept promptOverride
if (!content.includes('promptOverride?: string')) {
  content = content.replace(
    /const handlePivot = async \(newTechLevel: string, newAiBuilder: string\) => \{/,
    `const handlePivot = async (newTechLevel: string, newAiBuilder: string, promptOverride?: string) => {`
  );

  content = content.replace(
    /const promptToUse = ideaPrompt \|\| "Build a modern SaaS application.";/,
    `const promptToUse = promptOverride || ideaPrompt || "Build a modern SaaS application.";`
  );
}

// 4. Overhaul the Return JSX (from line ~636 to the end)
// We find exactly the return for VaultContent.
// The structure is:
// function VaultContent() { ... return ( <div ...> ... </div> ); }
// export default function PremiumVaultPage() { ... }

// Let's find "return (" after "let renderText = "";"
const returnStartStr = '  return (\n    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">';
let returnStart = content.indexOf(returnStartStr);

if (returnStart === -1) {
    console.log("Could not find return start!");
    process.exit(1);
}

const returnEndStr = '      <UserEnvSettings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />\n    </div>\n  );';
let returnEnd = content.indexOf(returnEndStr);

if (returnEnd === -1) {
    console.log("Could not find return end!");
    process.exit(1);
}

const newReturnJSX = `  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-zinc-950 font-sans text-slate-300">
      <Navbar />
      
      {/* CMDK Palette */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-sm flex items-start justify-center pt-[20vh]">
          <Command className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border-b border-zinc-800 px-3" onClick={() => setCmdOpen(false)}>
              <CmdIcon className="w-4 h-4 text-zinc-400 shrink-0" />
              <Command.Input 
                autoFocus 
                placeholder="Type a command or search..." 
                className="w-full bg-transparent border-none text-slate-200 px-2 py-4 focus:outline-none focus:ring-0 placeholder-zinc-500" 
              />
              <button className="text-[10px] uppercase font-bold text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">ESC</button>
            </div>
            <Command.List className="p-2 max-h-[300px] overflow-y-auto">
              <Command.Empty className="py-6 text-center text-sm text-zinc-500">No results found.</Command.Empty>
              <Command.Group heading={<span className="text-xs text-zinc-500 uppercase tracking-widest px-2 font-bold">Actions</span>}>
                <Command.Item onSelect={() => { setIsSettingsOpen(true); setCmdOpen(false); }} className="px-2 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer flex items-center gap-2 data-[selected='true']:bg-cyan-500/10 data-[selected='true']:text-cyan-400">
                  <Settings className="w-4 h-4" /> Open API Keys
                </Command.Item>
                <Command.Item onSelect={() => { router.push('/'); setCmdOpen(false); }} className="px-2 py-2 rounded-lg text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer flex items-center gap-2 data-[selected='true']:bg-cyan-500/10 data-[selected='true']:text-cyan-400">
                  <Zap className="w-4 h-4" /> New Blueprint
                </Command.Item>
                <Command.Item onSelect={() => { handleDeployToCloud(); setCmdOpen(false); }} className="px-2 py-2 rounded-lg text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer flex items-center gap-2 data-[selected='true']:bg-emerald-500/10 data-[selected='true']:text-emerald-400">
                  <Terminal className="w-4 h-4" /> Boot Cloud Environment
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Chat (25%) */}
        <div className="w-full lg:w-[25%] shrink-0 flex flex-col border-r border-zinc-800 bg-[#0a0a0a] h-full relative z-20">
          
          {/* Swarm Avatars */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800 bg-zinc-950/50">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Co-Founder</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center animate-pulse border border-cyan-500/30" title="Architect"><Bot className="w-3 h-3 text-cyan-400" /></div>
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center animate-pulse border border-purple-500/30" title="DB Admin"><Database className="w-3 h-3 text-purple-400" /></div>
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse border border-blue-500/30" title="Frontend Dev"><Layout className="w-3 h-3 text-blue-400" /></div>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse border border-emerald-500/30" title="DevOps"><Server className="w-3 h-3 text-emerald-400" /></div>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {chatHistory.map((msg, i) => (
              <div key={i} className={\`flex \${msg.role === "user" ? "justify-end" : "justify-start"}\`}>
                {msg.type === "thought" ? (
                  <div className="font-mono text-[10px] text-cyan-500/70 border-l-2 border-cyan-900 pl-3 my-2 uppercase tracking-wide">
                    &gt; {msg.content}_
                  </div>
                ) : (
                  <div className={\`max-w-[85%] rounded-xl p-3 text-sm \${msg.role === "user" ? "bg-cyan-500 text-black font-medium" : "bg-zinc-900 text-slate-300 border border-zinc-800"}\`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: CodeBlock,
                        a: ({ node, ...props }: any) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline" />,
                      }}
                    >
                      {msg.content.replace("[RENDER_CONTROLS]", "")}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {isRegenerating && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 text-slate-300 border border-zinc-800 rounded-xl p-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Architecting...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex flex-col gap-2">
            <form onSubmit={handleSendMessage} className="relative w-full">
              <button
                type="button"
                onClick={toggleRecording}
                className={\`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors z-10 \${isRecording ? "text-red-500 bg-red-500/10 animate-pulse" : "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"}\`}
                title="Hands-free Coding Mic"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={isRecording ? "Listening..." : "Talk to your AI Co-Founder (Ctrl+K for Cmds)..."}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-12 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim() && !isRecording}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {micError && <p className="text-xs text-red-400 px-2">{micError}</p>}
          </div>
        </div>

        {/* MIDDLE PANEL: Architecture Tree (40%) */}
        <div className="hidden lg:flex w-[40%] shrink-0 flex-col border-r border-zinc-800 bg-[#050505] h-full relative z-10">
          <NeuralNodeMap blueprintData={blueprintData} />
        </div>

        {/* RIGHT PANEL: E2B Sandbox (35%) */}
        <div className="hidden lg:flex w-[35%] shrink-0 flex-col bg-[#050505] h-full relative z-10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-zinc-300">Cloud Sandbox</span>
            </div>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
            </div>
          </div>
          <div className="flex-1 bg-[#050507] relative p-4 flex flex-col justify-center items-center font-mono text-sm text-zinc-500">
            {/* Paywall Hook Overlay */}
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-50">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 border border-cyan-500/30 animate-pulse">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight">Access Cloud Compute</h2>
              <p className="text-zinc-400 mb-8 max-w-sm leading-relaxed text-sm">
                You can generate architecture and chat for free. To boot an instant cloud VM and deploy this application live, upgrade to the Founder Tier.
              </p>
              <a 
                href="https://distresshunter.gumroad.com/l/pbhwbn?wanted=true"
                target="_blank"
                rel="noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1 flex items-center gap-2"
              >
                🚀 Boot Cloud Environment ($19/mo)
              </a>
            </div>
            
            {/* Fake terminal background content */}
            <div className="w-full h-full opacity-20 pointer-events-none">
              <div className="mb-2">~ % npx create-next-app@latest my-app</div>
              <div className="mb-2 text-green-400">✔ Success! Created my-app at /home/user/my-app</div>
              <div className="mb-2">~ % cd my-app && npm run dev</div>
              <div className="text-cyan-400">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
            </div>
          </div>
        </div>

      </div>
`;

content = content.substring(0, returnStart) + newReturnJSX + content.substring(returnEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Refactoring complete");

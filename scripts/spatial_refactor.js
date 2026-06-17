const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '../app/studio/page.tsx');
const content = fs.readFileSync(pageFile, 'utf8');

const lines = content.split('\n');
const beforeReturn = lines.slice(0, 666).join('\n');

const newReturnJSX = `
  return (
    <div className="w-screen h-screen fixed inset-0 z-0 bg-zinc-950 font-sans overflow-hidden">
      <Navbar />

      {/* Floating View Toggle Pill */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/50 backdrop-blur-md border border-zinc-700 p-1 rounded-full flex gap-1 shadow-2xl">
        <button
          onClick={() => setViewMode('architecture')}
          className={\`px-4 py-2 rounded-full text-sm font-bold transition-all \${viewMode === 'architecture' ? 'bg-zinc-800 text-cyan-400 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}\`}
        >
          🧠 Architecture
        </button>
        <button
          onClick={() => setViewMode('app')}
          className={\`px-4 py-2 rounded-full text-sm font-bold transition-all \${viewMode === 'app' ? 'bg-zinc-800 text-cyan-400 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}\`}
        >
          🚀 Live App
        </button>
      </div>

      {/* Layer 0: Background Canvas */}
      <div className="absolute inset-0 pt-20 pb-4 px-4 overflow-hidden">
        {viewMode === 'architecture' ? (
          <div className="w-full h-full flex flex-col relative z-10">
            <NeuralNodeMap markdown={blueprintData} onNodeSelect={(nodeId) => {
              let selector = \`[id*="\${nodeId}"]\`;
              const element = document.querySelector(selector);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }} />
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
                         <a href={e2bUrl.startsWith("http") ? e2bUrl : \`https://\${e2bUrl}\`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-black rounded-lg px-4 py-1.5 text-xs font-mono text-zinc-400 truncate hover:text-cyan-400 transition-colors border border-zinc-800">
                           {e2bUrl}
                         </a>
                       </div>
                       <iframe src={e2bUrl.startsWith("http") ? e2bUrl : \`https://\${e2bUrl}\`} className="w-full flex-1 bg-white" />
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
              <div key={i} className={\`flex \${msg.role === "user" ? "justify-end" : "justify-start"}\`}>
                {msg.type === "thought" ? (
                  <div className="font-mono text-[10px] text-cyan-500/70 border-l-2 border-cyan-900 pl-3 my-2 uppercase tracking-wide">
                    &gt; {msg.content}_
                  </div>
                ) : (
                  <div className={\`max-w-[85%] rounded-xl p-3 text-sm \${msg.role === "user" ? "bg-cyan-500 text-black font-medium" : "bg-black/60 text-slate-300 border border-white/5 backdrop-blur-md"}\`}>
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
                className={\`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all \${chatMessage.trim() ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]" : isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-zinc-500"}\`}
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
`;

fs.writeFileSync(pageFile, beforeReturn + newReturnJSX);
console.log("Successfully overhauled page.tsx with Immersive Spatial Canvas.");

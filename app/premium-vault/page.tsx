'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { CodeBlock } from '@/components/CodeBlock';

export default function PremiumVaultPage() {
  const [blueprintData, setBlueprintData] = useState<string>('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Welcome to the Premium Vault! I'm your AI Co-Founder. Let me know if you need help executing any phase of your blueprint." }
  ]);

  useEffect(() => {
    const data = localStorage.getItem('blueprintData');
    if (data) {
      setBlueprintData(data);
    } else {
      setBlueprintData('# No Blueprint Found\nPlease generate a blueprint from the home page.');
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    setChatMessage('');
    
    // Mock response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'ai', content: "I'm analyzing your blueprint context. Let's tackle that together. What specific phase are you looking at?" }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-slate-300 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="text-emerald-400 w-6 h-6 shrink-0" />
          <h1 className="text-emerald-400 font-bold text-lg md:text-xl tracking-tight">Payment Successful. Your Blueprint is unlocked.</h1>
        </div>
        <Link href="/" className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest font-mono shrink-0">
          &larr; Back to Dashboard
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Left Column: Markdown Blueprint */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest font-mono border-b border-slate-800 pb-4">Your MVP Blueprint</h2>
            <div className="prose prose-invert prose-cyan max-w-none prose-p:text-slate-400 prose-headings:text-slate-200">
              <ReactMarkdown components={{ pre: CodeBlock }}>{blueprintData}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Right Column: AI Co-Founder Chat */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.1)] backdrop-blur-xl">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight">AI Co-Founder</h3>
                <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400">Online & Ready</p>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500 text-black font-medium' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask your technical questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

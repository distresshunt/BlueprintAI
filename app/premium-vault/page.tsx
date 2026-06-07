'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, CheckCircle, Mic } from 'lucide-react';
import Link from 'next/link';
import { CodeBlock } from '@/components/CodeBlock';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function VaultContent() {
  const [blueprintData, setBlueprintData] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Welcome to the Premium Vault! I'm your AI Co-Founder. Let me know if you need help executing any phase of your blueprint." }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState('');
  
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  useEffect(() => {
    async function loadData() {
      if (id) {
        try {
          const { data, error } = await supabase
            .from('blueprints')
            .select('blueprint_markdown, is_unlocked')
            .eq('id', id)
            .single();
            
          if (data) {
            if (data.is_unlocked === false) {
              setIsLocked(true);
            } else {
              setIsLocked(false);
            }
            if (data.blueprint_markdown) {
              setBlueprintData(data.blueprint_markdown);
            }
            return;
          }
        } catch (e) {
          console.error("Failed to load from Supabase:", e);
        }
      }
      
      const localData = localStorage.getItem('blueprintData');
      if (localData) {
        setBlueprintData(localData);
      } else {
        setBlueprintData('# No Blueprint Found\nPlease generate a blueprint from the home page.');
      }
    }
    
    loadData();
  }, [id]);

  // Dwell Time Tracking
  useEffect(() => {
    const setupObserver = setTimeout(() => {
      const elements = document.querySelectorAll('.prose strong');
      const phaseElements = Array.from(elements).filter(el => el.textContent?.startsWith('Phase'));

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const phaseName = entry.target.textContent;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              setChatHistory(prev => [...prev, { 
                role: 'ai', 
                content: `I notice you're reviewing ${phaseName}. Let me know if you need the exact Stripe API keys or specific code to proceed.` 
              }]);
            }, 15000);
          } else {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }
        });
      }, { threshold: 0.5 });

      phaseElements.forEach(el => observer.observe(el));

      return () => {
        observer.disconnect();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, 1000);

    return () => clearTimeout(setupObserver);
  }, [blueprintData]);

  // Highlight Tracking
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 10) {
        // Find if we already asked about this exact snippet to prevent spam
        const alreadyAsked = chatHistory.some(msg => msg.content.includes(text.substring(0, 10)));
        if (!alreadyAsked) {
          setChatHistory(prev => [...prev, {
            role: 'ai',
            content: `I see you highlighted: "${text.length > 50 ? text.substring(0, 50) + '...' : text}". Let me know if you want me to explain or code that specific part.`
          }]);
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [chatHistory]);

  const toggleRecording = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setMicError('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Browser doesn't support voice input.");
      setTimeout(() => setMicError(''), 5000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript.trim()) {
        const message = finalTranscript.trim();
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'ai', content: `I heard: "${message}". I am analyzing the blueprint to assist you.` }]);
        }, 1000);
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error !== 'no-speech') {
          setMicError(`Mic error: ${event.error}`);
          setTimeout(() => setMicError(''), 5000);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }]);
    setChatMessage('');
    
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
        <Link href="/dashboard" className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest font-mono shrink-0">
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
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-2">
              <form onSubmit={handleSendMessage} className="relative w-full">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg transition-colors z-10 ${isRecording ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                  title="Hands-free Coding Mic"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isRecording ? "Listening..." : "Ask your technical questions..."}
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
              {micError && <p className="text-xs text-red-400 px-2">{micError}</p>}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PremiumVaultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050507] text-slate-300 flex items-center justify-center">Loading vault...</div>}>
      <VaultContent />
    </Suspense>
  );
}

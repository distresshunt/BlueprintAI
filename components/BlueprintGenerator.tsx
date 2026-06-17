'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Send, Loader2, Zap, ChevronDown, ChevronRight, Info, Lock, Check, Copy, CheckCheck, Mic, X, Bot, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth, SignInButton, useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { CodeBlock } from './CodeBlock';
import { useSearchParams } from 'next/navigation';
import businessModels from '@/data/business-models.json';

const ExpandableBlockquote = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-6 border border-slate-700/50 rounded-xl bg-slate-900/50 overflow-hidden shadow-lg">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2 text-cyan-400 font-sans font-semibold text-sm uppercase tracking-widest">
          <Info className="w-4 h-4" />
          Implementation Notes & Key Features
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-cyan-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-6 pt-4 prose prose-invert prose-sm max-w-none prose-p:text-slate-400 border-t border-slate-800/50 mt-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



const startupIdeas: Record<string, { idea: string; text: string }[]> = {
  saas: [
    {
      idea: "A specialized CRM and scheduling dispatch system for residential window tinting and detailing businesses.",
      text: "Love the B2B SaaS angle. High margins, recurring revenue, clear pain points. Here's a massive idea:\n\n**A specialized CRM and scheduling dispatch system for residential window tinting and detailing businesses.**\n\nIt solves a direct operational pain and has a clear path to early customers. What do you think?"
    },
    {
      idea: "An automated compliance dashboard for construction managers tracking local environmental permits.",
      text: "B2B SaaS is the holy grail. High customer lifetime value. Here's a solid concept:\n\n**An automated compliance dashboard for construction managers tracking local environmental permits.**\n\nBy tracking regulatory deadlines automatically, it protects developers from costly stop-work orders. How does this sound?"
    },
    {
      idea: "A material estimating micro-SaaS specifically for custom cabinet builders and finish carpenters.",
      text: "Focusing on B2B SaaS niche workflows is incredibly lucrative. Check this out:\n\n**A material estimating micro-SaaS specifically for custom cabinet builders and finish carpenters.**\n\nIt replaces messy Excel sheets with precise waste-reducing yield calculations. Would you build this?"
    }
  ],
  marketplace: [
    {
      idea: "A localized equipment rental marketplace for neighborhood landscaping tools and heavy DIY gear.",
      text: "Marketplaces are tough but highly defensible once you build local density. Here's an idea:\n\n**A localized equipment rental marketplace for neighborhood landscaping tools and heavy DIY gear.**\n\nIt lets homeowners rent expensive lawn aerators, sod cutters, and power washers directly from neighbors. Thoughts?"
    },
    {
      idea: "A matchmaking platform connecting local culinary school graduates with families looking for private meal prep.",
      text: "Connecting under-utilized talent with high-intent buyers is a classic marketplace winner:\n\n**A matchmaking platform connecting local culinary school graduates with families looking for private meal prep.**\n\nIt helps busy families eat healthy while giving junior chefs a premium income source. Are you leaning towards this?"
    },
    {
      idea: "A peer-to-peer rental network for specialized cinematic equipment and lenses within your city.",
      text: "High-value asset sharing works beautifully in tight-knit professional niches:\n\n**A peer-to-peer rental network for specialized cinematic equipment and lenses within your city.**\n\nIt lets indie filmmakers rent high-end cameras and anamorphic lenses safely with built-in deposit escrows. Do you like this idea?"
    }
  ],
  wrapper: [
    {
      idea: "An AI-powered client contract analyzer that highlights high-risk terms for freelance designers.",
      text: "AI Wrappers are fantastic because of the ultra-fast time-to-market. Here is a highly actionable one:\n\n**An AI-powered client contract analyzer that highlights high-risk terms for freelance designers.**\n\nIt scans service agreements in seconds to flag boilerplate traps like unlimited revisions or delayed payments. Does this spark your interest?"
    },
    {
      idea: "An AI tool that reads municipal codes and outputs automated compliance suggestions for property developments.",
      text: "Solving compliance issues with LLMs is a massive business. Look at this:\n\n**An AI tool that reads municipal codes and outputs automated compliance suggestions for property developments.**\n\nIt digests massive city zoning documents and instantly extracts set-back and building height requirements. What do you think?"
    },
    {
      idea: "An AI copywriting workflow assistant designed specifically for real estate listing agents.",
      text: "The key to a great AI wrapper is hyper-focused positioning. Check this concept:\n\n**An AI copywriting workflow assistant designed specifically for real estate listing agents.**\n\nIt turns MLS bullet points and photos into compelling, compliance-checked property descriptions in seconds. Ready to claim this?"
    }
  ],
  govtech: [
    {
      idea: "A compliance tool for local municipalities to audit contractor bids for state green energy subsidies.",
      text: "B2G gov-tech is incredibly stable with long-term contracts. Here is a strong direction:\n\n**A compliance tool for local municipalities to audit contractor bids for state green energy subsidies.**\n\nIt ensures all procurement bids satisfy clean energy legislation requirements before public funds are spent. Sound like a plan?"
    },
    {
      idea: "An analytics dashboard for city planners to monitor and optimize public parks usage and maintenance.",
      text: "Helping municipalities run more efficiently is a high-value niche:\n\n**An analytics dashboard for city planners to monitor and optimize public parks usage and maintenance.**\n\nIt tracks facility conditions, schedules trash collection routes, and maps public feedback onto local maintenance crews. Do you want to build this?"
    },
    {
      idea: "An automated form-builder that helps small businesses fill out and submit local government licensing requirements.",
      text: "Gov-tech doesn't just sell to governments, it can help citizens navigate them. Here's a hybrid idea:\n\n**An automated form-builder that helps small businesses fill out and submit local government licensing requirements.**\n\nIt walks local merchants through the complex licensing requirements of health and safety permits. Should we run with this?"
    }
  ]
};

const coFounderGreetings = [
  "The most profitable software usually solves boring problems. What industry do you know better than anyone else? (e.g., Real estate, plumbing, logistics). Tell me what you know, and I'll pitch you 3 highly-lucrative launch plans.",
  "I'm your AI Co-Founder. Stop staring at a blank screen. Tell me what pisses you off at your day job, or a manual task you hate doing, and let's turn it into a subscription business.",
  "Let's find your gold mine. Do you want to build a high-ticket B2B SaaS, a local directory, a Chrome extension, or an AI Wrapper? Give me a hint about your skills, and I'll do the heavy lifting."
];

export function BlueprintGenerator({ initialIdea, pSeoModel, pSeoNiche, initialId, learnSkill, learnNiche }: { initialIdea?: string; pSeoModel?: string; pSeoNiche?: string; initialId?: string; learnSkill?: string; learnNiche?: string }) {
  const { userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'exoscommand@gmail.com';
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const activeId = urlId || initialId;

  const [idea, setIdea] = useState(initialIdea || (learnSkill && learnNiche ? `I want to learn ${learnSkill} from scratch by building a real software business for ${learnNiche}.` : (pSeoModel && pSeoNiche ? `I want to build a ${pSeoModel} for ${pSeoNiche}.` : '')));
  const [selectedModel, setSelectedModel] = useState(pSeoModel || '');
  const [activeProjectType, setActiveProjectType] = useState<string>('Full Stack App');
  const [llmCore, setLlmCore] = useState<string>('Gemini 3.1 Pro (Default)');
  const [mcpTools, setMcpTools] = useState<string>('None');
  const [baseTemplate, setBaseTemplate] = useState<string>('Next.js + Supabase (Default)');
  const [aiBuilder, setAiBuilder] = useState('Decide for me ✨');
  const [blueprint, setBlueprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('ARCHITECTING MVP...');
  const [isPivoting, setIsPivoting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [micError, setMicError] = useState('');
  
  
  useEffect(() => {
    if (activeId) {
      const fetchBlueprint = async () => {
        try {
          const { data, error } = await supabase
            .from('blueprints')
            .select('blueprint_markdown, idea_prompt, is_unlocked')
            .eq('id', activeId)
            .single();
          if (data) {
            setIdea(data.idea_prompt);
            setBlueprint(data.blueprint_markdown);
            if (data.is_unlocked) {
              setIsUnlocked(true);
            }
          }
        } catch (err) {
          console.error("Failed to load blueprint:", err);
        }
      };
      fetchBlueprint();
    }
  }, [activeId]);

  useEffect(() => {
    if (userId) {
      supabase.from('profiles').select('is_pro').eq('user_id', userId).single().then(({ data }) => {
        if (data?.is_pro) {
          setIsUnlocked(true);
        }
      });
    }
  }, [userId]);

  useEffect(() => {
    if (isAdmin) {
      setIsUnlocked(true);
    }
  }, [isAdmin]);

  const [techLevel, setTechLevel] = useState(learnSkill && learnNiche ? 'Learn to Code' : 'No-Code');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleCopyTrap = async (e: React.ClipboardEvent | any) => {
    if (!isUnlocked && !isAdmin) {
      e.preventDefault();
      const cheekyMessage = "🛑 Aha! Nice try. This Perfect Prompt is proprietary BlueprintAI architecture. Upgrade to Pro to copy and export our prompts: https://blueprintagent.dev";
      
      try {
        await navigator.clipboard.writeText(cheekyMessage);
      } catch (err) {
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', cheekyMessage);
        }
      }
      
      alert("🛑 Nice try! You need the Founder Tier to copy our proprietary prompts.");
    }
  };

  const [isBrainstormOpen, setIsBrainstormOpen] = useState(false);
  const [brainstormMessages, setBrainstormMessages] = useState<any[]>([]);

  const openBrainstormModal = () => {
    const randomGreeting = coFounderGreetings[Math.floor(Math.random() * coFounderGreetings.length)];
    setBrainstormMessages([
      {
        id: 'initial',
        sender: 'ai',
        text: randomGreeting
      }
    ]);
    setIsBrainstormOpen(true);
  };
  const [brainstormInput, setBrainstormInput] = useState('');
  const [isBrainstormTyping, setIsBrainstormTyping] = useState(false);
  const [liveDraft, setLiveDraft] = useState('');
  const [isHowToPromptOpen, setIsHowToPromptOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isBrainstormOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [brainstormMessages, isBrainstormTyping, isBrainstormOpen]);

  const handleApproveIdea = (ideaText: string) => {
    setIdea(ideaText);
    setIsBrainstormOpen(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBrainstormInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (brainstormInput.trim() && !isBrainstormTyping) {
        handleBrainstormSubmit(brainstormInput);
      }
    }
  };

  const handleBrainstormSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsgId = `user-${Date.now()}`;
    const updatedMessages = [...brainstormMessages, { id: userMsgId, sender: 'user', text }];
    setBrainstormMessages(updatedMessages);
    setBrainstormInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsBrainstormTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(msg => ({ sender: msg.sender, text: msg.text })) }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to brainstorm');
      }
      
      const aiText = data.text;
      
      let cleanText = aiText;
      const draftMatch = aiText.match(/<draft>([\s\S]*?)<\/draft>/);
      if (draftMatch) {
         setLiveDraft(draftMatch[1].trim());
         cleanText = aiText.replace(/<draft>[\s\S]*?<\/draft>/g, '').trim();
      } else {
         const boldMatch = aiText.match(/\*\*([^*]{10,200})\*\*/);
         if (boldMatch && boldMatch[1]) setLiveDraft(boldMatch[1].trim());
      }

      setBrainstormMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: cleanText
      }]);
    } catch (err) {
      console.error(err);
      setBrainstormMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Error connecting to AI Co-Founder. Please try again."
      }]);
    } finally {
      setIsBrainstormTyping(false);
    }
  };

  const handlePillClick = async (category: string, displayLabel: string) => {
    const userMsgId = `user-${Date.now()}`;
    const userText = `I'm leaning towards building a ${displayLabel}. Give me a refined concept.`;
    const updatedMessages = [...brainstormMessages, { id: userMsgId, sender: 'user', text: userText }];
    setBrainstormMessages(updatedMessages);
    setIsBrainstormTyping(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(msg => ({ sender: msg.sender, text: msg.text })) }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to brainstorm');
      }
      
      const aiText = data.text;
      let cleanText = aiText;
      const draftMatch = aiText.match(/<draft>([\s\S]*?)<\/draft>/);
      if (draftMatch) {
         setLiveDraft(draftMatch[1].trim());
         cleanText = aiText.replace(/<draft>[\s\S]*?<\/draft>/g, '').trim();
      } else {
         const boldMatch = aiText.match(/\*\*([^*]{10,200})\*\*/);
         if (boldMatch && boldMatch[1]) setLiveDraft(boldMatch[1].trim());
      }

      setBrainstormMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: cleanText
      }]);
    } catch (err) {
      console.error(err);
      setBrainstormMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Error connecting to AI Co-Founder. Please try again."
      }]);
    } finally {
      setIsBrainstormTyping(false);
    }
  };

  const defaultIdeas = [
    "An AI-powered REAPER script that automatically EQs muddy vocals in real-time...",
    "A subscription-based VST plugin marketplace for indie beatmakers...",
    "A dispatch dashboard for mobile mechanics...",
    "An AI wrapper that generates personalized wedding speeches...",
    "A Chrome extension that auto-fills government grant applications...",
    "A productized service for real estate drone photography...",
    "A programmatic SEO directory for local building permits...",
    "A matchmaking marketplace for freelance copywriters...",
    "An inventory tracker for custom epoxy countertop installers...",
    "An automated SMS reminder tool for mobile pet groomers...",
    "A dynamic pricing engine for local escape rooms...",
    "A paid newsletter tracking local zoning law changes...",
    "A peer-to-peer marketplace for renting out indie filmmaking gear...",
    "A CRM specifically for commercial pool cleaners...",
    "A shift-scheduling app for independent coffee shops...",
    "A directory of pet-friendly Airbnbs with fully fenced yards...",
    "A lead-gen tool for HVAC companies tracking heat pump rebates...",
    "An AI contract analyzer for freelance graphic designers...",
    "A Webflow template marketplace for dental clinics...",
    "A job board exclusively for bilingual construction project managers...",
    "A micro-SaaS calculating material yield for drywall installers...",
    "A SaaS that routes excess bakery inventory to local food banks...",
    "An AI tool that writes custom cold emails for commercial roofers...",
    "A matching app for Twitch streamers and indie game devs...",
    "A subscription tracking app that auto-cancels unused services...",
    "A digital tip-jar and review platform for local buskers...",
    "A dashboard tracking distressed properties for real estate flippers..."
  ];

  const ideas = (learnSkill && learnNiche) ? [
    `I want to learn ${learnSkill} by building a CRM for ${learnNiche}...`,
    `I want to master ${learnSkill} by developing an AI tool for ${learnNiche}...`,
    `I want to learn ${learnSkill} from scratch while building a directory for ${learnNiche}...`
  ] : (pSeoModel && pSeoNiche) ? [
    `A ${pSeoModel} for ${pSeoNiche} that scrapes local municipal data to automate compliance paperwork...`,
    `An AI-powered ${pSeoModel} that connects ${pSeoNiche} to high-net-worth clients via automated LinkedIn outreach...`,
    `A white-labeled ${pSeoModel} allowing ${pSeoNiche} to launch their own branded client portals in one click...`,
    `A ${pSeoModel} for ${pSeoNiche} that turns voice memos into formatted invoices and sends them via SMS...`,
    `A hyper-local ${pSeoModel} that helps ${pSeoNiche} identify untapped neighborhoods for targeted ad spend...`,
    `A B2B ${pSeoModel} that integrates with QuickBooks to automatically chase down unpaid invoices for ${pSeoNiche}...`,
    `A zero-setup ${pSeoModel} that monitors competitors' pricing and alerts ${pSeoNiche} when to adjust their rates...`,
    `An offline-first ${pSeoModel} that allows ${pSeoNiche} to track material yield and waste without an internet connection...`
  ] : defaultIdeas;

  const placeholderRef = useRef<HTMLSpanElement>(null); // Attach this to the fake placeholder span!
  const ideaIndex = useRef(0);
  const isDeleting = useRef(false);
  const currentText = useRef("");

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeLoop = () => {
      const targetIdea = ideas[ideaIndex.current];

      if (isDeleting.current) {
        currentText.current = targetIdea.substring(0, currentText.current.length - 1);
      } else {
        currentText.current = targetIdea.substring(0, currentText.current.length + 1);
      }

      // DIRECT DOM UPDATE (Bypasses React Render Cycle)
      if (placeholderRef.current) {
        placeholderRef.current.textContent = currentText.current || "\u00A0";
      }

      let speed = isDeleting.current ? 20 : 40; // Extremely fast and smooth

      if (!isDeleting.current && currentText.current === targetIdea) {
        speed = 3000; // Pause to read
        isDeleting.current = true;
      } else if (isDeleting.current && currentText.current === "") {
        isDeleting.current = false;
        // Pick new random idea
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * ideas.length);
        } while (nextIndex === ideaIndex.current);
        ideaIndex.current = nextIndex;
        speed = 500; // Pause before starting new word
      }

      timeout = setTimeout(typeLoop, speed);
    };

    timeout = setTimeout(typeLoop, 500); // Start the loop
    return () => clearTimeout(timeout);
  }, []); // Empty dependency array so it only mounts once!

  const startRecording = () => {
    setMicError('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("Browser doesn't support voice input. Try Chrome.");
      setTimeout(() => setMicError(''), 5000);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
         setIdea(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      if (event.error !== 'no-speech') {
          setMicError(`Mic error: ${event.error}`);
          setTimeout(() => setMicError(''), 5000);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const ideaRef = useRef(idea);
  const techLevelRef = useRef(techLevel);
  const aiBuilderRef = useRef(aiBuilder);
  const selectedModelRef = useRef(selectedModel);

  useEffect(() => { ideaRef.current = idea; }, [idea]);
  useEffect(() => { techLevelRef.current = techLevel; }, [techLevel]);
  useEffect(() => { aiBuilderRef.current = aiBuilder; }, [aiBuilder]);
  useEffect(() => { selectedModelRef.current = selectedModel; }, [selectedModel]);

  const generateBlueprint = async (isPivot = false, pivotTechLevel?: string, pivotAiBuilder?: string) => {
    const finalTechLevel = pivotTechLevel || techLevelRef.current;
    const finalAiBuilder = pivotAiBuilder || aiBuilderRef.current;
    
    let basePrompt = ideaRef.current.trim() || ideas[ideaIndex.current];
    if (!basePrompt) return;
    
    const promptToUse = `Build a [${activeProjectType}] doing: ${basePrompt}`;
    
    setLoading(true);
    setError('');
    
    if (isPivot) {
      setIsPivoting(true);
      if (finalTechLevel === 'No-Code') {
        setLoadingMessage('Re-architecting for No-Code stack...');
      } else if (finalTechLevel === 'Learn to Code') {
        setLoadingMessage('Simplifying architecture for learning...');
      } else if (finalAiBuilder === 'Antigravity') {
        setLoadingMessage('Rewriting A2A rules for Antigravity...');
      } else {
        setLoadingMessage(`Rewriting A2A rules for ${finalAiBuilder}...`);
      }
    } else {
      setBlueprint('');
      setIsPivoting(false);
      setLoadingStep(0);
    }
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: promptToUse, 
          aiBuilder: finalTechLevel === 'No-Code' ? 'None' : finalAiBuilder, 
          techLevel: finalTechLevel,
          llmCore,
          mcpTools,
          baseTemplate,
          businessModelSlug: selectedModelRef.current
        }),
      });
      
      if (!response.ok) {
        let errStr = `Server Error (${response.status})`;
        try {
           const errData = await response.json();
           if (errData.error) errStr = errData.error;
        } catch(e) {}
        throw new Error(errStr);
      }
      
      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        if (chunkValue) {
          fullText += chunkValue;
          setBlueprint(fullText);
        }
      }
      
      localStorage.setItem('blueprintData', fullText);
      localStorage.setItem('ideaPrompt', promptToUse);
      
      if (userId) {
        try {
          const { data: profile } = await supabase.from('profiles').select('is_pro').eq('user_id', userId).single();
          const isUserPro = profile?.is_pro === true;

          await supabase.from('blueprints').insert({
            user_id: userId,
            idea_prompt: promptToUse,
            blueprint_markdown: fullText,
            is_unlocked: isUserPro || isAdmin,
            tech_level: finalTechLevel,
            ai_builder: finalTechLevel === 'No-Code' ? 'None' : finalAiBuilder
          });
          
          if (isUserPro || isAdmin) {
            setIsUnlocked(true);
          }
        } catch (dbErr) {
          console.error("Failed to save to Supabase", dbErr);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setIsPivoting(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading && !isPivoting) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 3);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading, isPivoting]);

  const loadingMessages = [
    "> [Arch-Agent] Mapping database relations...",
    "> [Sec-Agent] Writing RLS policies...",
    "> [Dev-Agent] Generating .clinerules environment..."
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateBlueprint();
    }
  };

  const splitBlueprint = (text: string) => {
    let free = '';
    let premium = '';
    let cursorRules = '';
    let thinkText = '';

    const thinkMatch = text.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
    if (thinkMatch) {
      thinkText = thinkMatch[1].trim();
      text = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/i, '').trim();
    }

    const cursorRulesMatch = text.match(/```a2a\n([\s\S]*?)```/) || text.match(/```cursorrules\n([\s\S]*?)```/);
    if (cursorRulesMatch) {
      cursorRules = cursorRulesMatch[1].trim();
      text = text.replace(/```(a2a|cursorrules)\n[\s\S]*?```/, '');
    }

    if (isUnlocked) {
      free = text;
      premium = '';
    } else {
      const match = text.match(/(?:\n|^)(?:#|\*)*\s*Phase 2/i);
      const splitIndex = match ? match.index : -1;
      if (splitIndex !== -1) {
        free = text.slice(0, splitIndex);
        premium = text.slice(splitIndex);
      } else {
        free = text;
        premium = '';
      }
    }

    return { free, premium, cursorRules, thinkText };
  };

  const { free, premium, cursorRules, thinkText } = splitBlueprint(blueprint);

  const handleCopyRules = () => {
    if (!cursorRules) return;
    navigator.clipboard.writeText(cursorRules);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const a2aTitle = aiBuilder === 'Decide for me ✨' ? 'A2A Tech Lead Configuration' : `A2A Tech Lead Configuration (${aiBuilder === 'Cursor' ? '.cursorrules' : aiBuilder === 'Windsurf' ? '.windsurfrules' : '.clinerules'})`;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Input Section */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
        
        {/* Marquee Ticker */}
        <div className="overflow-hidden bg-zinc-900/50 border border-zinc-800/50 rounded-xl py-2.5 flex whitespace-nowrap shadow-inner w-full relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="absolute inset-x-0 h-full w-full pointer-events-none z-10 box-border rounded-xl"></div>
          <div className="animate-marquee hover:[animation-play-state:paused] flex items-center text-[11px] font-mono tracking-widest uppercase shrink-0 w-max relative z-0">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 px-4 shrink-0">
                <span className="text-zinc-400"><span className="mr-2 text-base">🔥</span> JUST ADDED: <span className="text-zinc-300 font-semibold">Google Open Knowledge Format (OKF) Export</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
                <span className="text-zinc-400"><span className="mr-2 text-base">🔥</span> NEW: <span className="text-zinc-300 font-semibold">Agent-to-Agent (A2A) Anti-Laziness Architecture Files</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
                <span className="text-zinc-400"><span className="mr-2 text-base">🚀</span> JUST SHIPPED: <span className="text-zinc-300 font-semibold">1-Click Cursor &amp; Windsurf Code Export</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
                <span className="text-zinc-400"><span className="mr-2 text-base">⚡</span> IN DEVELOPMENT: <span className="text-zinc-300 font-semibold">Automated Competitor Pricing Tear-Downs</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
                <span className="text-zinc-400"><span className="mr-2 text-base">🎨</span> UP NEXT: <span className="text-zinc-300 font-semibold">AI-to-Figma Wireframe Generation</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
                <span className="text-zinc-400"><span className="mr-2 text-base">📈</span> PRO FEATURE: <span className="text-zinc-300 font-semibold">Bespoke Monetization Strategy Generation</span></span>
                <span className="text-zinc-700 font-light px-2">|</span>
              </div>
            ))}
          </div>
        </div>

        {learnSkill && learnNiche ? (
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight mt-4 mb-2 text-center sm:text-left">
            Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{learnSkill}</span> by building a digital business for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{learnNiche}</span>
          </h1>
        ) : pSeoModel && pSeoNiche ? (
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight mt-4 mb-2 text-center sm:text-left">
            Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{pSeoModel}</span> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{pSeoNiche}</span>
          </h1>
        ) : null}
        {!pSeoModel && !pSeoNiche && !learnSkill && !learnNiche && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-500/70 mb-2 block ml-1">&gt; INPUT_ARCHITECTURE_PARAMETERS_</span>
        )}
        
        {/* Project Type Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {['Full Stack App', 'Mobile App', 'Landing Page', 'Chrome Extension'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveProjectType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all backdrop-blur-md ${
                activeProjectType === type
                  ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {type === 'Full Stack App' && '🌐 '}
              {type === 'Mobile App' && '📱 '}
              {type === 'Landing Page' && '🛬 '}
              {type === 'Chrome Extension' && '🧩 '}
              {type}
            </button>
          ))}
        </div>

        {/* Business Model Select Dropdown */}
        <div className="flex flex-col gap-1.5 mb-2 max-w-xs">
          <label htmlFor="business-model-select" className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block ml-1">
            Select Business Model (Optional):
          </label>
          <div className="relative">
            <select
              id="business-model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-zinc-300 text-xs rounded-xl p-3 focus:border-cyan-500/50 focus:outline-none transition-all cursor-pointer appearance-none pr-10 shadow-inner"
            >
              <option value="">-- No Specific Model --</option>
              {businessModels.map((model) => (
                <option key={model.slug} value={model.slug} className="bg-slate-950 text-zinc-300 text-xs">
                  {model.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div 
          className="relative group bg-slate-900/50 border-2 border-slate-800 focus-within:border-cyan-500/50 rounded-xl shadow-2xl transition-all w-full flex flex-col overflow-hidden"
          onCopy={handleCopyTrap}
        >
          <div className={`absolute top-0 left-0 w-full h-full p-6 pb-24 pointer-events-none text-zinc-500 overflow-hidden break-words whitespace-pre-wrap text-lg ${idea.length > 0 ? 'opacity-0' : 'opacity-100'}`} aria-hidden="true">
            <span ref={placeholderRef}></span><span className="animate-pulse text-cyan-400 font-bold ml-0.5">|</span>
          </div>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-40 min-h-[120px] max-h-[600px] bg-transparent p-6 pb-24 text-lg text-zinc-100 focus:outline-none resize-y overflow-y-auto"
            disabled={loading}
            aria-label="Business idea input"
          />
          <div className="absolute top-4 right-4 flex gap-2 pointer-events-none">
            <span className="text-[10px] bg-slate-800/80 px-2 py-1 rounded text-slate-400 font-mono tracking-tighter hidden sm:block backdrop-blur-sm">PRO ENGINE v4.2</span>
          </div>
          {/* Sleek Action Bar */}
          <div className="absolute bottom-0 w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={startRecording}
                className={`p-2 rounded-lg transition-all ${isRecording ? 'text-red-500 bg-red-900/20 animate-pulse' : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800'}`}
                title="Use Voice Input"
                aria-label="Start voice typing"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsHowToPromptOpen(true)}
                aria-label="View prompt instructions"
                className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-slate-300 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm backdrop-blur-sm"
                title="How to Prompt"
              >
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">How to Prompt</span>
              </button>
              <AnimatePresence>
                {micError && (
                  <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-mono bg-red-950/80 px-2 py-1.5 rounded border border-red-900/50">
                    {micError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center pointer-events-auto">
              <button
                onClick={openBrainstormModal}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 text-xs font-semibold rounded-lg transition-all flex items-center shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-sm"
              >
                <span><span className="hidden sm:inline">Need an idea? </span>Brainstorm with AI 🧠</span>
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Controls Drawer */}
        <details className="group w-full bg-slate-900/40 rounded-xl border border-slate-800 mt-2">
          <summary className="flex items-center justify-between p-4 cursor-pointer list-none outline-none text-xs font-mono text-slate-400 uppercase tracking-widest hover:text-cyan-400 transition-colors">
            <div className="flex items-center gap-2">
              <span>⚙️ Advanced Controls</span>
            </div>
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="p-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/50">
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Select LLM Core:</label>
              <select 
                value={llmCore}
                onChange={(e) => setLlmCore(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 focus:border-cyan-500 outline-none"
              >
                <option>Gemini 3.1 Pro (Default)</option>
                <option>Claude 3.5 Sonnet</option>
                <option>GPT-4o</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Select MCPs to use:</label>
              <select 
                value={mcpTools}
                onChange={(e) => setMcpTools(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 focus:border-cyan-500 outline-none"
              >
                <option>None</option>
                <option>Firecrawl (Web Scraper)</option>
                <option>GitHub</option>
                <option>Vercel</option>
                <option>Supabase</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Select Template:</label>
              <select 
                value={baseTemplate}
                onChange={(e) => setBaseTemplate(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 focus:border-cyan-500 outline-none"
              >
                <option>Next.js + Supabase (Default)</option>
                <option>React + Firebase</option>
                <option>Node + Postgres</option>
              </select>
            </div>

          </div>
        </details>

          <button
            onClick={() => generateBlueprint()}
            disabled={loading}
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 disabled:bg-[#0D0D0D] disabled:border disabled:border-zinc-800 disabled:text-zinc-500 disabled:shadow-none text-black font-bold text-lg md:text-sm rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] group overflow-hidden relative cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-3 w-full px-6 font-mono text-xs sm:text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-500 shrink-0" />
                <span className="text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left">
                  {isPivoting ? loadingMessage : loadingMessages[loadingStep]}
                </span>
                <span className="w-2 h-4 bg-cyan-500 animate-pulse shrink-0"></span>
              </div>
            ) : (
              <>
                <span className="uppercase tracking-wider relative z-10">GENERATE LAUNCH BLUEPRINT</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </>
            )}
          </button>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-md border border-red-900/50 bg-red-950/20 text-red-400 font-mono text-sm flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results State */}
      <AnimatePresence>
        {blueprint && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full flex-1 p-6 sm:p-8 overflow-hidden flex flex-col relative transition-all duration-500 ${isPivoting ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {isPivoting && (
              <div className="absolute inset-0 flex items-center justify-center z-50">
                <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
              </div>
            )}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/50">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-cyan-500" />
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Latest Architecture: mvp-blueprint.md</span>
              </div>
              <div className="flex gap-4">
                <div className="hidden sm:flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] text-slate-500 font-mono">SYSTEM READY</span>
                </div>
              </div>
            </div>

            {thinkText && (
              <details className="group mb-6 border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-950/40 backdrop-blur-md">
                <summary className="flex items-center justify-between p-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-widest cursor-pointer hover:bg-zinc-900/50 transition-colors list-none outline-none">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-500 animate-pulse" />
                    ✨ Agent Reasoning Process
                  </div>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-4 border-t border-zinc-800 bg-black/80 font-mono text-[10px] text-zinc-500 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                  {thinkText}
                </div>
              </details>
            )}

            <div className="prose prose-invert prose-cyan max-w-none prose-headings:font-bold prose-h1:text-cyan-400 prose-h2:text-zinc-200 prose-h3:text-cyan-500/80 prose-p:text-zinc-400 prose-p:leading-relaxed prose-li:text-zinc-400 prose-strong:text-zinc-300 bg-transparent"
              onCopy={handleCopyTrap}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{ 
                  blockquote: ExpandableBlockquote, 
                  h2: ({ node, children, ...props }: any) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return <h2 id={id} className="" {...props}>{children}</h2>;
                  },
                  h3: ({ node, children, ...props }: any) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return <h3 id={id} className="" {...props}>{children}</h3>;
                  },
                  pre: CodeBlock,
                  a: ({ node, ...props }: any) => (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                    />
                  ),
                  input: ({ node, checked, ...props }: any) => {
                    if (props.type === 'checkbox') {
                      return (
                        <input 
                          type="checkbox" 
                          defaultChecked={checked}
                          className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer mr-2 mt-1" 
                        />
                      );
                    }
                    return <input {...props} />;
                  }
                }}
              >{free}</ReactMarkdown>
            </div>

            {cursorRules && (
              <div className="mt-8 mb-4">
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 border-b-0 rounded-t-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono font-semibold text-zinc-300">{a2aTitle}</span>
                  </div>
                  <button
                    onClick={handleCopyRules}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors text-xs font-mono border border-zinc-700"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Agent Rules'}
                  </button>
                </div>
                <div className="bg-[#0D0D0D] border border-zinc-800 rounded-b-xl overflow-x-auto p-4 relative shadow-2xl pb-6">
                  <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap leading-relaxed m-0">
                    <code>{cursorRules}</code>
                  </pre>
                </div>
              </div>
            )}

            {premium && (
              <div className="relative mt-12 rounded-xl group overflow-hidden">
                {!isUnlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl pointer-events-auto">
                    {/* Left Card */}
                    <div className="border border-slate-700 bg-slate-900/90 rounded-2xl p-6 sm:p-8 flex flex-col backdrop-blur-xl">
                      <h3 className="text-xl font-bold text-white font-sans uppercase tracking-tight">The Hustler Tier</h3>
                      <div className="text-3xl font-bold mt-2 mb-6 text-white">$29 <span className="text-sm font-normal text-slate-400">One-Time</span></div>
                      
                      <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Instant .cursorrules & .clinerules Files</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Copy & Paste AI Developer Prompts</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Stripe-Ready Legal Compliance Pack</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>The 'First 10 Customers' GTM Script</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Database Schemas & RLS Policies</span>
                        </li>
                      </ul>
                      
                      <button onClick={() => window.location.href = "https://distresshunter.gumroad.com/l/vjowjj?wanted=true"} className="w-full py-3 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700">
                        Unlock Basic
                      </button>
                    </div>

                    {/* Right Card */}
                    <div className="border-2 border-cyan-500 bg-slate-900/90 rounded-2xl p-6 sm:p-8 flex flex-col relative shadow-[0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-xl">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.8)]">
                        Most Popular
                      </div>
                      <h3 className="text-xl font-bold text-white font-sans uppercase tracking-tight">The Founder Tier</h3>
                      <div className="text-3xl font-bold mt-2 mb-6 text-white">$19<span className="text-sm font-normal text-slate-400">/Month</span></div>
                      
                      <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-start gap-3 font-semibold text-white text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Everything in Hustler, PLUS:</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>24/7 Context-Aware AI Tech Lead (Chat)</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Live 'Vision' Debugging (Paste Screenshots)</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Unlimited Blueprint Generations</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>Auto-Save to Secure Cloud Vault</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                          <span>CI/CD Pipelines & Architecture Diagrams</span>
                        </li>
                      </ul>
                      
                      <button onClick={() => window.location.href = "https://distresshunter.gumroad.com/l/pbhwbn?wanted=true"} className="w-full py-3 sm:py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]">
                        Start Subscription
                      </button>
                    </div>
                  </div>
                </div>
                )}
                
                {!isUnlocked && <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>}
                
                <div className={`prose prose-invert prose-cyan max-w-none p-4 ${!isUnlocked ? 'blur-md select-none opacity-60 pointer-events-none' : ''}
                  prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight 
                  prose-h2:border-l-4 prose-h2:border-cyan-500 prose-h2:pl-4 prose-h2:mb-4 prose-h2:text-2xl prose-h2:text-white
                  prose-p:text-slate-300 prose-p:font-serif prose-p:text-sm prose-p:leading-relaxed
                  prose-li:text-slate-400 prose-li:font-mono prose-li:text-xs
                  prose-strong:text-cyan-400 prose-strong:uppercase prose-strong:font-sans prose-strong:text-xs prose-strong:tracking-widest
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-cyan-300 transition-colors`}
                >
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{ 
                      blockquote: ExpandableBlockquote, 
                      pre: CodeBlock,
                      a: ({ node, ...props }: any) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                        />
                      ),
                      input: ({ node, checked, ...props }: any) => {
                        if (props.type === 'checkbox') {
                          return (
                            <input 
                              type="checkbox" 
                              defaultChecked={checked}
                              className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer mr-2 mt-1" 
                            />
                          );
                        }
                        return <input {...props} />;
                      }
                    }}
                  >
                    {premium}
                  </ReactMarkdown>
                </div>
                
                {!isUnlocked && (
                  <div className="relative z-30 mt-2 pb-6 text-center">
                    <button 
                      onClick={() => setIsUnlocked(true)}
                      className="text-[10px] text-slate-500 hover:text-slate-300 hover:underline transition-colors font-mono uppercase tracking-widest cursor-pointer pointer-events-auto"
                    >
                      Bypass Paywall (Admin Mode)
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHowToPromptOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-lg"
              onClick={() => setIsHowToPromptOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900/80 border border-slate-800 rounded-2xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)] backdrop-blur-xl z-10"
            >
              <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                    <Info className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">BlueprintAI Best Practices</h3>
                    <p className="text-[10px] text-slate-500 font-mono">HOW TO ENGINEER THE PERFECT PROMPT</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHowToPromptOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 sm:p-8 space-y-8 prose prose-invert prose-cyan max-w-none">
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  BlueprintAI is powered by an elite System Architecture prompt. To get the most lucrative, production-ready blueprint, you shouldn't just type a 5-word idea. You need to feed the engine context.
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-cyan-950/30 p-4 rounded-lg border border-cyan-900/50">
                  <strong className="text-pink-400 font-bold">Don't want to write it yourself?</strong><br />
                  Click the pink <em>Brainstorm with AI</em> button on the main dashboard. You can casually discuss your vision with your AI Co-Founder, and it will dynamically ghostwrite the perfect architectural prompt for you in real-time.
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-semibold text-cyan-400">
                  Otherwise, if you prefer to write it manually, structure your idea using the "4 Pillars":
                </p>

                <div className="space-y-6">
                  <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">1</span> THE IDENTITY & THE AUDIENCE</h4>
                    <p className="text-sm text-slate-400 mb-2">Who are you building this for? Be hyper-specific.</p>
                    <div className="text-sm">
                      <span className="text-red-400 font-semibold mr-2">Bad:</span><span className="text-slate-300">"An app for mechanics."</span><br/>
                      <span className="text-green-400 font-semibold mr-2">Good:</span><span className="text-slate-300">"A dispatch tool for mobile auto mechanics in Canada who do driveway oil changes."</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">2</span> THE CORE MECHANICS</h4>
                    <p className="text-sm text-slate-400 mb-2">What is the primary action the user takes?</p>
                    <div className="text-sm">
                      <span className="text-cyan-400 font-semibold mr-2">Example:</span><span className="text-slate-300">"The mechanic scans a VIN barcode with their phone, and the app automatically pulls the required oil type and filter size from an API."</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">3</span> THE "UNFAIR ADVANTAGE" (The Data)</h4>
                    <p className="text-sm text-slate-400 mb-2">Where is your data coming from? BlueprintAI needs to know your constraints.</p>
                    <div className="text-sm">
                      <span className="text-cyan-400 font-semibold mr-2">Example:</span><span className="text-slate-300">"We are using a public government database" or "We are using user-uploaded PDF files."</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl">
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2"><span className="bg-cyan-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">4</span> YOUR ENDGAME</h4>
                    <p className="text-sm text-slate-400 mb-2">How do you plan to scale it?</p>
                    <div className="text-sm">
                      <span className="text-cyan-400 font-semibold mr-2">Example:</span><span className="text-slate-300">"I want to start by manually selling this to 10 local shops, but eventually want to charge a $49/month SaaS subscription."</span>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-900/20 border border-cyan-500/30 p-5 rounded-xl mt-8">
                  <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4"/> PRO-TIP</h4>
                  <p className="text-sm text-slate-300 leading-relaxed m-0">
                    If you are an experienced developer, make sure you select your preferred AI IDE (Cursor, Windsurf, Antigravity) before generating. BlueprintAI will output the exact hidden configuration files (.cursorrules / .clinerules) you need to drop into your workspace to keep your AI coding agents from getting lazy.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBrainstormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-lg"
              onClick={() => setIsBrainstormOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[80vh] flex flex-col lg:flex-row bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-10 shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)]"
            >
              {/* Left Column: Live Draft */}
              <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40">
                <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/60">
                  <h3 className="text-sm sm:text-base font-bold text-cyan-400 uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Live Blueprint Prompt
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">CONTINUOUSLY UPDATING...</p>
                </div>
                <div 
                  className="flex-1 p-4 sm:p-6 relative"
                  onCopy={handleCopyTrap}
                >
                  <textarea 
                    className="w-full h-full min-h-[300px] bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4 text-sm leading-relaxed text-cyan-50 font-mono resize-y focus:outline-none focus:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)] transition-colors"
                    value={liveDraft}
                    onChange={(e) => setLiveDraft(e.target.value)}
                    placeholder="Chat with your AI Co-Founder to engineer the perfect 6-Pillar prompt..."
                  />
                </div>
                <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/60">
                  <button
                    onClick={() => handleApproveIdea(liveDraft)}
                    disabled={!liveDraft.trim()}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Approve This Draft</span>
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Chat Interface */}
              <div className="w-full lg:w-1/2 flex flex-col h-full bg-slate-900/80">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                      <Bot className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">Co-Founder Chat</h3>
                      <p className="text-[10px] text-slate-500 font-mono">GHOSTWRITER PROTOCOL</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBrainstormOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
                {brainstormMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} w-full`}
                  >
                    <div className="flex items-start gap-3 max-w-[85%]">
                      {msg.sender === 'ai' && (
                        <div className="w-7 h-7 bg-cyan-500/10 rounded-full border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                          msg.sender === 'user'
                            ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-tr-none ml-auto'
                            : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-tl-none'
                        }`}
                      >
                        {msg.sender === 'ai' ? (
                          <div className="prose prose-invert prose-cyan max-w-none text-xs sm:text-sm prose-p:my-1 prose-strong:text-cyan-400">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{ 
                                pre: CodeBlock,
                                a: ({ node, ...props }: any) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 underline font-medium"
                                  />
                                ),
                                input: ({ node, checked, ...props }: any) => {
                                  if (props.type === 'checkbox') {
                                    return (
                                      <input 
                                        type="checkbox" 
                                        defaultChecked={checked}
                                        className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900 cursor-pointer mr-2 mt-1" 
                                      />
                                    );
                                  }
                                  return <input {...props} />;
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isBrainstormTyping && (
                  <div className="flex items-start gap-3 max-w-[85%]">
                    <div className="w-7 h-7 bg-cyan-500/10 rounded-full border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Options (Pills) */}
              {!isBrainstormTyping && (
                <div className="px-4 sm:px-6 pb-2">
                  <div className="text-[10px] uppercase tracking-widest font-mono text-slate-500 mb-2">Suggested Paths:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePillClick('saas', 'B2B SaaS 🏢')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>B2B SaaS</span>
                      <span>🏢</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('marketplace', 'Local Marketplace 🤝')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Local Marketplace</span>
                      <span>🤝</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('wrapper', 'AI Wrapper 🤖')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>AI Wrapper</span>
                      <span>🤖</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('chrome-extension', 'Chrome Extension 🧩')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Chrome Extension</span>
                      <span>🧩</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('daw-plugin', 'DAW Plugin 🎛️')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>DAW Plugin</span>
                      <span>🎛️</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('newsletter', 'Paid Newsletter 📧')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Paid Newsletter</span>
                      <span>📧</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('directory', 'Niche Directory 🗂️')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Niche Directory</span>
                      <span>🗂️</span>
                    </button>
                    <button
                      onClick={() => handlePillClick('govtech', 'B2G Gov-Tech 🏛️')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>B2G Gov-Tech</span>
                      <span>🏛️</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (brainstormInput.trim()) {
                    handleBrainstormSubmit(brainstormInput);
                  }
                }}
                className="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-2 items-end"
              >
                <div className="flex-1 bg-slate-900/50 border border-slate-800 focus-within:border-cyan-500/50 rounded-xl px-4 min-h-[44px] flex items-center">
                  <textarea
                    ref={textareaRef}
                    value={brainstormInput}
                    onChange={handleTextareaChange}
                    onKeyDown={handleTextareaKeyDown}
                    onCopy={handleCopyTrap}
                    placeholder="Ask for custom ideas or refine details..."
                    className="resize-none min-h-[44px] max-h-[200px] overflow-y-auto w-full bg-transparent outline-none py-3 text-sm text-white placeholder:text-slate-600"
                    disabled={isBrainstormTyping}
                    rows={1}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isBrainstormTyping || !brainstormInput.trim()}
                  className="p-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-black rounded-xl transition-colors cursor-pointer shrink-0 mb-0.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

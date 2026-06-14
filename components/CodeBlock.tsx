'use client';

import { useState } from 'react';
import { Check, Copy, Zap } from 'lucide-react';

export const CodeBlock = ({ children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const textContext = children?.props?.children;

  const handleCopy = () => {
    if (typeof textContext === 'string') {
      navigator.clipboard.writeText(textContext.replace(/\n$/, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSendToWorkspace = () => {
    if (typeof textContext === 'string') {
      window.dispatchEvent(
        new CustomEvent('update-sandbox', { detail: { code: textContext.replace(/\n$/, '') } })
      );
      setIsSent(true);
      setTimeout(() => setIsSent(false), 2000);
      // Let the user know by briefly showing a toast or alert (optional since the button changes text)
    }
  };

  return (
    <div className="relative group mt-4">
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
        <button
          onClick={handleSendToWorkspace}
          className="bg-zinc-800/80 hover:bg-zinc-700 text-cyan-400 border border-cyan-500/50 backdrop-blur-sm px-2 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          {isSent ? "🚀 Sent!" : <><Zap className="w-3.5 h-3.5" /> Send to Workspace</>}
        </button>
        <button
          onClick={handleCopy}
          className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 backdrop-blur-sm p-1.5 rounded-md transition-all"
          title="Copy Code"
        >
          {isCopied ? <Check className="text-emerald-400 w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre {...props}>
        {children}
      </pre>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const CodeBlock = ({ children, ...props }: any) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const textContext = children?.props?.children;

  const handleCopy = () => {
    if (typeof textContext === 'string') {
      navigator.clipboard.writeText(textContext.replace(/\n$/, ''));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 backdrop-blur-sm p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
      >
        {isCopied ? <Check className="text-cyan-400 w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre {...props}>
        {children}
      </pre>
    </div>
  );
};

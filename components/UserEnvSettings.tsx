import React, { useState, useEffect } from 'react';
import { X, Settings, ShieldAlert, CheckCircle } from 'lucide-react';

interface UserEnvSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserEnvSettings({ isOpen, onClose }: UserEnvSettingsProps) {
  const [firecrawlKey, setFirecrawlKey] = useState('');
  const [apifyKey, setApifyKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('blueprint_user_keys');
      if (stored) {
        try {
          const keys = JSON.parse(stored);
          setFirecrawlKey(keys.firecrawlKey || '');
          setApifyKey(keys.apifyKey || '');
          setOpenaiKey(keys.openaiKey || '');
          setAnthropicKey(keys.anthropicKey || '');
        } catch (e) {
          console.error("Error parsing stored keys", e);
        }
      }
      setIsSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    const keys = {
      firecrawlKey,
      apifyKey,
      openaiKey,
      anthropicKey
    };
    localStorage.setItem('blueprint_user_keys', JSON.stringify(keys));
    setIsSaved(true);
    setTimeout(() => {
      onClose();
      setIsSaved(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white tracking-tight">Local API Keys</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start gap-3 p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/70">
              <span className="font-semibold text-amber-400">Secure Storage:</span> Your keys are stored securely in your browser's local storage. They are never saved to our database.
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Firecrawl API Key</label>
              <input
                type="password"
                value={firecrawlKey}
                onChange={(e) => setFirecrawlKey(e.target.value)}
                placeholder="fc-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <p className="text-[10px] text-slate-500">Required for web scraping and live analysis.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Apify API Key (Optional)</label>
              <input
                type="password"
                value={apifyKey}
                onChange={(e) => setApifyKey(e.target.value)}
                placeholder="apify_api_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">OpenAI API Key (Optional)</label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Anthropic API Key (Optional)</label>
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-4 rounded-lg transition-all"
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Saved!
                </>
              ) : (
                'Save Keys'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

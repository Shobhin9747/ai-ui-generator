'use client';

import React, { useState } from 'react';
import { Settings2, FileText, ChevronDown, ChevronUp, Sparkles, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptEditorProps {
  prd: string;
  setPrd: (val: string) => void;
  systemPrompt: string;
  setSystemPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  prd,
  setPrd,
  systemPrompt,
  setSystemPrompt,
  onGenerate,
  isGenerating
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Header Segment */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <BrainCircuit className="text-cyan-400 w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Requirement Input</h2>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2 rounded-lg transition-all ${showAdvanced ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
        >
          <Settings2 size={18} />
        </button>
      </div>

      {/* Advanced Settings */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-inset p-4 rounded-xl mb-4 space-y-3 border-cyan-500/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-tighter">System Persona</span>
                <div className="h-px flex-1 bg-cyan-500/10" />
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Influence the AI's coding style..."
                className="w-full h-24 bg-transparent border-none p-0 text-sm text-slate-400 focus:outline-none placeholder:text-slate-600 resize-none font-mono"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Templates */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
           <Sparkles size={12} className="text-cyan-500" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Start Templates</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Fintech Dashboard', icon: '📊' },
            { id: 'portfolio', label: 'Designer Portfolio', icon: '🎨' },
            { id: 'ecom', label: 'Luxury E-commerce', icon: '⌚' },
            { id: 'saas', label: 'SaaS Landing', icon: '🚀' }
          ].map(template => (
            <button
              key={template.id}
              onClick={() => {
                const templates: Record<string, string> = {
                  dashboard: 'Create a premium fintech dashboard with glassmorphism. Include a sidebar, summary cards for balance and ROI, a transaction list with status badges, and a revenue chart.',
                  portfolio: 'Design a high-end dark-mode designer portfolio. Use a bento-grid project gallery, smooth entrance animations, and a sophisticated typography-focused hero section.',
                  ecom: 'Build a luxury watch product page. Feature a centered product showcase, detailed specifications grid with icons, and a premium "Add to Cart" interaction.',
                  saas: 'Create a modern B2B SaaS landing page. Include a hero section with a gradient background, a feature grid with glass effect cards, and a sleek pricing table.'
                };
                setPrd(templates[template.id]);
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-bold text-slate-300 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:text-cyan-400 transition-all"
            >
              <span className="mr-1.5">{template.icon}</span> {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main PRD Input */}
      <div className="flex-1 flex flex-col min-h-0 space-y-3">
        <textarea
          value={prd}
          onChange={(e) => setPrd(e.target.value)}
          placeholder="Paste your PRD, feature list, or prompt here..."
          className="flex-1 w-full bg-white/[0.02] border border-white/5 focus:border-cyan-500/30 rounded-2xl p-5 text-slate-300 focus:outline-none focus:ring-4 focus:ring-cyan-500/5 transition-all resize-none font-sans text-sm leading-relaxed placeholder:text-slate-600 shadow-inner"
        />
        <div className="flex items-center justify-between px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          <span>Tokens: {prd.length} chars</span>
          <span>Formatting: MD Supported</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGenerate}
        disabled={isGenerating || !prd.trim()}
        className="relative group overflow-hidden py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-cyan-500/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center justify-center gap-3">
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <Sparkles className="w-5 h-5 text-white group-hover:animate-pulse" />
          )}
          <span className="font-black text-white uppercase tracking-widest text-sm">
            {isGenerating ? 'Synthesizing...' : 'Generate UI Tree'}
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default PromptEditor;

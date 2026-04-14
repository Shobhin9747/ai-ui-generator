'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Cpu, Layers, Globe, Terminal, Code, Eye, Settings } from 'lucide-react';
import PromptEditor from '@/components/PromptEditor';
import ComponentPreview from '@/components/ComponentPreview';
import CodeExporter from '@/components/CodeExporter';

export default function Home() {
  const [prd, setPrd] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  const handleGenerate = async () => {
    if (!prd.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd, systemPrompt }),
      });

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(data.code);
        // Automatically switch to preview if successful
        setActiveTab('preview');
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col p-4 md:p-8 gap-6 z-10">
      {/* Background Decorative Blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      {/* Modern Header */}
      <header className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 glass flex items-center justify-center border-cyan-500/20 shadow-lg shadow-cyan-500/10"
          >
            <Bot className="text-cyan-400 w-7 h-7" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black text-gradient leading-tight">
              AGENTIC<span className="text-cyan-400 text-sm font-mono ml-2 tracking-widest opacity-60">UI_v1</span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">AI Synthesis Pipeline Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-6 px-4 py-2 glass-morphism rounded-full mr-4">
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <Cpu size={14} className="text-cyan-500" /> {
                 process.env.NEXT_PUBLIC_GEMINI_API_KEY?.startsWith('gsk_') ? 'GROQ_LLAMA_3.3' : 
                 process.env.NEXT_PUBLIC_GEMINI_API_KEY?.startsWith('xai-') ? 'GROK_BETA' : 
                 'GEMINI_1.5_FLASH'
               }
             </div>
             <div className="h-4 w-px bg-white/10" />
             <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
               <Layers size={14} className="text-purple-500" /> TAILWIND_RUNTIME
             </div>
          </div>
          <button className="w-10 h-10 glass flex items-center justify-center hover:bg-white/10 transition-colors">
            <Settings size={18} className="text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        
        {/* Left: Editor Segment (Col 1-4) */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 flex flex-col min-h-0"
        >
          <div className="flex-1 glass p-1 flex flex-col overflow-hidden">
            <PromptEditor
              prd={prd}
              setPrd={setPrd}
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        </motion.section>

        {/* Right: Output Segment (Col 5-12) */}
        <section className="lg:col-span-8 flex flex-col gap-4 min-h-0">
          {/* Tab Controller UI */}
          <div className="flex items-center justify-between px-2">
            <div className="flex gap-2 p-1 glass-morphism rounded-xl">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'preview' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Eye size={14} /> VISUAL PREVIEW
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'code' 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/5' 
                  : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Terminal size={14} /> SOURCE CODE
              </button>
            </div>
            
            {activeTab === 'preview' && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">
                <Sparkles size={12} className="text-cyan-400" /> Real-time Synthesis
              </div>
            )}
          </div>

          {/* Content Card */}
          <div className="flex-1 glass p-2 relative overflow-hidden">
             <AnimatePresence mode="wait">
              {activeTab === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full"
                >
                  <ComponentPreview code={generatedCode} isGenerating={isGenerating} />
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="h-full"
                >
                  <CodeExporter code={generatedCode} />
                </motion.div>
              )}
             </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}

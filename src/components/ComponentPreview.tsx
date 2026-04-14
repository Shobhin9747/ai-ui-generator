'use client';

import React, { useState } from 'react';
import { Eye, Monitor, Tablet, Smartphone, RefreshCw, Box, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComponentPreviewProps {
  code: string;
  isGenerating: boolean;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ code, isGenerating }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getWidth = () => {
    switch (viewMode) {
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  const encodedCode = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(code || ''))) : '';

  return (
    <div className="flex flex-col h-full">
      {/* Device Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Eye size={16} className="text-cyan-400" />
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Interactive Render</span>
        </div>
        
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
          <button 
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Monitor size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Desktop</span>
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Tablet size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Tablet</span>
          </button>
          <button 
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Smartphone size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-slate-950/50 backdrop-blur-3xl relative overflow-hidden flex items-center justify-center p-8">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <RefreshCw className="w-12 h-12 text-cyan-500 animate-spin" />
              <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 w-4 h-4 animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black text-slate-200 uppercase tracking-widest">Building Components</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">Assembling Tailwind Node Tree...</p>
            </div>
          </div>
        ) : !code ? (
          <div className="text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 glass-morphism rounded-3xl flex items-center justify-center mx-auto border-cyan-500/10">
              <Box size={32} className="text-slate-700 hover:text-cyan-500/50 transition-colors" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Waiting for Architecture</p>
              <p className="text-slate-500 text-[11px] leading-relaxed uppercase tracking-wider">Define your PRD in the editor to synthesize a functional UI preview here.</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ease-[0.23,1,0.32,1] ring-1 ring-black/5"
              style={{ width: getWidth(), height: '100%', maxHeight: '800px' }}
            >
              <iframe
                title="Preview"
                className="w-full h-full border-none"
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <script>
                        window.process = { env: { NODE_ENV: 'production' } };
                        window.exports = {};
                        window.module = { exports: window.exports };
                      </script>
                      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                      <script>
                        window.React = React;
                        window.ReactDOM = ReactDOM;
                      </script>
                      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                      <script src="https://cdn.tailwindcss.com"></script>
                      <script src="https://unpkg.com/framer-motion@11.0.8/dist/framer-motion.js"></script>
                      <script src="https://unpkg.com/lucide-react@0.344.0/dist/umd/lucide-react.min.js"></script>
                      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                      <style>
                        body { 
                          font-family: 'Inter', sans-serif; 
                          background: white; 
                          margin: 0; 
                          padding: 0; 
                          overflow-x: hidden;
                        }
                        #root { min-height: 100vh; }
                        ::-webkit-scrollbar { width: 6px; }
                        ::-webkit-scrollbar-track { background: transparent; }
                        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                      </style>
                    </head>
                    <body>
                      <div id="root"></div>
                      <script type="text/babel">
                        const { useState, useEffect, useMemo, useCallback, useRef, Fragment, forwardRef } = React;
                        const FM = window.Motion || window.FramerMotion || window.framerMotion;
                        const { motion, AnimatePresence, LayoutGroup } = FM || {};
                        
                        const Lucide = window.LucideReact || window.lucide || window.Lucide;
                        if (Lucide) {
                          Object.entries(Lucide).forEach(([name, component]) => {
                            window[name] = component;
                          });
                        }

                        try {
                          const rawCode = decodeURIComponent(escape(atob("${encodedCode}")));
                          
                          // Robustly strip imports and exports
                          let processedCode = rawCode.split('\\n')
                            .filter(line => !line.trim().startsWith('import ') && !line.trim().startsWith('import{'))
                            .join('\\n');
                          
                          processedCode = processedCode.replace(/export\\s+default\\s+/g, 'module.exports.default = ');
                          processedCode = processedCode.replace(/export\\s+const\\s+/g, 'const ');
                          processedCode = processedCode.replace(/export\\s+function\\s+/g, 'function ');
                          processedCode = processedCode.replace(/export\\s+class\\s+/g, 'class ');

                          const transpiled = Babel.transform(processedCode, { 
                            presets: ['react'],
                            filename: 'preview.tsx'
                          }).code;
                          
                          eval(transpiled);

                          const AppRoot = module.exports.default || Object.values(module.exports)[0];
                          
                          if (AppRoot) {
                            ReactDOM.createRoot(document.getElementById('root')).render(
                              <React.StrictMode>
                                <AppRoot />
                              </React.StrictMode>
                            );
                          } else {
                            throw new Error("Could not find a React component to render. Ensure your component is exported or defined correctly.");
                          }

                        } catch (err) {
                          console.error("Preview Render Error:", err);
                          document.getElementById('root').innerHTML = \`
                            <div style="color: #ef4444; padding: 3rem; font-family: system-ui, sans-serif; text-align: center;">
                              <h3 style="margin-bottom: 1rem;">Rendering Failed</h3>
                              <p style="font-size: 14px; opacity: 0.8; margin-bottom: 2rem;">\${err.message}</p>
                              <pre style="background: rgba(239, 68, 68, 0.05); padding: 1.5rem; border-radius: 12px; text-align: left; font-size: 11px; overflow: auto; border: 1px solid rgba(239, 68, 68, 0.1);">\${err.stack || err.message}</pre>
                            </div>
                          \`;
                        }
                      </script>
                    </body>
                  </html>
                `}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComponentPreview;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Brain, 
  Zap, 
  AlertTriangle, 
  MessageSquare, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

const ConfidenceBar = ({ label, value, color, icon: Icon }: any) => (
  <div className="space-y-3 md:space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-3">
        <div className={cn("p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 shadow-inner", color.replace('bg-', 'text-'))}>
          <Icon className="w-3 h-3 md:w-4 md:h-4" />
        </div>
        <span className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl md:text-2xl font-mono font-bold text-white">{value}%</span>
    </div>
    <div className="h-2 md:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("h-full relative", color)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
      </motion.div>
    </div>
  </div>
);

const DebateStep = ({ step, active, completed }: { step: number; active: boolean; completed: boolean }) => (
  <div className="flex items-center gap-3 md:gap-4 relative">
    <div className={cn(
      "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 shrink-0",
      completed ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" :
      active ? "bg-[#8B4513] border-[#D2691E] text-white shadow-[0_0_15px_rgba(210,105,30,0.5)]" :
      "bg-black/40 border-white/10 text-white/20"
    )}>
      {completed ? <Zap className="w-3 h-3 md:w-4 md:h-4" /> : <span className="text-[10px] md:text-xs font-bold">{step}</span>}
    </div>
    <div className="flex-1 min-w-0">
      <p className={cn(
        "text-[10px] md:text-xs font-bold uppercase tracking-widest truncate",
        active ? "text-white" : "text-white/20"
      )}>
        Round {step}
      </p>
      <p className={cn(
        "text-[8px] md:text-[10px] italic truncate",
        active ? "text-[#D2691E]" : "text-white/10"
      )}>
        {active ? "Processing consensus..." : "Waiting..."}
      </p>
    </div>
  </div>
);

export const LiveEngine = () => {
  const [claudeConf, setClaudeConf] = useState(0);
  const [gptConf, setGptConf] = useState(0);
  const [isDebating, setIsDebating] = useState(false);
  const [debateStep, setDebateStep] = useState(0);

  const drift = Math.abs(claudeConf - gptConf);
  const isDrifting = drift > 15;

  useEffect(() => {
    // In a real app, we'd listen for WS events from the consensus layer
    // For now, we stay at 0 until real data is received
  }, []);

  useEffect(() => {
    if (isDrifting && !isDebating) {
      setIsDebating(true);
      setDebateStep(1);
      
      const timer = setInterval(() => {
        setDebateStep(prev => {
          if (prev >= 3) {
            clearInterval(timer);
            setTimeout(() => {
              setIsDebating(false);
              setDebateStep(0);
              // Resolve drift
              const avg = (claudeConf + gptConf) / 2;
              setClaudeConf(avg + (Math.random() * 4 - 2));
              setGptConf(avg + (Math.random() * 4 - 2));
            }, 2000);
            return 3;
          }
          return prev + 1;
        });
      }, 3000);
    }
  }, [isDrifting, isDebating, claudeConf, gptConf]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">Live Engine</h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl">Real-time visualization of the AI consensus layer. Monitoring model drift and automated debate triggers.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 md:px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2 md:gap-3 shadow-[0_4px_24px_-8px_rgba(255,255,255,0.1)]">
            <RefreshCw className="w-3 h-3 md:w-4 md:h-4 text-white/40 animate-spin" />
            <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">Syncing Models</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 p-6 md:p-8">
              <Activity className="w-8 h-8 md:w-12 md:h-12 text-[#D2691E]/10" />
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-12">
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-[#D2691E]" />
              <h2 className="text-xl md:text-2xl font-bold text-white">AI Consensus Panel</h2>
            </div>

            <div className="space-y-8 md:space-y-12">
              <ConfidenceBar label="Claude 3.5 Sonnet" value={Math.round(claudeConf)} color="bg-indigo-500" icon={Cpu} />
              <ConfidenceBar label="GPT-4o Engine" value={Math.round(gptConf)} color="bg-emerald-500" icon={Zap} />
            </div>

            <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Model Drift</p>
                <div className="flex items-center gap-1.5 md:gap-2">
                  {isDrifting ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-rose-400" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />}
                  <span className={cn(
                    "text-lg md:text-xl font-mono font-bold",
                    isDrifting ? "text-rose-400" : "text-emerald-400"
                  )}>{drift.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">Active Debate</p>
                <p className="text-lg md:text-xl font-mono font-bold text-white">{isDebating ? 'YES' : 'NO'}</p>
              </div>
              <div className="space-y-1.5 md:space-y-2 col-span-2 sm:col-span-1">
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40">System State</p>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <div className={cn(
                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0",
                    isDrifting ? "bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(251,113,133,0.5)]" : "bg-emerald-400"
                  )} />
                  <span className={cn(
                    "text-xs md:text-sm font-bold uppercase tracking-widest truncate",
                    isDrifting ? "text-rose-400" : "text-emerald-400"
                  )}>{isDrifting ? 'Conflict Detected' : 'Stable'}</span>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isDrifting && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_32px_-8px_rgba(244,63,94,0.2)]"
              >
                <div className="flex items-start sm:items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30 shrink-0 shadow-inner">
                    <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">Drift Threshold Exceeded</h3>
                    <p className="text-xs md:text-sm text-rose-400/60 mt-1">The difference between model outputs has exceeded 15%. Automated debate protocol triggered.</p>
                  </div>
                </div>
                <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-xl bg-rose-500 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest animate-pulse text-center sm:text-left shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                  Debate Triggered
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 h-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-[#D2691E]" />
              <h2 className="text-lg md:text-xl font-bold text-white">Debate Visualization</h2>
            </div>

            <div className="space-y-8 md:space-y-12 relative">
              <div className="absolute left-3 md:left-4 top-3 md:top-4 bottom-3 md:bottom-4 w-px bg-white/10" />
              
              <DebateStep step={1} active={debateStep === 1} completed={debateStep > 1} />
              <DebateStep step={2} active={debateStep === 2} completed={debateStep > 2} />
              <DebateStep step={3} active={debateStep === 3} completed={debateStep > 3} />

              <div className="pt-6 md:pt-8 space-y-4 md:space-y-6">
                <div className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/10 shadow-inner">
                  <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 md:mb-2">Live Log</p>
                  <div className="space-y-1.5 md:space-y-2 font-mono text-[8px] md:text-[10px] text-white/60">
                    <p className="text-[#D2691E] truncate">[SYSTEM] Awaiting model consensus...</p>
                    <p className="truncate">[CLAUDE] Idle...</p>
                    <p className="truncate">[GPT-4] Idle...</p>
                    {debateStep >= 2 && <p className="text-[#D2691E] truncate">[SYSTEM] Conflict identified in Layer 4.</p>}
                    {debateStep >= 3 && <p className="text-emerald-400 truncate">[SYSTEM] Converging on 68.4% confidence.</p>}
                  </div>
                </div>

                <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-[#8B4513]/10 border border-[#8B4513]/20 shadow-inner">
                  <h4 className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest mb-1.5 md:mb-2">Self-Healing Status</h4>
                  <p className="text-[8px] md:text-[10px] text-white/60 leading-relaxed">
                    The system is currently stable. No weight adjustments required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

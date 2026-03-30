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
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-white/5 border border-white/10", color.replace('bg-', 'text-'))}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-white uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-2xl font-mono font-bold text-white">{value}%</span>
    </div>
    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
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
  <div className="flex items-center gap-4 relative">
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10",
      completed ? "bg-emerald-500 border-emerald-500 text-white" :
      active ? "bg-[#8B4513] border-[#D2691E] text-white shadow-[0_0_15px_rgba(210,105,30,0.5)]" :
      "bg-black/40 border-white/10 text-white/20"
    )}>
      {completed ? <Zap className="w-4 h-4" /> : <span className="text-xs font-bold">{step}</span>}
    </div>
    <div className="flex-1">
      <p className={cn(
        "text-xs font-bold uppercase tracking-widest",
        active ? "text-white" : "text-white/20"
      )}>
        Round {step}
      </p>
      <p className={cn(
        "text-[10px] italic",
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
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Live Engine</h1>
          <p className="text-white/40 max-w-xl">Real-time visualization of the AI consensus layer. Monitoring model drift and automated debate triggers.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-white/40 animate-spin" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Syncing Models</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Activity className="w-12 h-12 text-[#D2691E]/10" />
            </div>
            
            <div className="flex items-center gap-3 mb-12">
              <Brain className="w-6 h-6 text-[#D2691E]" />
              <h2 className="text-2xl font-bold text-white">AI Consensus Panel</h2>
            </div>

            <div className="space-y-12">
              <ConfidenceBar label="Claude 3.5 Sonnet" value={Math.round(claudeConf)} color="bg-indigo-500" icon={Cpu} />
              <ConfidenceBar label="GPT-4o Engine" value={Math.round(gptConf)} color="bg-emerald-500" icon={Zap} />
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 grid grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Model Drift</p>
                <div className="flex items-center gap-2">
                  {isDrifting ? <TrendingUp className="w-4 h-4 text-rose-400" /> : <TrendingDown className="w-4 h-4 text-emerald-400" />}
                  <span className={cn(
                    "text-xl font-mono font-bold",
                    isDrifting ? "text-rose-400" : "text-emerald-400"
                  )}>{drift.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Debate</p>
                <p className="text-xl font-mono font-bold text-white">{isDebating ? 'YES' : 'NO'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">System State</p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isDrifting ? "bg-rose-400 animate-pulse shadow-[0_0_8px_rgba(251,113,133,0.5)]" : "bg-emerald-400"
                  )} />
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-widest",
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
                className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Drift Threshold Exceeded</h3>
                    <p className="text-sm text-rose-400/60">The difference between model outputs has exceeded 15%. Automated debate protocol triggered.</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase tracking-widest animate-pulse">
                  Debate Triggered
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-6 h-6 text-[#D2691E]" />
              <h2 className="text-xl font-bold text-white">Debate Visualization</h2>
            </div>

            <div className="space-y-12 relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-white/10" />
              
              <DebateStep step={1} active={debateStep === 1} completed={debateStep > 1} />
              <DebateStep step={2} active={debateStep === 2} completed={debateStep > 2} />
              <DebateStep step={3} active={debateStep === 3} completed={debateStep > 3} />

              <div className="pt-8 space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Live Log</p>
                  <div className="space-y-2 font-mono text-[10px] text-white/60">
                    <p className="text-[#D2691E]">[SYSTEM] Awaiting model consensus...</p>
                    <p>[CLAUDE] Idle...</p>
                    <p>[GPT-4] Idle...</p>
                    {debateStep >= 2 && <p className="text-[#D2691E]">[SYSTEM] Conflict identified in Layer 4.</p>}
                    {debateStep >= 3 && <p className="text-emerald-400">[SYSTEM] Converging on 68.4% confidence.</p>}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#8B4513]/10 border border-[#8B4513]/20">
                  <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2">Self-Healing Status</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed">
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

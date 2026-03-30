import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dna, 
  Layers, 
  History, 
  Zap, 
  Cpu, 
  Activity, 
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Brain,
  RefreshCw,
  Clock,
  Code
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FormulaVersion } from '../types';
import { apiService } from '../lib/api';

const LayerCard = ({ name, weight, description }: { name: string; weight: number; description: string }) => (
  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#8B4513]/50 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8B4513]/20 flex items-center justify-center border border-[#8B4513]/30">
          <Layers className="w-5 h-5 text-[#D2691E]" />
        </div>
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">{name}</h4>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Weight</p>
        <p className="text-lg font-mono font-bold text-white">{weight}%</p>
      </div>
    </div>
    <p className="text-xs text-white/40 leading-relaxed min-h-[40px]">{description}</p>
    <div className="mt-6 h-1.5 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${weight}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-[#D2691E]/50"
      />
    </div>
  </div>
);

const PatchItem = ({ patch }: any) => (
  <div className="relative pl-8 pb-8 border-l border-white/10 last:border-0 last:pb-0">
    <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8B4513] border-4 border-black shadow-[0_0_10px_#8B4513]" />
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 rounded bg-[#8B4513]/20 text-[10px] font-mono font-bold text-[#D2691E] border border-[#8B4513]/30">
            {patch.version}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
            {new Date(patch.timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Applied</span>
        </div>
      </div>
      <h5 className="text-sm font-bold text-white mb-2">{patch.reason}</h5>
      <p className="text-xs text-white/40 leading-relaxed mb-4">{patch.explanation}</p>
      <div className="flex items-center gap-4">
        <button className="text-[10px] font-bold uppercase tracking-widest text-[#D2691E] hover:underline flex items-center gap-1">
          <Code className="w-3 h-3" />
          View Diff
        </button>
        <button className="text-[10px] font-bold uppercase tracking-widest text-[#D2691E] hover:underline flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Impact Analysis
        </button>
      </div>
    </div>
  </div>
);

export const FormulaEngine = () => {
  const [formula, setFormula] = useState<FormulaVersion | null>(null);

  useEffect(() => {
    const fetchFormula = async () => {
      try {
        const response = await apiService.getFormula();
        setFormula(response.data);
      } catch (error) {
        console.error('Failed to fetch formula:', error);
      }
    };
    fetchFormula();
  }, []);

  if (!formula) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Formula Engine</h1>
          <p className="text-white/40 max-w-xl">The core intelligence of STARK. Monitoring the 6-layer confidence matrix and automated self-healing patches.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-white/40 animate-spin" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Auto-Healing Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <Dna className="w-12 h-12 text-[#D2691E]/10" />
            </div>
            
            <div className="flex items-center gap-3 mb-12">
              <Brain className="w-6 h-6 text-[#D2691E]" />
              <h2 className="text-2xl font-bold text-white">Current Formula State</h2>
              <span className="ml-4 px-3 py-1 rounded-lg bg-[#8B4513]/20 text-xs font-mono font-bold text-[#D2691E] border border-[#8B4513]/30">
                {formula.version}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formula.layers.map((layer, idx) => (
                <LayerCard key={idx} {...layer} />
              ))}
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-[#8B4513]/10 border border-[#8B4513]/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#8B4513]/20 flex items-center justify-center border border-[#8B4513]/30">
                  <Activity className="w-6 h-6 text-[#D2691E]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">System Health: Optimal</h4>
                  <p className="text-xs text-white/40">No drift detected in the last 50 predictions. Formula is operating at peak efficiency.</p>
                </div>
              </div>
              <button className="px-6 py-2 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold text-xs uppercase tracking-widest transition-all">
                Manual Recalibrate
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full">
            <div className="flex items-center gap-3 mb-8">
              <History className="w-6 h-6 text-[#D2691E]" />
              <h2 className="text-xl font-bold text-white">Patch History</h2>
            </div>

            <div className="space-y-0">
              {formula.patchHistory.map((patch) => (
                <PatchItem key={patch.id} patch={patch} />
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Automated Patching</h4>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                The Formula Engine automatically generates patches when verification failures exceed the 20% confidence mismatch threshold.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

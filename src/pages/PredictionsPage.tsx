import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Brain, 
  Layers,
  Activity,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Prediction, Sport, SlipStatus, SlipSource } from '../types';
import { apiService } from '../lib/api';

const LayerScore = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
      <span className="text-white/40">{label}</span>
      <span className="text-white">{score}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className="h-full bg-[#D2691E]/50"
      />
    </div>
  </div>
);

const PredictionRow = ({ prediction }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-4 flex items-center gap-6 hover:bg-white/5 transition-all cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
          <Zap className={cn(
            "w-5 h-5",
            prediction.status === SlipStatus.PREDICTED || prediction.status === SlipStatus.VERIFIED ? "text-emerald-400" : "text-amber-400"
          )} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{prediction.match}</h4>
          <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">{prediction.sport}</p>
        </div>
        <div className="flex items-center gap-12">
          <div className="text-center w-20">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Claude</p>
            <p className="text-sm font-mono font-bold text-white">{prediction.claudeConfidence}%</p>
          </div>
          <div className="text-center w-20">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">GPT-4</p>
            <p className="text-sm font-mono font-bold text-white">{prediction.gptConfidence}%</p>
          </div>
          <div className="text-center w-24">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#D2691E] mb-1">Final</p>
            <p className="text-lg font-mono font-bold text-white">{prediction.finalConfidence}%</p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border w-28 text-center",
            prediction.status === SlipStatus.PREDICTED || prediction.status === SlipStatus.VERIFIED ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
            prediction.status === SlipStatus.PROCESSING ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
            "bg-white/5 text-white/40 border-white/10"
          )}>
            {prediction.status}
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-white/20" /> : <ChevronDown className="w-5 h-5 text-white/20" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white/[0.02]"
          >
            <div className="px-24 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-[#D2691E]" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest">AI Reasoning Engine</h5>
                </div>
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-white/60 leading-relaxed">
                  {prediction.reasoning?.summary || "No detailed AI reasoning available for this prediction."}
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      {prediction.status === SlipStatus.PREDICTED || prediction.status === SlipStatus.VERIFIED ? "Consensus Reached" : "Awaiting Consensus"}
                    </span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Drift: {prediction.drift || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-5 h-5 text-[#D2691E]" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest">6-Layer Confidence Matrix</h5>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <LayerScore label="Form" score={prediction.reasoning?.layers.form || 0} />
                  <LayerScore label="Squad" score={prediction.reasoning?.layers.squad || 0} />
                  <LayerScore label="Tactics" score={prediction.reasoning?.layers.tactics || 0} />
                  <LayerScore label="Psychology" score={prediction.reasoning?.layers.psychology || 0} />
                  <LayerScore label="Environment" score={prediction.reasoning?.layers.environment || 0} />
                  <LayerScore label="Simulation" score={prediction.reasoning?.layers.simulation || 0} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PredictionsPage = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchInput, setMatchInput] = useState('');
  const [sport, setSport] = useState<Sport>('football');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await apiService.getSlips();
        // Map slips to predictions for the UI
        const allPredictions = (response.data.slips || []).flatMap(slip => 
          (slip.parsedMatches || []).map(m => ({
            ...m,
            id: slip.id + '_' + m.match,
            status: slip.status,
            createdAt: slip.createdAt
          }))
        );
        setPredictions(allPredictions as any);
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      }
    };
    fetchPredictions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchInput) return;

    setIsSubmitting(true);
    try {
      await apiService.createSlip({
        source: SlipSource.MANUAL,
        matches: [{ match: matchInput, sport }],
        autoPredict: true
      });
      setMatchInput('');
      // In a real app, we'd wait for WS or re-fetch
    } catch (error) {
      console.error('Failed to analyze match:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Predictions Engine</h1>
          <p className="text-white/40 max-w-xl">Initiate new AI analysis jobs and monitor the 6-layer reasoning process in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-5 h-5 text-[#D2691E]" />
              <h2 className="text-xl font-bold text-white">New Prediction</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Match Details</label>
                <input 
                  type="text" 
                  value={matchInput}
                  onChange={(e) => setMatchInput(e.target.value)}
                  placeholder="e.g. Manchester City vs Arsenal" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#8B4513]/50 transition-all"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-white/40 italic">Sport auto-detect active</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Sport Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['football', 'basketball', 'tennis', 'baseball'] as Sport[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSport(s)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all",
                        sport === s 
                          ? "bg-[#8B4513]/20 border-[#8B4513]/50 text-white" 
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={isSubmitting || !matchInput}
                className="w-full py-4 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cpu className="w-5 h-5" />}
                {isSubmitting ? 'Initializing Job...' : 'Start AI Analysis'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Filter predictions..." 
                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition-all">
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs font-medium text-white/40">
                <span>Total: {predictions.length}</span>
                <span>Processing: {predictions.filter(p => p.status === 'processing').length}</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {predictions.map((p) => (
                <PredictionRow key={p.id} prediction={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

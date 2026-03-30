import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Activity, 
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Layers,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Result, ResultStatus } from '../types';
import { apiService } from '../lib/api';

const ResultRow = ({ result }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-4 flex items-center gap-6 hover:bg-white/5 transition-all cursor-pointer group"
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center border",
          result.verificationStatus === ResultStatus.VERIFIED ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
          result.verificationStatus === ResultStatus.FAILED ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
          "bg-white/5 border-white/10 text-white/20"
        )}>
          {result.verificationStatus === ResultStatus.VERIFIED ? <ShieldCheck className="w-5 h-5" /> : 
           result.verificationStatus === ResultStatus.FAILED ? <ShieldAlert className="w-5 h-5" /> : 
           <Activity className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white truncate">{result.match}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Predicted: {result.predictedResult}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Actual: {result.actualResult}</span>
          </div>
        </div>
        <div className="flex items-center gap-12">
          <div className="text-center w-32">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Status</p>
            <div className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border text-center",
              result.verificationStatus === ResultStatus.VERIFIED ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
              result.verificationStatus === ResultStatus.FAILED ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
              "bg-white/5 text-white/40 border-white/10"
            )}>
              {result.verificationStatus}
            </div>
          </div>
          <div className="text-center w-24">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Accuracy</p>
            {result.isCorrect ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-mono font-bold">100%</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-rose-400">
                <XCircle className="w-4 h-4" />
                <span className="text-sm font-mono font-bold">0%</span>
              </div>
            )}
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-white/20" /> : <ChevronDown className="w-5 h-5 text-white/20" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && result.verificationStatus === ResultStatus.FAILED && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-rose-500/[0.02]"
          >
            <div className="px-24 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest">Failure Insight Panel</h5>
                </div>
                <div className="p-6 rounded-2xl bg-black/40 border border-rose-500/20 font-mono text-xs text-rose-400/80 leading-relaxed">
                  {result.failureInsight?.explanation || "No detailed failure insight available for this result."}
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-rose-400" />
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Layer: {result.failureInsight?.layer || 'N/A'}</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#8B4513]/10 border border-[#8B4513]/20 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#D2691E]" />
                    <span className="text-[10px] font-bold text-[#D2691E] uppercase tracking-widest">Patch Triggered</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-[#D2691E]" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-widest">Confidence Mismatch</h5>
                </div>
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-white/40">Predicted Confidence</span>
                      <span className="text-white">{result.predictedConfidence || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#D2691E]/50" style={{ width: `${result.predictedConfidence || 0}%` }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-rose-400/60">Actual Outcome Correlation</span>
                      <span className="text-rose-400">{result.actualCorrelation || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500/50" style={{ width: `${result.actualCorrelation || 0}%` }} />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <p className="text-[10px] text-rose-400/60 leading-relaxed italic">
                      {result.failureInsight?.mismatch || "No divergence data available."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Results = () => {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await apiService.getResults();
        setResults(response.data.predictions || []);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Results + Verification</h1>
          <p className="text-white/40 max-w-xl">Monitor the accuracy of the STARK engine and analyze failures to trigger automated formula patches.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-[#8B4513]/10 border border-[#8B4513]/20 flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#D2691E]" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Verification Engine Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search results..." 
                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition-all">
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs font-medium text-white/40">
                <span>Total: {results.length}</span>
                <span>Verified: {results.filter(r => r.verificationStatus === 'verified').length}</span>
                <span>Failed: {results.filter(r => r.verificationStatus === 'failed').length}</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {results.map((r) => (
                <ResultRow key={r.id} result={r} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-28">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-6 h-6 text-[#D2691E]" />
              <h2 className="text-xl font-bold text-white">Result Submission</h2>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Select Match</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#8B4513]/50 transition-all appearance-none">
                  <option value="">Choose a match...</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Actual Result</label>
                <input 
                  type="text" 
                  placeholder="e.g. Alcaraz Win" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#8B4513]/50 transition-all"
                />
              </div>

              <button 
                type="button"
                className="w-full py-4 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)] flex items-center justify-center gap-2"
              >
                <Cpu className="w-5 h-5" />
                Submit for Verification
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Auto-Patching Policy</h4>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                Any verified failure with a confidence mismatch {'>'} 20% will automatically trigger a Formula Engine patch job to recalibrate the failing layer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

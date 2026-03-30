import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MonitorDot, 
  Cpu, 
  Zap, 
  Activity, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Terminal,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Job, JobStatus, JobType } from '../types';
import { apiService } from '../lib/api';

const JobRow = ({ job, isSelected, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 hover:bg-white/5 transition-all cursor-pointer group border-b border-white/5 last:border-0",
      isSelected ? "bg-white/10 border-l-4 border-l-[#D2691E]" : "border-l-4 border-l-transparent"
    )}
  >
    <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
      <div className={cn(
        "w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border shrink-0",
        job.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
        job.status === 'failed' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
        job.status === 'active' ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse" :
        "bg-white/5 border-white/10 text-white/20"
      )}>
        {job.status === 'completed' ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : 
         job.status === 'failed' ? <XCircle className="w-4 h-4 md:w-5 md:h-5" /> : 
         job.status === 'active' ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : 
         <Clock className="w-4 h-4 md:w-5 md:h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 md:gap-2 mb-1">
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 truncate">ID: {job.id}</span>
          <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
          <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#D2691E] shrink-0">{job.type}</span>
        </div>
        <h4 className="text-xs md:text-sm font-bold text-white truncate">Processing {job.type === 'predict' ? 'Prediction' : 'Verification'} Logic</h4>
      </div>
    </div>
    
    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-12 pl-11 md:pl-0">
      <div className="text-left md:text-center w-auto md:w-32">
        <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1 hidden md:block">Status</p>
        <div className={cn(
          "px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest border text-center inline-block md:block",
          job.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          job.status === 'failed' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
          job.status === 'active' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
          "bg-white/5 text-white/40 border-white/10"
        )}>
          {job.status}
        </div>
      </div>
      <div className="text-right md:text-center w-auto md:w-32">
        <p className="text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1 hidden md:block">Progress</p>
        <div className="flex items-center justify-end md:justify-center gap-2 md:gap-3">
          <div className="hidden md:block flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${job.progress}%` }}
              className={cn(
                "h-full transition-all duration-500",
                job.status === 'completed' ? "bg-emerald-500" :
                job.status === 'failed' ? "bg-rose-500" :
                "bg-[#D2691E]"
              )}
            />
          </div>
          <span className="text-xs md:text-sm font-mono font-bold text-white">{job.progress}%</span>
        </div>
      </div>
      <ChevronRight className="hidden md:block w-5 h-5 text-white/20 group-hover:text-white transition-colors shrink-0" />
    </div>
  </div>
);

export const QueueMonitor = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiService.getEngineSnapshot();
        setJobs(response.data.queue || []);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">Queue Monitor</h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl">Real-time visibility into the STARK distributed job queue. Monitor prediction and verification lifecycle.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 md:px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2 md:gap-3 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">Queue Status: Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="px-4 md:px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02]">
              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    placeholder="Search jobs..." 
                    className="w-full sm:w-auto bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#8B4513]/50 transition-colors"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all shrink-0">
                  <Filter className="w-3 h-3" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 text-[10px] md:text-xs font-medium text-white/40 w-full sm:w-auto">
                <span>Total: {jobs.length}</span>
                <span className="text-amber-400/60">Active: {jobs.filter(j => j.status === 'active').length}</span>
                <span className="text-rose-400/60">Failed: {jobs.filter(j => j.status === 'failed').length}</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 md:p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 animate-pulse" />
                      <div className="space-y-1.5 md:space-y-2">
                        <div className="h-3 md:h-4 w-32 md:w-48 bg-white/5 rounded animate-pulse" />
                        <div className="h-2 md:h-3 w-16 md:w-24 bg-white/5 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 md:h-8 w-16 md:w-24 bg-white/5 rounded-lg animate-pulse" />
                  </div>
                ))
              ) : jobs.length > 0 ? (
                jobs.map((j) => (
                  <JobRow 
                    key={j.id} 
                    job={j} 
                    isSelected={selectedJob?.id === j.id} 
                    onClick={() => setSelectedJob(j)} 
                  />
                ))
              ) : (
                <div className="p-8 md:p-12 text-center text-sm md:text-base text-white/40">
                  No active jobs in the queue.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 h-full min-h-[400px] md:min-h-[600px] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] sticky top-24 md:top-28">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3">
                <Terminal className="w-5 h-5 md:w-6 md:h-6 text-[#D2691E]" />
                <h2 className="text-lg md:text-xl font-bold text-white">Job Detail Panel</h2>
              </div>
              {selectedJob && (
                <div className="flex items-center gap-2">
                  <button className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <button className="p-1.5 md:p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                    <Pause className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedJob ? (
                <motion.div 
                  key={selectedJob.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 md:space-y-8"
                >
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Duration</p>
                      <p className="text-base md:text-lg font-mono font-bold text-white">{selectedJob.duration || '--'}s</p>
                    </div>
                    <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                      <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Priority</p>
                      <p className="text-base md:text-lg font-mono font-bold text-[#D2691E]">{selectedJob.priority || 'NORMAL'}</p>
                    </div>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-3 h-3 md:w-4 md:h-4 text-[#D2691E]" />
                      Execution Logs
                    </h4>
                    <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-black/40 border border-white/10 font-mono text-[8px] md:text-[10px] text-white/60 space-y-1.5 md:space-y-2 h-[250px] md:h-[300px] overflow-y-auto shadow-inner">
                      {selectedJob.logs.map((log, idx) => (
                        <p key={idx} className={cn(
                          log.includes('[ERROR]') ? "text-rose-400" :
                          log.includes('[SYSTEM]') ? "text-[#D2691E]" :
                          "text-white/60"
                        )}>
                          {log}
                        </p>
                      ))}
                      {selectedJob.status === 'active' && (
                        <p className="animate-pulse text-[#D2691E]">_</p>
                      )}
                    </div>
                  </div>

                  {selectedJob.error && (
                    <div className="p-3 md:p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start md:items-center gap-2 md:gap-3 shadow-sm">
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-rose-400 shrink-0 mt-0.5 md:mt-0" />
                      <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-rose-400 uppercase tracking-widest">Error Detected</p>
                        <p className="text-[10px] md:text-xs text-rose-400/60 mt-0.5">{selectedJob.error}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 md:pt-4 space-y-4">
                    <button className="w-full py-3 md:py-4 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold text-sm md:text-base transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)] flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                      Restart Job
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <MonitorDot className="w-6 h-6 md:w-8 md:h-8 text-white/10" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white/40">No Job Selected</h3>
                    <p className="text-xs md:text-sm text-white/20 max-w-[200px] mt-1">Select a job from the queue to view detailed execution logs.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

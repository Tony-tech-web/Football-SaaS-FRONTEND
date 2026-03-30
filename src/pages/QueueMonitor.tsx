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

const JobRow = ({ job, isSelected, onClick }: any) => (
  <div 
    onClick={onClick}
    className={cn(
      "px-6 py-4 flex items-center gap-6 hover:bg-white/5 transition-all cursor-pointer group border-b border-white/5 last:border-0",
      isSelected ? "bg-white/10 border-l-4 border-l-[#D2691E]" : ""
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-lg flex items-center justify-center border",
      job.status === 'completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
      job.status === 'failed' ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
      job.status === 'active' ? "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse" :
      "bg-white/5 border-white/10 text-white/20"
    )}>
      {job.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
       job.status === 'failed' ? <XCircle className="w-5 h-5" /> : 
       job.status === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
       <Clock className="w-5 h-5" />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Job ID: {job.id}</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D2691E]">{job.type}</span>
      </div>
      <h4 className="text-sm font-bold text-white truncate">Processing {job.type === 'predict' ? 'Prediction' : 'Verification'} Logic</h4>
    </div>
    <div className="flex items-center gap-12">
      <div className="text-center w-32">
        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Status</p>
        <div className={cn(
          "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border text-center",
          job.status === 'completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          job.status === 'failed' ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
          job.status === 'active' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
          "bg-white/5 text-white/40 border-white/10"
        )}>
          {job.status}
        </div>
      </div>
      <div className="text-center w-32">
        <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Progress</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
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
          <span className="text-xs font-mono font-bold text-white">{job.progress}%</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
    </div>
  </div>
);

import { apiService } from '../lib/api';

export const QueueMonitor = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiService.getEngineSnapshot();
        setJobs(response.data.queue);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };
    fetchJobs();
    
    // Refresh every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Queue Monitor</h1>
          <p className="text-white/40 max-w-xl">Real-time visibility into the STARK distributed job queue. Monitor prediction and verification lifecycle.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Queue Status: Active</span>
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
                    placeholder="Search jobs..." 
                    className="bg-black/40 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white transition-all">
                  <Filter className="w-3 h-3" />
                  Filter
                </button>
              </div>
              <div className="flex items-center gap-6 text-xs font-medium text-white/40">
                <span>Total: {jobs.length}</span>
                <span>Active: {jobs.filter(j => j.status === 'active').length}</span>
                <span>Failed: {jobs.filter(j => j.status === 'failed').length}</span>
              </div>
            </div>

            <div className="divide-y divide-white/5">
              {jobs.map((j) => (
                <JobRow 
                  key={j.id} 
                  job={j} 
                  isSelected={selectedJob?.id === j.id} 
                  onClick={() => setSelectedJob(j)} 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-[#D2691E]" />
                <h2 className="text-xl font-bold text-white">Job Detail Panel</h2>
              </div>
              {selectedJob && (
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                    <Pause className="w-4 h-4" />
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
                  className="space-y-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Duration</p>
                      <p className="text-lg font-mono font-bold text-white">{selectedJob.duration || '--'}s</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Priority</p>
                      <p className="text-lg font-mono font-bold text-[#D2691E]">{selectedJob.priority || 'NORMAL'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#D2691E]" />
                      Execution Logs
                    </h4>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 font-mono text-[10px] text-white/60 space-y-2 h-[300px] overflow-y-auto">
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
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                      <div>
                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Error Detected</p>
                        <p className="text-xs text-rose-400/60">{selectedJob.error}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-4">
                    <button className="w-full py-4 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)] flex items-center justify-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Restart Job
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MonitorDot className="w-8 h-8 text-white/10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/40">No Job Selected</h3>
                    <p className="text-sm text-white/20 max-w-[200px]">Select a job from the queue to view detailed execution logs.</p>
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

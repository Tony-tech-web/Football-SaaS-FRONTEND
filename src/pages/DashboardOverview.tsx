import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Cpu, 
  Database, 
  Wifi,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Prediction, SlipStatus, UserStats, PlanLimits } from '../types';
import { subscribeToPredictions } from '../lib/socket';
import { apiService } from '../lib/api';

const MetricCard = ({ label, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 relative overflow-hidden group hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-20", color)} />
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl bg-white/5 border border-white/10", color.replace('bg-', 'text-'))}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      {trend && (
        <span className={cn(
          "text-[10px] md:text-xs font-bold px-2 py-1 rounded-lg",
          trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
        )}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <h3 className="text-xs md:text-sm font-medium text-white/40 mb-1">{label}</h3>
    <p className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight">{value}</p>
  </div>
);

function PredictionCard({ prediction }: { prediction: Prediction; key?: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 hover:bg-white/10 transition-all group cursor-pointer shadow-sm"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#8B4513]/20 flex items-center justify-center border border-[#8B4513]/30 shrink-0">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#D2691E]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D2691E] truncate">{prediction.sport}</span>
            <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
            <span className="text-[10px] md:text-xs text-white/40 shrink-0">{new Date(prediction.createdAt).toLocaleTimeString()}</span>
          </div>
          <h4 className="text-base md:text-lg font-bold text-white truncate">{prediction.match}</h4>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-8 pl-14 sm:pl-0">
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Confidence</p>
          <p className="text-lg md:text-xl font-mono font-bold text-white">{prediction.finalConfidence}%</p>
        </div>
        <div className={cn(
          "px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest border text-center",
          prediction.status === SlipStatus.PREDICTED || prediction.status === SlipStatus.VERIFIED ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          prediction.status === SlipStatus.PROCESSING ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
          "bg-white/5 text-white/40 border-white/10"
        )}>
          {prediction.status}
        </div>
        <ChevronRight className="hidden sm:block w-5 h-5 text-white/20 group-hover:text-white transition-colors shrink-0" />
      </div>
    </motion.div>
  );
}

export const DashboardOverview = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [limits, setLimits] = useState<PlanLimits | null>(null);
  const [health, setHealth] = useState<{ status: string; formula: string; db: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [userRes, healthRes] = await Promise.all([
          apiService.getUser({ stats: true }),
          apiService.getHealth()
        ]);
        setStats(userRes.data.stats || null);
        setLimits(userRes.data.limits);
        setHealth(healthRes.data);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const unsubscribe = subscribeToPredictions((newPrediction) => {
      setPredictions(prev => [newPrediction, ...prev].slice(0, 10));
    });

    return unsubscribe;
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">System Overview</h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl">Real-time control panel for the STARK distributed AI sports engine. Monitoring 6-layer confidence evolution and formula self-healing.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3 md:px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-white/60">Live Stream Active</span>
          </div>
          <button className="px-4 md:px-6 py-2 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white text-sm md:text-base font-bold transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)]">
            Manual Trigger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl md:rounded-3xl bg-white/5 animate-pulse border border-white/10" />
          ))
        ) : (
          <>
            <MetricCard label="System Accuracy" value={stats?.accuracy !== undefined ? `${stats.accuracy}%` : '--'} icon={TrendingUp} color="bg-emerald-500" />
            <MetricCard label="Predictions Today" value={stats?.totalSlips ?? '--'} icon={Zap} color="bg-[#D2691E]" />
            <MetricCard label="Daily Limit" value={limits?.dailyPredictions ?? '--'} icon={Cpu} color="bg-indigo-500" />
            <MetricCard label="Remaining Slips" value={limits?.remainingSlips ?? '--'} icon={AlertCircle} color="bg-rose-500" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#D2691E]" />
              Live Predictions Feed
            </h2>
            <button className="text-xs md:text-sm font-medium text-[#D2691E] hover:underline">View All</button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/10" />
              ))
            ) : predictions.length > 0 ? (
              predictions.map((p) => (
                <PredictionCard key={p.id} prediction={p} />
              ))
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
                <p className="text-sm md:text-base text-white/40">No live predictions yet. Upload a slip to begin.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D2691E]" />
            System Health
          </h2>
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-5 md:space-y-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                </div>
              ))
            ) : (
              <>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                      <span className="text-xs md:text-sm font-medium text-white/80">API Gateway</span>
                    </div>
                    <span className={cn(
                      "text-[10px] md:text-xs font-bold uppercase",
                      health?.status === 'healthy' ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {health?.status || 'Offline'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn(
                      "w-full h-full",
                      health?.status === 'healthy' ? "bg-emerald-400/50" : "bg-rose-400/50"
                    )} />
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Database className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                      <span className="text-xs md:text-sm font-medium text-white/80">Database</span>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase">{health?.db || 'Disconnected'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-indigo-400/50" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className="text-xs md:text-sm font-medium text-white/40">Active Formula</span>
                    <span className="text-xs md:text-sm font-mono font-bold text-white">{health?.formula || 'v0.0.0'}</span>
                  </div>
                  <div className="p-3 md:p-4 rounded-xl bg-[#8B4513]/10 border border-[#8B4513]/20">
                    <p className="text-[10px] md:text-xs text-white/60 leading-relaxed">
                      Formula Engine is currently stable. Monitoring for potential drift in real-time.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

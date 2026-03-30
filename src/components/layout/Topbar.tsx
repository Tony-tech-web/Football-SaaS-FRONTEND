import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Wifi, 
  Database, 
  Cpu, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { apiService } from '../../lib/api';

interface SystemStatusProps {
  label: string;
  status: 'online' | 'offline' | 'degraded';
  icon: React.ElementType;
}

const SystemStatus = ({ label, status, icon: Icon }: SystemStatusProps) => (
  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
    <Icon className={cn(
      "w-4 h-4",
      status === 'online' ? "text-emerald-400" : status === 'degraded' ? "text-amber-400" : "text-rose-400"
    )} />
    <span className="text-xs font-medium text-white/60">{label}</span>
    <div className={cn(
      "w-1.5 h-1.5 rounded-full",
      status === 'online' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : status === 'degraded' ? "bg-amber-400" : "bg-rose-400"
    )} />
  </div>
);

export const Topbar = () => {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await apiService.getHealth();
        setHealth(response.data);
      } catch (error) {
        console.error('Failed to fetch health:', error);
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const apiStatus = health?.db === 'connected' ? 'online' : 'offline';
  const systemLoad = health?.load || 0;

  return (
    <header className="h-20 border-b border-white/10 bg-black/20 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#D2691E] transition-colors" />
          <input 
            type="text" 
            placeholder="Search system logs, predictions, or jobs..." 
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 w-96 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#8B4513]/50 focus:ring-1 focus:ring-[#8B4513]/30 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <SystemStatus label="API" status={apiStatus} icon={Database} />
          <SystemStatus label="Queue" status="online" icon={Cpu} />
          <SystemStatus label="WS" status="online" icon={Wifi} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#D2691E] rounded-full border-2 border-black" />
        </button>
        
        <div className="h-8 w-px bg-white/10 mx-2" />
        
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#8B4513]/10 border border-[#8B4513]/20">
          <Activity className="w-4 h-4 text-[#D2691E] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#D2691E]">System Load</span>
            <span className="text-sm font-mono font-bold text-white">{systemLoad}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};

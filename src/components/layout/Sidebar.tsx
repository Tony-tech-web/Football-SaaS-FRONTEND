import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Cpu, 
  Receipt, 
  CheckCircle2, 
  Dna, 
  MonitorDot, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Zap, label: 'Predictions', path: '/predictions' },
  { icon: Cpu, label: 'Live Engine', path: '/live-engine' },
  { icon: Receipt, label: 'Bet Slips', path: '/bet-slips' },
  { icon: CheckCircle2, label: 'Results', path: '/results' },
  { icon: Dna, label: 'Formula Engine', path: '/formula-engine' },
  { icon: MonitorDot, label: 'Queue Monitor', path: '/queue-monitor' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8B4513] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">STARK</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
              isActive 
                ? "bg-[#8B4513]/20 text-[#D2691E] border border-[#8B4513]/30" 
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-5 h-5", isCollapsed ? "mx-auto" : "")} />
            {!isCollapsed && <span className="font-medium">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl bg-white/5",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B4513] to-[#D2691E]" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">System Admin</p>
              <p className="text-xs text-white/40 truncate">tonyalidu@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

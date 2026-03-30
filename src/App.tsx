import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardOverview } from './pages/DashboardOverview';
import { PredictionsPage } from './pages/PredictionsPage';
import { LiveEngine } from './pages/LiveEngine';
import { BetSlips } from './pages/BetSlips';
import { Results } from './pages/Results';
import { FormulaEngine } from './pages/FormulaEngine';
import { QueueMonitor } from './pages/QueueMonitor';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D2691E]/30 selection:text-[#D2691E]">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="pl-0 md:pl-20 lg:pl-64 transition-all duration-300">
        <Topbar setIsMobileOpen={setIsMobileOpen} />
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8B4513]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D2691E]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout><DashboardOverview /></DashboardLayout>} />
        <Route path="/dashboard/predictions" element={<DashboardLayout><PredictionsPage /></DashboardLayout>} />
        <Route path="/dashboard/live-engine" element={<DashboardLayout><LiveEngine /></DashboardLayout>} />
        <Route path="/dashboard/bet-slips" element={<DashboardLayout><BetSlips /></DashboardLayout>} />
        <Route path="/dashboard/results" element={<DashboardLayout><Results /></DashboardLayout>} />
        <Route path="/dashboard/formula-engine" element={<DashboardLayout><FormulaEngine /></DashboardLayout>} />
        <Route path="/dashboard/queue-monitor" element={<DashboardLayout><QueueMonitor /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><div className="p-8 text-center text-white/40">Settings module coming soon...</div></DashboardLayout>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

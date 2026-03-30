import React from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D2691E]/30 selection:text-[#D2691E]">
      <Sidebar />
      <div className="pl-20 lg:pl-64 transition-all duration-300">
        <Topbar />
        <main className="p-8 max-w-[1600px] mx-auto">
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
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/live-engine" element={<LiveEngine />} />
          <Route path="/bet-slips" element={<BetSlips />} />
          <Route path="/results" element={<Results />} />
          <Route path="/formula-engine" element={<FormulaEngine />} />
          <Route path="/queue-monitor" element={<QueueMonitor />} />
          <Route path="/settings" element={<div className="p-8 text-center text-white/40">Settings module coming soon...</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

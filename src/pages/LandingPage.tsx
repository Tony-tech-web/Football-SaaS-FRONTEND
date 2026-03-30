import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowRight, Brain, Cpu, Zap, ShieldAlert, 
  GitBranch, RefreshCcw, CheckCircle2, MessageSquare, 
  BarChart3, Layers, Terminal, Database, Play, Menu, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { apiService } from '../lib/api';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [isLoading, setIsLoading] = useState(true);
  const [health, setHealth] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [latestPrediction, setLatestPrediction] = useState<any>(null);
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setIsLoading(true);
        const [healthRes, resultsRes, snapshotRes] = await Promise.all([
          apiService.getHealth().catch(() => ({ data: null })),
          apiService.getResults({ limit: 5 }).catch(() => ({ data: { stats: null, predictions: [] } })),
          apiService.getEngineSnapshot().catch(() => ({ data: { queue: [], stats: null } }))
        ]);

        setHealth(healthRes.data);
        setStats({
          accuracy: resultsRes.data?.stats?.accuracy,
          totalPredictions: resultsRes.data?.stats?.total,
          activeJobs: snapshotRes.data?.queue?.length || 0,
        });
        setRecentPredictions(resultsRes.data?.predictions || []);
        setLatestPrediction(resultsRes.data?.predictions?.[0] || null);
      } catch (error) {
        console.error("Failed to fetch landing data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D2691E]/30 selection:text-[#D2691E] overflow-x-hidden">
      <Navbar />
      
      <main>
        <HeroSection navigate={navigate} isLoading={isLoading} health={health} latestPrediction={latestPrediction} />
        <MarqueeSection isLoading={isLoading} stats={stats} health={health} recentPredictions={recentPredictions} />
        <EnginePreviewSection />
        <FeaturesSection />
        <DebateSection />
        <SelfHealingSection isLoading={isLoading} health={health} />
        <MetricsSection isLoading={isLoading} stats={stats} health={health} />
        <TestimonialsSection />
        <CTASection navigate={navigate} />
      </main>

      <Footer />
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,69,19,0.4)]">
              <Activity className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tighter text-white">STARK</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#engine" className="hover:text-white transition-colors">Engine</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#metrics" className="hover:text-white transition-colors">Metrics</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-white/80 hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate('/login')} className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-bold transition-all shadow-[0_4px_16px_rgba(255,255,255,0.05)]">
              Get Access
            </button>
          </div>
          <button 
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl pt-20 px-6 flex flex-col md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium text-white/80 mt-8">
              <a href="#engine" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/10">Engine</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/10">Features</a>
              <a href="#metrics" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/10">Metrics</a>
              <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors py-2 border-b border-white/10">Testimonials</a>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold transition-all">
                Sign In
              </button>
              <button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8B4513] to-[#D2691E] text-white font-bold transition-all shadow-[0_0_30px_rgba(139,69,19,0.4)]">
                Get Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSection = ({ navigate, isLoading, health, latestPrediction }: { navigate: (path: string) => void, isLoading: boolean, health: any, latestPrediction: any }) => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-20 md:pt-24 pb-12 overflow-hidden">
      {/* Background Video / Data Overlay Simulation */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[10%] left-[10%] md:left-[20%] w-[60%] md:w-[40%] h-[40%] bg-[#8B4513]/20 blur-[100px] md:blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[60%] md:w-[50%] h-[50%] bg-[#D2691E]/10 blur-[100px] md:blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 w-full grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 md:space-y-8 text-center lg:text-left pt-10 lg:pt-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#D2691E] shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#D2691E] animate-pulse" />
            {isLoading ? (
              <span className="w-20 md:w-24 h-3 md:h-4 bg-white/10 rounded animate-pulse" />
            ) : (
              `Engine ${health?.formula || 'v--'} Online`
            )}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
            Predict Smarter.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D2691E] to-[#8B4513]">Win Consistently.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Multi-AI consensus engine with real-time self-healing accuracy. We don't just guess; we compute, debate, and evolve.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2 md:pt-4">
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-xl bg-gradient-to-r from-[#8B4513] to-[#D2691E] hover:from-[#A0522D] hover:to-[#CD853F] text-white font-bold transition-all shadow-[0_0_30px_rgba(139,69,19,0.4)] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-sm md:text-base">
              Start Predicting <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={() => document.getElementById('engine')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-sm md:text-base shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
              <Play className="w-4 h-4 md:w-5 md:h-5" /> View Live Engine
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative perspective-1000 mt-8 lg:mt-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8B4513]/20 to-transparent blur-2xl md:blur-3xl rounded-full" />
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
            {isLoading ? (
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-white/10 pb-3 md:pb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 animate-pulse" />
                    <div className="space-y-1 md:space-y-2">
                      <div className="w-24 md:w-32 h-3 md:h-4 bg-white/5 rounded animate-pulse" />
                      <div className="w-16 md:w-20 h-2 md:h-3 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-16 md:w-24 h-5 md:h-6 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <div className="flex justify-between mb-1.5 md:mb-2"><div className="w-20 md:w-24 h-2 md:h-3 bg-white/5 rounded animate-pulse" /><div className="w-6 md:w-8 h-2 md:h-3 bg-white/5 rounded animate-pulse" /></div>
                    <div className="h-1.5 md:h-2 bg-white/5 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5 md:mb-2"><div className="w-20 md:w-24 h-2 md:h-3 bg-white/5 rounded animate-pulse" /><div className="w-6 md:w-8 h-2 md:h-3 bg-white/5 rounded animate-pulse" /></div>
                    <div className="h-1.5 md:h-2 bg-white/5 rounded-full" />
                  </div>
                  <div className="pt-3 md:pt-4 border-t border-white/10 flex justify-between items-end">
                    <div className="space-y-1 md:space-y-2"><div className="w-16 md:w-20 h-2 md:h-3 bg-white/5 rounded animate-pulse" /><div className="w-12 md:w-16 h-6 md:h-8 bg-white/5 rounded animate-pulse" /></div>
                    <div className="space-y-1 md:space-y-2 items-end flex flex-col"><div className="w-12 md:w-16 h-2 md:h-3 bg-white/5 rounded animate-pulse" /><div className="w-20 md:w-24 h-5 md:h-6 bg-white/5 rounded animate-pulse" /></div>
                  </div>
                </div>
              </div>
            ) : latestPrediction ? (
              <>
                <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-white/10 pb-3 md:pb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-sm md:text-base">
                      ⚽
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-lg truncate max-w-[120px] sm:max-w-[200px]">{latestPrediction.match}</h3>
                      <p className="text-[8px] md:text-xs text-white/40 uppercase tracking-widest">{latestPrediction.sport}</p>
                    </div>
                  </div>
                  <div className="px-2 md:px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                    {latestPrediction.status}
                  </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1.5 md:mb-2">
                      <span className="text-white/60">Claude 3.5 Sonnet</span>
                      <span className="font-mono font-bold">{latestPrediction.claudeConfidence ?? '--'}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${latestPrediction.claudeConfidence || 0}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-indigo-500 rounded-full" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1.5 md:mb-2">
                      <span className="text-white/60">GPT-4o</span>
                      <span className="font-mono font-bold">{latestPrediction.gptConfidence ?? '--'}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${latestPrediction.gptConfidence || 0}%` }} transition={{ duration: 1.5, delay: 0.7 }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>

                  <div className="pt-3 md:pt-4 border-t border-white/10">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] md:text-xs text-[#D2691E] font-bold uppercase tracking-widest mb-0.5 md:mb-1">Final Consensus</p>
                        <p className="text-2xl md:text-3xl font-bold font-mono">{latestPrediction.finalConfidence ?? '--'}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] md:text-xs text-white/40 mb-0.5 md:mb-1">Prediction</p>
                        <p className="text-sm md:text-lg font-bold">{latestPrediction.predictedResult || '--'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                <Activity className="w-8 h-8 md:w-12 md:h-12 text-white/20 mb-3 md:mb-4" />
                <p className="text-sm md:text-base text-white/60 font-medium">No active predictions</p>
                <p className="text-[10px] md:text-xs text-white/40 mt-1 md:mt-2">Awaiting new data ingestion...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MarqueeSection = ({ isLoading, stats, health, recentPredictions }: any) => {
  const marqueeItems = isLoading ? Array(5).fill("Loading system data...") : [
    `Processing Queue: ${stats?.activeJobs ?? '--'} active jobs`,
    `Formula Patch ${health?.formula ?? 'v--'} Deployed`,
    `Accuracy Last 24h: ${stats?.accuracy ?? '--'}%`,
    `System Status: ${health?.status ?? 'Unknown'}`,
    ...(recentPredictions || []).map((p: any) => `${p.match}: ${p.finalConfidence ?? '--'}% Confidence (${p.predictedResult || 'Pending'})`)
  ];

  if (marqueeItems.length < 5) {
    marqueeItems.push("Awaiting more prediction data...");
    marqueeItems.push("System monitoring active...");
  }

  return (
    <div className="w-full bg-[#8B4513]/10 backdrop-blur-md border-y border-[#8B4513]/20 py-2 md:py-3 overflow-hidden flex whitespace-nowrap shadow-[0_4px_24px_-8px_rgba(139,69,19,0.2)]">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        className="flex gap-6 md:gap-8 items-center"
      >
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((stat, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-3">
            <span className={cn("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", isLoading ? "bg-white/20 animate-pulse" : "bg-[#D2691E]")} />
            <span className={cn("text-xs md:text-sm font-mono uppercase tracking-wider", isLoading ? "text-white/40" : "text-white/70")}>{stat}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const EnginePreviewSection = () => {
  return (
    <section id="engine" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 md:mb-4">Inside the Engine</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto px-4">Watch the dual-AI system process, debate, and finalize predictions in real-time.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 max-w-4xl mx-auto relative overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D2691E] to-transparent opacity-50" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 mb-4 md:mb-6">
                <Database className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Data Ingestion</span>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <p className="text-xs md:text-sm font-medium mb-2">Match Stats</p>
                <div className="space-y-1.5 md:space-y-2">
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full w-3/4 animate-pulse" />
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full w-1/2 animate-pulse" />
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full w-5/6 animate-pulse" />
                </div>
              </div>
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <p className="text-xs md:text-sm font-medium mb-2">Player Form</p>
                <div className="space-y-1.5 md:space-y-2">
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full w-full animate-pulse" />
                  <div className="h-1.5 md:h-2 bg-white/10 rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-4 relative">
              <div className="hidden md:block absolute top-1/2 -left-4 w-8 border-t border-dashed border-white/20" />
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-white/20" />
              
              <div className="flex items-center gap-2 text-[#D2691E] mb-4 md:mb-6">
                <Brain className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">AI Processing</span>
              </div>
              
              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_4px_16px_rgba(99,102,241,0.1)]">
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-indigo-400">Model A (Logic)</span>
                  <span className="text-[10px] md:text-xs font-mono">Processing...</span>
                </div>
                <div className="h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full origin-left animate-[scale-x_2s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_4px_16px_rgba(16,185,129,0.1)]">
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-emerald-400">Model B (Pattern)</span>
                  <span className="text-[10px] md:text-xs font-mono">Processing...</span>
                </div>
                <div className="h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full origin-left animate-[scale-x_2.5s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/60 mb-4 md:mb-6">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Consensus</span>
              </div>
              
              <div className="h-32 md:h-full p-4 md:p-6 rounded-xl md:rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 flex flex-col justify-center items-center text-center shadow-inner">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-[3px] md:border-4 border-white/10 border-t-[#D2691E] animate-spin mb-3 md:mb-4" />
                <p className="text-xs md:text-sm font-medium text-white/60">Awaiting Models</p>
                <p className="text-[10px] md:text-xs text-white/40 mt-1 md:mt-2">Calculating variance...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: "Multi-AI Consensus Engine",
      desc: "Combines Claude's logical reasoning with GPT-4's pattern recognition for unparalleled accuracy."
    },
    {
      icon: RefreshCcw,
      title: "Self-Healing Predictions",
      desc: "Automatically patches its own formula layers when a verified prediction fails."
    },
    {
      icon: Layers,
      title: "Queue-Based Processing",
      desc: "Enterprise-grade Redis + Bull queues handle thousands of concurrent prediction requests."
    },
    {
      icon: Zap,
      title: "OCR Bet Slip Ingestion",
      desc: "Upload screenshots of slips. Our vision models extract matches, odds, and stakes instantly."
    },
    {
      icon: Activity,
      title: "Real-Time WebSockets",
      desc: "Watch confidence scores update live as new data flows into the engine."
    },
    {
      icon: ShieldAlert,
      title: "Disagreement Detection",
      desc: "Triggers automated debate protocols when AI models diverge by more than 15%."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-black/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 md:mb-4">System Architecture</h2>
          <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto md:mx-0">Built like a high-frequency trading platform, designed for sports analytics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all group shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-4 md:mb-6 group-hover:border-[#D2691E]/50 transition-colors shadow-inner">
                <f.icon className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-[#D2691E] transition-colors" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{f.title}</h3>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DebateSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 bg-rose-500/10 blur-[60px] md:blur-[100px] rounded-full" />
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 space-y-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldAlert className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Debate Protocol Triggered</span>
              </div>
              <span className="text-[10px] md:text-xs font-mono text-white/40">Variance: --%</span>
            </div>
            
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_4px_16px_rgba(99,102,241,0.1)]">
              <p className="text-[10px] md:text-xs font-bold text-indigo-400 mb-1.5 md:mb-2">Model A (Logic)</p>
              <p className="text-xs md:text-sm text-white/80 font-mono leading-relaxed">"Historical data strongly favors home team due to recent tactical shifts in midfield."</p>
            </div>
            
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_4px_16px_rgba(16,185,129,0.1)]">
              <p className="text-[10px] md:text-xs font-bold text-emerald-400 mb-1.5 md:mb-2">Model B (Pattern)</p>
              <p className="text-xs md:text-sm text-white/80 font-mono leading-relaxed">"Weather conditions and key player fatigue metrics suggest a higher probability of a draw."</p>
            </div>

            <div className="flex justify-center pt-2">
              <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] md:text-xs font-medium text-white/60 flex items-center gap-2 shadow-sm">
                <RefreshCcw className="w-3 h-3 animate-spin" />
                Initiating Round 2 Re-evaluation...
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 md:mb-6">AI Debate Engine</h2>
          <p className="text-sm md:text-lg text-white/50 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            When our models disagree by more than 15%, the system doesn't just average the scores. It forces them to debate.
          </p>
          <ul className="space-y-3 md:space-y-4 text-left max-w-md mx-auto lg:mx-0">
            {[
              "Confidence drift detection (>15% variance)",
              "Automated 2-round debate protocol",
              "Cross-examination of reasoning",
              "Final consensus or manual review flag"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-white/80">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#D2691E]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#D2691E]" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const SelfHealingSection = ({ isLoading, health }: any) => {
  return (
    <section className="py-20 md:py-32 bg-black/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-1 lg:order-1 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 md:mb-6">Self-Healing Formula</h2>
          <p className="text-sm md:text-lg text-white/50 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            The engine learns from its mistakes. When a verified prediction fails, the system automatically patches its own logic layers.
          </p>
          <div className="space-y-4 md:space-y-6 text-left max-w-md mx-auto lg:mx-0">
            <div className="flex gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                <Terminal className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold mb-0.5 md:mb-1">Failure Detection</h4>
                <p className="text-xs md:text-sm text-white/50">Actual results are compared against predictions.</p>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                <GitBranch className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold mb-0.5 md:mb-1">Layer Isolation</h4>
                <p className="text-xs md:text-sm text-white/50">Identifies which of the 6 formula layers caused the error.</p>
              </div>
            </div>
            <div className="flex gap-3 md:gap-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#8B4513]/20 backdrop-blur-md border border-[#8B4513]/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,69,19,0.3)]">
                <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 text-[#D2691E]" />
              </div>
              <div>
                <h4 className="text-sm md:text-base font-bold text-[#D2691E] mb-0.5 md:mb-1">Auto-Patch Generation</h4>
                <p className="text-xs md:text-sm text-white/50">Deploys a new formula version dynamically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-2 relative mt-8 lg:mt-0">
          <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] md:blur-[100px] rounded-full" />
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-6 font-mono text-xs md:text-sm shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-white/10 pb-3 md:pb-4">
              <span className="text-white/40">system@stark:~$</span>
              {isLoading ? (
                <span className="w-16 md:w-20 h-4 md:h-5 bg-white/10 rounded animate-pulse" />
              ) : (
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[8px] md:text-[10px] uppercase tracking-widest">Patch {health?.formula || 'v--'}</span>
              )}
            </div>
            <div className="space-y-1.5 md:space-y-2 text-white/70">
              <p><span className="text-rose-400">ERR:</span> Prediction ID #-- failed.</p>
              <p><span className="text-white/40">LOG:</span> Analyzing 6-layer formula...</p>
              <p><span className="text-amber-400">WARN:</span> Layer 3 (Weather Impact) over-weighted.</p>
              <p><span className="text-indigo-400">EXEC:</span> Generating patch for Layer 3...</p>
              <p className="text-emerald-400 pt-1.5 md:pt-2">SUCCESS: Formula updated to {isLoading ? '--' : (health?.formula || 'v--')}</p>
              <p className="text-white/40">Recalibrating pending queue...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricsSection = ({ isLoading, stats, health }: any) => {
  const metrics = [
    { label: "System Accuracy", value: stats?.accuracy !== undefined ? `${stats.accuracy}%` : '--', color: "text-emerald-400" },
    { label: "Predictions / Day", value: stats?.totalPredictions ?? '--', color: "text-white" },
    { label: "Formula Layers", value: "6", color: "text-white" },
    { label: "Active Jobs", value: stats?.activeJobs ?? '--', color: "text-[#D2691E]" }
  ];

  return (
    <section id="metrics" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="w-16 md:w-24 h-8 md:h-10 bg-white/10 rounded-lg animate-pulse" />
                  <div className="w-24 md:w-32 h-3 md:h-4 bg-white/5 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <p className={cn("text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-1.5 md:mb-2", m.color)}>{m.value}</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/40">{m.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-black/50 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10 md:mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 md:mb-4">Trusted by Professionals</h2>
        <p className="text-sm md:text-base text-white/50 max-w-2xl mx-auto">Syndicates and professional bettors rely on STARK's consensus engine.</p>
      </div>
      
      <div className="flex gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[280px] sm:min-w-[350px] md:min-w-[400px] p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 snap-center shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner" />
              <div>
                <p className="text-sm md:text-base font-bold">Pro Syndicate {i}</p>
                <p className="text-[10px] md:text-xs text-white/40">Volume Bettor</p>
              </div>
            </div>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed">
              "The debate protocol is what sold us. Seeing Claude and GPT-4 argue over a match and arrive at a 76% consensus gives us the confidence to place high-volume stakes."
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CTASection = ({ navigate }: { navigate: (path: string) => void }) => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8B4513]/10 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(139,69,19,0.5)] mb-6 md:mb-8">
          <Activity className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-6">Start Winning with STARK</h2>
        <p className="text-base md:text-xl text-white/50 mb-8 md:mb-10 max-w-2xl mx-auto">
          Join the elite tier of sports predictors. Access the dual-AI consensus engine today.
        </p>
        <button onClick={() => navigate('/login')} className="px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white text-black font-bold text-base md:text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95">
          Get Early Access
        </button>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#D2691E]" />
          <span className="text-base md:text-lg font-bold tracking-tighter text-white">STARK</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xs md:text-sm font-medium text-white/40">
          <a href="#" className="hover:text-white transition-colors">Product</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
        </div>
        <p className="text-[10px] md:text-xs text-white/20">© 2026 STARK Engine. All rights reserved.</p>
      </div>
    </footer>
  );
};

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  X, 
  Cpu, 
  Zap, 
  Activity,
  Loader2,
  Receipt,
  Scan,
  Edit2,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { BetSlip, Sport, SlipSource, SlipStatus } from '../types';

import { apiService } from '../lib/api';

export const BetSlips = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<BetSlip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreview(base64);
        
        // Real OCR Upload
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        
        try {
          const response = await apiService.uploadImage(formData);
          const data = response.data;
          setOcrData({
            id: 'temp_' + Date.now(),
            status: SlipStatus.PROCESSING,
            createdAt: new Date().toISOString(),
            parsedMatches: data.matches,
            source: SlipSource.OCR_IMAGE,
            imageBase64: data.imageBase64,
            mimeType: data.mimeType
          });
        } catch (error) {
          console.error('OCR failed:', error);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitSlip = async () => {
    if (!ocrData) return;
    try {
      await apiService.createSlip({
        source: SlipSource.OCR_IMAGE,
        matches: ocrData.parsedMatches,
        imageBase64: ocrData.imageBase64,
        mimeType: ocrData.mimeType,
        autoPredict: true
      });
      reset();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  const reset = () => {
    setPreview(null);
    setOcrData(null);
    setIsUploading(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">Bet Slip OCR</h1>
          <p className="text-sm md:text-base text-white/40 max-w-xl">Upload physical or digital bet slips to automatically parse matches and trigger AI analysis jobs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 md:px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center gap-2 md:gap-3 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <Scan className="w-3 h-3 md:w-4 md:h-4 text-[#D2691E]" />
            <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">OCR Engine v2.1</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6 md:space-y-8">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={cn(
              "bg-white/5 backdrop-blur-2xl border-2 border-dashed rounded-2xl md:rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center gap-4 md:gap-6 transition-all cursor-pointer relative overflow-hidden group shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]",
              preview ? "border-[#8B4513]/50" : "border-white/10 hover:border-white/20 hover:bg-white/10"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
            
            {preview ? (
              <div className="relative w-full aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3 md:gap-4">
                      <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-[#D2691E] animate-spin" />
                      <p className="text-[10px] md:text-sm font-bold text-white uppercase tracking-widest animate-pulse">Analyzing Image...</p>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); reset(); }}
                      className="p-2 md:p-3 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg"
                    >
                      <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
                {isUploading && (
                  <motion.div 
                    initial={{ top: 0 }}
                    animate={{ top: '100%' }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#D2691E] shadow-[0_0_15px_#D2691E] z-10"
                  />
                )}
              </div>
            ) : (
              <>
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-[#8B4513]/20 flex items-center justify-center border border-[#8B4513]/30 group-hover:scale-110 transition-transform shadow-inner">
                  <Upload className="w-8 h-8 md:w-10 md:h-10 text-[#D2691E]" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">Upload Bet Slip</h3>
                  <p className="text-xs md:text-sm text-white/40">Drag and drop your image here, or click to browse</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-white/20">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> JPG</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PNG</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PDF</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 md:p-6 flex items-center gap-4 md:gap-6 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">System Load: Optimal</h4>
              <p className="text-[10px] md:text-xs text-white/40">OCR processing nodes are currently operating at optimal capacity.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 h-full min-h-[400px] md:min-h-[600px] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <div className="flex items-center gap-2 md:gap-3">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#D2691E]" />
                <h2 className="text-lg md:text-xl font-bold text-white">OCR Output Panel</h2>
              </div>
              {ocrData && (
                <div className="px-2 md:px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Success
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {ocrData ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="space-y-3 md:space-y-4">
                    {ocrData.parsedMatches.map((match, idx) => (
                      <div key={idx} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 group hover:border-[#8B4513]/50 transition-all shadow-sm">
                        <div className="flex items-start justify-between mb-2 md:mb-3">
                          <div>
                            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-[#D2691E] mb-0.5 md:mb-1">{match.sport}</p>
                            <h4 className="text-xs md:text-sm font-bold text-white line-clamp-2 md:line-clamp-none">{match.match}</h4>
                          </div>
                          <button className="p-1.5 md:p-2 rounded-lg hover:bg-white/10 text-white/20 hover:text-white transition-all shrink-0">
                            <Edit2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="px-2 py-1 rounded bg-white/5 text-[8px] md:text-[10px] font-mono text-white/40">
                              Odds: {match.odds}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                            <span className="text-[8px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 md:pt-8 space-y-3 md:space-y-4">
                    <button 
                      onClick={submitSlip}
                      className="w-full py-3 md:py-4 rounded-xl bg-[#8B4513] hover:bg-[#D2691E] text-white font-bold text-sm md:text-base transition-all shadow-[0_0_20px_rgba(139,69,19,0.3)] flex items-center justify-center gap-2"
                    >
                      <Cpu className="w-4 h-4 md:w-5 md:h-5" />
                      Trigger AI Prediction Queue
                    </button>
                    <button 
                      onClick={reset}
                      className="w-full py-3 md:py-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm md:text-base hover:bg-white/10 transition-all"
                    >
                      Clear and Upload New
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <Receipt className="w-6 h-6 md:w-8 md:h-8 text-white/10" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white/40">No Data Parsed</h3>
                    <p className="text-xs md:text-sm text-white/20 max-w-[200px]">Upload a bet slip to see the OCR engine in action.</p>
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

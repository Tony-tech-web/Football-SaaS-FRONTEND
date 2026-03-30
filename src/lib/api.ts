import axios from 'axios';
import { 
  Prediction, Job, BetSlip, Result, FormulaVersion, 
  User, PlanLimits, UserStats, SlipStatus, SlipSource, ResultSource, MatchInput
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

// For the Data Engine (Internal)
const engineApi = axios.create({
  baseURL: '', // We'll use absolute paths or relative to root if hosted on same port
});

export const apiService = {
  // Health (/api/health)
  getHealth: () => api.get<{ status: string; formula: string; db: string }>('/health'),

  // Users (/api/users)
  getUser: (params?: { stats?: boolean }) => 
    api.get<{ user: User; limits: PlanLimits; stats?: UserStats }>('/users', { params }),
  updateUser: (data: { name: string }) => api.patch('/users', data),

  // Slips (/api/slips)
  getSlips: (params?: { page?: number; limit?: number; status?: SlipStatus }) => 
    api.get<{ slips: BetSlip[]; pagination: any }>('/slips', { params }),
  createSlip: (data: { 
    source: SlipSource; 
    rawInput?: string; 
    imageBase64?: string; 
    mimeType?: string; 
    matches?: MatchInput[]; 
    autoPredict?: boolean 
  }) => api.post<{ slipId: string; matchesExtracted: number; status: SlipStatus }>('/slips', data),
  getSlipDetail: (slipId: string) => 
    api.get<{ slip: BetSlip; summary: any }>(`/slips/${slipId}`),
  deleteSlip: (slipId: string) => api.delete(`/slips/${slipId}`),

  // Upload (/api/upload)
  uploadImage: (formData: FormData) => 
    api.post<{ matches: MatchInput[]; imageBase64: string; mimeType: string }>('/upload', formData),

  // Predict (/api/predict)
  runPrediction: (data: { source: 'slip' | 'match'; slipId?: string; matchId?: string }) => 
    api.post<{ slipId: string; predictions: any[]; summary: any }>('/predict', data),
  getPrediction: (params: { slipId?: string; matchId?: string }) => 
    api.get<Prediction>('/predict', { params }),

  // Results (/api/results)
  submitResult: (data: { 
    source: 'single' | 'batch'; 
    matchId?: string; 
    homeScore?: number; 
    awayScore?: number; 
    results?: any[] 
  }) => api.post<{ 
    verified: boolean; 
    wasCorrect: boolean; 
    selfHealed: boolean; 
    failedLayer?: string; 
    newFormulaVersion?: string; 
    patchApplied?: string 
  }>('/results', data),
  getResults: (params?: { page?: number; limit?: number }) => 
    api.get<{ predictions: any[]; stats: any; pagination: any }>('/results', { params }),

  // Formula (/api/formula)
  getFormula: (params?: { view?: 'active' | 'history' | 'patches' | 'accuracy'; page?: number; layer?: string }) => 
    api.get<FormulaVersion>('/formula', { params }),
  adminFormula: (data: { action: 'seed' | 'rollback'; targetVersionId?: string }) => 
    api.post('/formula', data),

  // Admin (/api/admin)
  getAdminReport: (params?: { view?: 'report' | 'patches' | 'versions' | 'usage'; page?: number; layer?: string }) => 
    api.get('/admin', { params }),
  adminAction: (data: any) => api.post('/admin', data),

  // Engine Health
  getEngineHealth: () => engineApi.get('/health'),

  // Engine Queue
  queuePredict: (data: { matchId: string; userId: string; matchData: MatchInput; slipId?: string }) => 
    engineApi.post('/queue/predict', data),
  queueVerify: (data: { matchId: string; homeScore: number; awayScore: number; source?: string }) => 
    engineApi.post('/queue/verify', data),
  getJobStatus: (jobId: string, queue: 'predictions' | 'verifications') => 
    engineApi.get<Job>(`/queue/status/${jobId}`, { params: { queue } }),
  getEngineSnapshot: () => 
    engineApi.get<{ queue: Job[]; stats: any }>('/queue/admin/snapshot'),
};

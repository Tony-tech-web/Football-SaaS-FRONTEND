export type Sport = 'football' | 'basketball';

export enum SlipStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PREDICTED = 'PREDICTED',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

export enum SlipSource {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  OCR_IMAGE = 'OCR_IMAGE',
  MANUAL = 'MANUAL'
}

export enum ConfidenceTier {
  TIER1 = 'TIER1',
  TIER2 = 'TIER2',
  TIER3 = 'TIER3'
}

export enum Plan {
  FREE = 'FREE',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export enum FailedLayer {
  L1_FORM = 'L1_FORM',
  L2_SQUAD = 'L2_SQUAD',
  L3_TACTICAL = 'L3_TACTICAL',
  L4_PSYCHOLOGY = 'L4_PSYCHOLOGY',
  L5_ENVIRONMENT = 'L5_ENVIRONMENT',
  L6_SIMULATION = 'L6_SIMULATION'
}

export enum FailureType {
  WRONG_OUTCOME = 'WRONG_OUTCOME',
  WRONG_GOALS = 'WRONG_GOALS',
  WRONG_SCORE = 'WRONG_SCORE'
}

export enum ResultSource {
  MANUAL = 'MANUAL',
  API = 'API',
  WEB_SCRAPE = 'WEB_SCRAPE'
}

export enum ResultStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed'
}

export enum BetType {
  HOME = 'HOME',
  AWAY = 'AWAY',
  DRAW = 'DRAW',
  OVER_0_5 = 'OVER_0.5',
  OVER_1_5 = 'OVER_1.5',
  OVER_2_5 = 'OVER_2.5',
  OVER_3_5 = 'OVER_3.5',
  UNDER_0_5 = 'UNDER_0.5',
  UNDER_1_5 = 'UNDER_1.5',
  UNDER_2_5 = 'UNDER_2.5',
  UNDER_3_5 = 'UNDER_3.5',
  BTTS_YES = 'BTTS_YES',
  BTTS_NO = 'BTTS_NO',
  DNB_HOME = 'DNB_HOME',
  DNB_AWAY = 'DNB_AWAY',
  DC_HOME_DRAW = 'DC_HOME_DRAW',
  DC_AWAY_DRAW = 'DC_AWAY_DRAW',
  DC_HOME_AWAY = 'DC_HOME_AWAY'
}

export interface Prediction {
  id: string;
  match: string;
  sport: Sport;
  claudeConfidence: number;
  gptConfidence: number;
  finalConfidence: number;
  status: SlipStatus;
  createdAt: string;
  confidenceTier: ConfidenceTier;
  reasoning?: {
    summary: string;
    layers: {
      [key in FailedLayer]?: number;
    };
  };
}

export type JobType = 'predict' | 'verify';
export type JobStatus = 'pending' | 'active' | 'completed' | 'failed';

export interface Job {
  id: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  createdAt: string;
  logs: string[];
  duration?: number;
  error?: string;
}

export interface BetSlip {
  id: string;
  source: SlipSource;
  status: SlipStatus;
  createdAt: string;
  parsedMatches: MatchInput[];
  imageBase64?: string;
  mimeType?: string;
}

export interface MatchInput {
  match: string;
  sport: Sport;
  odds?: number;
  betType?: BetType;
}

export interface Result {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  actualResult: string;
  predictedResult: string;
  isCorrect: boolean;
  verificationStatus: 'pending' | 'verified' | 'failed';
  source: ResultSource;
  failureInsight?: {
    layer: FailedLayer;
    mismatch: string;
    explanation: string;
  };
}

export interface FormulaVersion {
  version: string;
  layers: {
    name: string;
    weight: number;
    description: string;
  }[];
  patchHistory: {
    id: string;
    version: string;
    reason: string;
    explanation: string;
    timestamp: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: Plan;
}

export interface PlanLimits {
  dailySlips: number;
  dailyPredictions: number;
  remainingSlips: number;
}

export interface UserStats {
  totalSlips: number;
  accuracy: number;
  tier1Rate: number;
}

export interface Submission {
  id: string;
  candidateName: string;
  poem: string;
  timestamp: string;
}

export interface RankedResult {
  rank: number;
  candidateName: string;
  score: number;
  roast: string;
  creativity_score: number;
  humor_score: number;
  zetech_reference_score: number;
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
}
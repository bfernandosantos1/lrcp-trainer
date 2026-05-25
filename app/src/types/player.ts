export type LevelName =
  | 'MS3' | 'PGY-1' | 'PGY-2' | 'PGY-3' | 'PGY-4' | 'PGY-5'
  | 'Fellow' | 'Attending' | 'Junior Surgeon' | 'Mid-career Surgeon'
  | 'Expert Surgeon' | 'Master Surgeon' | 'Master Educator';

export interface PlayerState {
  name: string;
  currentLevel: LevelName;
  xp: number;
  casesCompleted: number;
  caseHistory: CompletedCase[];
  streakCount: number;
  totalScore: number;
}

export interface CompletedCase {
  caseId: string;
  date: string;
  levelAtTime: LevelName;
  screenScores: ScreenScores;
  totalScore: number;
  xpEarned: number;
}

export interface ScreenScores {
  screen1: number;
  screen2: number;
  screen3: number;
  screen4: number;
  screen5: number;
  screen6: number;
}

export const DEFAULT_PLAYER: PlayerState = {
  name: '',
  currentLevel: 'MS3',
  xp: 0,
  casesCompleted: 0,
  caseHistory: [],
  streakCount: 0,
  totalScore: 0,
};

import type { LevelName } from '../types/player';
import type { Difficulty } from '../types/case';

export interface LevelThreshold {
  name: LevelName;
  xpRequired: number;
  difficultyRange: [Difficulty, Difficulty];
  timerEnabled: boolean;
  timerSeconds: number;
  complicationMultiplier: number;
  showAlgorithmByDefault: boolean;
  description: string;
}

export const LEVEL_CONFIG: LevelThreshold[] = [
  { name: 'MS3', xpRequired: 0, difficultyRange: [1, 1], timerEnabled: false, timerSeconds: 0, complicationMultiplier: 0, showAlgorithmByDefault: true, description: '3rd Year Medical Student' },
  { name: 'PGY-1', xpRequired: 200, difficultyRange: [1, 2], timerEnabled: false, timerSeconds: 0, complicationMultiplier: 0.1, showAlgorithmByDefault: true, description: 'Intern' },
  { name: 'PGY-2', xpRequired: 500, difficultyRange: [1, 2], timerEnabled: false, timerSeconds: 0, complicationMultiplier: 0.2, showAlgorithmByDefault: true, description: '2nd Year Resident' },
  { name: 'PGY-3', xpRequired: 900, difficultyRange: [2, 3], timerEnabled: false, timerSeconds: 0, complicationMultiplier: 0.3, showAlgorithmByDefault: false, description: '3rd Year Resident' },
  { name: 'PGY-4', xpRequired: 1400, difficultyRange: [2, 3], timerEnabled: true, timerSeconds: 300, complicationMultiplier: 0.4, showAlgorithmByDefault: false, description: '4th Year Resident' },
  { name: 'PGY-5', xpRequired: 2000, difficultyRange: [2, 4], timerEnabled: true, timerSeconds: 270, complicationMultiplier: 0.5, showAlgorithmByDefault: false, description: 'Chief Resident' },
  { name: 'Fellow', xpRequired: 2800, difficultyRange: [3, 4], timerEnabled: true, timerSeconds: 240, complicationMultiplier: 0.6, showAlgorithmByDefault: false, description: 'MIS/HPB Fellow' },
  { name: 'Attending', xpRequired: 3800, difficultyRange: [3, 5], timerEnabled: true, timerSeconds: 210, complicationMultiplier: 0.7, showAlgorithmByDefault: false, description: 'Attending Surgeon' },
  { name: 'Junior Surgeon', xpRequired: 5000, difficultyRange: [3, 5], timerEnabled: true, timerSeconds: 180, complicationMultiplier: 0.8, showAlgorithmByDefault: false, description: 'Early Career Surgeon' },
  { name: 'Mid-career Surgeon', xpRequired: 6500, difficultyRange: [4, 5], timerEnabled: true, timerSeconds: 150, complicationMultiplier: 0.9, showAlgorithmByDefault: false, description: 'Experienced Surgeon' },
  { name: 'Expert Surgeon', xpRequired: 8500, difficultyRange: [4, 5], timerEnabled: true, timerSeconds: 120, complicationMultiplier: 1.0, showAlgorithmByDefault: false, description: 'Expert-Level Surgeon' },
  { name: 'Master Surgeon', xpRequired: 11000, difficultyRange: [5, 5], timerEnabled: true, timerSeconds: 90, complicationMultiplier: 1.0, showAlgorithmByDefault: false, description: 'Master Surgeon' },
  { name: 'Master Educator', xpRequired: 14000, difficultyRange: [5, 5], timerEnabled: true, timerSeconds: 90, complicationMultiplier: 1.0, showAlgorithmByDefault: false, description: 'Master Educator' },
];

export function getLevelConfig(levelName: LevelName): LevelThreshold {
  return LEVEL_CONFIG.find(l => l.name === levelName) || LEVEL_CONFIG[0];
}

export function getLevelForXP(xp: number): LevelThreshold {
  let level = LEVEL_CONFIG[0];
  for (const l of LEVEL_CONFIG) {
    if (xp >= l.xpRequired) level = l;
    else break;
  }
  return level;
}

export function getNextLevel(currentLevel: LevelName): LevelThreshold | null {
  const idx = LEVEL_CONFIG.findIndex(l => l.name === currentLevel);
  if (idx < LEVEL_CONFIG.length - 1) return LEVEL_CONFIG[idx + 1];
  return null;
}

import type { CaseDefinition, Difficulty } from '../types/case';
import type { PlayerState } from '../types/player';
import { getCasesByDifficulty } from '../data/cases';
import { getLevelConfig } from '../data/levelConfig';

export function selectCase(player: PlayerState): CaseDefinition {
  const levelConfig = getLevelConfig(player.currentLevel);
  const [minDiff, maxDiff] = levelConfig.difficultyRange;

  const eligibleCases = getCasesByDifficulty(minDiff as Difficulty, maxDiff as Difficulty);

  // Prefer cases not recently played
  const recentCaseIds = player.caseHistory
    .slice(-3)
    .map(c => c.caseId);

  const unseenCases = eligibleCases.filter(c => !recentCaseIds.includes(c.id));
  const pool = unseenCases.length > 0 ? unseenCases : eligibleCases;

  // Weighted random: prefer cases not yet played at all
  const neverPlayed = pool.filter(c =>
    !player.caseHistory.some(h => h.caseId === c.id)
  );

  const finalPool = neverPlayed.length > 0 ? neverPlayed : pool;
  const randomIndex = Math.floor(Math.random() * finalPool.length);

  return finalPool[randomIndex];
}

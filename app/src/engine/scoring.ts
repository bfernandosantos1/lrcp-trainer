import type { CaseDefinition } from '../types/case';
import type { PlayerChoices } from '../types/game';
import type { ScreenScores } from '../types/player';
import { validateIOCInterpretation } from './algorithmValidator';

const SCREEN_WEIGHTS = {
  screen1: 0.10,
  screen2: 0.10,
  screen3: 0.35,
  screen4: 0.15,
  screen5: 0.15,
  screen6: 0.15,
};

export function scoreScreen1(choices: PlayerChoices['screen1'], caseData: CaseDefinition): number {
  const correct = caseData.screen1.correct;
  const selected = choices.decisions;
  if (selected.length === 0) return 0;

  let score = 0;
  const correctSelected = selected.filter(s => correct.includes(s));
  const incorrectSelected = selected.filter(s => !correct.includes(s));

  score = (correctSelected.length / correct.length) * 100;
  score -= incorrectSelected.length * 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreScreen2(choices: PlayerChoices['screen2'], caseData: CaseDefinition): number {
  return choices.nextStep === caseData.screen2.correctNextStep ? 100 : 0;
}

export function scoreScreen3(choices: PlayerChoices['screen3'], caseData: CaseDefinition): number {
  const result = validateIOCInterpretation(choices, caseData);
  return result.total;
}

export function scoreScreen4(choices: PlayerChoices['screen4'], caseData: CaseDefinition): number {
  const required = new Set(caseData.requiredEquipment);
  const selected = new Set(choices.selectedEquipment);

  let correctCount = 0;
  let extraCount = 0;

  for (const item of selected) {
    if (required.has(item)) correctCount++;
    else extraCount++;
  }

  const missedCount = required.size - correctCount;
  const accuracy = required.size > 0 ? (correctCount / required.size) * 100 : 100;
  const penalty = (extraCount + missedCount) * 5;

  return Math.max(0, Math.min(100, Math.round(accuracy - penalty)));
}

export function scoreScreen5(choices: PlayerChoices['screen5'], caseData: CaseDefinition): number {
  if (caseData.complications.length === 0) {
    return 100;
  }

  const comp = caseData.complications[0];
  const selected = choices.decisions;
  if (selected.length === 0) return 50;

  const hasCorrect = selected.some(d => comp.correctResponses.includes(d));
  const hasIncorrect = selected.some(d => comp.incorrectResponses.includes(d));

  if (hasCorrect && !hasIncorrect) return 100;
  if (hasCorrect && hasIncorrect) return 60;
  if (!hasCorrect && !hasIncorrect) return 40;
  return 20;
}

export function scoreScreen6(choices: PlayerChoices['screen6'], caseData: CaseDefinition): number {
  if (!choices.orders) return 0;

  const correct = caseData.correctPostopOrders;
  let score = 0;

  // Labs (30 points)
  const correctLabs = choices.orders.labs.filter(l => correct.labs.includes(l));
  score += (correctLabs.length / correct.labs.length) * 30;

  // Diet (20 points)
  if (choices.orders.diet === correct.diet) score += 20;

  // Activity (15 points)
  if (choices.orders.activity === correct.activity) score += 15;

  // Disposition (25 points)
  if (choices.orders.disposition === correct.disposition) score += 25;

  // Additional orders (10 points)
  const correctAdditional = choices.orders.additionalOrders.filter(o => correct.additionalOrders.includes(o));
  if (correct.additionalOrders.length > 0) {
    score += (correctAdditional.length / correct.additionalOrders.length) * 10;
  } else {
    score += 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function calculateScreenScores(choices: PlayerChoices, caseData: CaseDefinition): ScreenScores {
  return {
    screen1: scoreScreen1(choices.screen1, caseData),
    screen2: scoreScreen2(choices.screen2, caseData),
    screen3: scoreScreen3(choices.screen3, caseData),
    screen4: scoreScreen4(choices.screen4, caseData),
    screen5: scoreScreen5(choices.screen5, caseData),
    screen6: scoreScreen6(choices.screen6, caseData),
  };
}

export function calculateWeightedTotal(scores: ScreenScores): number {
  return Math.round(
    scores.screen1 * SCREEN_WEIGHTS.screen1 +
    scores.screen2 * SCREEN_WEIGHTS.screen2 +
    scores.screen3 * SCREEN_WEIGHTS.screen3 +
    scores.screen4 * SCREEN_WEIGHTS.screen4 +
    scores.screen5 * SCREEN_WEIGHTS.screen5 +
    scores.screen6 * SCREEN_WEIGHTS.screen6
  );
}

export function calculateXP(totalScore: number, difficulty: number, streakCount: number): number {
  let xp = totalScore * difficulty * 2;

  // Streak bonus
  if (streakCount > 0 && totalScore >= 80) {
    xp *= 1 + (streakCount * 0.1);
  }

  // Perfect score bonus
  if (totalScore === 100) {
    xp += 50;
  }

  return Math.round(xp);
}

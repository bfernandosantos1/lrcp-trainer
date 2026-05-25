import type { CysticDuctSize, StoneBurden, Technique, PrimaryClearanceMethod } from './algorithm';
import type { CaseDefinition, ComplicationScenario, PostopOrders } from './case';
import type { ScreenScores } from './player';

export type ScreenNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface PlayerChoices {
  screen1: { decisions: string[] };
  screen2: { nextStep: string };
  screen3: {
    cysticDuctSize: CysticDuctSize | null;
    cbdDiameter: number | null;
    stoneBurden: StoneBurden | null;
    selectedTechnique: Technique | null;
    selectedMethod: PrimaryClearanceMethod | null;
  };
  screen4: { selectedEquipment: string[] };
  screen5: { decisions: string[] };
  screen6: { orders: PostopOrders | null };
}

export interface GameState {
  currentScreen: ScreenNumber;
  activeCase: CaseDefinition | null;
  playerChoices: PlayerChoices;
  screenScores: Partial<ScreenScores>;
  complicationTriggered: ComplicationScenario | null;
  showAlgorithmRef: boolean;
  caseStartTime: number | null;
}

export const INITIAL_CHOICES: PlayerChoices = {
  screen1: { decisions: [] },
  screen2: { nextStep: '' },
  screen3: {
    cysticDuctSize: null,
    cbdDiameter: null,
    stoneBurden: null,
    selectedTechnique: null,
    selectedMethod: null,
  },
  screen4: { selectedEquipment: [] },
  screen5: { decisions: [] },
  screen6: { orders: null },
};

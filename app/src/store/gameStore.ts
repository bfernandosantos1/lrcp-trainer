import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerState, ScreenScores, CompletedCase, LevelName } from '../types/player';
import type { GameState, PlayerChoices, ScreenNumber } from '../types/game';
import type { CaseDefinition, ComplicationScenario, PostopOrders } from '../types/case';
import type { CysticDuctSize, StoneBurden, Technique, PrimaryClearanceMethod } from '../types/algorithm';
import { DEFAULT_PLAYER } from '../types/player';
import { INITIAL_CHOICES } from '../types/game';
import { selectCase } from '../engine/caseSelector';
import { calculateScreenScores, calculateWeightedTotal, calculateXP } from '../engine/scoring';
import { getLevelForXP } from '../data/levelConfig';

interface GameStore {
  // Player state (persisted)
  player: PlayerState;

  // Game state (ephemeral)
  game: GameState;

  // Player actions
  setPlayerName: (name: string) => void;
  resetPlayer: () => void;

  // Game actions
  startNewCase: () => void;
  startSpecificCase: (caseData: CaseDefinition) => void;
  advanceScreen: () => void;
  goToScreen: (screen: ScreenNumber) => void;

  // Screen-specific choice setters
  setScreen1Decisions: (decisions: string[]) => void;
  setScreen2NextStep: (nextStep: string) => void;
  setScreen3CysticDuct: (size: CysticDuctSize) => void;
  setScreen3CbdDiameter: (diameter: number) => void;
  setScreen3StoneBurden: (burden: StoneBurden) => void;
  setScreen3Technique: (technique: Technique) => void;
  setScreen3Method: (method: PrimaryClearanceMethod) => void;
  setScreen4Equipment: (equipment: string[]) => void;
  toggleScreen4Equipment: (equipmentId: string) => void;
  setScreen5Decisions: (decisions: string[]) => void;
  setScreen6Orders: (orders: PostopOrders) => void;

  // Complication
  triggerComplication: (comp: ComplicationScenario) => void;

  // Algorithm reference
  toggleAlgorithmRef: () => void;

  // End case and calculate scores
  endCase: () => { scores: ScreenScores; total: number; xp: number; leveledUp: boolean; newLevel: LevelName };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      player: DEFAULT_PLAYER,

      game: {
        currentScreen: 1 as ScreenNumber,
        activeCase: null,
        playerChoices: { ...INITIAL_CHOICES },
        screenScores: {},
        complicationTriggered: null,
        showAlgorithmRef: false,
        caseStartTime: null,
      },

      setPlayerName: (name) => set((state) => ({
        player: { ...state.player, name },
      })),

      resetPlayer: () => set({ player: DEFAULT_PLAYER }),

      startNewCase: () => {
        const { player } = get();
        const caseData = selectCase(player);
        set({
          game: {
            currentScreen: 1,
            activeCase: caseData,
            playerChoices: JSON.parse(JSON.stringify(INITIAL_CHOICES)),
            screenScores: {},
            complicationTriggered: null,
            showAlgorithmRef: false,
            caseStartTime: Date.now(),
          },
        });
      },

      startSpecificCase: (caseData) => set({
        game: {
          currentScreen: 1,
          activeCase: caseData,
          playerChoices: JSON.parse(JSON.stringify(INITIAL_CHOICES)),
          screenScores: {},
          complicationTriggered: null,
          showAlgorithmRef: false,
          caseStartTime: Date.now(),
        },
      }),

      advanceScreen: () => set((state) => {
        const next = Math.min(state.game.currentScreen + 1, 7) as ScreenNumber;
        return { game: { ...state.game, currentScreen: next } };
      }),

      goToScreen: (screen) => set((state) => ({
        game: { ...state.game, currentScreen: screen },
      })),

      setScreen1Decisions: (decisions) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen1: { decisions },
          },
        },
      })),

      setScreen2NextStep: (nextStep) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen2: { nextStep },
          },
        },
      })),

      setScreen3CysticDuct: (size) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen3: { ...state.game.playerChoices.screen3, cysticDuctSize: size },
          },
        },
      })),

      setScreen3CbdDiameter: (diameter) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen3: { ...state.game.playerChoices.screen3, cbdDiameter: diameter },
          },
        },
      })),

      setScreen3StoneBurden: (burden) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen3: { ...state.game.playerChoices.screen3, stoneBurden: burden },
          },
        },
      })),

      setScreen3Technique: (technique) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen3: { ...state.game.playerChoices.screen3, selectedTechnique: technique },
          },
        },
      })),

      setScreen3Method: (method) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen3: { ...state.game.playerChoices.screen3, selectedMethod: method },
          },
        },
      })),

      setScreen4Equipment: (equipment) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen4: { selectedEquipment: equipment },
          },
        },
      })),

      toggleScreen4Equipment: (equipmentId) => set((state) => {
        const current = state.game.playerChoices.screen4.selectedEquipment;
        const updated = current.includes(equipmentId)
          ? current.filter(id => id !== equipmentId)
          : [...current, equipmentId];
        return {
          game: {
            ...state.game,
            playerChoices: {
              ...state.game.playerChoices,
              screen4: { selectedEquipment: updated },
            },
          },
        };
      }),

      setScreen5Decisions: (decisions) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen5: { decisions },
          },
        },
      })),

      setScreen6Orders: (orders) => set((state) => ({
        game: {
          ...state.game,
          playerChoices: {
            ...state.game.playerChoices,
            screen6: { orders },
          },
        },
      })),

      triggerComplication: (comp) => set((state) => ({
        game: { ...state.game, complicationTriggered: comp },
      })),

      toggleAlgorithmRef: () => set((state) => ({
        game: { ...state.game, showAlgorithmRef: !state.game.showAlgorithmRef },
      })),

      endCase: () => {
        const state = get();
        const { activeCase, playerChoices } = state.game;
        if (!activeCase) {
          return { scores: { screen1: 0, screen2: 0, screen3: 0, screen4: 0, screen5: 0, screen6: 0 }, total: 0, xp: 0, leveledUp: false, newLevel: state.player.currentLevel };
        }

        const scores = calculateScreenScores(playerChoices, activeCase);
        const total = calculateWeightedTotal(scores);
        const newStreak = total >= 80 ? state.player.streakCount + 1 : 0;
        const xp = calculateXP(total, activeCase.difficulty, state.player.streakCount);
        const newXP = state.player.xp + xp;
        const newLevelConfig = getLevelForXP(newXP);
        const leveledUp = newLevelConfig.name !== state.player.currentLevel;

        const completedCase: CompletedCase = {
          caseId: activeCase.id,
          date: new Date().toISOString(),
          levelAtTime: state.player.currentLevel,
          screenScores: scores,
          totalScore: total,
          xpEarned: xp,
        };

        set({
          player: {
            ...state.player,
            xp: newXP,
            currentLevel: newLevelConfig.name,
            casesCompleted: state.player.casesCompleted + 1,
            caseHistory: [...state.player.caseHistory, completedCase],
            streakCount: newStreak,
            totalScore: state.player.totalScore + total,
          },
          game: {
            ...state.game,
            screenScores: scores,
          },
        });

        return { scores, total, xp, leveledUp, newLevel: newLevelConfig.name };
      },
    }),
    {
      name: 'lrcp-trainer-player',
      partialize: (state) => ({ player: state.player }),
    }
  )
);

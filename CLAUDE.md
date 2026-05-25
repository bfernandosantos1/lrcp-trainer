# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LRCP Trainer — a React web app teaching surgical learners to interpret intraoperative cholangiograms (IOC) and apply the LRCP (Laparoscopic Reverse Cholangiopancreatography) algorithm for laparoscopic common bile duct exploration. Based on Santos et al., Surg Laparosc Endosc Percutan Tech 2025.

## Repository Layout

The application lives entirely in `app/`. The root also contains source materials (`*.pptx`, `*.pdf`, `pptx_images/`) — these are reference only and not part of the build.

## Commands

All commands run from `app/`:

```bash
cd app
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # Preview production build
npx tsc --noEmit  # Type-check without emitting
```

No test framework is configured yet.

## Architecture

**Tech stack:** React 19, TypeScript ~6, Vite 8, Tailwind CSS v4 (via `@tailwindcss/vite` plugin), Zustand 5, React Router 7.

**Two routes:** `/` (HomeScreen) and `/play` (GameShell with 7-screen game loop).

### State Management

Single Zustand store (`src/store/gameStore.ts`) with two slices:
- `player` — persisted to localStorage (key `lrcp-trainer-player`). Tracks XP, level, case history, streak.
- `game` — ephemeral. Tracks current screen (1–7), active case, per-screen player choices, scores, complications.

The store uses `partialize` to persist only the `player` slice.

### Game Flow

1. `HomeScreen` → `startNewCase()` → `caseSelector.ts` picks a `CaseDefinition` matching the player's level difficulty range
2. `GameShell` renders screens 1–7 based on `game.currentScreen`
3. Each screen writes to `game.playerChoices` via dedicated store setters
4. Screen 7 calls `endCase()` → `scoring.ts` computes weighted scores → updates player XP and level

### Core Domain: LRCP Algorithm

The algorithm decision tree (in `src/engine/algorithmValidator.ts`):
- Cystic duct ≥4mm → Choledochoscope-Assisted → {basket extraction, sphincteroplasty+snowplow, lithotripsy}
- Cystic duct <4mm/tortuous → Fluoroscopy-Guided → {extraction balloon push, sphincteroplasty+flush+extraction, lithotripsy}

Each `CaseDefinition` carries a `correctAlgorithmPath` that the validator compares against player choices.

### Scoring Weights

Screen 3 (IOC interpretation) is the core educational screen at 35% weight. Screens 4/5/6 are 15% each. Screens 1/2 are 10% each.

### Case Data

13 clinical cases in `src/data/cases/` (case01–case13), difficulty 1–5. Each exports a `CaseDefinition` with patient demographics, labs, imaging, IOC findings, correct algorithm path, required equipment, complications, and teaching pearls. 15 real IOC images in `public/images/ioc/`.

### Progression

13 levels (MS3 → Master Educator) defined in `src/data/levelConfig.ts`. Higher levels unlock harder cases, enable countdown timers, increase complication probability, and hide the algorithm reference overlay.

## TypeScript Notes

- `verbatimModuleSyntax: true` — use `import type` for type-only imports
- `noUnusedLocals` and `noUnusedParameters` are enforced
- `erasableSyntaxOnly: true` — no `const enum` or other legacy TS-only syntax

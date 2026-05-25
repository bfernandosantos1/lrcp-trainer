import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getNextLevel } from '../../data/levelConfig';
import type { ScreenScores, LevelName } from '../../types/player';
import { useNavigate } from 'react-router-dom';

const SCREEN_NAMES: Record<keyof ScreenScores, string> = {
  screen1: 'Presentation',
  screen2: 'Workup',
  screen3: 'IOC Interpretation',
  screen4: 'Equipment',
  screen5: 'Intervention',
  screen6: 'Postop',
};

const SCREEN_WEIGHTS: Record<keyof ScreenScores, number> = {
  screen1: 10,
  screen2: 10,
  screen3: 35,
  screen4: 15,
  screen5: 15,
  screen6: 15,
};

export function Screen7Debrief() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const endCase = useGameStore(s => s.endCase);
  const startNewCase = useGameStore(s => s.startNewCase);
  const player = useGameStore(s => s.player);
  const navigate = useNavigate();

  const [result, setResult] = useState<{
    scores: ScreenScores;
    total: number;
    xp: number;
    leveledUp: boolean;
    newLevel: LevelName;
  } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const r = endCase();
    setResult(r);
    if (r.leveledUp) {
      setTimeout(() => setShowLevelUp(true), 1500);
    }
  }, []);

  if (!result) return null;

  const { scores, total, xp, leveledUp, newLevel } = result;
  const nextLevel = getNextLevel(player.currentLevel);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Level Up Overlay */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 fade-in" onClick={() => setShowLevelUp(false)}>
          <div className="bg-gradient-to-b from-amber-900/80 to-slate-900 rounded-2xl p-8 text-center level-up-animate border border-amber-500/50 max-w-sm mx-4">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Level Up!</h2>
            <p className="text-slate-300 mb-1">You've been promoted to</p>
            <p className="text-3xl font-bold text-white">{newLevel}</p>
            <p className="text-sm text-slate-400 mt-4">Click anywhere to continue</p>
          </div>
        </div>
      )}

      {/* Header with Grade */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700/50 text-center">
        <h2 className="text-lg font-bold text-slate-100 mb-1">Case Debrief</h2>
        <p className="text-sm text-slate-400 mb-4">{activeCase.title}</p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <div className={`text-5xl font-bold ${total >= 80 ? 'text-green-400' : total >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {getGrade(total)}
            </div>
            <div className="text-sm text-slate-400 mt-1">{total}/100</div>
          </div>
          <div className="text-left">
            <div className="text-amber-400 font-bold text-lg">+{xp} XP</div>
            <div className="text-xs text-slate-500">Difficulty {activeCase.difficulty}/5</div>
            {player.streakCount > 1 && (
              <div className="text-xs text-amber-300">🔥 {player.streakCount} streak!</div>
            )}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Score Breakdown</h3>
        <div className="space-y-3">
          {(Object.keys(SCREEN_NAMES) as (keyof ScreenScores)[]).map(key => {
            const score = scores[key];
            const weight = SCREEN_WEIGHTS[key];
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{SCREEN_NAMES[key]}</span>
                    {key === 'screen3' && <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">CORE</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{weight}%</span>
                    <span className={`text-sm font-bold ${score >= 80 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {score}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Correct Algorithm Path */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Correct LRCP Algorithm Path</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
            Cystic duct {activeCase.correctAlgorithmPath.cysticDuctSize === 'gte4mm' ? '≥ 4mm' : '< 4mm / tortuous'}
          </span>
          <span className="text-slate-500">→</span>
          <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
            {activeCase.correctAlgorithmPath.technique === 'choledochoscope_assisted' ? 'Choledochoscope-Assisted' : 'Fluoroscopy-Guided'}
          </span>
          <span className="text-slate-500">→</span>
          <span className="bg-amber-900/50 text-amber-300 px-2 py-1 rounded">
            {activeCase.correctAlgorithmPath.stoneBurden === 'none' ? 'No stones' :
             activeCase.correctAlgorithmPath.stoneBurden === 'few_small' ? 'Few small' :
             activeCase.correctAlgorithmPath.stoneBurden === 'single_small' ? 'Single small' :
             activeCase.correctAlgorithmPath.stoneBurden === 'multiple_medium' ? 'Multiple/medium' : 'Large (>10mm)'}
          </span>
          <span className="text-slate-500">→</span>
          <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded">
            {activeCase.correctAlgorithmPath.primaryMethod === 'basket_extraction' ? 'Basket Extraction' :
             activeCase.correctAlgorithmPath.primaryMethod === 'balloon_sphincteroplasty_snowplow' ? 'Sphincteroplasty + Snow-Plow' :
             activeCase.correctAlgorithmPath.primaryMethod === 'lithotripsy' ? 'Lithotripsy' :
             activeCase.correctAlgorithmPath.primaryMethod === 'extraction_balloon_push' ? 'Extraction Balloon Push' :
             activeCase.correctAlgorithmPath.primaryMethod === 'balloon_sphincteroplasty_flush_extraction' ? 'Sphincteroplasty + Flush + Extraction' :
             activeCase.correctAlgorithmPath.primaryMethod === 'glucagon_flush' ? 'Glucagon Flush' : 'No Intervention'}
          </span>
        </div>
      </div>

      {/* Debrief Explanation */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Discussion</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{activeCase.debriefExplanation}</p>
      </div>

      {/* Teaching Pearls */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Teaching Pearls</h3>
        <ul className="space-y-2">
          {activeCase.pearls.map((pearl, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-amber-400 mt-0.5">•</span>
              {pearl}
            </li>
          ))}
        </ul>
      </div>

      {/* XP Progress */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">{player.currentLevel}</span>
          {nextLevel && <span className="text-xs text-slate-500">{nextLevel.name}</span>}
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
            style={{
              width: nextLevel
                ? `${Math.min(100, ((player.xp - (LEVEL_CONFIG_XP.get(player.currentLevel) || 0)) / ((nextLevel?.xpRequired || 1) - (LEVEL_CONFIG_XP.get(player.currentLevel) || 0))) * 100)}%`
                : '100%',
            }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">{player.xp} / {nextLevel?.xpRequired || 'MAX'} XP</div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center pb-8">
        <button
          onClick={() => {
            startNewCase();
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Next Case
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

// Helper map for XP thresholds
import { LEVEL_CONFIG } from '../../data/levelConfig';
const LEVEL_CONFIG_XP = new Map(LEVEL_CONFIG.map(l => [l.name, l.xpRequired]));

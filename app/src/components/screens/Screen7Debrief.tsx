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

  const { scores, total, xp, newLevel } = result;
  const nextLevel = getNextLevel(player.currentLevel);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-vital-green';
    if (score >= 50) return 'bg-vital-amber';
    return 'bg-vital-red';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-vital-green vital-glow-green';
    if (score >= 50) return 'text-vital-amber vital-glow-amber';
    return 'text-vital-red vital-glow-red';
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
          <div className="bg-gradient-to-b from-vital-amber/20 to-monitor-bg rounded-2xl p-8 text-center level-up-animate border border-vital-amber/50 max-w-sm mx-4 monitor-panel">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-vital-amber vital-glow-amber mb-2 font-clinical">Level Up!</h2>
            <p className="text-monitor-text mb-1">You've been promoted to</p>
            <p className="text-3xl font-bold text-monitor-bright">{newLevel}</p>
            <p className="text-sm text-monitor-text/40 mt-4">Click anywhere to continue</p>
          </div>
        </div>
      )}

      {/* Header with Grade */}
      <div className="bg-gradient-to-r from-vital-cyan/10 to-monitor-panel rounded-lg p-6 border border-vital-cyan/20 text-center">
        <h2 className="text-lg font-bold text-monitor-bright mb-1">Case Debrief</h2>
        <p className="text-sm text-monitor-text/50 mb-4">{activeCase.title}</p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <div className={`text-5xl font-bold font-clinical ${getScoreTextColor(total)}`}>
              {getGrade(total)}
            </div>
            <div className="text-sm text-monitor-text/50 mt-1 font-clinical">{total}/100</div>
          </div>
          <div className="text-left">
            <div className="text-vital-amber vital-glow-amber font-bold text-lg font-clinical">+{xp} XP</div>
            <div className="text-xs text-monitor-text/50">Difficulty {activeCase.difficulty}/5</div>
            {player.streakCount > 1 && (
              <div className="text-xs text-vital-amber">🔥 {player.streakCount} streak!</div>
            )}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="monitor-panel p-4">
        <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider mb-4 font-clinical">Score Breakdown</h3>
        <div className="space-y-3">
          {(Object.keys(SCREEN_NAMES) as (keyof ScreenScores)[]).map(key => {
            const score = scores[key];
            const weight = SCREEN_WEIGHTS[key];
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-monitor-text/60">{SCREEN_NAMES[key]}</span>
                    {key === 'screen3' && <span className="text-[10px] text-vital-amber bg-vital-amber/10 px-1.5 py-0.5 rounded border border-vital-amber/30">CORE</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-monitor-text/40 font-clinical">{weight}%</span>
                    <span className={`text-sm font-bold font-clinical ${getScoreTextColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-monitor-bg rounded-full overflow-hidden border border-monitor-border/30">
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
      <div className="monitor-panel p-4">
        <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider mb-3 font-clinical">Correct LRCP Algorithm Path</h3>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-vital-cyan/10 text-vital-cyan px-2 py-1 rounded border border-vital-cyan/30">
            Cystic duct {activeCase.correctAlgorithmPath.cysticDuctSize === 'gte4mm' ? '≥ 4mm' : '< 4mm / tortuous'}
          </span>
          <span className="text-monitor-text/30">→</span>
          <span className="bg-vital-cyan/10 text-vital-cyan px-2 py-1 rounded border border-vital-cyan/30">
            {activeCase.correctAlgorithmPath.technique === 'choledochoscope_assisted' ? 'Choledochoscope-Assisted' : 'Fluoroscopy-Guided'}
          </span>
          <span className="text-monitor-text/30">→</span>
          <span className="bg-vital-amber/10 text-vital-amber px-2 py-1 rounded border border-vital-amber/30">
            {activeCase.correctAlgorithmPath.stoneBurden === 'none' ? 'No stones' :
             activeCase.correctAlgorithmPath.stoneBurden === 'few_small' ? 'Few small' :
             activeCase.correctAlgorithmPath.stoneBurden === 'single_small' ? 'Single small' :
             activeCase.correctAlgorithmPath.stoneBurden === 'multiple_medium' ? 'Multiple/medium' : 'Large (>10mm)'}
          </span>
          <span className="text-monitor-text/30">→</span>
          <span className="bg-vital-green/10 text-vital-green px-2 py-1 rounded border border-vital-green/30">
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
      <div className="monitor-panel p-4">
        <h3 className="text-sm font-semibold text-monitor-text uppercase tracking-wider mb-2">Discussion</h3>
        <p className="text-sm text-monitor-text leading-relaxed">{activeCase.debriefExplanation}</p>
      </div>

      {/* Teaching Pearls */}
      <div className="monitor-panel p-4">
        <h3 className="text-sm font-semibold text-vital-amber vital-glow-amber uppercase tracking-wider mb-2 font-clinical">Teaching Pearls</h3>
        <ul className="space-y-2">
          {activeCase.pearls.map((pearl, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-monitor-text">
              <span className="text-vital-amber mt-0.5">•</span>
              {pearl}
            </li>
          ))}
        </ul>
      </div>

      {/* XP Progress */}
      <div className="monitor-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-monitor-text font-clinical">{player.currentLevel}</span>
          {nextLevel && <span className="text-xs text-monitor-text/40 font-clinical">{nextLevel.name}</span>}
        </div>
        <div className="w-full h-3 bg-monitor-bg rounded-full overflow-hidden border border-monitor-border/30">
          <div
            className="h-full bg-vital-cyan rounded-full transition-all duration-1000"
            style={{
              width: nextLevel
                ? `${Math.min(100, ((player.xp - (LEVEL_CONFIG_XP.get(player.currentLevel) || 0)) / ((nextLevel?.xpRequired || 1) - (LEVEL_CONFIG_XP.get(player.currentLevel) || 0))) * 100)}%`
                : '100%',
            }}
          />
        </div>
        <div className="text-xs text-monitor-text/40 mt-1 font-clinical">{player.xp} / {nextLevel?.xpRequired || 'MAX'} XP</div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center pb-8">
        <button
          onClick={() => {
            startNewCase();
          }}
          className="bg-vital-cyan hover:bg-vital-cyan/80 text-monitor-bg font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Next Case
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-monitor-panel hover:bg-monitor-border/50 text-monitor-bright font-semibold px-6 py-3 rounded-lg transition-colors border border-monitor-border"
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

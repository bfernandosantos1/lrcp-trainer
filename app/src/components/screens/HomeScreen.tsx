import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { Header } from '../layout/Header';
import { getLevelConfig, getNextLevel, LEVEL_CONFIG } from '../../data/levelConfig';
import { AlgorithmReference } from '../reference/AlgorithmReference';

export function HomeScreen() {
  const player = useGameStore(s => s.player);
  const setPlayerName = useGameStore(s => s.setPlayerName);
  const startNewCase = useGameStore(s => s.startNewCase);
  const resetPlayer = useGameStore(s => s.resetPlayer);
  const navigate = useNavigate();

  const [showAlgorithm, setShowAlgorithm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showReset, setShowReset] = useState(false);

  const levelConfig = getLevelConfig(player.currentLevel);
  const nextLevel = getNextLevel(player.currentLevel);
  const xpProgress = nextLevel
    ? ((player.xp - levelConfig.xpRequired) / (nextLevel.xpRequired - levelConfig.xpRequired)) * 100
    : 100;

  const handleStart = () => {
    if (!player.name && nameInput.trim()) {
      setPlayerName(nameInput.trim());
    }
    startNewCase();
    navigate('/play');
  };

  const averageScore = player.casesCompleted > 0
    ? Math.round(player.totalScore / player.casesCompleted)
    : 0;

  const needsName = !player.name;

  return (
    <div className="min-h-screen flex flex-col bg-monitor-bg relative">
      <div className="fixed inset-0 monitor-scanlines z-[1] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-monitor-bright mb-3">
              <span className="text-vital-cyan vital-glow-cyan font-clinical">LRCP</span> Trainer
            </h1>
            <p className="text-monitor-text/60 text-lg max-w-xl mx-auto">
              Master the Laparoscopic Reverse Cholangiopancreatography algorithm through interactive clinical cases.
            </p>
          </div>

          {needsName ? (
            /* Name Entry */
            <div className="max-w-sm mx-auto monitor-panel p-6">
              <h2 className="text-lg font-semibold text-monitor-bright mb-4">Welcome, Learner</h2>
              <p className="text-sm text-monitor-text/60 mb-4">Enter your name to begin:</p>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Your name"
                className="w-full bg-monitor-bg border border-monitor-border rounded-lg px-4 py-2 text-monitor-bright placeholder-monitor-text/30 focus:outline-none focus:border-vital-cyan mb-4 font-clinical"
                onKeyDown={e => e.key === 'Enter' && nameInput.trim() && handleStart()}
              />
              <button
                onClick={handleStart}
                disabled={!nameInput.trim()}
                className="w-full bg-vital-cyan hover:bg-vital-cyan/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 text-monitor-bg font-semibold py-3 rounded-lg transition-colors"
              >
                Start Training
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Player Card */}
              <div className="monitor-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-monitor-bright">{player.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-vital-amber vital-glow-amber font-semibold">{player.currentLevel}</span>
                      <span className="text-xs text-monitor-text/50">&mdash; {levelConfig.description}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-vital-cyan vital-glow-cyan font-clinical">{player.xp}</div>
                    <div className="text-xs text-monitor-text/50">Total XP</div>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-monitor-text/50 mb-1">
                    <span>{player.currentLevel}</span>
                    <span>{nextLevel ? nextLevel.name : 'MAX'}</span>
                  </div>
                  <div className="w-full h-3 bg-monitor-bg rounded-full overflow-hidden border border-monitor-border/50">
                    <div
                      className="h-full bg-vital-cyan rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, xpProgress)}%` }}
                    />
                  </div>
                  {nextLevel && (
                    <div className="text-xs text-monitor-text/50 mt-1 text-right font-clinical">
                      {nextLevel.xpRequired - player.xp} XP to next level
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'Cases', value: player.casesCompleted },
                    { label: 'Avg Score', value: averageScore + '%' },
                    { label: 'Streak', value: player.streakCount },
                    { label: 'Level', value: LEVEL_CONFIG.findIndex(l => l.name === player.currentLevel) + 1 + '/' + LEVEL_CONFIG.length },
                  ].map(stat => (
                    <div key={stat.label} className="bg-monitor-bg rounded-lg p-3 text-center border border-monitor-border/50">
                      <div className="text-lg font-bold text-monitor-bright font-clinical">{stat.value}</div>
                      <div className="text-[10px] text-monitor-text/40 uppercase">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleStart}
                  className="bg-vital-cyan hover:bg-vital-cyan/80 text-monitor-bg font-bold py-4 rounded-xl transition-colors text-lg"
                >
                  Start New Case
                </button>
                <button
                  onClick={() => setShowAlgorithm(true)}
                  className="bg-monitor-panel hover:bg-monitor-border/50 text-monitor-bright font-semibold py-4 rounded-xl transition-colors border border-monitor-border"
                >
                  Review LRCP Algorithm
                </button>
              </div>

              {/* Recent Cases */}
              {player.caseHistory.length > 0 && (
                <div className="monitor-panel p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-monitor-text uppercase tracking-wider font-clinical">Recent Cases</h3>
                    <button
                      onClick={() => setShowStats(!showStats)}
                      className="text-xs text-vital-cyan hover:text-vital-cyan/70"
                    >
                      {showStats ? 'Hide' : 'Show All'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {player.caseHistory
                      .slice(showStats ? 0 : -5)
                      .reverse()
                      .map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-monitor-bg rounded p-2 border border-monitor-border/30">
                        <div>
                          <span className="text-sm text-monitor-text font-clinical">{c.caseId.replace('_', ' ').toUpperCase()}</span>
                          <span className="text-xs text-monitor-text/40 ml-2">{new Date(c.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold font-clinical ${c.totalScore >= 80 ? 'text-vital-green vital-glow-green' : c.totalScore >= 50 ? 'text-vital-amber vital-glow-amber' : 'text-vital-red vital-glow-red'}`}>
                            {c.totalScore}%
                          </span>
                          <span className="text-xs text-vital-amber font-clinical">+{c.xpEarned} XP</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset */}
              <div className="text-center">
                {!showReset ? (
                  <button
                    onClick={() => setShowReset(true)}
                    className="text-xs text-monitor-text/30 hover:text-monitor-text/50 transition-colors"
                  >
                    Reset Progress
                  </button>
                ) : (
                  <div className="bg-vital-red/10 border border-vital-red/30 rounded-lg p-3 inline-block">
                    <p className="text-xs text-vital-red mb-2">This will permanently delete all progress. Are you sure?</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => { resetPlayer(); setShowReset(false); }}
                        className="bg-vital-red hover:bg-vital-red/80 text-white text-xs px-4 py-1.5 rounded transition-colors"
                      >
                        Yes, Reset
                      </button>
                      <button
                        onClick={() => setShowReset(false)}
                        className="bg-monitor-panel hover:bg-monitor-border/50 text-monitor-bright text-xs px-4 py-1.5 rounded transition-colors border border-monitor-border"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-monitor-text/30 border-t border-monitor-border/30">
          LRCP Trainer &mdash; Based on Santos et al., Surg Laparosc Endosc Percutan Tech 2025
        </footer>

        {showAlgorithm && <AlgorithmReference onClose={() => setShowAlgorithm(false)} />}
      </div>
    </div>
  );
}

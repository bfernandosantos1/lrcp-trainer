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
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            <span className="text-blue-400">LRCP</span> Trainer
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Master the Laparoscopic Reverse Cholangiopancreatography algorithm through interactive clinical cases.
          </p>
        </div>

        {needsName ? (
          /* Name Entry */
          <div className="max-w-sm mx-auto bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Welcome, Learner</h2>
            <p className="text-sm text-slate-400 mb-4">Enter your name to begin:</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Your name"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-4"
              onKeyDown={e => e.key === 'Enter' && nameInput.trim() && handleStart()}
            />
            <button
              onClick={handleStart}
              disabled={!nameInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Start Training
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Player Card */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{player.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-400 font-semibold">{player.currentLevel}</span>
                    <span className="text-xs text-slate-500">— {levelConfig.description}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">{player.xp}</div>
                  <div className="text-xs text-slate-500">Total XP</div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{player.currentLevel}</span>
                  <span>{nextLevel ? nextLevel.name : 'MAX'}</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, xpProgress)}%` }}
                  />
                </div>
                {nextLevel && (
                  <div className="text-xs text-slate-500 mt-1 text-right">
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
                  <div key={stat.label} className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-slate-200">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleStart}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-colors text-lg"
              >
                Start New Case
              </button>
              <button
                onClick={() => setShowAlgorithm(true)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                Review LRCP Algorithm
              </button>
            </div>

            {/* Recent Cases */}
            {player.caseHistory.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Recent Cases</h3>
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {showStats ? 'Hide' : 'Show All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {player.caseHistory
                    .slice(showStats ? 0 : -5)
                    .reverse()
                    .map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-700/50 rounded p-2">
                      <div>
                        <span className="text-sm text-slate-300">{c.caseId.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-xs text-slate-500 ml-2">{new Date(c.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${c.totalScore >= 80 ? 'text-green-400' : c.totalScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {c.totalScore}%
                        </span>
                        <span className="text-xs text-amber-400">+{c.xpEarned} XP</span>
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
                  className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Reset Progress
                </button>
              ) : (
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 inline-block">
                  <p className="text-xs text-red-400 mb-2">This will permanently delete all progress. Are you sure?</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => { resetPlayer(); setShowReset(false); }}
                      className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-1.5 rounded transition-colors"
                    >
                      Yes, Reset
                    </button>
                    <button
                      onClick={() => setShowReset(false)}
                      className="bg-slate-600 hover:bg-slate-500 text-white text-xs px-4 py-1.5 rounded transition-colors"
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
      <footer className="text-center py-4 text-xs text-slate-600 border-t border-slate-800">
        LRCP Trainer — Based on Santos et al., Surg Laparosc Endosc Percutan Tech 2025
      </footer>

      {showAlgorithm && <AlgorithmReference onClose={() => setShowAlgorithm(false)} />}
    </div>
  );
}

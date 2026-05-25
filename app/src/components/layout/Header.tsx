import { useGameStore } from '../../store/gameStore';
import { getLevelConfig, getNextLevel } from '../../data/levelConfig';

export function Header() {
  const player = useGameStore(s => s.player);
  const levelConfig = getLevelConfig(player.currentLevel);
  const nextLevel = getNextLevel(player.currentLevel);

  const xpProgress = nextLevel
    ? ((player.xp - levelConfig.xpRequired) / (nextLevel.xpRequired - levelConfig.xpRequired)) * 100
    : 100;

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-blue-400 tracking-tight">LRCP Trainer</h1>
          <span className="text-xs text-slate-500 hidden sm:inline">Laparoscopic Reverse Cholangiopancreatography</span>
        </div>

        <div className="flex items-center gap-4">
          {player.name && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-400">{player.currentLevel}</span>
                <span className="text-xs text-slate-400">{levelConfig.description}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, xpProgress)}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{player.xp} XP</span>
              </div>
            </div>
          )}

          {player.casesCompleted > 0 && (
            <div className="text-xs text-slate-500 border-l border-slate-700 pl-3">
              <div>{player.casesCompleted} cases</div>
              {player.streakCount > 0 && (
                <div className="text-amber-400">{player.streakCount} streak</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

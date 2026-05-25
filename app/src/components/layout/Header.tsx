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
    <header className="bg-monitor-panel/90 backdrop-blur-sm border-b border-monitor-border px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-vital-cyan vital-glow-cyan tracking-tight font-clinical">LRCP Trainer</h1>
          <span className="text-xs text-monitor-text/50 hidden sm:inline">Laparoscopic Reverse Cholangiopancreatography</span>
        </div>

        <div className="flex items-center gap-4">
          {player.name && (
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-vital-amber vital-glow-amber">{player.currentLevel}</span>
                <span className="text-xs text-monitor-text/50">{levelConfig.description}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-1.5 bg-monitor-bg rounded-full overflow-hidden border border-monitor-border/50">
                  <div
                    className="h-full bg-vital-cyan rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, xpProgress)}%` }}
                  />
                </div>
                <span className="text-xs text-monitor-text/50 font-clinical">{player.xp} XP</span>
              </div>
            </div>
          )}

          {player.casesCompleted > 0 && (
            <div className="text-xs text-monitor-text/50 border-l border-monitor-border pl-3">
              <div>{player.casesCompleted} cases</div>
              {player.streakCount > 0 && (
                <div className="text-vital-amber vital-glow-amber">{player.streakCount} streak</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="ekg-line mt-2" />
    </header>
  );
}

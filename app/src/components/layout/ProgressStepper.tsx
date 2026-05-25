import type { ScreenNumber } from '../../types/game';

const SCREEN_LABELS: Record<ScreenNumber, string> = {
  1: 'Presentation',
  2: 'Workup',
  3: 'IOC',
  4: 'Equipment',
  5: 'Intervention',
  6: 'Postop',
  7: 'Debrief',
};

interface Props {
  currentScreen: ScreenNumber;
}

export function ProgressStepper({ currentScreen }: Props) {
  const screens: ScreenNumber[] = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="bg-monitor-panel/50 border-b border-monitor-border/50 px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {screens.map((screen, i) => {
          const isActive = screen === currentScreen;
          const isCompleted = screen < currentScreen;
          const isCore = screen === 3;

          return (
            <div key={screen} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-clinical transition-all
                    ${isActive
                      ? isCore
                        ? 'bg-vital-amber text-monitor-bg ring-2 ring-vital-amber/50 pulse-glow'
                        : 'bg-vital-cyan text-monitor-bg ring-2 ring-vital-cyan/50'
                      : isCompleted
                        ? 'bg-vital-green text-monitor-bg'
                        : 'bg-monitor-panel text-monitor-text/50 border border-monitor-border'
                    }`}
                >
                  {isCompleted ? '✓' : screen}
                </div>
                <span className={`text-[10px] mt-1 ${isActive ? 'text-vital-cyan font-semibold' : 'text-monitor-text/40'}`}>
                  {SCREEN_LABELS[screen]}
                </span>
              </div>
              {i < screens.length - 1 && (
                <div className={`w-6 sm:w-10 h-0.5 mx-1 ${isCompleted ? 'bg-vital-green' : 'bg-monitor-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

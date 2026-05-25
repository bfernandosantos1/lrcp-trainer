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
    <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {screens.map((screen, i) => {
          const isActive = screen === currentScreen;
          const isCompleted = screen < currentScreen;
          const isCore = screen === 3;

          return (
            <div key={screen} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${isActive
                      ? isCore
                        ? 'bg-amber-500 text-white ring-2 ring-amber-400/50 pulse-glow'
                        : 'bg-blue-500 text-white ring-2 ring-blue-400/50'
                      : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                >
                  {isCompleted ? '✓' : screen}
                </div>
                <span className={`text-[10px] mt-1 ${isActive ? 'text-blue-300 font-semibold' : 'text-slate-500'}`}>
                  {SCREEN_LABELS[screen]}
                </span>
              </div>
              {i < screens.length - 1 && (
                <div className={`w-6 sm:w-10 h-0.5 mx-1 ${isCompleted ? 'bg-green-600' : 'bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

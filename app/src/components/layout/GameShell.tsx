import { useState, useEffect, useCallback } from 'react';
import { Header } from './Header';
import { ProgressStepper } from './ProgressStepper';
import { useGameStore } from '../../store/gameStore';
import { Screen1Presentation } from '../screens/Screen1Presentation';
import { Screen2Workup } from '../screens/Screen2Workup';
import { Screen3IOC } from '../screens/Screen3IOC';
import { Screen4Equipment } from '../screens/Screen4Equipment';
import { Screen5Intervention } from '../screens/Screen5Intervention';
import { Screen6Postop } from '../screens/Screen6Postop';
import { Screen7Debrief } from '../screens/Screen7Debrief';
import { LoadingScreen } from '../screens/LoadingScreen';
import { AlgorithmReference } from '../reference/AlgorithmReference';

export function GameShell() {
  const currentScreen = useGameStore(s => s.game.currentScreen);
  const activeCase = useGameStore(s => s.game.activeCase);
  const showAlgorithmRef = useGameStore(s => s.game.showAlgorithmRef);
  const toggleAlgorithmRef = useGameStore(s => s.toggleAlgorithmRef);

  const [showLoading, setShowLoading] = useState(true);
  const [loadingCaseId, setLoadingCaseId] = useState<string | null>(null);

  // Show loading screen when a new case is loaded
  useEffect(() => {
    if (activeCase && activeCase.id !== loadingCaseId) {
      setShowLoading(true);
      setLoadingCaseId(activeCase.id);
    }
  }, [activeCase, loadingCaseId]);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  if (!activeCase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-monitor-bg">
        <p className="text-monitor-text/60">No active case. Return to home to start.</p>
      </div>
    );
  }

  const renderScreen = () => {
    if (showLoading && currentScreen === 1) {
      return <LoadingScreen onComplete={handleLoadingComplete} />;
    }
    switch (currentScreen) {
      case 1: return <Screen1Presentation />;
      case 2: return <Screen2Workup />;
      case 3: return <Screen3IOC />;
      case 4: return <Screen4Equipment />;
      case 5: return <Screen5Intervention />;
      case 6: return <Screen6Postop />;
      case 7: return <Screen7Debrief />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-monitor-bg relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 monitor-scanlines z-[1] pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <ProgressStepper currentScreen={currentScreen} />

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          <div className="fade-in" key={showLoading ? 'loading' : currentScreen}>
            {renderScreen()}
          </div>
        </main>

        {/* Floating algorithm reference button */}
        {!showLoading && currentScreen >= 3 && currentScreen <= 5 && (
          <button
            onClick={toggleAlgorithmRef}
            className="fixed bottom-6 right-6 bg-vital-cyan/80 hover:bg-vital-cyan text-monitor-bg rounded-full p-3 shadow-lg z-40 transition-colors pulse-glow"
            title="LRCP Algorithm Reference"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        )}

        {showAlgorithmRef && (
          <AlgorithmReference onClose={toggleAlgorithmRef} />
        )}
      </div>
    </div>
  );
}

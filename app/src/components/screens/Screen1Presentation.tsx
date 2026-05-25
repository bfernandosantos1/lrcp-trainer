import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PatientCard } from '../shared/PatientCard';
import { PRESENTATION_LABELS } from '../../types/case';

export function Screen1Presentation() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const setDecisions = useGameStore(s => s.setScreen1Decisions);
  const advanceScreen = useGameStore(s => s.advanceScreen);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const allOptions = [...activeCase.screen1.correct, ...activeCase.screen1.distractors];
  // Shuffle deterministically based on case ID
  const shuffled = [...allOptions].sort((a, b) => {
    const hashA = a.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const hashB = b.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return hashA - hashB;
  });

  const toggleOption = (option: string) => {
    if (submitted) return;
    setSelected(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    setDecisions(selected);
    setSubmitted(true);
  };

  const handleContinue = () => {
    advanceScreen();
  };

  const isCorrect = (option: string) => activeCase.screen1.correct.includes(option);

  return (
    <div className="space-y-6">
      {/* Setting Banner */}
      <div className="bg-gradient-to-r from-vital-cyan/10 to-monitor-panel rounded-lg p-4 border border-vital-cyan/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {activeCase.demographics.presentation === 'ed_consult' ? '🏥' :
             activeCase.demographics.presentation === 'on_call_phone' ? '📱' : '🏢'}
          </span>
          <div>
            <h2 className="text-lg font-bold text-monitor-bright">
              {PRESENTATION_LABELS[activeCase.demographics.presentation]}
            </h2>
            <p className="text-sm text-monitor-text/50">New Consultation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Info */}
        <PatientCard
          demographics={activeCase.demographics}
          vitals={activeCase.vitals}
        />

        {/* Decision Panel */}
        <div className="monitor-panel p-4">
          <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider mb-3 font-clinical">
            What is your initial management plan?
          </h3>
          <p className="text-xs text-monitor-text/50 mb-4">Select all that apply</p>

          <div className="space-y-2">
            {shuffled.map(option => {
              const isSelected = selected.includes(option);
              const correct = isCorrect(option);

              let bgClass = 'bg-monitor-bg hover:bg-monitor-border/30 border-monitor-border';
              if (submitted) {
                if (correct && isSelected) bgClass = 'bg-vital-green/15 border-vital-green';
                else if (correct && !isSelected) bgClass = 'bg-vital-green/5 border-vital-green/30';
                else if (!correct && isSelected) bgClass = 'bg-vital-red/15 border-vital-red';
                else bgClass = 'bg-monitor-bg/30 border-monitor-border/30';
              } else if (isSelected) {
                bgClass = 'bg-vital-cyan/15 border-vital-cyan';
              }

              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${bgClass}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs
                      ${isSelected ? 'bg-vital-cyan border-vital-cyan text-monitor-bg' : 'border-monitor-text/30'}`}>
                      {isSelected && '✓'}
                    </div>
                    <span className={submitted && correct ? 'text-vital-green vital-glow-green' : 'text-monitor-bright'}>
                      {option}
                    </span>
                  </div>
                  {submitted && correct && isSelected && (
                    <span className="text-xs text-vital-green ml-6">Correct</span>
                  )}
                  {submitted && !correct && isSelected && (
                    <span className="text-xs text-vital-red ml-6">Incorrect</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className="mt-4 p-3 bg-monitor-bg rounded-lg border border-monitor-border/50 slide-in">
              <h4 className="text-xs font-semibold text-vital-amber vital-glow-amber mb-1">Explanation</h4>
              <p className="text-xs text-monitor-text leading-relaxed">{activeCase.screen1.explanation}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected.length === 0}
                className="bg-vital-cyan hover:bg-vital-cyan/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Continue to Workup →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

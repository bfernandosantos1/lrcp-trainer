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
      <div className="bg-gradient-to-r from-blue-900/50 to-slate-800/50 rounded-lg p-4 border border-blue-800/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {activeCase.demographics.presentation === 'ed_consult' ? '🏥' :
             activeCase.demographics.presentation === 'on_call_phone' ? '📱' : '🏢'}
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {PRESENTATION_LABELS[activeCase.demographics.presentation]}
            </h2>
            <p className="text-sm text-slate-400">{activeCase.title}</p>
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
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
            What is your initial management plan?
          </h3>
          <p className="text-xs text-slate-400 mb-4">Select all that apply</p>

          <div className="space-y-2">
            {shuffled.map(option => {
              const isSelected = selected.includes(option);
              const correct = isCorrect(option);

              let bgClass = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600';
              if (submitted) {
                if (correct && isSelected) bgClass = 'bg-green-900/40 border-green-600';
                else if (correct && !isSelected) bgClass = 'bg-green-900/20 border-green-700/50';
                else if (!correct && isSelected) bgClass = 'bg-red-900/40 border-red-600';
                else bgClass = 'bg-slate-700/30 border-slate-600/30';
              } else if (isSelected) {
                bgClass = 'bg-blue-900/40 border-blue-500';
              }

              return (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${bgClass}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs
                      ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-500'}`}>
                      {isSelected && '✓'}
                    </div>
                    <span className={submitted && correct ? 'text-green-300' : 'text-slate-200'}>
                      {option}
                    </span>
                  </div>
                  {submitted && correct && isSelected && (
                    <span className="text-xs text-green-400 ml-6">Correct</span>
                  )}
                  {submitted && !correct && isSelected && (
                    <span className="text-xs text-red-400 ml-6">Incorrect</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {submitted && (
            <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 slide-in">
              <h4 className="text-xs font-semibold text-amber-400 mb-1">Explanation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{activeCase.screen1.explanation}</p>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selected.length === 0}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
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

import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export function Screen5Intervention() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const complication = useGameStore(s => s.game.complicationTriggered);
  const triggerComplication = useGameStore(s => s.triggerComplication);
  const setDecisions = useGameStore(s => s.setScreen5Decisions);
  const advanceScreen = useGameStore(s => s.advanceScreen);

  const [visibleSteps, setVisibleSteps] = useState(0);
  const [complicationShown, setComplicationShown] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const narrative = activeCase.interventionNarrative;
  const hasComplication = activeCase.complications.length > 0;
  const complicationStep = hasComplication ? Math.floor(narrative.length * 0.6) : narrative.length;

  // Progressive reveal of narrative steps
  useEffect(() => {
    if (visibleSteps < narrative.length) {
      if (hasComplication && visibleSteps === complicationStep && !complicationShown) {
        // Pause here for complication
        return;
      }
      if (complicationShown && !submitted) {
        // Wait for complication response
        return;
      }
      const timer = setTimeout(() => {
        setVisibleSteps(v => v + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, narrative.length, complicationStep, hasComplication, complicationShown, submitted]);

  // Trigger complication when we reach the complication step
  useEffect(() => {
    if (hasComplication && visibleSteps === complicationStep && !complicationShown) {
      const timer = setTimeout(() => {
        triggerComplication(activeCase.complications[0]);
        setComplicationShown(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps, complicationStep, hasComplication, complicationShown, triggerComplication, activeCase.complications]);

  const handleComplicationResponse = () => {
    setDecisions([selectedResponse]);
    setSubmitted(true);
    // Resume narrative
    setTimeout(() => {
      setVisibleSteps(v => v + 1);
    }, 1000);
  };

  const handleContinue = () => {
    if (!hasComplication) {
      setDecisions(['no_complication']);
    }
    advanceScreen();
  };

  const comp = activeCase.complications[0];
  const allResponses = comp
    ? [...comp.correctResponses, ...comp.incorrectResponses].sort()
    : [];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <h2 className="text-lg font-bold text-slate-100">Procedure in Progress</h2>
        <p className="text-sm text-slate-400">Follow the progress of your intervention.</p>
      </div>

      {/* Narrative Steps */}
      <div className="bg-slate-800 rounded-lg p-4 space-y-3">
        {narrative.slice(0, visibleSteps).map((step, i) => (
          <div key={i} className="flex gap-3 slide-in">
            <div className="w-6 h-6 rounded-full bg-green-800 text-green-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
          </div>
        ))}

        {visibleSteps < narrative.length && !complicationShown && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            Procedure in progress...
          </div>
        )}
      </div>

      {/* Complication Alert */}
      {complicationShown && comp && !submitted && (
        <div className="bg-red-900/30 border border-red-600 rounded-lg p-4 slide-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <h3 className="text-sm font-bold text-red-400 uppercase">Complication</h3>
          </div>
          <p className="text-sm text-red-200 mb-4">{comp.narrative}</p>

          <h4 className="text-xs font-semibold text-slate-300 mb-2">How do you respond?</h4>
          <div className="space-y-2">
            {allResponses.map(response => (
              <button
                key={response}
                onClick={() => setSelectedResponse(response)}
                className={`w-full text-left p-2.5 rounded-lg border text-sm transition-colors
                  ${selectedResponse === response
                    ? 'bg-blue-900/40 border-blue-500 text-blue-200'
                    : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
              >
                {response}
              </button>
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleComplicationResponse}
              disabled={!selectedResponse}
              className="bg-red-600 hover:bg-red-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Respond
            </button>
          </div>
        </div>
      )}

      {/* Complication Feedback */}
      {submitted && comp && (
        <div className={`rounded-lg p-4 border slide-in ${
          comp.correctResponses.includes(selectedResponse)
            ? 'bg-green-900/20 border-green-600'
            : 'bg-red-900/20 border-red-600'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {comp.correctResponses.includes(selectedResponse) ? (
              <span className="text-green-400 font-semibold text-sm">Correct response!</span>
            ) : (
              <span className="text-red-400 font-semibold text-sm">Suboptimal response</span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Best responses: {comp.correctResponses.join('; ')}
          </p>
        </div>
      )}

      {/* Continue button */}
      {visibleSteps >= narrative.length && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Postop Management →
          </button>
        </div>
      )}
    </div>
  );
}

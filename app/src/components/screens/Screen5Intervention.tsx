import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';

export function Screen5Intervention() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
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
        return;
      }
      if (complicationShown && !submitted) {
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
      <div className="bg-gradient-to-r from-vital-green/10 to-monitor-panel rounded-lg p-4 border border-vital-green/20">
        <h2 className="text-lg font-bold text-monitor-bright">Procedure in Progress</h2>
        <p className="text-sm text-monitor-text/50">Follow the progress of your intervention.</p>
      </div>

      {/* Narrative Steps */}
      <div className="monitor-panel p-4 space-y-3">
        {narrative.slice(0, visibleSteps).map((step, i) => (
          <div key={i} className="flex gap-3 slide-in">
            <div className="w-6 h-6 rounded-full bg-vital-green/20 text-vital-green flex items-center justify-center text-xs font-bold font-clinical shrink-0 mt-0.5 border border-vital-green/30">
              {i + 1}
            </div>
            <p className="text-sm text-monitor-text leading-relaxed">{step}</p>
          </div>
        ))}

        {visibleSteps < narrative.length && !complicationShown && (
          <div className="flex items-center gap-2 text-monitor-text/40 text-sm">
            <div className="w-4 h-4 border-2 border-vital-cyan border-t-transparent rounded-full animate-spin" />
            Procedure in progress...
          </div>
        )}
      </div>

      {/* Complication Alert */}
      {complicationShown && comp && !submitted && (
        <div className="bg-vital-red/10 border border-vital-red rounded-lg p-4 slide-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl blink">⚠️</span>
            <h3 className="text-sm font-bold text-vital-red vital-glow-red uppercase font-clinical">Complication</h3>
          </div>
          <p className="text-sm text-vital-red/80 mb-4">{comp.narrative}</p>

          <h4 className="text-xs font-semibold text-monitor-text mb-2">How do you respond?</h4>
          <div className="space-y-2">
            {allResponses.map(response => (
              <button
                key={response}
                onClick={() => setSelectedResponse(response)}
                className={`w-full text-left p-2.5 rounded-lg border text-sm transition-colors
                  ${selectedResponse === response
                    ? 'bg-vital-cyan/15 border-vital-cyan text-vital-cyan'
                    : 'bg-monitor-bg border-monitor-border text-monitor-text hover:bg-monitor-border/30'
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
              className="bg-vital-red hover:bg-vital-red/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
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
            ? 'bg-vital-green/10 border-vital-green'
            : 'bg-vital-red/10 border-vital-red'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {comp.correctResponses.includes(selectedResponse) ? (
              <span className="text-vital-green vital-glow-green font-semibold text-sm">Correct response!</span>
            ) : (
              <span className="text-vital-red vital-glow-red font-semibold text-sm">Suboptimal response</span>
            )}
          </div>
          <p className="text-xs text-monitor-text/60">
            Best responses: {comp.correctResponses.join('; ')}
          </p>
        </div>
      )}

      {/* Continue button */}
      {visibleSteps >= narrative.length && (
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Postop Management →
          </button>
        </div>
      )}
    </div>
  );
}

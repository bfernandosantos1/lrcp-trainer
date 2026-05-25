import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

const LAB_OPTIONS = ['CBC', 'CMP with LFTs', 'Lipase', 'Amylase', 'Coagulation panel', 'Blood cultures', 'Lactic acid'];
const DIET_OPTIONS = ['NPO', 'Clear liquids, advance as tolerated', 'Regular diet as tolerated'];
const ACTIVITY_OPTIONS = ['Bedrest', 'Ambulate', 'Activity as tolerated'];
const DISPOSITION_OPTIONS = ['Discharge same day', 'Admit overnight', 'Extended observation (48-72h)', 'ICU admission'];
const ADDITIONAL_OPTIONS = ['IV fluids', 'Pain management', 'Antibiotics if signs of cholangitis', 'Drain output monitoring', 'VTE prophylaxis', 'Monitor lipase trend', 'Schedule follow-up ERCP', 'Surgical drain placement'];

export function Screen6Postop() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const setOrders = useGameStore(s => s.setScreen6Orders);
  const advanceScreen = useGameStore(s => s.advanceScreen);

  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedDisposition, setSelectedDisposition] = useState('');
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const correct = activeCase.correctPostopOrders;

  const toggleLab = (lab: string) => {
    setSelectedLabs(prev => prev.includes(lab) ? prev.filter(l => l !== lab) : [...prev, lab]);
  };

  const toggleAdditional = (order: string) => {
    setSelectedAdditional(prev => prev.includes(order) ? prev.filter(o => o !== order) : [...prev, order]);
  };

  const handleSubmit = () => {
    setOrders({
      labs: selectedLabs,
      diet: selectedDiet,
      activity: selectedActivity,
      disposition: selectedDisposition,
      additionalOrders: selectedAdditional,
    });
    setSubmitted(true);
  };

  const isComplete = selectedLabs.length > 0 && selectedDiet && selectedActivity && selectedDisposition;

  const checkboxClass = (isSelected: boolean, isCorrectOption: boolean, wasSubmitted: boolean) => {
    if (wasSubmitted) {
      if (isCorrectOption && isSelected) return 'bg-vital-green/15 border-vital-green';
      if (isCorrectOption && !isSelected) return 'bg-vital-amber/10 border-vital-amber/50';
      if (!isCorrectOption && isSelected) return 'bg-vital-red/10 border-vital-red';
      return 'bg-monitor-bg border-monitor-border';
    }
    if (isSelected) return 'bg-vital-cyan/15 border-vital-cyan';
    return 'bg-monitor-bg hover:bg-monitor-border/30 border-monitor-border';
  };

  const radioClass = (isSelected: boolean, isCorrectOption: boolean, wasSubmitted: boolean) => {
    if (wasSubmitted) {
      if (isCorrectOption) return 'bg-vital-green/15 border-vital-green';
      if (isSelected) return 'bg-vital-red/10 border-vital-red';
      return 'bg-monitor-bg border-monitor-border';
    }
    if (isSelected) return 'bg-vital-cyan/15 border-vital-cyan';
    return 'bg-monitor-bg hover:bg-monitor-border/30 border-monitor-border';
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-vital-blue/10 to-monitor-panel rounded-lg p-4 border border-vital-blue/20">
        <h2 className="text-lg font-bold text-monitor-bright">Postoperative Management</h2>
        <p className="text-sm text-monitor-text/50">Write your postoperative orders for this patient.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AM Labs */}
        <div className="monitor-panel p-4">
          <h3 className="text-xs font-semibold text-vital-cyan uppercase tracking-wider mb-2 font-clinical">AM Laboratory Orders</h3>
          <div className="space-y-1.5">
            {LAB_OPTIONS.map(lab => (
              <button
                key={lab}
                onClick={() => !submitted && toggleLab(lab)}
                disabled={submitted}
                className={`w-full text-left p-2 rounded border text-sm transition-colors flex items-center gap-2 text-monitor-bright ${checkboxClass(selectedLabs.includes(lab), correct.labs.includes(lab), submitted)}`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${selectedLabs.includes(lab) ? 'bg-vital-cyan border-vital-cyan text-monitor-bg' : 'border-monitor-text/30'}`}>
                  {selectedLabs.includes(lab) && '✓'}
                </div>
                {lab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Diet */}
          <div className="monitor-panel p-4">
            <h3 className="text-xs font-semibold text-vital-cyan uppercase tracking-wider mb-2 font-clinical">Diet</h3>
            <div className="space-y-1.5">
              {DIET_OPTIONS.map(diet => (
                <button
                  key={diet}
                  onClick={() => !submitted && setSelectedDiet(diet)}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-sm transition-colors text-monitor-bright ${radioClass(selectedDiet === diet, correct.diet === diet, submitted)}`}
                >
                  {diet}
                </button>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="monitor-panel p-4">
            <h3 className="text-xs font-semibold text-vital-cyan uppercase tracking-wider mb-2 font-clinical">Activity</h3>
            <div className="space-y-1.5">
              {ACTIVITY_OPTIONS.map(act => (
                <button
                  key={act}
                  onClick={() => !submitted && setSelectedActivity(act)}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-sm transition-colors text-monitor-bright ${radioClass(selectedActivity === act, correct.activity === act, submitted)}`}
                >
                  {act}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disposition */}
      <div className="monitor-panel p-4">
        <h3 className="text-xs font-semibold text-vital-cyan uppercase tracking-wider mb-2 font-clinical">Disposition</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {DISPOSITION_OPTIONS.map(disp => (
            <button
              key={disp}
              onClick={() => !submitted && setSelectedDisposition(disp)}
              disabled={submitted}
              className={`text-left p-2 rounded border text-sm transition-colors text-monitor-bright ${radioClass(selectedDisposition === disp, correct.disposition === disp, submitted)}`}
            >
              {disp}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Orders */}
      <div className="monitor-panel p-4">
        <h3 className="text-xs font-semibold text-vital-cyan uppercase tracking-wider mb-2 font-clinical">Additional Orders</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {ADDITIONAL_OPTIONS.map(order => (
            <button
              key={order}
              onClick={() => !submitted && toggleAdditional(order)}
              disabled={submitted}
              className={`text-left p-2 rounded border text-sm transition-colors flex items-center gap-2 text-monitor-bright ${checkboxClass(selectedAdditional.includes(order), correct.additionalOrders.includes(order), submitted)}`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${selectedAdditional.includes(order) ? 'bg-vital-cyan border-vital-cyan text-monitor-bg' : 'border-monitor-text/30'}`}>
                {selectedAdditional.includes(order) && '✓'}
              </div>
              {order}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="bg-vital-cyan hover:bg-vital-cyan/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit Orders
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Debrief →
          </button>
        )}
      </div>
    </div>
  );
}

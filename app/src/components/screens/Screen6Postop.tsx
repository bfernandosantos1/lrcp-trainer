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

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <h2 className="text-lg font-bold text-slate-100">Postoperative Management</h2>
        <p className="text-sm text-slate-400">Write your postoperative orders for this patient.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AM Labs */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">AM Laboratory Orders</h3>
          <div className="space-y-1.5">
            {LAB_OPTIONS.map(lab => {
              const isSelected = selectedLabs.includes(lab);
              const isCorrectOption = correct.labs.includes(lab);
              let cls = 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
              if (submitted) {
                if (isCorrectOption && isSelected) cls = 'bg-green-900/40 border-green-600';
                else if (isCorrectOption && !isSelected) cls = 'bg-amber-900/20 border-amber-600/50';
                else if (!isCorrectOption && isSelected) cls = 'bg-red-900/30 border-red-600';
              } else if (isSelected) cls = 'bg-blue-900/40 border-blue-500';

              return (
                <button
                  key={lab}
                  onClick={() => !submitted && toggleLab(lab)}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-sm transition-colors flex items-center gap-2 ${cls}`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-500'}`}>
                    {isSelected && '✓'}
                  </div>
                  {lab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Diet */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Diet</h3>
            <div className="space-y-1.5">
              {DIET_OPTIONS.map(diet => {
                const isSelected = selectedDiet === diet;
                const isCorrectOption = correct.diet === diet;
                let cls = 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
                if (submitted) {
                  if (isCorrectOption) cls = 'bg-green-900/40 border-green-600';
                  else if (isSelected) cls = 'bg-red-900/30 border-red-600';
                } else if (isSelected) cls = 'bg-blue-900/40 border-blue-500';

                return (
                  <button
                    key={diet}
                    onClick={() => !submitted && setSelectedDiet(diet)}
                    disabled={submitted}
                    className={`w-full text-left p-2 rounded border text-sm transition-colors ${cls}`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Activity</h3>
            <div className="space-y-1.5">
              {ACTIVITY_OPTIONS.map(act => {
                const isSelected = selectedActivity === act;
                const isCorrectOption = correct.activity === act;
                let cls = 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
                if (submitted) {
                  if (isCorrectOption) cls = 'bg-green-900/40 border-green-600';
                  else if (isSelected) cls = 'bg-red-900/30 border-red-600';
                } else if (isSelected) cls = 'bg-blue-900/40 border-blue-500';

                return (
                  <button
                    key={act}
                    onClick={() => !submitted && setSelectedActivity(act)}
                    disabled={submitted}
                    className={`w-full text-left p-2 rounded border text-sm transition-colors ${cls}`}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Disposition */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Disposition</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {DISPOSITION_OPTIONS.map(disp => {
            const isSelected = selectedDisposition === disp;
            const isCorrectOption = correct.disposition === disp;
            let cls = 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
            if (submitted) {
              if (isCorrectOption) cls = 'bg-green-900/40 border-green-600';
              else if (isSelected) cls = 'bg-red-900/30 border-red-600';
            } else if (isSelected) cls = 'bg-blue-900/40 border-blue-500';

            return (
              <button
                key={disp}
                onClick={() => !submitted && setSelectedDisposition(disp)}
                disabled={submitted}
                className={`text-left p-2 rounded border text-sm transition-colors ${cls}`}
              >
                {disp}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Orders */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Additional Orders</h3>
        <div className="grid grid-cols-2 gap-1.5">
          {ADDITIONAL_OPTIONS.map(order => {
            const isSelected = selectedAdditional.includes(order);
            const isCorrectOption = correct.additionalOrders.includes(order);
            let cls = 'bg-slate-700/50 border-slate-600 hover:bg-slate-700';
            if (submitted) {
              if (isCorrectOption && isSelected) cls = 'bg-green-900/40 border-green-600';
              else if (isCorrectOption && !isSelected) cls = 'bg-amber-900/20 border-amber-600/50';
              else if (!isCorrectOption && isSelected) cls = 'bg-red-900/30 border-red-600';
            } else if (isSelected) cls = 'bg-blue-900/40 border-blue-500';

            return (
              <button
                key={order}
                onClick={() => !submitted && toggleAdditional(order)}
                disabled={submitted}
                className={`text-left p-2 rounded border text-sm transition-colors flex items-center gap-2 ${cls}`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-500'}`}>
                  {isSelected && '✓'}
                </div>
                {order}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit Orders
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Debrief →
          </button>
        )}
      </div>
    </div>
  );
}

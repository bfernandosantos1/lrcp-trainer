import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { LabPanel } from '../shared/LabPanel';
import { ImageViewer } from '../shared/ImageViewer';

export function Screen2Workup() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const setNextStep = useGameStore(s => s.setScreen2NextStep);
  const advanceScreen = useGameStore(s => s.advanceScreen);
  const [selectedTab, setSelectedTab] = useState<'labs' | 'imaging'>('labs');
  const [selectedOption, setSelectedOption] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setNextStep(selectedOption);
    setSubmitted(true);
  };

  const isCorrect = selectedOption === activeCase.screen2.correctNextStep;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <h2 className="text-lg font-bold text-slate-100">Workup Results</h2>
        <p className="text-sm text-slate-400">Review the laboratory and imaging results below.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
        {['labs', 'imaging'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as 'labs' | 'imaging')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize
              ${selectedTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'labs' && <LabPanel labs={activeCase.labs} />}

      {selectedTab === 'imaging' && (
        <div className="bg-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Imaging Results</h3>

          {activeCase.imaging.ruqUltrasound && (
            <div className="bg-slate-700/50 rounded p-3">
              <h4 className="text-xs font-semibold text-blue-400 mb-1">RUQ Ultrasound</h4>
              <p className="text-sm text-slate-300">{activeCase.imaging.ruqUltrasound}</p>
            </div>
          )}

          {activeCase.imaging.ct && (
            <div className="space-y-3">
              <div className="bg-slate-700/50 rounded p-3">
                <h4 className="text-xs font-semibold text-blue-400 mb-1">CT Abdomen/Pelvis</h4>
                <p className="text-sm text-slate-300">{activeCase.imaging.ct.description}</p>
              </div>
              {activeCase.imaging.ct.imagePath && (
                <ImageViewer
                  src={activeCase.imaging.ct.imagePath}
                  alt="CT scan"
                  className="h-80"
                />
              )}
            </div>
          )}

          {activeCase.imaging.mrcp && (
            <div className="bg-slate-700/50 rounded p-3">
              <h4 className="text-xs font-semibold text-blue-400 mb-1">MRCP</h4>
              <p className="text-sm text-slate-300">{activeCase.imaging.mrcp}</p>
            </div>
          )}
        </div>
      )}

      {/* Key Findings Summary */}
      {submitted && (
        <div className="bg-slate-800 rounded-lg p-4 slide-in">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Key Findings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <h4 className="text-xs text-slate-400 mb-1">Abnormal Labs</h4>
              <ul className="space-y-1">
                {activeCase.screen2.abnormalLabs.map(lab => (
                  <li key={lab} className="text-xs text-red-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    {lab}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs text-slate-400 mb-1">Imaging Findings</h4>
              <ul className="space-y-1">
                {activeCase.screen2.imagingFindings.map(finding => (
                  <li key={finding} className="text-xs text-blue-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Decision */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          What is your next step?
        </h3>
        <div className="space-y-2">
          {activeCase.screen2.options.map(option => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === activeCase.screen2.correctNextStep;

            let bgClass = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600';
            if (submitted) {
              if (isCorrectOption) bgClass = 'bg-green-900/40 border-green-600';
              else if (isSelected && !isCorrectOption) bgClass = 'bg-red-900/40 border-red-600';
              else bgClass = 'bg-slate-700/30 border-slate-600/30';
            } else if (isSelected) {
              bgClass = 'bg-blue-900/40 border-blue-500';
            }

            return (
              <button
                key={option}
                onClick={() => !submitted && setSelectedOption(option)}
                className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${bgClass}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-slate-500'}`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-slate-200">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 slide-in">
            <h4 className="text-xs font-semibold text-amber-400 mb-1">Explanation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{activeCase.screen2.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={advanceScreen}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Continue to OR →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

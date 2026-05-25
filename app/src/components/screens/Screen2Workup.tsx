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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-vital-blue/10 to-monitor-panel rounded-lg p-4 border border-vital-blue/20">
        <h2 className="text-lg font-bold text-monitor-bright">Workup Results</h2>
        <p className="text-sm text-monitor-text/50">Review the laboratory and imaging results below.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 monitor-panel p-1">
        {['labs', 'imaging'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as 'labs' | 'imaging')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize
              ${selectedTab === tab ? 'bg-vital-cyan text-monitor-bg' : 'text-monitor-text/50 hover:text-monitor-bright'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'labs' && <LabPanel labs={activeCase.labs} />}

      {selectedTab === 'imaging' && (
        <div className="monitor-panel p-4 space-y-4">
          <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider font-clinical">Imaging Results</h3>

          {activeCase.imaging.ruqUltrasound && (
            <div className="bg-monitor-bg rounded p-3 border border-monitor-border/50">
              <h4 className="text-xs font-semibold text-vital-cyan mb-1">RUQ Ultrasound</h4>
              <p className="text-sm text-monitor-text">{activeCase.imaging.ruqUltrasound}</p>
            </div>
          )}

          {activeCase.imaging.ct && (
            <div className="space-y-3">
              <div className="bg-monitor-bg rounded p-3 border border-monitor-border/50">
                <h4 className="text-xs font-semibold text-vital-cyan mb-1">CT Abdomen/Pelvis</h4>
                <p className="text-sm text-monitor-text">{activeCase.imaging.ct.description}</p>
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
            <div className="bg-monitor-bg rounded p-3 border border-monitor-border/50">
              <h4 className="text-xs font-semibold text-vital-cyan mb-1">MRCP</h4>
              <p className="text-sm text-monitor-text">{activeCase.imaging.mrcp}</p>
            </div>
          )}
        </div>
      )}

      {/* Key Findings Summary */}
      {submitted && (
        <div className="monitor-panel p-4 slide-in">
          <h3 className="text-xs font-semibold text-vital-amber vital-glow-amber uppercase tracking-wider mb-2 font-clinical">Key Findings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <h4 className="text-xs text-monitor-text/50 mb-1">Abnormal Labs</h4>
              <ul className="space-y-1">
                {activeCase.screen2.abnormalLabs.map(lab => (
                  <li key={lab} className="text-xs text-vital-red flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-vital-red rounded-full" />
                    {lab}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs text-monitor-text/50 mb-1">Imaging Findings</h4>
              <ul className="space-y-1">
                {activeCase.screen2.imagingFindings.map(finding => (
                  <li key={finding} className="text-xs text-vital-cyan flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-vital-cyan rounded-full" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Decision */}
      <div className="monitor-panel p-4">
        <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider mb-3 font-clinical">
          What is your next step?
        </h3>
        <div className="space-y-2">
          {activeCase.screen2.options.map(option => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === activeCase.screen2.correctNextStep;

            let bgClass = 'bg-monitor-bg hover:bg-monitor-border/30 border-monitor-border';
            if (submitted) {
              if (isCorrectOption) bgClass = 'bg-vital-green/15 border-vital-green';
              else if (isSelected && !isCorrectOption) bgClass = 'bg-vital-red/15 border-vital-red';
              else bgClass = 'bg-monitor-bg/30 border-monitor-border/30';
            } else if (isSelected) {
              bgClass = 'bg-vital-cyan/15 border-vital-cyan';
            }

            return (
              <button
                key={option}
                onClick={() => !submitted && setSelectedOption(option)}
                className={`w-full text-left p-3 rounded-lg border transition-colors text-sm ${bgClass}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${isSelected ? 'bg-vital-cyan border-vital-cyan' : 'border-monitor-text/30'}`}>
                    {isSelected && <div className="w-2 h-2 bg-monitor-bg rounded-full" />}
                  </div>
                  <span className="text-monitor-bright">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div className="mt-4 p-3 bg-monitor-bg rounded-lg border border-monitor-border/50 slide-in">
            <h4 className="text-xs font-semibold text-vital-amber vital-glow-amber mb-1">Explanation</h4>
            <p className="text-xs text-monitor-text leading-relaxed">{activeCase.screen2.explanation}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="bg-vital-cyan hover:bg-vital-cyan/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={advanceScreen}
              className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
            >
              Continue to OR →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

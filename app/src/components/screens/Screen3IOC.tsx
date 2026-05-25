import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ImageViewer } from '../shared/ImageViewer';
import {
  TECHNIQUE_LABELS,
  STONE_BURDEN_LABELS,
  CLEARANCE_METHOD_LABELS,
  type CysticDuctSize,
  type StoneBurden,
  type Technique,
  type PrimaryClearanceMethod,
} from '../../types/algorithm';
import { getAvailableMethods, validateIOCInterpretation } from '../../engine/algorithmValidator';

export function Screen3IOC() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const choices = useGameStore(s => s.game.playerChoices.screen3);
  const setCysticDuct = useGameStore(s => s.setScreen3CysticDuct);
  const setCbdDiameter = useGameStore(s => s.setScreen3CbdDiameter);
  const setStoneBurden = useGameStore(s => s.setScreen3StoneBurden);
  const setTechnique = useGameStore(s => s.setScreen3Technique);
  const setMethod = useGameStore(s => s.setScreen3Method);
  const advanceScreen = useGameStore(s => s.advanceScreen);

  const [submitted, setSubmitted] = useState(false);
  const [cbdInput, setCbdInput] = useState('');

  const handleSubmit = () => {
    if (cbdInput) {
      setCbdDiameter(parseFloat(cbdInput));
    }
    setSubmitted(true);
  };

  const validation = submitted ? validateIOCInterpretation(
    { ...choices, cbdDiameter: cbdInput ? parseFloat(cbdInput) : choices.cbdDiameter },
    activeCase
  ) : null;

  const availableMethods = choices.selectedTechnique
    ? getAvailableMethods(choices.selectedTechnique)
    : [];

  const cysticDuctOptions: { value: CysticDuctSize; label: string }[] = [
    { value: 'gte4mm', label: '≥ 4mm (adequate for choledochoscope)' },
    { value: 'lt4mm_or_tortuous', label: '< 4mm or tortuous' },
  ];

  const stoneBurdenOptions: { value: StoneBurden; label: string }[] = [
    { value: 'none', label: STONE_BURDEN_LABELS.none },
    { value: 'single_small', label: STONE_BURDEN_LABELS.single_small },
    { value: 'few_small', label: STONE_BURDEN_LABELS.few_small },
    { value: 'multiple_medium', label: STONE_BURDEN_LABELS.multiple_medium },
    { value: 'large', label: STONE_BURDEN_LABELS.large },
  ];

  const isComplete = choices.cysticDuctSize && cbdInput && choices.stoneBurden && choices.selectedTechnique && choices.selectedMethod;

  const optionClass = (isSelected: boolean, isCorrectVal: boolean) => {
    if (submitted) {
      if (isSelected && isCorrectVal) return 'bg-vital-green/15 border-vital-green';
      if (isSelected && !isCorrectVal) return 'bg-vital-red/15 border-vital-red';
      if (!isSelected && isCorrectVal) return 'bg-vital-green/5 border-vital-green/30';
      return 'bg-monitor-bg/30 border-monitor-border/30';
    }
    if (isSelected) return 'bg-vital-cyan/15 border-vital-cyan';
    return 'bg-monitor-bg hover:bg-monitor-border/30 border-monitor-border';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-vital-amber/15 to-monitor-panel rounded-lg p-4 border border-vital-amber/30">
        <h2 className="text-lg font-bold text-vital-amber vital-glow-amber font-clinical">Intraoperative Cholangiogram</h2>
        <p className="text-sm text-monitor-text/50">Interpret the IOC and apply the LRCP algorithm to select the appropriate clearance method.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* IOC Image - takes 3 columns */}
        <div className="lg:col-span-3">
          <ImageViewer
            src={activeCase.ioc.imagePath}
            alt="Intraoperative Cholangiogram"
            className="h-[400px] lg:h-[500px]"
          />
        </div>

        {/* Interpretation Panel - 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cystic Duct Size */}
          <div className="monitor-panel p-3">
            <label className="text-xs font-semibold text-vital-cyan uppercase tracking-wider block mb-2 font-clinical">
              1. Cystic Duct Diameter
              {submitted && (
                <span className={`ml-2 ${validation?.cysticDuctCorrect ? 'text-vital-green vital-glow-green' : 'text-vital-red vital-glow-red'}`}>
                  {validation?.cysticDuctCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              )}
            </label>
            <div className="space-y-1.5">
              {cysticDuctOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => !submitted && setCysticDuct(opt.value)}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors text-monitor-bright
                    ${optionClass(choices.cysticDuctSize === opt.value, opt.value === activeCase.correctAlgorithmPath.cysticDuctSize)}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* CBD Diameter */}
          <div className="monitor-panel p-3">
            <label className="text-xs font-semibold text-vital-cyan uppercase tracking-wider block mb-2 font-clinical">
              2. CBD Diameter (mm)
              {submitted && (
                <span className={`ml-2 ${validation?.cbdDiameterClose ? 'text-vital-green vital-glow-green' : 'text-vital-red vital-glow-red'}`}>
                  {validation?.cbdDiameterClose ? '✓ Close' : `✗ Actual: ${activeCase.ioc.cbdDiameterMm}mm`}
                </span>
              )}
            </label>
            <input
              type="number"
              value={cbdInput}
              onChange={e => setCbdInput(e.target.value)}
              disabled={submitted}
              placeholder="e.g., 8"
              min={1}
              max={30}
              className="w-full bg-monitor-bg border border-monitor-border rounded px-3 py-2 text-sm text-monitor-bright placeholder-monitor-text/30 focus:outline-none focus:border-vital-cyan font-clinical"
            />
          </div>

          {/* Stone Burden */}
          <div className="monitor-panel p-3">
            <label className="text-xs font-semibold text-vital-cyan uppercase tracking-wider block mb-2 font-clinical">
              3. Stone Burden
              {submitted && (
                <span className={`ml-2 ${validation?.stoneBurdenCorrect ? 'text-vital-green vital-glow-green' : 'text-vital-red vital-glow-red'}`}>
                  {validation?.stoneBurdenCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              )}
            </label>
            <div className="space-y-1.5">
              {stoneBurdenOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => !submitted && setStoneBurden(opt.value)}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors text-monitor-bright
                    ${optionClass(choices.stoneBurden === opt.value, opt.value === activeCase.correctAlgorithmPath.stoneBurden)}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Technique */}
          <div className="monitor-panel p-3">
            <label className="text-xs font-semibold text-vital-cyan uppercase tracking-wider block mb-2 font-clinical">
              4. Technique
              {submitted && (
                <span className={`ml-2 ${validation?.techniqueCorrect ? 'text-vital-green vital-glow-green' : 'text-vital-red vital-glow-red'}`}>
                  {validation?.techniqueCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              )}
            </label>
            <div className="space-y-1.5">
              {(['choledochoscope_assisted', 'fluoroscopy_guided'] as Technique[]).map(tech => (
                <button
                  key={tech}
                  onClick={() => {
                    if (submitted) return;
                    setTechnique(tech);
                    setMethod(null as unknown as PrimaryClearanceMethod);
                  }}
                  disabled={submitted}
                  className={`w-full text-left p-2 rounded border text-xs transition-colors text-monitor-bright
                    ${optionClass(choices.selectedTechnique === tech, tech === activeCase.correctAlgorithmPath.technique)}`}
                >
                  {TECHNIQUE_LABELS[tech]}
                </button>
              ))}
            </div>
          </div>

          {/* Clearance Method */}
          {choices.selectedTechnique && (
            <div className="monitor-panel p-3">
              <label className="text-xs font-semibold text-vital-cyan uppercase tracking-wider block mb-2 font-clinical">
                5. Clearance Method
                {submitted && (
                  <span className={`ml-2 ${validation?.methodCorrect ? 'text-vital-green vital-glow-green' : 'text-vital-red vital-glow-red'}`}>
                    {validation?.methodCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                )}
              </label>
              <div className="space-y-1.5">
                {availableMethods.map(method => (
                  <button
                    key={method}
                    onClick={() => !submitted && setMethod(method)}
                    disabled={submitted}
                    className={`w-full text-left p-2 rounded border text-xs transition-colors text-monitor-bright
                      ${optionClass(choices.selectedMethod === method, method === activeCase.correctAlgorithmPath.primaryMethod)}`}
                  >
                    {CLEARANCE_METHOD_LABELS[method]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score and explanation */}
      {submitted && validation && (
        <div className="monitor-panel p-4 border-vital-amber/30 slide-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-vital-amber vital-glow-amber font-clinical">IOC Interpretation Score</h3>
            <span className={`text-2xl font-bold font-clinical ${validation.total >= 80 ? 'text-vital-green vital-glow-green' : validation.total >= 50 ? 'text-vital-amber vital-glow-amber' : 'text-vital-red vital-glow-red'}`}>
              {validation.total}/100
            </span>
          </div>
          <div className="bg-monitor-bg rounded p-3 border border-monitor-border/50">
            <h4 className="text-xs font-semibold text-monitor-text mb-1">IOC Findings</h4>
            <p className="text-xs text-monitor-text/60 leading-relaxed">{activeCase.ioc.description}</p>
          </div>
          <div className="mt-3 bg-monitor-bg rounded p-3 border border-monitor-border/50">
            <h4 className="text-xs font-semibold text-monitor-text mb-1">Correct Algorithm Path</h4>
            <p className="text-xs text-monitor-text/60">
              Cystic duct {activeCase.correctAlgorithmPath.cysticDuctSize === 'gte4mm' ? '≥4mm' : '<4mm/tortuous'} →{' '}
              {TECHNIQUE_LABELS[activeCase.correctAlgorithmPath.technique]} →{' '}
              {STONE_BURDEN_LABELS[activeCase.correctAlgorithmPath.stoneBurden]} →{' '}
              {CLEARANCE_METHOD_LABELS[activeCase.correctAlgorithmPath.primaryMethod]}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="bg-vital-amber hover:bg-vital-amber/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit IOC Interpretation
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Equipment Selection →
          </button>
        )}
      </div>
    </div>
  );
}

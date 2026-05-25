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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900/30 to-slate-800/50 rounded-lg p-4 border border-amber-700/30">
        <h2 className="text-lg font-bold text-amber-400">Intraoperative Cholangiogram</h2>
        <p className="text-sm text-slate-400">Interpret the IOC and apply the LRCP algorithm to select the appropriate clearance method.</p>
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
          <div className="bg-slate-800 rounded-lg p-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              1. Cystic Duct Diameter
              {submitted && (
                <span className={`ml-2 ${validation?.cysticDuctCorrect ? 'text-green-400' : 'text-red-400'}`}>
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
                  className={`w-full text-left p-2 rounded border text-xs transition-colors
                    ${choices.cysticDuctSize === opt.value
                      ? submitted
                        ? opt.value === activeCase.correctAlgorithmPath.cysticDuctSize
                          ? 'bg-green-900/40 border-green-600'
                          : 'bg-red-900/40 border-red-600'
                        : 'bg-blue-900/40 border-blue-500'
                      : submitted && opt.value === activeCase.correctAlgorithmPath.cysticDuctSize
                        ? 'bg-green-900/20 border-green-700/50'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* CBD Diameter */}
          <div className="bg-slate-800 rounded-lg p-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              2. CBD Diameter (mm)
              {submitted && (
                <span className={`ml-2 ${validation?.cbdDiameterClose ? 'text-green-400' : 'text-red-400'}`}>
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
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Stone Burden */}
          <div className="bg-slate-800 rounded-lg p-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              3. Stone Burden
              {submitted && (
                <span className={`ml-2 ${validation?.stoneBurdenCorrect ? 'text-green-400' : 'text-red-400'}`}>
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
                  className={`w-full text-left p-2 rounded border text-xs transition-colors
                    ${choices.stoneBurden === opt.value
                      ? submitted
                        ? opt.value === activeCase.correctAlgorithmPath.stoneBurden
                          ? 'bg-green-900/40 border-green-600'
                          : 'bg-red-900/40 border-red-600'
                        : 'bg-blue-900/40 border-blue-500'
                      : submitted && opt.value === activeCase.correctAlgorithmPath.stoneBurden
                        ? 'bg-green-900/20 border-green-700/50'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Technique */}
          <div className="bg-slate-800 rounded-lg p-3">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              4. Technique
              {submitted && (
                <span className={`ml-2 ${validation?.techniqueCorrect ? 'text-green-400' : 'text-red-400'}`}>
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
                  className={`w-full text-left p-2 rounded border text-xs transition-colors
                    ${choices.selectedTechnique === tech
                      ? submitted
                        ? tech === activeCase.correctAlgorithmPath.technique
                          ? 'bg-green-900/40 border-green-600'
                          : 'bg-red-900/40 border-red-600'
                        : 'bg-blue-900/40 border-blue-500'
                      : submitted && tech === activeCase.correctAlgorithmPath.technique
                        ? 'bg-green-900/20 border-green-700/50'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                    }`}
                >
                  {TECHNIQUE_LABELS[tech]}
                </button>
              ))}
            </div>
          </div>

          {/* Clearance Method */}
          {choices.selectedTechnique && (
            <div className="bg-slate-800 rounded-lg p-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                5. Clearance Method
                {submitted && (
                  <span className={`ml-2 ${validation?.methodCorrect ? 'text-green-400' : 'text-red-400'}`}>
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
                    className={`w-full text-left p-2 rounded border text-xs transition-colors
                      ${choices.selectedMethod === method
                        ? submitted
                          ? method === activeCase.correctAlgorithmPath.primaryMethod
                            ? 'bg-green-900/40 border-green-600'
                            : 'bg-red-900/40 border-red-600'
                          : 'bg-blue-900/40 border-blue-500'
                        : submitted && method === activeCase.correctAlgorithmPath.primaryMethod
                          ? 'bg-green-900/20 border-green-700/50'
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                      }`}
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
        <div className="bg-slate-800 rounded-lg p-4 border border-amber-700/30 slide-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-400">IOC Interpretation Score</h3>
            <span className={`text-2xl font-bold ${validation.total >= 80 ? 'text-green-400' : validation.total >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {validation.total}/100
            </span>
          </div>
          <div className="bg-slate-700/50 rounded p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-1">IOC Findings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{activeCase.ioc.description}</p>
          </div>
          <div className="mt-3 bg-slate-700/50 rounded p-3">
            <h4 className="text-xs font-semibold text-slate-300 mb-1">Correct Algorithm Path</h4>
            <p className="text-xs text-slate-400">
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
            className="bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit IOC Interpretation
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Equipment Selection →
          </button>
        )}
      </div>
    </div>
  );
}

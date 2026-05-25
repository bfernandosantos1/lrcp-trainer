import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { EQUIPMENT_CATALOG } from '../../data/equipment';
import { EQUIPMENT_CATEGORY_LABELS, type EquipmentItem } from '../../types/equipment';

export function Screen4Equipment() {
  const activeCase = useGameStore(s => s.game.activeCase)!;
  const selectedEquipment = useGameStore(s => s.game.playerChoices.screen4.selectedEquipment);
  const toggleEquipment = useGameStore(s => s.toggleScreen4Equipment);
  const advanceScreen = useGameStore(s => s.advanceScreen);

  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(EQUIPMENT_CATALOG.map(e => e.category))];

  const filteredEquipment = filter === 'all'
    ? EQUIPMENT_CATALOG
    : EQUIPMENT_CATALOG.filter(e => e.category === filter);

  const required = new Set(activeCase.requiredEquipment);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const correctCount = selectedEquipment.filter(id => required.has(id)).length;
  const extraCount = selectedEquipment.filter(id => !required.has(id)).length;
  const missedCount = required.size - correctCount;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-4 border border-slate-700/50">
        <h2 className="text-lg font-bold text-slate-100">Equipment Selection</h2>
        <p className="text-sm text-slate-400">
          Based on your chosen technique ({activeCase.correctAlgorithmPath.technique === 'choledochoscope_assisted' ? 'Choledochoscope-Assisted' : 'Fluoroscopy-Guided'}),
          select all equipment you will need.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize
              ${filter === cat ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}
          >
            {cat === 'all' ? 'All' : EQUIPMENT_CATEGORY_LABELS[cat as EquipmentItem['category']] || cat}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filteredEquipment.map(item => {
          const isSelected = selectedEquipment.includes(item.id);
          const isRequired = required.has(item.id);

          let bgClass = 'bg-slate-800 border-slate-700 hover:border-slate-500';
          if (submitted) {
            if (isRequired && isSelected) bgClass = 'bg-green-900/30 border-green-600';
            else if (isRequired && !isSelected) bgClass = 'bg-amber-900/20 border-amber-600/50';
            else if (!isRequired && isSelected) bgClass = 'bg-red-900/30 border-red-600';
            else bgClass = 'bg-slate-800/50 border-slate-700/50';
          } else if (isSelected) {
            bgClass = 'bg-blue-900/30 border-blue-500';
          }

          return (
            <button
              key={item.id}
              onClick={() => !submitted && toggleEquipment(item.id)}
              disabled={submitted}
              className={`text-left p-3 rounded-lg border transition-all ${bgClass}`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 shrink-0
                  ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-500'}`}>
                  {isSelected && <span className="text-xs">✓</span>}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-200 leading-tight">{item.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{item.specification}</div>
                  <div className="text-[10px] text-slate-500">{item.manufacturer}</div>
                  {submitted && isRequired && !isSelected && (
                    <div className="text-[10px] text-amber-400 mt-1">Missing - needed for this procedure</div>
                  )}
                  {submitted && !isRequired && isSelected && (
                    <div className="text-[10px] text-red-400 mt-1">Not needed for this procedure</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      {submitted && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 slide-in">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Equipment Score</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-green-400">{correctCount} correct</span>
            <span className="text-red-400">{extraCount} unnecessary</span>
            <span className="text-amber-400">{missedCount} missed</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">{selectedEquipment.length} items selected</span>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedEquipment.length === 0}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit Equipment
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Begin Intervention →
          </button>
        )}
      </div>
    </div>
  );
}

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
      <div className="bg-gradient-to-r from-vital-blue/10 to-monitor-panel rounded-lg p-4 border border-vital-blue/20">
        <h2 className="text-lg font-bold text-monitor-bright">Equipment Selection</h2>
        <p className="text-sm text-monitor-text/50">
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
              ${filter === cat ? 'bg-vital-cyan text-monitor-bg' : 'bg-monitor-panel text-monitor-text/50 hover:text-monitor-bright border border-monitor-border'}`}
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

          let bgClass = 'bg-monitor-panel border-monitor-border hover:border-monitor-text/30';
          if (submitted) {
            if (isRequired && isSelected) bgClass = 'bg-vital-green/10 border-vital-green';
            else if (isRequired && !isSelected) bgClass = 'bg-vital-amber/10 border-vital-amber/50';
            else if (!isRequired && isSelected) bgClass = 'bg-vital-red/10 border-vital-red';
            else bgClass = 'bg-monitor-panel/50 border-monitor-border/50';
          } else if (isSelected) {
            bgClass = 'bg-vital-cyan/10 border-vital-cyan';
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
                  ${isSelected ? 'bg-vital-cyan border-vital-cyan text-monitor-bg' : 'border-monitor-text/30'}`}>
                  {isSelected && <span className="text-xs">✓</span>}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-monitor-bright leading-tight">{item.name}</div>
                  <div className="text-[10px] text-monitor-text/50 mt-0.5">{item.specification}</div>
                  <div className="text-[10px] text-monitor-text/40">{item.manufacturer}</div>
                  {submitted && isRequired && !isSelected && (
                    <div className="text-[10px] text-vital-amber mt-1">Missing - needed for this procedure</div>
                  )}
                  {submitted && !isRequired && isSelected && (
                    <div className="text-[10px] text-vital-red mt-1">Not needed for this procedure</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      {submitted && (
        <div className="monitor-panel p-4 slide-in">
          <h3 className="text-sm font-semibold text-monitor-text mb-2 font-clinical">Equipment Score</h3>
          <div className="flex gap-4 text-sm font-clinical">
            <span className="text-vital-green vital-glow-green">{correctCount} correct</span>
            <span className="text-vital-red vital-glow-red">{extraCount} unnecessary</span>
            <span className="text-vital-amber vital-glow-amber">{missedCount} missed</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-monitor-text/40 font-clinical">{selectedEquipment.length} items selected</span>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedEquipment.length === 0}
            className="bg-vital-cyan hover:bg-vital-cyan/80 disabled:bg-monitor-panel disabled:text-monitor-text/30 disabled:cursor-not-allowed text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit Equipment
          </button>
        ) : (
          <button
            onClick={advanceScreen}
            className="bg-vital-green hover:bg-vital-green/80 text-monitor-bg font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Begin Intervention →
          </button>
        )}
      </div>
    </div>
  );
}

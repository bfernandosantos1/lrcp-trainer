import type { LabValues } from '../../types/case';
import { LAB_RANGES, isAbnormal } from '../../data/labRanges';

interface Props {
  labs: LabValues;
}

export function LabPanel({ labs }: Props) {
  const labEntries = LAB_RANGES.map(range => ({
    ...range,
    value: labs[range.key as keyof LabValues],
    abnormal: isAbnormal(range.key, labs[range.key as keyof LabValues]),
  }));

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Laboratory Results</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {labEntries.map(lab => (
          <div
            key={lab.key}
            className={`rounded p-2 text-sm ${lab.abnormal ? 'bg-red-900/30 border border-red-700/50' : 'bg-slate-700/50'}`}
          >
            <div className="text-xs text-slate-400">{lab.name}</div>
            <div className={`font-mono font-bold ${lab.abnormal ? 'text-red-400' : 'text-slate-200'}`}>
              {lab.value} <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              {lab.low}-{lab.high}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

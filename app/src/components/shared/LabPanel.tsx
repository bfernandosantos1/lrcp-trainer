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
    <div className="monitor-panel p-4">
      <h3 className="text-sm font-semibold text-vital-cyan uppercase tracking-wider mb-3 font-clinical">Laboratory Results</h3>
      <div className="ekg-line mb-3" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {labEntries.map(lab => (
          <div
            key={lab.key}
            className={`rounded p-2 text-sm ${lab.abnormal ? 'bg-vital-red/10 border border-vital-red/30' : 'bg-monitor-bg border border-monitor-border/50'}`}
          >
            <div className="text-xs text-monitor-text/60">{lab.name}</div>
            <div className={`font-clinical font-bold ${lab.abnormal ? 'text-vital-red vital-glow-red' : 'text-monitor-bright'}`}>
              {lab.value} <span className="text-xs font-normal text-monitor-text/40">{lab.unit}</span>
            </div>
            <div className="text-[10px] text-monitor-text/40 font-clinical">
              {lab.low}-{lab.high}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

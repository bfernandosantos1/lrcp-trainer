import type { PatientDemographics, Vitals } from '../../types/case';

interface Props {
  demographics: PatientDemographics;
  vitals: Vitals;
}

export function PatientCard({ demographics, vitals }: Props) {
  return (
    <div className="monitor-panel overflow-hidden">
      {/* Header */}
      <div className="bg-vital-cyan/10 px-4 py-3 border-b border-monitor-border">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-monitor-bright font-clinical">
              {demographics.age}{demographics.sex === 'M' ? 'M' : 'F'}
            </span>
            <span className="text-sm text-monitor-text/60 ml-2">BMI: {demographics.bmi}</span>
          </div>
          <span className="text-xs bg-vital-cyan/15 text-vital-cyan rounded-full px-3 py-1 border border-vital-cyan/30">
            {demographics.presentation === 'ed_consult' ? 'ED' :
             demographics.presentation === 'on_call_phone' ? 'On-Call' : 'Clinic'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Chief Complaint */}
        <div>
          <h4 className="text-xs font-semibold text-monitor-text/60 uppercase tracking-wider mb-1">Chief Complaint</h4>
          <p className="text-sm text-monitor-bright">{demographics.chiefComplaint}</p>
        </div>

        {/* HPI */}
        <div>
          <h4 className="text-xs font-semibold text-monitor-text/60 uppercase tracking-wider mb-1">History of Present Illness</h4>
          <p className="text-sm text-monitor-text leading-relaxed">{demographics.history}</p>
        </div>

        {/* PMH */}
        {demographics.pmh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-monitor-text/60 uppercase tracking-wider mb-1">Past Medical History</h4>
            <div className="flex flex-wrap gap-1">
              {demographics.pmh.map(item => (
                <span key={item} className="text-xs bg-monitor-bg text-monitor-text rounded px-2 py-0.5 border border-monitor-border/50">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Surgical History */}
        {demographics.surgicalHistory.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-monitor-text/60 uppercase tracking-wider mb-1">Surgical History</h4>
            <div className="flex flex-wrap gap-1">
              {demographics.surgicalHistory.map(item => (
                <span key={item} className="text-xs bg-monitor-bg text-monitor-text rounded px-2 py-0.5 border border-monitor-border/50">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Vitals */}
        <div>
          <h4 className="text-xs font-semibold text-monitor-text/60 uppercase tracking-wider mb-2">Vitals</h4>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'HR', value: vitals.hr, unit: 'bpm', warn: vitals.hr > 100 || vitals.hr < 60 },
              { label: 'BP', value: vitals.bp, unit: '', warn: false },
              { label: 'Temp', value: vitals.temp, unit: '°C', warn: vitals.temp >= 38.0 },
              { label: 'RR', value: vitals.rr, unit: '/min', warn: vitals.rr > 20 },
              { label: 'SpO2', value: vitals.spo2, unit: '%', warn: vitals.spo2 < 95 },
            ].map(v => (
              <div key={v.label} className={`text-center rounded p-1.5 ${v.warn ? 'bg-vital-red/10 border border-vital-red/30' : 'bg-monitor-bg/50 border border-monitor-border/50'}`}>
                <div className="text-[10px] text-monitor-text/50">{v.label}</div>
                <div className={`text-sm font-clinical font-bold ${v.warn ? 'text-vital-red vital-glow-red' : 'text-vital-green vital-glow-green'}`}>
                  {v.value}
                </div>
                <div className="text-[10px] text-monitor-text/40">{v.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

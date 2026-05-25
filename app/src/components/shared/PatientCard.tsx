import type { PatientDemographics, Vitals } from '../../types/case';

interface Props {
  demographics: PatientDemographics;
  vitals: Vitals;
}

export function PatientCard({ demographics, vitals }: Props) {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-900/50 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-slate-100">
              {demographics.age}{demographics.sex === 'M' ? 'M' : 'F'}
            </span>
            <span className="text-sm text-slate-400 ml-2">BMI: {demographics.bmi}</span>
          </div>
          <span className="text-xs bg-blue-800 text-blue-200 rounded-full px-3 py-1">
            {demographics.presentation === 'ed_consult' ? 'ED' :
             demographics.presentation === 'on_call_phone' ? 'On-Call' : 'Clinic'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Chief Complaint */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Chief Complaint</h4>
          <p className="text-sm text-slate-200">{demographics.chiefComplaint}</p>
        </div>

        {/* HPI */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">History of Present Illness</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{demographics.history}</p>
        </div>

        {/* PMH */}
        {demographics.pmh.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Past Medical History</h4>
            <div className="flex flex-wrap gap-1">
              {demographics.pmh.map(item => (
                <span key={item} className="text-xs bg-slate-700 text-slate-300 rounded px-2 py-0.5">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Surgical History */}
        {demographics.surgicalHistory.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Surgical History</h4>
            <div className="flex flex-wrap gap-1">
              {demographics.surgicalHistory.map(item => (
                <span key={item} className="text-xs bg-slate-700 text-slate-300 rounded px-2 py-0.5">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Vitals */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Vitals</h4>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'HR', value: vitals.hr, unit: 'bpm', warn: vitals.hr > 100 || vitals.hr < 60 },
              { label: 'BP', value: vitals.bp, unit: '', warn: false },
              { label: 'Temp', value: vitals.temp, unit: '°C', warn: vitals.temp >= 38.0 },
              { label: 'RR', value: vitals.rr, unit: '/min', warn: vitals.rr > 20 },
              { label: 'SpO2', value: vitals.spo2, unit: '%', warn: vitals.spo2 < 95 },
            ].map(v => (
              <div key={v.label} className={`text-center rounded p-1.5 ${v.warn ? 'bg-red-900/30 border border-red-700/50' : 'bg-slate-700/50'}`}>
                <div className="text-[10px] text-slate-400">{v.label}</div>
                <div className={`text-sm font-mono font-bold ${v.warn ? 'text-red-400' : 'text-slate-200'}`}>
                  {v.value}
                </div>
                <div className="text-[10px] text-slate-500">{v.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

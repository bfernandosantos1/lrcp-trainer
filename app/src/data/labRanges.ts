export interface LabRange {
  name: string;
  unit: string;
  low: number;
  high: number;
  key: string;
}

export const LAB_RANGES: LabRange[] = [
  { key: 'wbc', name: 'WBC', unit: 'K/μL', low: 4.5, high: 11.0 },
  { key: 'hgb', name: 'Hemoglobin', unit: 'g/dL', low: 12.0, high: 17.5 },
  { key: 'plt', name: 'Platelets', unit: 'K/μL', low: 150, high: 400 },
  { key: 'sodium', name: 'Sodium', unit: 'mEq/L', low: 136, high: 145 },
  { key: 'potassium', name: 'Potassium', unit: 'mEq/L', low: 3.5, high: 5.0 },
  { key: 'bun', name: 'BUN', unit: 'mg/dL', low: 7, high: 20 },
  { key: 'creatinine', name: 'Creatinine', unit: 'mg/dL', low: 0.7, high: 1.3 },
  { key: 'totalBilirubin', name: 'Total Bilirubin', unit: 'mg/dL', low: 0.1, high: 1.2 },
  { key: 'directBilirubin', name: 'Direct Bilirubin', unit: 'mg/dL', low: 0.0, high: 0.3 },
  { key: 'ast', name: 'AST', unit: 'U/L', low: 10, high: 40 },
  { key: 'alt', name: 'ALT', unit: 'U/L', low: 7, high: 56 },
  { key: 'alkPhos', name: 'Alk Phos', unit: 'U/L', low: 44, high: 147 },
  { key: 'ggt', name: 'GGT', unit: 'U/L', low: 0, high: 45 },
  { key: 'lipase', name: 'Lipase', unit: 'U/L', low: 0, high: 160 },
  { key: 'inr', name: 'INR', unit: '', low: 0.8, high: 1.1 },
];

export function isAbnormal(key: string, value: number): boolean {
  const range = LAB_RANGES.find(r => r.key === key);
  if (!range) return false;
  return value < range.low || value > range.high;
}

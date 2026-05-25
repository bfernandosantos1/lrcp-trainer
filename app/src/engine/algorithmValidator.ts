import type { CaseDefinition } from '../types/case';
import type { CysticDuctSize, StoneBurden, Technique, PrimaryClearanceMethod } from '../types/algorithm';

export interface IOCInterpretation {
  cysticDuctSize: CysticDuctSize | null;
  cbdDiameter: number | null;
  stoneBurden: StoneBurden | null;
  selectedTechnique: Technique | null;
  selectedMethod: PrimaryClearanceMethod | null;
}

export interface Screen3Score {
  cysticDuctCorrect: boolean;
  cbdDiameterClose: boolean;
  stoneBurdenCorrect: boolean;
  techniqueCorrect: boolean;
  methodCorrect: boolean;
  total: number;
}

export function validateIOCInterpretation(
  interpretation: IOCInterpretation,
  caseData: CaseDefinition
): Screen3Score {
  const correct = caseData.correctAlgorithmPath;

  const cysticDuctCorrect = interpretation.cysticDuctSize === correct.cysticDuctSize;
  const cbdDiameterClose = interpretation.cbdDiameter !== null &&
    Math.abs(interpretation.cbdDiameter - caseData.ioc.cbdDiameterMm) <= 2;
  const stoneBurdenCorrect = interpretation.stoneBurden === correct.stoneBurden;
  const techniqueCorrect = interpretation.selectedTechnique === correct.technique;
  const methodCorrect = interpretation.selectedMethod === correct.primaryMethod;

  let total = 0;
  if (cysticDuctCorrect) total += 20;
  if (cbdDiameterClose) total += 10;
  if (stoneBurdenCorrect) total += 20;
  if (techniqueCorrect) total += 25;
  if (methodCorrect) total += 25;

  return {
    cysticDuctCorrect,
    cbdDiameterClose,
    stoneBurdenCorrect,
    techniqueCorrect,
    methodCorrect,
    total,
  };
}

export function getExpectedTechnique(cysticDuctSize: CysticDuctSize): Technique {
  return cysticDuctSize === 'gte4mm' ? 'choledochoscope_assisted' : 'fluoroscopy_guided';
}

export function getAvailableMethods(technique: Technique): PrimaryClearanceMethod[] {
  if (technique === 'choledochoscope_assisted') {
    return [
      'basket_extraction',
      'balloon_sphincteroplasty_snowplow',
      'lithotripsy',
      'none_normal_ioc',
    ];
  }
  return [
    'extraction_balloon_push',
    'balloon_sphincteroplasty_flush_extraction',
    'lithotripsy',
    'glucagon_flush',
    'none_normal_ioc',
  ];
}

import type { AlgorithmPath, AnatomyType } from './algorithm';

export type Presentation = 'ed_consult' | 'on_call_phone' | 'clinic_referral';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface PatientDemographics {
  age: number;
  sex: 'M' | 'F';
  bmi: number;
  chiefComplaint: string;
  history: string;
  pmh: string[];
  surgicalHistory: string[];
  presentation: Presentation;
}

export interface Vitals {
  hr: number;
  bp: string;
  temp: number;
  rr: number;
  spo2: number;
}

export interface LabValues {
  wbc: number;
  hgb: number;
  plt: number;
  sodium: number;
  potassium: number;
  bun: number;
  creatinine: number;
  totalBilirubin: number;
  directBilirubin: number;
  ast: number;
  alt: number;
  alkPhos: number;
  ggt: number;
  lipase: number;
  inr: number;
}

export interface ImagingFindings {
  ruqUltrasound?: string;
  ct?: { description: string; imagePath?: string };
  mrcp?: string;
  hida?: string;
}

export interface IOCFindings {
  imagePath: string;
  secondaryImagePath?: string;
  cysticDuctDiameterMm: number;
  cbdDiameterMm: number;
  stoneCount: number;
  stoneSizes: number[];
  stoneLocations: string[];
  contrastFlowToD2: boolean;
  anatomyType: AnatomyType;
  description: string;
}

export interface ComplicationScenario {
  type: 'basket_entrapment' | 'bile_duct_injury' | 'bacteremia' |
        'pancreatitis' | 'bleeding' | 'dropped_stones' | 'cystic_duct_injury' | 'failed_clearance';
  probability: number;
  trigger: string;
  correctResponses: string[];
  incorrectResponses: string[];
  description: string;
  narrative: string;
}

export interface PostopOrders {
  labs: string[];
  diet: string;
  activity: string;
  disposition: string;
  additionalOrders: string[];
}

export interface Screen1Options {
  correct: string[];
  distractors: string[];
  explanation: string;
}

export interface Screen2KeyFindings {
  abnormalLabs: string[];
  imagingFindings: string[];
  correctNextStep: string;
  options: string[];
  explanation: string;
}

export interface CaseDefinition {
  id: string;
  title: string;
  difficulty: Difficulty;
  demographics: PatientDemographics;
  vitals: Vitals;
  labs: LabValues;
  imaging: ImagingFindings;
  ioc: IOCFindings;
  correctAlgorithmPath: AlgorithmPath;
  requiredEquipment: string[];
  complications: ComplicationScenario[];
  correctPostopOrders: PostopOrders;
  screen1: Screen1Options;
  screen2: Screen2KeyFindings;
  interventionNarrative: string[];
  debriefExplanation: string;
  pearls: string[];
}

export const PRESENTATION_LABELS: Record<Presentation, string> = {
  ed_consult: 'Emergency Department Consult',
  on_call_phone: 'On-Call Phone Notification',
  clinic_referral: 'Clinic Referral',
};

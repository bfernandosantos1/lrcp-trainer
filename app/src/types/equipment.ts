import type { PrimaryClearanceMethod } from './algorithm';

export interface EquipmentItem {
  id: string;
  name: string;
  category: 'ioc' | 'choledochoscope' | 'wire' | 'balloon' | 'extraction' | 'lithotripsy' | 'stent' | 'sheath';
  manufacturer: string;
  specification: string;
  usedInMethods: PrimaryClearanceMethod[];
}

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentItem['category'], string> = {
  ioc: 'IOC',
  choledochoscope: 'Choledochoscope',
  wire: 'Wire Access',
  balloon: 'Balloon Dilation',
  extraction: 'Extraction',
  lithotripsy: 'Lithotripsy',
  stent: 'Stent',
  sheath: 'Introducer/Sheath',
};

export type CysticDuctSize = 'gte4mm' | 'lt4mm_or_tortuous';
export type Technique = 'choledochoscope_assisted' | 'fluoroscopy_guided';

export type StoneBurden =
  | 'few_small'
  | 'multiple_medium'
  | 'large'
  | 'single_small'
  | 'none';

export type PrimaryClearanceMethod =
  | 'basket_extraction'
  | 'balloon_sphincteroplasty_snowplow'
  | 'lithotripsy'
  | 'extraction_balloon_push'
  | 'balloon_sphincteroplasty_flush_extraction'
  | 'glucagon_flush'
  | 'none_normal_ioc';

export type FallbackMethod =
  | 'intraop_ercp'
  | 'stent_postop_ercp'
  | 'rendezvous_ercp_long_wire'
  | 'rendezvous_lap_assisted_ercp'
  | 'transcholedochal_exploration';

export type AnatomyType = 'normal' | 'roux_en_y';

export interface AlgorithmPath {
  cysticDuctSize: CysticDuctSize;
  technique: Technique;
  stoneBurden: StoneBurden;
  primaryMethod: PrimaryClearanceMethod;
  fallbackChain: FallbackMethod[];
  anatomy: AnatomyType;
}

export const TECHNIQUE_LABELS: Record<Technique, string> = {
  choledochoscope_assisted: 'Choledochoscope-Assisted',
  fluoroscopy_guided: 'Fluoroscopy-Guided',
};

export const STONE_BURDEN_LABELS: Record<StoneBurden, string> = {
  none: 'No stones',
  single_small: 'Single small stone',
  few_small: 'Few small stones',
  multiple_medium: 'Multiple/medium stones (≤10mm)',
  large: 'Large stone (>10mm)',
};

export const CLEARANCE_METHOD_LABELS: Record<PrimaryClearanceMethod, string> = {
  basket_extraction: 'Basket Extraction',
  balloon_sphincteroplasty_snowplow: 'Balloon Sphincteroplasty + Snow-Plow',
  lithotripsy: 'Lithotripsy (EHL/Laser)',
  extraction_balloon_push: 'Extraction Balloon Push',
  balloon_sphincteroplasty_flush_extraction: 'Balloon Sphincteroplasty + Flush + Extraction Balloon',
  glucagon_flush: 'Glucagon Flush',
  none_normal_ioc: 'No intervention (normal IOC)',
};

export const FALLBACK_LABELS: Record<FallbackMethod, string> = {
  intraop_ercp: 'Intraoperative ERCP',
  stent_postop_ercp: 'Stent → Postoperative ERCP',
  rendezvous_ercp_long_wire: 'Rendezvous ERCP (Long Wire)',
  rendezvous_lap_assisted_ercp: 'Rendezvous Lap-Assisted ERCP',
  transcholedochal_exploration: 'Transcholedochal Exploration',
};

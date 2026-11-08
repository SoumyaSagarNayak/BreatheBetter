import { AQICategory, AQICategoryLevel, PollutantMeasurement } from '../types';

export const AQI_CATEGORIES: Record<AQICategoryLevel, AQICategory> = {
  1: {
    level: 1,
    name: 'Good',
    min: 0,
    max: 50,
    color: '#10b981',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
    glowClass: 'shadow-glow-good',
    healthRisk: 'Low Risk',
    generalGuidance: 'Air quality is satisfactory and poses little or no risk. Ideal for outdoor activities and natural ventilation.',
  },
  2: {
    level: 2,
    name: 'Moderate',
    min: 51,
    max: 100,
    color: '#f59e0b',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30',
    glowClass: 'shadow-glow-mod',
    healthRisk: 'Moderate Risk',
    generalGuidance: 'Air quality is acceptable. However, unusually sensitive individuals should consider limiting prolonged outdoor exertion.',
  },
  3: {
    level: 3,
    name: 'Unhealthy for Sensitive Groups',
    min: 101,
    max: 150,
    color: '#f97316',
    bgColor: 'bg-orange-500/10 dark:bg-orange-500/15',
    textColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500/30',
    glowClass: 'shadow-glow-sens',
    healthRisk: 'Elevated Risk for Vulnerable Populations',
    generalGuidance: 'Members of sensitive groups (children, elderly, asthma patients) may experience health effects. General public is less likely to be affected.',
  },
  4: {
    level: 4,
    name: 'Unhealthy',
    min: 151,
    max: 200,
    color: '#ef4444',
    bgColor: 'bg-red-500/10 dark:bg-red-500/15',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-500/30',
    glowClass: 'shadow-glow-unhealth',
    healthRisk: 'High Risk for All',
    generalGuidance: 'Everyone may begin to experience adverse health effects. Sensitive individuals may experience more serious symptoms. Reduce outdoor exposure.',
  },
  5: {
    level: 5,
    name: 'Very Unhealthy',
    min: 201,
    max: 300,
    color: '#a855f7',
    bgColor: 'bg-purple-500/10 dark:bg-purple-500/15',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500/30',
    glowClass: 'shadow-glow-very',
    healthRisk: 'Very High Health Alert',
    generalGuidance: 'Health alert: risk of health effects is significantly increased for everyone. Avoid prolonged outdoor physical exertion; keep windows closed.',
  },
  6: {
    level: 6,
    name: 'Hazardous',
    min: 301,
    max: 500,
    color: '#881337',
    bgColor: 'bg-rose-950/30 dark:bg-rose-950/40',
    textColor: 'text-rose-500 dark:text-rose-400',
    borderColor: 'border-rose-700/50',
    glowClass: 'shadow-glow-hazard',
    healthRisk: 'Emergency Warning',
    generalGuidance: 'Health warning of emergency conditions. The entire population is likely to be severely affected. Remain indoors and run air purification.',
  },
};

/**
 * Returns the AQI Category object for any given US EPA AQI integer.
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return AQI_CATEGORIES[1];
  if (aqi <= 100) return AQI_CATEGORIES[2];
  if (aqi <= 150) return AQI_CATEGORIES[3];
  if (aqi <= 200) return AQI_CATEGORIES[4];
  if (aqi <= 300) return AQI_CATEGORIES[5];
  return AQI_CATEGORIES[6];
}

/**
 * WHO 2021 Reference Guideline Thresholds (24-hour mean in ug/m3, CO in ug/m3)
 */
export const WHO_GUIDELINES = {
  pm2_5: { threshold: 15, unit: 'µg/m³', label: 'WHO 24h: 15 µg/m³' },
  pm10: { threshold: 45, unit: 'µg/m³', label: 'WHO 24h: 45 µg/m³' },
  nitrogen_dioxide: { threshold: 25, unit: 'µg/m³', label: 'WHO 24h: 25 µg/m³' },
  sulphur_dioxide: { threshold: 40, unit: 'µg/m³', label: 'WHO 24h: 40 µg/m³' },
  carbon_monoxide: { threshold: 4000, unit: 'µg/m³', label: 'WHO 24h: 4,000 µg/m³ (4 mg/m³)' },
  ozone: { threshold: 100, unit: 'µg/m³', label: 'WHO 8h: 100 µg/m³' },
  dust: { threshold: 50, unit: 'µg/m³', label: 'Advisory: 50 µg/m³' },
};

/**
 * Categorizes a specific pollutant reading relative to WHO guideline thresholds.
 */
export function getPollutantStatus(
  id: string,
  value: number | null
): PollutantMeasurement['status'] {
  if (value === null || isNaN(value)) return 'unavailable';

  switch (id) {
    case 'pm2_5':
      if (value <= 12) return 'good';
      if (value <= 35.4) return 'moderate';
      if (value <= 55.4) return 'unhealthy_sensitive';
      if (value <= 150.4) return 'unhealthy';
      if (value <= 250.4) return 'very_unhealthy';
      return 'hazardous';

    case 'pm10':
      if (value <= 54) return 'good';
      if (value <= 154) return 'moderate';
      if (value <= 254) return 'unhealthy_sensitive';
      if (value <= 354) return 'unhealthy';
      if (value <= 424) return 'very_unhealthy';
      return 'hazardous';

    case 'ozone':
      if (value <= 54) return 'good';
      if (value <= 120) return 'moderate';
      if (value <= 164) return 'unhealthy_sensitive';
      if (value <= 204) return 'unhealthy';
      return 'very_unhealthy';

    case 'nitrogen_dioxide':
      if (value <= 53) return 'good';
      if (value <= 100) return 'moderate';
      if (value <= 200) return 'unhealthy_sensitive';
      return 'unhealthy';

    case 'sulphur_dioxide':
      if (value <= 35) return 'good';
      if (value <= 75) return 'moderate';
      if (value <= 185) return 'unhealthy_sensitive';
      return 'unhealthy';

    case 'carbon_monoxide':
      if (value <= 4400) return 'good';
      if (value <= 9400) return 'moderate';
      if (value <= 12400) return 'unhealthy_sensitive';
      return 'unhealthy';

    default:
      if (value <= 50) return 'good';
      if (value <= 100) return 'moderate';
      return 'unhealthy';
  }
}

/**
 * Generates an accurate, transparent, data-driven natural language interpretation.
 */
export function generateInterpretation(
  aqi: number,
  locationName: string,
  dominantPollutantName: string,
  dominantRatio: number
): string {
  const cat = getAQICategory(aqi);

  if (aqi <= 50) {
    return `Air quality in ${locationName} is exceptional (${aqi} AQI). Pollutant levels are well below international health thresholds. Outdoor exercise, cycling, and natural ventilation are thoroughly encouraged.`;
  }
  if (aqi <= 100) {
    return `Air quality in ${locationName} is moderate (${aqi} AQI). Primary driver is ${dominantPollutantName}. Most people can continue typical outdoor routines without concern, but individuals with severe respiratory asthma should pay attention to symptoms.`;
  }
  if (aqi <= 150) {
    return `Air quality in ${locationName} has reached Unhealthy for Sensitive Groups (${aqi} AQI), with ${dominantPollutantName} measuring ${dominantRatio > 1 ? dominantRatio.toFixed(1) + 'x' : 'near'} the WHO guideline. Children, pregnant women, and older adults should reduce extended outdoor physical exertion.`;
  }
  if (aqi <= 200) {
    return `Air quality in ${locationName} is Unhealthy (${aqi} AQI). Ambient ${dominantPollutantName} is elevated at ${dominantRatio.toFixed(1)}x recommended limits. Everyone may begin feeling throat or eye irritation. Sensitive groups should wear N95 respirators outdoors and run indoor HEPA filtration.`;
  }
  if (aqi <= 300) {
    return `CRITICAL HEALTH ALERT: Air quality in ${locationName} is Very Unhealthy (${aqi} AQI). Dangerous concentration of ${dominantPollutantName} (${dominantRatio.toFixed(1)}x WHO guideline limit). All individuals should strictly avoid outdoor endurance activities and seal windows.`;
  }
  return `EMERGENCY HAZARD WARNING: Air quality in ${locationName} is Hazardous (${aqi} AQI). Severe particulate saturation posing immediate respiratory risks to the entire population. Remain strictly indoors, utilize high-efficiency air purifiers, and keep physical movement minimized.`;
}


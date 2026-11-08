export type AQICategoryLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface AQICategory {
  level: AQICategoryLevel;
  name: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  glowClass: string;
  healthRisk: string;
  generalGuidance: string;
}

export interface LocationInfo {
  id: number | string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  timezone?: string;
  population?: number;
}

export interface PollutantMeasurement {
  id: string;
  name: string;
  symbol: string;
  value: number | null;
  unit: string;
  whoThreshold: number; // WHO 24h air quality guideline limit in ug/m3
  thresholdLabel: string;
  status: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous' | 'unavailable';
  description: string;
  healthImpact: string;
  trend: number[]; // 24-hr historical array
}

export interface HourlyDataPoint {
  time: string;
  formattedHour: string;
  formattedDate: string;
  usAqi: number | null;
  europeanAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  nitrogen_dioxide: number | null;
  sulphur_dioxide: number | null;
  carbon_monoxide: number | null;
  ozone: number | null;
  dust: number | null;
  uvIndex: number | null;
  isForecast: boolean;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  avgAqi: number;
  maxAqi: number;
  minAqi: number;
  category: AQICategory;
  dominantPollutant: string;
  avgPm25: number;
  avgPm10: number;
}

export interface ActivityWindow {
  hour: string;
  timeLabel: string;
  aqi: number;
  rating: 'Optimal' | 'Moderate' | 'Poor' | 'Hazardous';
  advice: string;
  suitableForRunners: boolean;
  suitableForKids: boolean;
}

export interface AirQualityData {
  location: LocationInfo;
  timestamp: string;
  source: string;
  usAqi: number;
  europeanAqi: number | null;
  category: AQICategory;
  dominantPollutant: {
    id: string;
    name: string;
    symbol: string;
    ratioToWHO: number;
  };
  pollutants: {
    pm2_5: PollutantMeasurement;
    pm10: PollutantMeasurement;
    nitrogen_dioxide: PollutantMeasurement;
    sulphur_dioxide: PollutantMeasurement;
    carbon_monoxide: PollutantMeasurement;
    ozone: PollutantMeasurement;
    dust?: PollutantMeasurement;
    uv_index?: PollutantMeasurement;
  };
  hourly: HourlyDataPoint[];
  dailyForecast: DailyForecast[];
  activityWindows: ActivityWindow[];
  interpretation: string;
}

export interface ComparisonCity {
  location: LocationInfo;
  data: AirQualityData | null;
  isLoading: boolean;
  error: string | null;
}


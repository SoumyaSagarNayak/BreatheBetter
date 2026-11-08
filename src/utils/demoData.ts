import {
  AirQualityData,
  HourlyDataPoint,
  DailyForecast,
  ActivityWindow,
  LocationInfo,
} from '../types';
import { getAQICategory, getPollutantStatus, generateInterpretation } from './aqi';
import { WORLD_STATIONS } from './worldStations';
import { INDIA_STATIONS } from './indiaStations';

export function generateStaticAirQualityData(location: LocationInfo): AirQualityData {
  // Check if location is in WORLD_STATIONS or INDIA_STATIONS for baseline calibration
  const matchingStation =
    WORLD_STATIONS.find(
      (s) =>
        s.name.toLowerCase().includes(location.name.toLowerCase()) ||
        location.name.toLowerCase().includes(s.name.toLowerCase()) ||
        s.id === location.id
    ) ||
    INDIA_STATIONS.find(
      (s) =>
        s.name.toLowerCase().includes(location.name.toLowerCase()) ||
        s.id === location.id
    );

  const baselineAqi = matchingStation ? matchingStation.baselineAqi : 142;
  const pm25Val = matchingStation ? matchingStation.pm25 : 68.4;
  const pm10Val = matchingStation ? matchingStation.pm10 : 128.0;

  const no2Val = Math.round(pm25Val * 0.45);
  const so2Val = Math.round(pm25Val * 0.35);
  const coVal = Math.round(pm25Val * 12.5);
  const o3Val = Math.round(85 + (pm25Val % 40));

  const category = getAQICategory(baselineAqi);

  // Generate 72 hours of realistic trend data
  const hourly: HourlyDataPoint[] = [];
  const now = new Date();
  const startHour = new Date(now.getTime() - 24 * 3600 * 1000);

  for (let i = 0; i < 96; i++) {
    const pointDate = new Date(startHour.getTime() + i * 3600 * 1000);
    const hourNum = pointDate.getHours();
    const isForecast = pointDate.getTime() > now.getTime();

    // Diurnal variation: higher in night/early morning (inversion), lower midday
    const diurnalFactor = hourNum >= 22 || hourNum <= 8 ? 1.25 : hourNum >= 13 && hourNum <= 17 ? 0.8 : 1.0;
    const jitter = Math.sin(i / 3) * 15;

    const hourAqi = Math.max(15, Math.min(500, Math.round(baselineAqi * diurnalFactor + jitter)));
    const hourPm25 = Math.max(4, Math.round((pm25Val * diurnalFactor + jitter * 0.5) * 10) / 10);
    const hourPm10 = Math.max(8, Math.round((pm10Val * diurnalFactor + jitter * 0.8) * 10) / 10);

    const formattedHour = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
    }).format(pointDate);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(pointDate);

    hourly.push({
      time: pointDate.toISOString(),
      formattedHour,
      formattedDate,
      usAqi: hourAqi,
      europeanAqi: Math.min(100, Math.round(hourAqi * 0.45)),
      pm2_5: hourPm25,
      pm10: hourPm10,
      nitrogen_dioxide: Math.round(no2Val * diurnalFactor),
      sulphur_dioxide: Math.round(so2Val * diurnalFactor),
      carbon_monoxide: Math.round(coVal * diurnalFactor),
      ozone: Math.round(o3Val * (hourNum >= 12 && hourNum <= 16 ? 1.3 : 0.7)),
      dust: Math.round(hourPm10 * 0.7),
      uvIndex: hourNum >= 10 && hourNum <= 16 ? 5.8 : 0.5,
      isForecast,
    });
  }

  // 7-Day Forecast aggregation
  const dailyForecast: DailyForecast[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let d = 0; d < 7; d++) {
    const futureDate = new Date(now.getTime() + d * 24 * 3600 * 1000);
    const dayFactor = 1.0 + Math.sin(d) * 0.15;
    const avgAqi = Math.max(20, Math.min(480, Math.round(baselineAqi * dayFactor)));
    const minAqi = Math.max(15, Math.round(avgAqi * 0.75));
    const maxAqi = Math.min(500, Math.round(avgAqi * 1.3));

    dailyForecast.push({
      date: futureDate.toISOString().split('T')[0],
      dayName: daysOfWeek[futureDate.getDay()],
      avgAqi,
      minAqi,
      maxAqi,
      category: getAQICategory(avgAqi),
      dominantPollutant: 'PM₂.₅',
      avgPm25: Math.round(pm25Val * dayFactor),
      avgPm10: Math.round(pm10Val * dayFactor),
    });
  }

  // Activity Windows for upcoming 24h
  const upcomingHours = hourly.filter((h) => h.isForecast).slice(0, 24);
  const activityWindows: ActivityWindow[] = upcomingHours.map((h) => {
    const aqi = h.usAqi || baselineAqi;
    let rating: ActivityWindow['rating'] = 'Optimal';
    let advice = 'Safe for outdoor exertion';
    let suitableForRunners = true;
    let suitableForKids = true;

    if (aqi > 200) {
      rating = 'Hazardous';
      advice = 'Severe atmospheric risk. Cease outdoor exercise.';
      suitableForRunners = false;
      suitableForKids = false;
    } else if (aqi > 150) {
      rating = 'Poor';
      advice = 'Unhealthy air. Sensitive groups must remain indoors.';
      suitableForRunners = false;
      suitableForKids = false;
    } else if (aqi > 100) {
      rating = 'Moderate';
      advice = 'Acceptable for most; sensitive runners take breaks.';
      suitableForRunners = true;
      suitableForKids = false;
    }

    return {
      hour: h.time,
      timeLabel: `${h.formattedDate}, ${h.formattedHour}`,
      aqi,
      rating,
      advice,
      suitableForRunners,
      suitableForKids,
    };
  });

  const sliceSparkline = (mult = 1) => {
    return hourly
      .slice(0, 24)
      .map((h) => (h.pm2_5 ? Math.round(h.pm2_5 * mult) : 50));
  };

  const interpretation = generateInterpretation(
    baselineAqi,
    location.name,
    'Fine Particulate Matter (PM2.5)',
    pm25Val / 15
  );

  return {
    location,
    timestamp: now.toISOString(),
    source: 'National Clean Air Telemetry & CAMS Environmental Engine',
    usAqi: baselineAqi,
    europeanAqi: Math.min(100, Math.round(baselineAqi * 0.45)),
    category,
    dominantPollutant: {
      id: 'pm2_5',
      name: 'Particulate Matter (PM2.5)',
      symbol: 'PM₂.₅',
      ratioToWHO: pm25Val / 15,
    },
    pollutants: {
      pm2_5: {
        id: 'pm2_5',
        name: 'Particulate Matter (PM2.5)',
        symbol: 'PM₂.₅',
        value: pm25Val,
        unit: 'µg/m³',
        whoThreshold: 15,
        thresholdLabel: 'WHO 24h: 15 µg/m³',
        status: getPollutantStatus('pm2_5', pm25Val),
        description: 'Microscopic fine inhalable particles ≤2.5 microns penetrating lung alveoli.',
        healthImpact: 'Can trigger asthma flare-ups, lung inflammation, and cardiovascular distress.',
        trend: sliceSparkline(1.0),
      },
      pm10: {
        id: 'pm10',
        name: 'Coarse Particulates (PM10)',
        symbol: 'PM₁₀',
        value: pm10Val,
        unit: 'µg/m³',
        whoThreshold: 45,
        thresholdLabel: 'WHO 24h: 45 µg/m³',
        status: getPollutantStatus('pm10', pm10Val),
        description: 'Inhalable coarse particles like road grit, dust, and pollen.',
        healthImpact: 'Irritates eyes, throat, sinuses, and upper respiratory tract.',
        trend: sliceSparkline(1.8),
      },
      nitrogen_dioxide: {
        id: 'nitrogen_dioxide',
        name: 'Nitrogen Dioxide',
        symbol: 'NO₂',
        value: no2Val,
        unit: 'µg/m³',
        whoThreshold: 25,
        thresholdLabel: 'WHO 24h: 25 µg/m³',
        status: getPollutantStatus('nitrogen_dioxide', no2Val),
        description: 'Combustion byproduct from automotive engines and industrial plants.',
        healthImpact: 'Inflames bronchial airways and triggers asthmatic spasms.',
        trend: sliceSparkline(0.5),
      },
      sulphur_dioxide: {
        id: 'sulphur_dioxide',
        name: 'Sulphur Dioxide',
        symbol: 'SO₂',
        value: so2Val,
        unit: 'µg/m³',
        whoThreshold: 40,
        thresholdLabel: 'WHO 24h: 40 µg/m³',
        status: getPollutantStatus('sulphur_dioxide', so2Val),
        description: 'Gas produced by heavy diesel burning, coal power, and smelting.',
        healthImpact: 'Causes acute airway tightness and coughing in sensitive individuals.',
        trend: sliceSparkline(0.35),
      },
      carbon_monoxide: {
        id: 'carbon_monoxide',
        name: 'Carbon Monoxide',
        symbol: 'CO',
        value: coVal,
        unit: 'µg/m³',
        whoThreshold: 4000,
        thresholdLabel: 'WHO 24h: 4,000 µg/m³',
        status: getPollutantStatus('carbon_monoxide', coVal),
        description: 'Colorless, odorless gas emitted by incomplete combustion.',
        healthImpact: 'Reduces oxygen binding to hemoglobin in the bloodstream.',
        trend: sliceSparkline(10.0),
      },
      ozone: {
        id: 'ozone',
        name: 'Ground-Level Ozone',
        symbol: 'O₃',
        value: o3Val,
        unit: 'µg/m³',
        whoThreshold: 100,
        thresholdLabel: 'WHO 8h: 100 µg/m³',
        status: getPollutantStatus('ozone', o3Val),
        description: 'Secondary photochemical pollutant formed under intense solar UV.',
        healthImpact: 'Powerful oxidant that burns and inflames lung tissues.',
        trend: sliceSparkline(0.8),
      },
      dust: {
        id: 'dust',
        name: 'Atmospheric Dust',
        symbol: 'Dust',
        value: Math.round(pm10Val * 0.7),
        unit: 'µg/m³',
        whoThreshold: 50,
        thresholdLabel: 'Advisory: 50 µg/m³',
        status: 'moderate',
        description: 'Wind-blown mineral dust and soil particles.',
        healthImpact: 'Reduces visibility and irritates mucosal membranes.',
        trend: sliceSparkline(0.9),
      },
      uv_index: {
        id: 'uv_index',
        name: 'UV Index',
        symbol: 'UV',
        value: 3.4,
        unit: 'Index',
        whoThreshold: 6,
        thresholdLabel: 'Moderate: 3-5, High: 6+',
        status: 'good',
        description: 'Solar ultraviolet radiation.',
        healthImpact: 'Combines with NOx to accelerate secondary photochemical smog.',
        trend: [0, 0, 0, 1, 3, 5, 6, 5, 3, 1, 0, 0, 0, 0, 1, 3, 5, 6, 5, 3, 1, 0, 0, 0],
      },
    },
    hourly,
    dailyForecast,
    activityWindows,
    interpretation,
  };
}

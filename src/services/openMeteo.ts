import {
  AirQualityData,
  HourlyDataPoint,
  DailyForecast,
  ActivityWindow,
  LocationInfo,
  PollutantMeasurement,
} from '../types';
import {
  getAQICategory,
  getPollutantStatus,
  WHO_GUIDELINES,
  generateInterpretation,
} from '../utils/aqi';
import { CacheService } from './cache';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1';

export async function searchLocations(query: string): Promise<LocationInfo[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const cacheKey = `geo_${trimmed.toLowerCase()}`;
  const cached = CacheService.get<LocationInfo[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
        trimmed
      )}&count=8&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    const locations: LocationInfo[] = data.results.map((item: any) => ({
      id: item.id || `${item.latitude}-${item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
      population: item.population,
    }));

    CacheService.set(cacheKey, locations, 30 * 60 * 1000); // 30 min cache for geocoding
    return locations;
  } catch (err: any) {
    console.error('Error in searchLocations:', err);
    throw new Error(
      `Unable to search locations: ${err.message || 'Network connection issue'}.`
    );
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<LocationInfo> {
  const cacheKey = `rev_geo_${lat.toFixed(3)}_${lon.toFixed(3)}`;
  const cached = CacheService.get<LocationInfo>(cacheKey);
  if (cached) return cached;

  try {
    // Open-Meteo reverse geocoding via search with coordinates or bounding box
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'BreatheBetter-AQI-Platform/1.0',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.county ||
        addr.state_district ||
        'Current Location';
      const loc: LocationInfo = {
        id: `rev-${lat.toFixed(4)}-${lon.toFixed(4)}`,
        name: cityName,
        country: addr.country || '',
        countryCode: (addr.country_code || '').toUpperCase(),
        latitude: lat,
        longitude: lon,
        admin1: addr.state || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      CacheService.set(cacheKey, loc, 60 * 60 * 1000);
      return loc;
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  // Graceful fallback coordinate descriptor
  return {
    id: `gps-${lat.toFixed(4)}-${lon.toFixed(4)}`,
    name: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    country: 'Current Area',
    countryCode: 'GPS',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function fetchAirQuality(
  location: LocationInfo,
  forceRefresh = false
): Promise<AirQualityData> {
  const cacheKey = CacheService.getCoordinateKey(
    location.latitude,
    location.longitude
  );

  if (!forceRefresh) {
    const cached = CacheService.get<AirQualityData>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const queryParams = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current:
      'us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index',
    hourly:
      'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi,dust,uv_index',
    timezone: 'auto',
    forecast_days: '7',
    past_days: '2',
  });

  const url = `${AIR_QUALITY_BASE_URL}/air-quality?${queryParams.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Air quality API failed with HTTP status ${response.status}`
      );
    }

    const json = await response.json();
    const current = json.current || {};
    const hourly = json.hourly || {};

    const rawUsAqi = current.us_aqi ?? null;
    const rawEuropeanAqi = current.european_aqi ?? null;
    const rawPm25 = current.pm2_5 ?? null;
    const rawPm10 = current.pm10 ?? null;
    const rawNo2 = current.nitrogen_dioxide ?? null;
    const rawSo2 = current.sulphur_dioxide ?? null;
    const rawCo = current.carbon_monoxide ?? null;
    const rawO3 = current.ozone ?? null;
    const rawDust = current.dust ?? null;
    const rawUv = current.uv_index ?? null;

    // Fallback if US AQI isn't directly computed in the response
    const computedUsAqi =
      rawUsAqi !== null
        ? Math.round(rawUsAqi)
        : rawPm25 !== null
        ? Math.min(500, Math.round(rawPm25 * 3.5))
        : 50;

    const category = getAQICategory(computedUsAqi);

    // Build 24-hr historical arrays for trend sparklines
    const currentTimeStr = current.time || '';
    const timeIndices = hourly.time || [];
    const currentIndex = timeIndices.findIndex((t: string) => t === currentTimeStr);
    const startSparkline = Math.max(0, currentIndex - 23);
    const endSparkline = currentIndex >= 0 ? currentIndex + 1 : 24;

    const sliceTrend = (arr?: (number | null)[]) => {
      if (!arr) return [];
      return arr.slice(startSparkline, endSparkline).map((v) => (v !== null ? v : 0));
    };

    const pollutants: AirQualityData['pollutants'] = {
      pm2_5: {
        id: 'pm2_5',
        name: 'Particulate Matter (PM2.5)',
        symbol: 'PM₂.₅',
        value: rawPm25,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.pm2_5.threshold,
        thresholdLabel: WHO_GUIDELINES.pm2_5.label,
        status: getPollutantStatus('pm2_5', rawPm25),
        description: 'Microscopic fine inhalable particles ≤2.5 microns. Penetrates deep into lung alveoli and bloodstream.',
        healthImpact: 'Can trigger asthma attacks, cardiovascular stress, chronic bronchitis, and long-term pulmonary inflammation.',
        trend: sliceTrend(hourly.pm2_5),
      },
      pm10: {
        id: 'pm10',
        name: 'Coarse Particulates (PM10)',
        symbol: 'PM₁₀',
        value: rawPm10,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.pm10.threshold,
        thresholdLabel: WHO_GUIDELINES.pm10.label,
        status: getPollutantStatus('pm10', rawPm10),
        description: 'Inhalable coarse particles ≤10 microns (dust, pollen, fly ash, construction grit).',
        healthImpact: 'Irritates nasal passages, upper respiratory airways, eyes, and worsens chronic sinusitis.',
        trend: sliceTrend(hourly.pm10),
      },
      nitrogen_dioxide: {
        id: 'nitrogen_dioxide',
        name: 'Nitrogen Dioxide',
        symbol: 'NO₂',
        value: rawNo2,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.nitrogen_dioxide.threshold,
        thresholdLabel: WHO_GUIDELINES.nitrogen_dioxide.label,
        status: getPollutantStatus('nitrogen_dioxide', rawNo2),
        description: 'Reactive gas produced primarily by motor vehicle combustion and power plants.',
        healthImpact: 'Inflames airways, exacerbates childhood asthma, and contributes to ground-level ozone formation.',
        trend: sliceTrend(hourly.nitrogen_dioxide),
      },
      sulphur_dioxide: {
        id: 'sulphur_dioxide',
        name: 'Sulphur Dioxide',
        symbol: 'SO₂',
        value: rawSo2,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.sulphur_dioxide.threshold,
        thresholdLabel: WHO_GUIDELINES.sulphur_dioxide.label,
        status: getPollutantStatus('sulphur_dioxide', rawSo2),
        description: 'Pungent toxic gas generated by coal, industrial fuel burning, and smelting processes.',
        healthImpact: 'Triggers bronchoconstriction and coughing within minutes of exposure in sensitive individuals.',
        trend: sliceTrend(hourly.sulphur_dioxide),
      },
      carbon_monoxide: {
        id: 'carbon_monoxide',
        name: 'Carbon Monoxide',
        symbol: 'CO',
        value: rawCo,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.carbon_monoxide.threshold,
        thresholdLabel: WHO_GUIDELINES.carbon_monoxide.label,
        status: getPollutantStatus('carbon_monoxide', rawCo),
        description: 'Colorless, odorless gas emitted by incomplete combustion of fossil fuels and biomass.',
        healthImpact: 'Binds with hemoglobin to diminish oxygen delivery to vital organs and brain tissue.',
        trend: sliceTrend(hourly.carbon_monoxide),
      },
      ozone: {
        id: 'ozone',
        name: 'Ground-Level Ozone',
        symbol: 'O₃',
        value: rawO3,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.ozone.threshold,
        thresholdLabel: WHO_GUIDELINES.ozone.label,
        status: getPollutantStatus('ozone', rawO3),
        description: 'Secondary pollutant formed when sunlight reacts with vehicular NOx and volatile organic compounds.',
        healthImpact: 'Acts as a powerful lung irritant, triggering chest tightness, coughing, and reduced lung capacity.',
        trend: sliceTrend(hourly.ozone),
      },
      dust: {
        id: 'dust',
        name: 'Atmospheric Dust',
        symbol: 'Dust',
        value: rawDust,
        unit: 'µg/m³',
        whoThreshold: WHO_GUIDELINES.dust.threshold,
        thresholdLabel: WHO_GUIDELINES.dust.label,
        status: getPollutantStatus('dust', rawDust),
        description: 'Airborne mineral and soil dust transported by wind and dry atmospheric currents.',
        healthImpact: 'Reduces horizontal visibility, triggers mechanical eye and airway irritation.',
        trend: sliceTrend(hourly.dust),
      },
      uv_index: {
        id: 'uv_index',
        name: 'UV Index',
        symbol: 'UV',
        value: rawUv,
        unit: 'Index',
        whoThreshold: 6,
        thresholdLabel: 'Moderate: 3-5, High: 6+',
        status: rawUv && rawUv > 5 ? 'unhealthy_sensitive' : 'good',
        description: 'Solar ultraviolet radiation intensity reaching the surface.',
        healthImpact: 'High UV combined with ground ozone accelerates photochemical smog reactions.',
        trend: sliceTrend(hourly.uv_index),
      },
    };

    // Determine Dominant Pollutant based on ratio to WHO guideline
    const ratios = [
      { id: 'pm2_5', name: 'Fine Particulate Matter (PM2.5)', symbol: 'PM₂.₅', ratio: rawPm25 ? rawPm25 / 15 : 0 },
      { id: 'pm10', name: 'Coarse Particulates (PM10)', symbol: 'PM₁₀', ratio: rawPm10 ? rawPm10 / 45 : 0 },
      { id: 'nitrogen_dioxide', name: 'Nitrogen Dioxide (NO2)', symbol: 'NO₂', ratio: rawNo2 ? rawNo2 / 25 : 0 },
      { id: 'ozone', name: 'Ground Ozone (O3)', symbol: 'O₃', ratio: rawO3 ? rawO3 / 100 : 0 },
      { id: 'sulphur_dioxide', name: 'Sulphur Dioxide (SO2)', symbol: 'SO₂', ratio: rawSo2 ? rawSo2 / 40 : 0 },
    ].sort((a, b) => b.ratio - a.ratio);

    const dominant = ratios[0] || { id: 'pm2_5', name: 'PM2.5', symbol: 'PM₂.₅', ratio: 1 };

    // Format hourly data with `isForecast` separation
    const currentTimestampMs = currentTimeStr ? new Date(currentTimeStr).getTime() : Date.now();

    const hourlyPoints: HourlyDataPoint[] = [];
    const times = hourly.time || [];

    for (let i = 0; i < times.length; i++) {
      const timeStr = times[i];
      const pointTimeMs = new Date(timeStr).getTime();
      const isForecast = pointTimeMs > currentTimestampMs;

      const dateObj = new Date(timeStr);
      const formattedHour = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: true,
      }).format(dateObj);

      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(dateObj);

      hourlyPoints.push({
        time: timeStr,
        formattedHour,
        formattedDate,
        usAqi: hourly.us_aqi ? hourly.us_aqi[i] : null,
        europeanAqi: hourly.european_aqi ? hourly.european_aqi[i] : null,
        pm2_5: hourly.pm2_5 ? hourly.pm2_5[i] : null,
        pm10: hourly.pm10 ? hourly.pm10[i] : null,
        nitrogen_dioxide: hourly.nitrogen_dioxide ? hourly.nitrogen_dioxide[i] : null,
        sulphur_dioxide: hourly.sulphur_dioxide ? hourly.sulphur_dioxide[i] : null,
        carbon_monoxide: hourly.carbon_monoxide ? hourly.carbon_monoxide[i] : null,
        ozone: hourly.ozone ? hourly.ozone[i] : null,
        dust: hourly.dust ? hourly.dust[i] : null,
        uvIndex: hourly.uv_index ? hourly.uv_index[i] : null,
        isForecast,
      });
    }

    // Daily Forecast aggregation (next 7 days)
    const dailyMap = new Map<string, HourlyDataPoint[]>();
    hourlyPoints
      .filter((p) => p.isForecast)
      .forEach((point) => {
        const dateKey = point.time.split('T')[0];
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, []);
        }
        dailyMap.get(dateKey)!.push(point);
      });

    const dailyForecast: DailyForecast[] = [];
    Array.from(dailyMap.entries()).slice(0, 7).forEach(([dateStr, points]) => {
      const validAqis = points.map((p) => p.usAqi).filter((v): v is number => v !== null);
      const validPm25 = points.map((p) => p.pm2_5).filter((v): v is number => v !== null);
      const validPm10 = points.map((p) => p.pm10).filter((v): v is number => v !== null);

      const avgAqi = validAqis.length ? Math.round(validAqis.reduce((a, b) => a + b, 0) / validAqis.length) : computedUsAqi;
      const maxAqi = validAqis.length ? Math.max(...validAqis) : computedUsAqi;
      const minAqi = validAqis.length ? Math.min(...validAqis) : computedUsAqi;
      const avgPm25 = validPm25.length ? Math.round(validPm25.reduce((a, b) => a + b, 0) / validPm25.length) : (rawPm25 || 0);
      const avgPm10 = validPm10.length ? Math.round(validPm10.reduce((a, b) => a + b, 0) / validPm10.length) : (rawPm10 || 0);

      const dateObj = new Date(dateStr);
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(dateObj);

      dailyForecast.push({
        date: dateStr,
        dayName,
        avgAqi,
        maxAqi,
        minAqi,
        category: getAQICategory(avgAqi),
        dominantPollutant: dominant.symbol,
        avgPm25,
        avgPm10,
      });
    });

    // Compute Activity Windows for next 24-36h (daylight hours 6 AM to 9 PM)
    const nextHours = hourlyPoints.filter((p) => p.isForecast).slice(0, 36);
    const activityWindows: ActivityWindow[] = nextHours.map((h) => {
      const aqi = h.usAqi || computedUsAqi;
      let rating: ActivityWindow['rating'] = 'Optimal';
      let advice = 'Great for outdoor exercise';
      let suitableForRunners = true;
      let suitableForKids = true;

      if (aqi > 200) {
        rating = 'Hazardous';
        advice = 'Avoid all outdoor activity; exercise indoors only';
        suitableForRunners = false;
        suitableForKids = false;
      } else if (aqi > 150) {
        rating = 'Poor';
        advice = 'Unhealthy air. Shift outdoor sports indoors';
        suitableForRunners = false;
        suitableForKids = false;
      } else if (aqi > 100) {
        rating = 'Moderate';
        advice = 'Acceptable for general public; sensitive individuals reduce cardio';
        suitableForRunners = true;
        suitableForKids = false;
      } else if (aqi > 50) {
        rating = 'Moderate';
        advice = 'Good outdoor conditions; enjoy outdoor recreation';
        suitableForRunners = true;
        suitableForKids = true;
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

    const interpretation = generateInterpretation(
      computedUsAqi,
      location.name,
      dominant.name,
      dominant.ratio
    );

    const result: AirQualityData = {
      location,
      timestamp: currentTimeStr || new Date().toISOString(),
      source: 'Copernicus Atmosphere Monitoring Service (CAMS) / Open-Meteo',
      usAqi: computedUsAqi,
      europeanAqi: rawEuropeanAqi,
      category,
      dominantPollutant: {
        id: dominant.id,
        name: dominant.name,
        symbol: dominant.symbol,
        ratioToWHO: dominant.ratio,
      },
      pollutants,
      hourly: hourlyPoints,
      dailyForecast,
      activityWindows,
      interpretation,
    };

    CacheService.set(cacheKey, result, 10 * 60 * 1000); // 10 min cache
    return result;
  } catch (err: any) {
    console.error('Error fetching air quality:', err);
    throw new Error(
      `Failed to retrieve air quality data from Open-Meteo API: ${
        err.message || 'Unknown network error'
      }. Please check your connection or retry.`
    );
  }
}


import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { AirQualityData } from '../../types';
import { ActivityPlanner } from './ActivityPlanner';
import { Badge } from '../ui/Badge';

interface ForecastSectionProps {
  data: AirQualityData;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ data }) => {
  const { dailyForecast, hourly, activityWindows } = data;
  const [tab, setTab] = useState<'daily' | 'hourly'>('daily');

  // Next 24 hours of forecast points
  const upcomingHourly = hourly.filter((h) => h.isForecast).slice(0, 24);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
            <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
              Air Quality Forecast (7-Day Projection)
            </h2>
          </div>
          <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
            Numerical chemical transport forecasts simulated by Copernicus Atmosphere Monitoring Service (CAMS)
          </p>
        </div>

        {/* Tab Toggle: Daily vs Hourly */}
        <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/80 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline flex items-center gap-1 text-xs">
          <button
            onClick={() => setTab('daily')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              tab === 'daily'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
            }`}
          >
            7-Day Daily
          </button>
          <button
            onClick={() => setTab('hourly')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              tab === 'hourly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
            }`}
          >
            Next 24h Hourly
          </button>
        </div>
      </div>

      {/* Forecast Disclaimer Warning */}
      <div className="p-3 rounded-xl border flex items-center gap-2.5 text-xs border-amber-500/30 bg-amber-500/10 text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
        <span>
          <strong>Scientific Disclaimer:</strong> Projections represent atmospheric simulation models rather than real-time ground sensor measurements. Meteorological wind currents, inversion layers, and humidity can alter actual particulate dispersal.
        </span>
      </div>

      {/* Daily Forecast Cards */}
      {tab === 'daily' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {dailyForecast.map((day, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border transition-all duration-200 border-forest-800/80 bg-forest-900/60 hover:bg-forest-850/80 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="text-xs font-medium text-slate-400 theme-cream:text-editorial-muted truncate">
                  {day.dayName}
                </div>
                <div className="text-xs font-mono text-slate-400 theme-cream:text-editorial-muted-soft">
                  {day.date.split('-').slice(1).join('/')}
                </div>
              </div>

              {/* Day AQI Circle & Category */}
              <div className="my-1 flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-full border-2 flex items-center justify-center font-serif text-lg font-bold shadow-sm"
                  style={{
                    backgroundColor: `${day.category.color}20`,
                    borderColor: day.category.color,
                    color: day.category.color,
                  }}
                >
                  {day.avgAqi}
                </div>
                <span
                  className="text-[11px] font-semibold mt-1 tracking-tight text-center"
                  style={{ color: day.category.color }}
                >
                  {day.category.name}
                </span>
              </div>

              {/* Day Particulate Averages */}
              <div className="pt-2 border-t border-forest-800/60 theme-cream:border-editorial-hairline-soft text-[11px] font-mono text-slate-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Range:</span>
                  <strong className="text-slate-300">{day.minAqi}-{day.maxAqi}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM2.5:</span>
                  <strong className="text-slate-300">{day.avgPm25} µg</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Hourly Forecast Horizontal Scroll */
        <div className="p-4 rounded-xl border overflow-x-auto border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline">
          <div className="flex items-center gap-3 min-w-max">
            {upcomingHourly.map((pt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-forest-800/70 bg-forest-950/60 text-center w-28 shrink-0 space-y-1.5"
              >
                <div className="text-xs font-mono text-slate-400">
                  {pt.formattedHour}
                </div>
                <div className="font-serif text-xl font-bold text-white theme-cream:text-editorial-ink">
                  {pt.usAqi || 'N/A'}
                </div>
                <div className="text-[10px] font-mono text-emerald-400">
                  PM2.5: {pt.pm2_5 ? `${pt.pm2_5.toFixed(0)}µg` : '-'}
                </div>
                <div className="text-[10px] font-mono text-amber-400">
                  PM10: {pt.pm10 ? `${pt.pm10.toFixed(0)}µg` : '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Activity Planner Component */}
      <ActivityPlanner windows={activityWindows} />
    </div>
  );
};


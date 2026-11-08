import React from 'react';
import {
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Info,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { AirQualityData } from '../../types';
import { AQIGauge } from './AQIGauge';
import { formatDateTime } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface MainAQICardProps {
  data: AirQualityData;
}

export const MainAQICard: React.FC<MainAQICardProps> = ({ data }) => {
  const { location, usAqi, category, timestamp, source, interpretation, dominantPollutant } =
    data;

  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-xl transition-all border-forest-700/60 bg-forest-900/70 shadow-2xl theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline theme-cream:shadow-subtle">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: category.color }}
      />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Column: Location & Live Telemetry */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          {/* Location Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium bg-forest-800/80 border border-forest-700/80 text-mint-300 theme-cream:bg-editorial-canvas theme-cream:text-editorial-body-strong theme-cream:border-editorial-hairline">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {location.name}
                {location.admin1 ? `, ${location.admin1}` : ''}
              </span>
              <span className="text-xs text-slate-400 theme-cream:text-editorial-muted">
                {location.country} ({location.countryCode})
              </span>
              <Badge variant="default" size="sm" dot>
                Live Feed
              </Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white theme-cream:text-editorial-ink">
              {location.name} Air Quality
            </h1>
          </div>

          {/* Health Risk Indicator Tag */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5">
            {category.level <= 2 ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: category.color }}
            >
              {category.healthRisk}
            </span>
            <span className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              • Dominant: <strong className="text-slate-200 theme-cream:text-editorial-ink">{dominantPollutant.name}</strong>
            </span>
          </div>

          {/* Interpretation Card */}
          <div className="p-4 rounded-xl border bg-forest-950/60 border-forest-800 text-slate-200 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-body text-sm leading-relaxed relative">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-mint-400 theme-cream:text-editorial-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Environmental Intelligence Summary
            </div>
            <p>{interpretation}</p>
          </div>

          {/* Timestamp and Source Attribution */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-slate-400 theme-cream:text-editorial-muted font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Updated: {formatDateTime(timestamp)}
            </span>
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Source: {source}
            </span>
          </div>
        </div>

        {/* Right Column: Circular AQI Gauge */}
        <div className="shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-forest-950/40 border border-forest-800/80 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline">
          <AQIGauge aqi={usAqi} category={category} size={250} />
          
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              Based on official 24-hr particulate and gaseous breakpoints
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


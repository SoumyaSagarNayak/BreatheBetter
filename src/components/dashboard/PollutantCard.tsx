import React from 'react';
import { PollutantMeasurement } from '../../types';
import { formatValue } from '../../utils/formatters';
import { Info } from 'lucide-react';

interface PollutantCardProps {
  pollutant: PollutantMeasurement;
}

export const PollutantCard: React.FC<PollutantCardProps> = ({ pollutant }) => {
  const { symbol, name, value, unit, thresholdLabel, status, description, trend } =
    pollutant;

  const isAvailable = value !== null && !isNaN(value);

  // Status Color Mapping
  const statusConfig = {
    good: {
      label: 'Good',
      color: '#10b981',
      bgClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    moderate: {
      label: 'Moderate',
      color: '#f59e0b',
      bgClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    unhealthy_sensitive: {
      label: 'Sensitive Alert',
      color: '#f97316',
      bgClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    },
    unhealthy: {
      label: 'Unhealthy',
      color: '#ef4444',
      bgClass: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    very_unhealthy: {
      label: 'Very Unhealthy',
      color: '#a855f7',
      bgClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
    hazardous: {
      label: 'Hazardous',
      color: '#881337',
      bgClass: 'bg-rose-950/40 text-rose-400 border-rose-700/50',
    },
    unavailable: {
      label: 'Data Unavailable',
      color: '#94a3b8',
      bgClass: 'bg-slate-800/40 text-slate-400 border-slate-700/40',
    },
  }[status];

  // Generate lightweight SVG sparkline for 24h trend
  const renderSparkline = () => {
    if (!trend || trend.length < 2) return null;
    const min = Math.min(...trend);
    const max = Math.max(...trend);
    const range = max - min || 1;
    const width = 110;
    const height = 28;

    const points = trend
      .map((val, idx) => {
        const x = (idx / (trend.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <polyline
          fill="none"
          stroke={statusConfig.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="relative group flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 border-forest-800/80 bg-forest-900/60 hover:bg-forest-850/80 hover:border-forest-700 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:hover:bg-editorial-surface-soft">
      {/* Card Header: Symbol & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink">
            {symbol}
          </span>
          <p className="text-xs text-slate-400 theme-cream:text-editorial-muted line-clamp-1">
            {name}
          </p>
        </div>

        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-pill border tracking-tight ${statusConfig.bgClass}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Main Measurement */}
      <div className="my-3">
        {isAvailable ? (
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-medium text-white theme-cream:text-editorial-ink tracking-tight">
              {formatValue(value, 1)}
            </span>
            <span className="text-xs font-mono text-slate-400 theme-cream:text-editorial-muted">
              {unit}
            </span>
          </div>
        ) : (
          <div className="text-sm font-medium text-slate-400 theme-cream:text-editorial-muted py-1">
            Data unavailable
          </div>
        )}
      </div>

      {/* Health Threshold & Sparkline Footer */}
      <div className="pt-2 border-t border-forest-800/70 theme-cream:border-editorial-hairline-soft flex items-center justify-between text-xs text-slate-400 theme-cream:text-editorial-muted">
        <div className="space-y-0.5 max-w-[55%]">
          <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
            Threshold
          </span>
          <span className="text-[11px] font-mono text-slate-300 theme-cream:text-editorial-body block truncate">
            {thresholdLabel}
          </span>
        </div>

        <div className="shrink-0 flex flex-col items-end">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
            24h Trend
          </span>
          {renderSparkline()}
        </div>
      </div>
    </div>
  );
};


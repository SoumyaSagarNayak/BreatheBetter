import React from 'react';
import { AQICategory } from '../../types';

interface AQIGaugeProps {
  aqi: number;
  category: AQICategory;
  size?: number;
}

export const AQIGauge: React.FC<AQIGaugeProps> = ({
  aqi,
  category,
  size = 240,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc represents 270 degrees of rotation (from -135deg to +135deg)
  const arcLength = circumference * 0.75;
  // Progress clamped to 500 max AQI
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  const progressRatio = clampedAqi / 500;
  const strokeDashoffset = arcLength - progressRatio * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="rotate-[135deg] transform origin-center"
        >
          {/* Subtle Outer Glow Filter */}
          <defs>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="8"
                floodColor={category.color}
                floodOpacity="0.45"
              />
            </filter>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="25%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="75%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#881337" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            className="text-forest-800/80 dark:text-forest-800/80 theme-cream:text-editorial-hairline"
          />

          {/* Active Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={category.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter="url(#gauge-glow)"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 theme-cream:text-editorial-muted">
            US EPA AQI
          </span>
          <span
            className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-white theme-cream:text-editorial-ink mt-0.5"
            style={{
              textShadow: `0 0 20px ${category.color}40`,
            }}
          >
            {aqi}
          </span>
          <div
            className="mt-1 px-3 py-1 rounded-pill text-xs font-semibold tracking-wide border shadow-sm transition-colors"
            style={{
              backgroundColor: `${category.color}20`,
              borderColor: `${category.color}50`,
              color: category.color,
            }}
          >
            {category.name}
          </div>
        </div>
      </div>

      {/* Scale Indicator Marks */}
      <div className="flex items-center justify-between w-full max-w-[220px] text-[10px] font-mono text-slate-400 theme-cream:text-editorial-muted-soft -mt-4 px-2">
        <span>0 Good</span>
        <span>100</span>
        <span>200</span>
        <span>500 Haz</span>
      </div>
    </div>
  );
};


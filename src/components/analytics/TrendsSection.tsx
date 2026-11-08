import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { AirQualityData } from '../../types';

interface TrendsSectionProps {
  data: AirQualityData;
}

export const TrendsSection: React.FC<TrendsSectionProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '72h' | '7d'>('72h');
  const [metricTab, setMetricTab] = useState<'particulate' | 'aqi' | 'gases'>('particulate');

  const { hourly, timestamp } = data;

  // Filter hourly points according to selected time range
  const filteredData = useMemo(() => {
    if (!hourly || hourly.length === 0) return [];

    const nowIndex = hourly.findIndex((p) => !p.isForecast);
    const count = timeRange === '24h' ? 24 : timeRange === '72h' ? 72 : 168;

    // Center around "now" so we show past observations AND upcoming forecast
    const pastCount = Math.floor(count * 0.4);
    const futureCount = Math.floor(count * 0.6);

    const startIndex = Math.max(0, (nowIndex >= 0 ? nowIndex : 48) - pastCount);
    const endIndex = Math.min(hourly.length, startIndex + count);

    return hourly.slice(startIndex, endIndex).map((point) => {
      const displayLabel = `${point.formattedDate} ${point.formattedHour}`;
      return {
        ...point,
        displayLabel,
        tooltipTime: displayLabel,
        observationLabel: point.isForecast ? 'Forecast Projection' : 'Verified Observation',
      };
    });
  }, [hourly, timeRange]);

  // Find the exact index or time of "Now" for ReferenceLine demarcation
  const nowPoint = filteredData.find((p) => p.isForecast);

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
            <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
              Atmospheric Trends & Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
            Continuous temporal trajectory: historical records clearly separated from numerical forecast models
          </p>
        </div>

        {/* Controls: Metric Tabs & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/80 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline flex items-center gap-1 text-xs">
            <button
              onClick={() => setMetricTab('particulate')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'particulate'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink'
              }`}
            >
              PM2.5 / PM10
            </button>
            <button
              onClick={() => setMetricTab('aqi')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'aqi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink'
              }`}
            >
              US AQI
            </button>
            <button
              onClick={() => setMetricTab('gases')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'gases'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink'
              }`}
            >
              Trace Gases (NO₂/SO₂/O₃)
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/80 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline flex items-center gap-1 text-xs">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '24h'
                  ? 'bg-mint-500/20 text-mint-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('72h')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '72h'
                  ? 'bg-mint-500/20 text-mint-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              72h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '7d'
                  ? 'bg-mint-500/20 text-mint-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline shadow-lg">
        {/* Chart Subtitle & Forecast Separation Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-forest-800/60 theme-cream:border-editorial-hairline-soft text-xs text-slate-400 theme-cream:text-editorial-muted">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Recorded Historical Observations</span>
            <span className="text-slate-600 dark:text-slate-500">|</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-mint-300 bg-mint-500/20" />
            <span>Projected Numerical Forecast</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            WHO Guideline Line: <strong className="text-emerald-400">15 µg/m³</strong> (PM2.5)
          </div>
        </div>

        {/* Recharts Responsive Container */}
        <div className="w-full h-[360px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {metricTab === 'particulate' ? (
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="pm10Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d2e25" vertical={false} />
                <XAxis
                  dataKey="formattedHour"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit=" µg"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl border shadow-xl bg-forest-950/95 border-forest-700 text-slate-200 text-xs theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-ink space-y-1">
                          <div className="font-mono text-[11px] text-slate-400">
                            {pt.formattedDate}, {pt.formattedHour}
                          </div>
                          <div className="text-[10px] font-mono px-1.5 py-0.5 rounded inline-block bg-mint-500/15 text-mint-300">
                            {pt.observationLabel}
                          </div>
                          <div className="pt-1 space-y-1 font-mono">
                            <div className="flex items-center justify-between gap-4 text-emerald-400">
                              <span>PM2.5:</span>
                              <strong>{pt.pm2_5 ? `${pt.pm2_5.toFixed(1)} µg/m³` : 'N/A'}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-amber-400">
                              <span>PM10:</span>
                              <strong>{pt.pm10 ? `${pt.pm10.toFixed(1)} µg/m³` : 'N/A'}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                {nowPoint && (
                  <ReferenceLine
                    x={nowPoint.formattedHour}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    label={{
                      value: 'NOW (Forecast Start)',
                      position: 'top',
                      fill: '#c084fc',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                )}
                {/* WHO 24h Guideline Reference for PM2.5 */}
                <ReferenceLine
                  y={15}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  label={{
                    value: 'WHO PM2.5 Limit (15 µg/m³)',
                    position: 'insideBottomRight',
                    fill: '#10b981',
                    fontSize: 10,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pm2_5"
                  name="PM2.5 Fine Particulates"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pm25Grad)"
                />
                <Area
                  type="monotone"
                  dataKey="pm10"
                  name="PM10 Coarse Dust"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pm10Grad)"
                />
              </AreaChart>
            ) : metricTab === 'aqi' ? (
              <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d2e25" vertical={false} />
                <XAxis
                  dataKey="formattedHour"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, 400]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl border shadow-xl bg-forest-950/95 border-forest-700 text-slate-200 text-xs space-y-1">
                          <div className="font-mono text-[11px] text-slate-400">
                            {pt.formattedDate}, {pt.formattedHour}
                          </div>
                          <div className="font-bold text-white text-sm">
                            AQI: {pt.usAqi || 'N/A'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {pt.observationLabel}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                {nowPoint && (
                  <ReferenceLine
                    x={nowPoint.formattedHour}
                    stroke="#a855f7"
                    strokeDasharray="4 4"
                    label={{ value: 'NOW', position: 'top', fill: '#c084fc', fontSize: 10 }}
                  />
                )}
                {/* 100 Moderate Threshold */}
                <ReferenceLine
                  y={100}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  label={{ value: 'Moderate / Sensitive Line (100)', fill: '#f59e0b', fontSize: 10 }}
                />
                {/* 150 Unhealthy Threshold */}
                <ReferenceLine
                  y={150}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'Unhealthy Line (150)', fill: '#ef4444', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="usAqi"
                  name="US EPA Air Quality Index"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              </LineChart>
            ) : (
              /* Gaseous Pollutants Multi-Line */
              <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d2e25" vertical={false} />
                <XAxis
                  dataKey="formattedHour"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit=" µg"
                />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="ozone"
                  name="Ozone (O₃)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="nitrogen_dioxide"
                  name="Nitrogen Dioxide (NO₂)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="sulphur_dioxide"
                  name="Sulphur Dioxide (SO₂)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

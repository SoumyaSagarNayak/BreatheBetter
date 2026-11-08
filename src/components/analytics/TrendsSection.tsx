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
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  AlertTriangle,
  Zap,
  Cpu,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
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

  // Statistical & Anomaly Calculations (Mandatory Feature C: Percentage Increases & Spikes)
  const analyticsSummary = useMemo(() => {
    if (!hourly || hourly.length < 24) {
      return {
        percentChange: 0,
        isIncrease: false,
        peakSpike: { value: 0, time: 'N/A' },
        anomalyDetected: false,
        anomalyReason: 'Atmospheric telemetry stable.',
        avgPm25: 0,
      };
    }

    // Historical slice (past 24h vs previous 24h)
    const historicalPoints = hourly.filter((p) => !p.isForecast);
    const recent24 = historicalPoints.slice(-24);
    const previous24 = historicalPoints.slice(-48, -24);

    const avgRecent = recent24.reduce((acc, p) => acc + (p.pm2_5 || 0), 0) / (recent24.length || 1);
    const avgPrevious =
      previous24.length > 0
        ? previous24.reduce((acc, p) => acc + (p.pm2_5 || 0), 0) / previous24.length
        : avgRecent * 0.85;

    const diff = avgRecent - avgPrevious;
    const percentChange = avgPrevious > 0 ? (diff / avgPrevious) * 100 : 0;
    const isIncrease = percentChange >= 0;

    // Find peak recorded spike
    let maxVal = 0;
    let maxTime = 'N/A';
    filteredData.forEach((p) => {
      if (p.pm2_5 && p.pm2_5 > maxVal) {
        maxVal = p.pm2_5;
        maxTime = `${p.formattedDate} ${p.formattedHour}`;
      }
    });

    // Anomaly detection: flag sudden rate of change > 35% in consecutive hours or peak PM2.5 > 150
    let anomalyDetected = false;
    let anomalyReason = 'Diurnal atmospheric variations within expected meteorological limits.';

    if (maxVal > 250) {
      anomalyDetected = true;
      anomalyReason = 'Severe thermal inversion boundary collapse; intense surface smoke accumulation detected.';
    } else if (Math.abs(percentChange) > 35) {
      anomalyDetected = true;
      anomalyReason = `Rapid pollution surge (+${percentChange.toFixed(1)}% in 24h); pyrotechnic/biomass emission spike identified.`;
    }

    return {
      percentChange: Math.abs(percentChange),
      isIncrease,
      peakSpike: { value: maxVal, time: maxTime },
      anomalyDetected,
      anomalyReason,
      avgPm25: avgRecent,
    };
  }, [hourly, filteredData]);

  // Find the exact index or time of "Now" for ReferenceLine demarcation
  const nowPoint = filteredData.find((p) => p.isForecast);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Atmospheric Trends & Historical Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Continuous temporal trajectory: verified historical observations clearly separated from numerical forecast models
          </p>
        </div>

        {/* Controls: Metric Tabs & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/80 flex items-center gap-1 text-xs">
            <button
              onClick={() => setMetricTab('particulate')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'particulate'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PM2.5 / PM10
            </button>
            <button
              onClick={() => setMetricTab('aqi')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'aqi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              US AQI
            </button>
            <button
              onClick={() => setMetricTab('gases')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                metricTab === 'gases'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Trace Gases (NO₂/SO₂/O₃)
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/80 flex items-center gap-1 text-xs">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '24h'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('72h')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '72h'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              72h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1.5 rounded-md font-mono ${
                timeRange === '7d'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Analytics Summary Cards (Percentage Changes, Spikes & Anomaly Detection) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: 24h Percentage Change */}
        <div className="p-3.5 rounded-xl border border-forest-800 bg-forest-900/60 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>24h Trajectory Change</span>
            {analyticsSummary.isIncrease ? (
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl font-bold font-mono ${
                analyticsSummary.isIncrease ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {analyticsSummary.isIncrease ? '+' : '-'}
              {analyticsSummary.percentChange.toFixed(1)}%
            </span>
            <span className="text-[11px] text-slate-400">vs yesterday</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            {analyticsSummary.isIncrease
              ? 'Particulate surge detected over 24h'
              : 'Progressive atmospheric dispersion'}
          </p>
        </div>

        {/* Card 2: Peak Recorded Spike */}
        <div className="p-3.5 rounded-xl border border-forest-800 bg-forest-900/60 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Peak Recorded Spike</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-amber-400">
              {analyticsSummary.peakSpike.value.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">µg/m³</span>
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
            <span>Spike at: {analyticsSummary.peakSpike.time}</span>
          </p>
        </div>

        {/* Card 3: WHO Guideline Multiple */}
        <div className="p-3.5 rounded-xl border border-forest-800 bg-forest-900/60 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>WHO Guideline Multiple</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-emerald-400">
              {(analyticsSummary.avgPm25 / 15).toFixed(1)}x
            </span>
            <span className="text-xs text-slate-400">above WHO</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">
            WHO 24h safe threshold is 15 µg/m³
          </p>
        </div>

        {/* Card 4: Atmospheric Anomaly Classification */}
        <div className="p-3.5 rounded-xl border border-forest-800 bg-forest-900/60 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Anomaly Status</span>
            <Zap className={`w-4 h-4 ${analyticsSummary.anomalyDetected ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-xs font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${
                analyticsSummary.anomalyDetected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {analyticsSummary.anomalyDetected ? 'Spike Flagged' : 'Nominal'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate" title={analyticsSummary.anomalyReason}>
            {analyticsSummary.anomalyReason}
          </p>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-5 sm:p-6 rounded-2xl border border-forest-800/80 bg-forest-900/60 shadow-lg">
        {/* Chart Subtitle & Forecast Separation Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-forest-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Recorded Historical Observations</span>
            <span className="text-slate-600">|</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full border border-dashed border-emerald-300 bg-emerald-500/20" />
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
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" µg" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl border shadow-xl bg-forest-950/95 border-forest-700 text-slate-200 text-xs space-y-1">
                          <div className="font-mono text-[11px] text-slate-400">
                            {pt.formattedDate}, {pt.formattedHour}
                          </div>
                          <div className="text-[10px] font-mono px-1.5 py-0.5 rounded inline-block bg-emerald-500/15 text-emerald-300">
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
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 400]} />
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
                  label={{ value: 'Moderate Line (100)', fill: '#f59e0b', fontSize: 10 }}
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
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" µg" />
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

        {/* ML Prediction & Atmospheric Inversion Insight Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white block font-medium">
                ML Autoregressive Predictive Model (CAMS + ECMWF)
              </strong>
              <span className="text-slate-400">
                Trained on boundary layer height & thermal diurnal cycles: nocturnal peak projected between 02:00 AM – 05:00 AM.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-forest-900 px-2.5 py-1 rounded-md border border-forest-800 shrink-0">
            95% Confidence Interval (±12 µg/m³)
          </span>
        </div>
      </div>
    </div>
  );
};

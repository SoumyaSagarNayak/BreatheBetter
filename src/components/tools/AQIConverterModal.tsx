import React, { useState } from 'react';
import { Calculator, X, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface AQIConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AQIConverterModal: React.FC<AQIConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pm25, setPm25] = useState<number>(68);

  if (!isOpen) return null;

  // Calculate US EPA AQI from PM2.5
  const calcUsAqi = (c: number): number => {
    if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0)) * (c - 0) + 0);
    if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
    if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
    if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
    if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
    if (c <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
    return Math.min(500, Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401));
  };

  // Calculate Indian National AQI (NAQI) from PM2.5
  const calcIndianNaqi = (c: number): { aqi: number; label: string; color: string } => {
    let aqi = 0;
    if (c <= 30) {
      aqi = Math.round((50 / 30) * c);
      return { aqi, label: 'Good', color: '#10b981' };
    }
    if (c <= 60) {
      aqi = Math.round(50 + ((100 - 50) / (60 - 30)) * (c - 30));
      return { aqi, label: 'Satisfactory', color: '#84cc16' };
    }
    if (c <= 90) {
      aqi = Math.round(100 + ((200 - 100) / (90 - 60)) * (c - 60));
      return { aqi, label: 'Moderately Polluted', color: '#f59e0b' };
    }
    if (c <= 120) {
      aqi = Math.round(200 + ((300 - 200) / (120 - 90)) * (c - 90));
      return { aqi, label: 'Poor', color: '#f97316' };
    }
    if (c <= 250) {
      aqi = Math.round(300 + ((400 - 300) / (250 - 120)) * (c - 120));
      return { aqi, label: 'Very Poor', color: '#ef4444' };
    }
    aqi = Math.min(500, Math.round(400 + ((500 - 400) / (380 - 250)) * (c - 250)));
    return { aqi, label: 'Severe', color: '#881337' };
  };

  // European CAQI approximation
  const calcEuropeanCaqi = (c: number): { caqi: number; label: string } => {
    if (c <= 15) return { caqi: Math.round((25 / 15) * c), label: 'Very Low' };
    if (c <= 30) return { caqi: Math.round(25 + (25 / 15) * (c - 15)), label: 'Low' };
    if (c <= 55) return { caqi: Math.round(50 + (25 / 25) * (c - 30)), label: 'Medium' };
    if (c <= 110) return { caqi: Math.round(75 + (25 / 55) * (c - 55)), label: 'High' };
    return { caqi: 100, label: 'Very High' };
  };

  const usAqi = calcUsAqi(pm25);
  const indianNaqi = calcIndianNaqi(pm25);
  const europeanCaqi = calcEuropeanCaqi(pm25);
  const whoRatio = (pm25 / 15).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-7 rounded-2xl border shadow-2xl bg-forest-900 border-forest-700 text-slate-100 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-ink space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white theme-cream:text-editorial-muted"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-primary">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
              Multi-Scale AQI & Concentration Converter
            </h3>
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              Map raw particulate density across US EPA, Indian NAQI, and European CAQI standards
            </p>
          </div>
        </div>

        {/* Slider & Input */}
        <div className="space-y-3 p-4 rounded-xl bg-forest-950/70 border border-forest-800 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-body">
              PM2.5 Ambient Concentration (µg/m³)
            </label>
            <div className="flex items-center gap-1 font-mono font-bold text-lg text-mint-400 theme-cream:text-editorial-primary">
              <input
                type="number"
                min="0"
                max="500"
                value={pm25}
                onChange={(e) => setPm25(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
                className="w-16 px-2 py-0.5 rounded bg-forest-900 border border-forest-750 text-right text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-mint-500 theme-cream:bg-editorial-canvas theme-cream:text-editorial-ink"
              />
              <span className="text-xs text-slate-400">µg/m³</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="350"
            value={pm25}
            onChange={(e) => setPm25(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />

          {/* Quick Presets */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Presets:</span>
            <button
              onClick={() => setPm25(15)}
              className="hover:text-emerald-400 underline underline-offset-2"
            >
              WHO (15 µg)
            </button>
            <button
              onClick={() => setPm25(60)}
              className="hover:text-amber-400 underline underline-offset-2"
            >
              Indian Std (60 µg)
            </button>
            <button
              onClick={() => setPm25(150)}
              className="hover:text-orange-400 underline underline-offset-2"
            >
              Moderate Smog (150 µg)
            </button>
            <button
              onClick={() => setPm25(300)}
              className="hover:text-rose-400 underline underline-offset-2"
            >
              Post-Diwali Peak (300 µg)
            </button>
          </div>
        </div>

        {/* 3 Simultaneous Standard Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* US EPA */}
          <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              US EPA AQI
            </span>
            <span className="font-serif text-3xl font-bold text-white theme-cream:text-editorial-ink">
              {usAqi}
            </span>
            <span className="text-[11px] block text-slate-300">
              0-500 Scale
            </span>
          </div>

          {/* Indian NAQI */}
          <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Indian NAQI
            </span>
            <span
              className="font-serif text-3xl font-bold"
              style={{ color: indianNaqi.color }}
            >
              {indianNaqi.aqi}
            </span>
            <span
              className="text-[11px] font-medium block"
              style={{ color: indianNaqi.color }}
            >
              {indianNaqi.label}
            </span>
          </div>

          {/* European CAQI */}
          <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              European CAQI
            </span>
            <span className="font-serif text-3xl font-bold text-sky-400">
              {europeanCaqi.caqi}
            </span>
            <span className="text-[11px] block text-slate-300">
              {europeanCaqi.label}
            </span>
          </div>
        </div>

        {/* WHO Guideline Multiple Banner */}
        <div className="p-3 rounded-lg bg-forest-950/60 border border-forest-850 flex items-center justify-between text-xs text-slate-300">
          <span>WHO 24-hr Health Ratio:</span>
          <span className="font-mono font-bold text-amber-400">
            {whoRatio}x Safe Limit
          </span>
        </div>
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Sparkles, Flame, Wind, ShieldCheck, AlertTriangle, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/Button';

export const DiwaliSmogWatch: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'seasonality' | 'chemistry' | 'actions'>('seasonality');

  return (
    <div className="relative overflow-hidden rounded-2xl border transition-all duration-300 border-amber-500/30 bg-gradient-to-br from-forest-900/90 via-forest-950 to-charcoal-950 theme-cream:from-editorial-surface-card theme-cream:via-editorial-canvas theme-cream:to-editorial-surface-soft theme-cream:border-editorial-hairline shadow-xl p-6 sm:p-7">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-forest-800/80 theme-cream:border-editorial-hairline-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-glow-mod">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Special Challenge Module
              </span>
              <span className="text-xs text-slate-400 theme-cream:text-editorial-muted font-mono">
                Diwali 2026 Edition
              </span>
            </div>
            <h3 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink mt-0.5">
              Seasonal Smog & Diwali Air Quality Observatory
            </h3>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-xs flex items-center gap-1.5"
        >
          {isExpanded ? (
            <>
              Collapse Guide <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Explore Smog Insights <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Overview Teaser */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-forest-950/60 border border-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
          <span className="font-semibold text-amber-300 block mb-1">
            Thermal Inversion Layer
          </span>
          <p className="text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            Cool winter air traps ground-level smoke beneath a warm atmospheric lid, causing particulate concentration to spike up to 8x normal background levels.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-forest-950/60 border border-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
          <span className="font-semibold text-emerald-400 block mb-1">
            Green Crackers vs Conventional
          </span>
          <p className="text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            SWAS, STAR, and SAFAL formulations developed by CSIR-NEERI reduce particulate emissions by 30-35% and eliminate banned barium salts.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-forest-950/60 border border-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
          <span className="font-semibold text-sky-400 block mb-1">
            Agricultural Stubble Interaction
          </span>
          <p className="text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            North-westerly winds transport post-harvest biomass plumes, combining with urban vehicle emissions to create dense photochemical winter smog.
          </p>
        </div>
      </div>

      {/* Expanded Interactive Tabs */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t border-forest-800/80 theme-cream:border-editorial-hairline space-y-4 animate-fadeIn">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-forest-850 pb-2">
            <button
              onClick={() => setActiveTab('seasonality')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'seasonality'
                  ? 'bg-amber-500 text-forest-950 font-bold'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
              }`}
            >
              Temporal Accumulation Curve
            </button>
            <button
              onClick={() => setActiveTab('chemistry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chemistry'
                  ? 'bg-amber-500 text-forest-950 font-bold'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
              }`}
            >
              Chemical Fingerprint
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'actions'
                  ? 'bg-amber-500 text-forest-950 font-bold'
                  : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
              }`}
            >
              Protective Protocol
            </button>
          </div>

          {/* Tab 1: Seasonality */}
          {activeTab === 'seasonality' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 theme-cream:bg-editorial-canvas space-y-2">
                <span className="font-mono text-emerald-400 font-bold">1. Pre-Diwali Baseline (Days -5 to -1)</span>
                <p className="text-slate-300 theme-cream:text-editorial-body">
                  Background AQI averages 120-180 in Northern cities, influenced mainly by slow surface wind speeds and regional stubble burning.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-forest-950/80 border border-amber-500/40 theme-cream:bg-editorial-canvas space-y-2">
                <span className="font-mono text-amber-400 font-bold">2. Festival Night Spike (Hour 0 to +12h)</span>
                <p className="text-slate-300 theme-cream:text-editorial-body">
                  Pyrotechnic ignition causes instantaneous PM2.5 concentrations to breach 400-800 µg/m³, exceeding WHO guidelines by over 30x.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 theme-cream:bg-editorial-canvas space-y-2">
                <span className="font-mono text-sky-400 font-bold">3. Dispersal Window (Days +2 to +6)</span>
                <p className="text-slate-300 theme-cream:text-editorial-body">
                  Rate of clearance depends directly on planetary boundary layer height and surface wind currents exceeding 15 km/h.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Chemical Fingerprint */}
          {activeTab === 'chemistry' && (
            <div className="p-4 rounded-xl bg-forest-950/80 border border-forest-800 theme-cream:bg-editorial-canvas text-xs space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 rounded bg-forest-900 border border-forest-850">
                  <strong className="text-amber-400 block">Barium (Ba)</strong>
                  <span className="text-[11px] text-slate-400">Green fire emission; respiratory and muscular toxicant.</span>
                </div>
                <div className="p-2.5 rounded bg-forest-900 border border-forest-850">
                  <strong className="text-rose-400 block">Strontium (Sr)</strong>
                  <span className="text-[11px] text-slate-400">Red flame coloring; lung and bone tissue accumulation.</span>
                </div>
                <div className="p-2.5 rounded bg-forest-900 border border-forest-850">
                  <strong className="text-sky-400 block">Potassium Nitrate</strong>
                  <span className="text-[11px] text-slate-400">Oxidizer agent generating toxic Nitrogen Oxides (NOx).</span>
                </div>
                <div className="p-2.5 rounded bg-forest-900 border border-forest-850">
                  <strong className="text-purple-400 block">Sulfur Powder</strong>
                  <span className="text-[11px] text-slate-400">Burns into pungent Sulfur Dioxide (SO₂) gas.</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Actions */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 theme-cream:bg-editorial-canvas space-y-1">
                <strong className="text-emerald-400 block">Indoor Air Isolation Protocol</strong>
                <p className="text-slate-300 theme-cream:text-editorial-body">
                  Keep windows and doors securely sealed between 6:00 PM and 9:00 AM during festival days. Place damp towels along door draft gaps.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-forest-950/80 border border-forest-800 theme-cream:bg-editorial-canvas space-y-1">
                <strong className="text-emerald-400 block">HEPA Purifier Operation</strong>
                <p className="text-slate-300 theme-cream:text-editorial-body">
                  Run true HEPA air cleaners on high setting in bedrooms at least 2 hours before sleeping. Verify carbon pre-filter is free of dust.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


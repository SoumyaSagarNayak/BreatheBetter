import React, { useState } from 'react';
import { ActivityWindow } from '../../types';
import { Footprints, CheckCircle2, AlertCircle, XCircle, Filter } from 'lucide-react';

interface ActivityPlannerProps {
  windows: ActivityWindow[];
}

export const ActivityPlanner: React.FC<ActivityPlannerProps> = ({ windows }) => {
  const [filterType, setFilterType] = useState<'all' | 'running' | 'kids'>('all');

  // Filter windows based on selected activity filter
  const filteredSlots = windows.slice(0, 18).filter((slot) => {
    if (filterType === 'running') return slot.suitableForRunners;
    if (filterType === 'kids') return slot.suitableForKids;
    return true;
  });

  const getRatingBadge = (rating: ActivityWindow['rating']) => {
    switch (rating) {
      case 'Optimal':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-pill bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Optimal Window
          </span>
        );
      case 'Moderate':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-pill bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            Moderate Caution
          </span>
        );
      case 'Poor':
      case 'Hazardous':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-pill bg-red-500/15 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            Shift Indoors
          </span>
        );
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
          <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
            Smart Outdoor Activity Planner
          </h3>
        </div>

        {/* Activity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-forest-800 bg-forest-950/80 text-xs theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterType === 'all'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
            }`}
          >
            All Hours
          </button>
          <button
            onClick={() => setFilterType('running')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              filterType === 'running'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
            }`}
          >
            🏃 Running Safe
          </button>
          <button
            onClick={() => setFilterType('kids')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              filterType === 'kids'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-white theme-cream:text-editorial-muted'
            }`}
          >
            🧒 Kids Play
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
        Algorithmic recommendation engine matching forecasted particulate concentrations against aerobic respiration thresholds for runners, children, and outdoor workers.
      </p>

      {/* Hourly Window Cards Grid */}
      {filteredSlots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSlots.slice(0, 12).map((slot, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-forest-800/70 bg-forest-950/60 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline space-y-2 hover:border-forest-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-slate-200 theme-cream:text-editorial-body-strong">
                  {slot.timeLabel}
                </span>
                {getRatingBadge(slot.rating)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 theme-cream:text-editorial-muted">
                  Projected AQI: <strong className="text-white theme-cream:text-editorial-ink font-mono">{slot.aqi}</strong>
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className={slot.suitableForRunners ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}>
                    🏃 Running
                  </span>
                  <span className={slot.suitableForKids ? 'text-emerald-400 font-medium' : 'text-slate-500 line-through'}>
                    🧒 Kids Play
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 theme-cream:text-editorial-muted pt-1 border-t border-forest-850/80 theme-cream:border-editorial-hairline-soft">
                {slot.advice}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-slate-400 rounded-xl border border-forest-800 bg-forest-950/40">
          No upcoming hours meet the strict safety threshold for this activity filter in the current forecast cycle. Please consider indoor workouts or waiting for daytime solar convection.
        </div>
      )}
    </div>
  );
};

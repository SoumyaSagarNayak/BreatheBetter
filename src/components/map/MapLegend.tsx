import React from 'react';
import { AQI_CATEGORIES } from '../../utils/aqi';
import { AQICategoryLevel } from '../../types';

export const MapLegend: React.FC = () => {
  const levels: AQICategoryLevel[] = [1, 2, 3, 4, 5, 6];

  return (
    <div className="p-3 rounded-xl border backdrop-blur-md bg-forest-950/85 border-forest-800 text-slate-200 theme-cream:bg-editorial-canvas/90 theme-cream:border-editorial-hairline theme-cream:text-editorial-ink shadow-lg">
      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 theme-cream:text-editorial-muted mb-2 font-medium">
        US EPA AQI Spectrum
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {levels.map((lvl) => {
          const cat = AQI_CATEGORIES[lvl];
          return (
            <div key={lvl} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: cat.color }}
              />
              <span className="font-mono text-[11px] text-slate-300 theme-cream:text-editorial-body truncate">
                {cat.min}-{cat.max > 300 ? '500+' : cat.max}: {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


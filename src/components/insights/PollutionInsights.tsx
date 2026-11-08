import React, { useState } from 'react';
import {
  Lightbulb,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Droplets,
  BookOpen,
} from 'lucide-react';
import { AirQualityData } from '../../types';
import { Button } from '../ui/Button';

interface PollutionInsightsProps {
  data: AirQualityData;
}

export const PollutionInsights: React.FC<PollutionInsightsProps> = ({ data }) => {
  const { dominantPollutant, pollutants, location, usAqi, hourly } = data;
  const [selectedGlossary, setSelectedGlossary] = useState<string | null>(null);

  // Compute 24h diurnal fluctuation: max vs min hourly AQI
  const recent24 = hourly.slice(0, 24);
  const aqis24 = recent24
    .map((h) => h.usAqi)
    .filter((v): v is number => v !== null);
  const min24 = aqis24.length ? Math.min(...aqis24) : usAqi;
  const max24 = aqis24.length ? Math.max(...aqis24) : usAqi;
  const variance = max24 - min24;

  const glossaryData: Record<
    string,
    { name: string; formula: string; source: string; health: string; mitigation: string }
  > = {
    pm2_5: {
      name: 'Fine Particulate Matter (PM2.5)',
      formula: 'Solid & liquid particles ≤ 2.5 µm',
      source: 'Vehicular exhaust, coal combustion, agricultural stubble burning, wildfire smoke, industrial emissions.',
      health: 'Bypasses respiratory cilia, enters deep lung alveoli, and crosses into vascular circulation, triggering systemic arterial inflammation.',
      mitigation: 'Wear certified N95/FFP2 masks outdoors; run indoor HEPA filtration systems.',
    },
    pm10: {
      name: 'Coarse Particulates (PM10)',
      formula: 'Inhalable particles ≤ 10 µm',
      source: 'Road dust resuspension, construction debris, mechanical crushing, pollen, and windblown soil.',
      health: 'Deposits in upper respiratory airways and nasal membranes, aggravating sinusitis, allergic rhinitis, and asthma.',
      mitigation: 'Seal building window frames, wet-mop indoor surfaces, and avoid dry sweeping.',
    },
    nitrogen_dioxide: {
      name: 'Nitrogen Dioxide (NO2)',
      formula: 'NO₂',
      source: 'High-temperature fossil fuel combustion in diesel engines, power generation plants, and gas stoves.',
      health: 'Potent pulmonary irritant causing airway spasms and increasing susceptibility to bronchial infections.',
      mitigation: 'Avoid walking beside heavy diesel congestion; ensure kitchen range hoods vent externally.',
    },
    ozone: {
      name: 'Ground-Level Ozone (O3)',
      formula: 'O₃',
      source: 'Secondary photochemical reaction between sunlight, atmospheric oxygen, NOx, and volatile organic hydrocarbons (VOCs).',
      health: 'Corrosive oxidant causing sunburn-like damage to lung tissue, coughing, and chest pain during deep inhalation.',
      mitigation: 'Avoid vigorous outdoor aerobic exercise during peak afternoon sunlight (1 PM to 5 PM).',
    },
    sulphur_dioxide: {
      name: 'Sulphur Dioxide (SO2)',
      formula: 'SO₂',
      source: 'Combustion of sulfur-rich heavy fuel oil, thermal coal plants, and mineral ore extraction.',
      health: 'Causes acute reflexive constriction of bronchial passages within minutes of breathing.',
      mitigation: 'Stay in sealed indoor environments with alkaline carbon air purifiers.',
    },
    carbon_monoxide: {
      name: 'Carbon Monoxide (CO)',
      formula: 'CO',
      source: 'Incomplete combustion of carbon fuels in motor vehicles, unvented indoor heaters, and biomass burning.',
      health: 'Affinity for hemoglobin is 200x higher than oxygen, forming carboxyhemoglobin and causing cerebral hypoxia.',
      mitigation: 'Ensure proper residential ventilation; never operate fuel generators or charcoal indoors.',
    },
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
          <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
            Atmospheric Intelligence Insights
          </h2>
        </div>
        <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
          Data-driven environmental findings calculated directly from authentic measurements in {location.name}
        </p>
      </div>

      {/* 3 Insight Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Insight 1: Dominant Driver */}
        <div className="p-5 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-mint-400 theme-cream:text-editorial-primary">
            Primary Air Driver
          </span>
          <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
            {dominantPollutant.name}
          </h3>
          <p className="text-xs text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            Concentrations currently register at{' '}
            <strong className="text-white theme-cream:text-editorial-ink">
              {dominantPollutant.ratioToWHO.toFixed(1)}x
            </strong>{' '}
            the World Health Organization 24-hr guideline threshold, making it the principal contributor to the current {usAqi} US AQI rating.
          </p>
        </div>

        {/* Insight 2: Diurnal Particulate Variance */}
        <div className="p-5 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
            24-Hour Diurnal Delta
          </span>
          <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
            {variance} Points Swing
          </h3>
          <p className="text-xs text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            Lowest recorded AQI was <strong className="text-emerald-400">{min24}</strong>, peaking at{' '}
            <strong className="text-rose-400">{max24}</strong>. Typical nocturnal thermal inversion traps vehicle exhaust near the ground until solar convection mixes the boundary layer.
          </p>
        </div>

        {/* Insight 3: Photochemical & Humidity Interaction */}
        <div className="p-5 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400">
            Chemical Dynamics
          </span>
          <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
            Secondary Smog Potential
          </h3>
          <p className="text-xs text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            With Ground Ozone at{' '}
            <strong className="text-white theme-cream:text-editorial-ink">
              {pollutants.ozone.value ? `${pollutants.ozone.value.toFixed(0)} µg/m³` : 'N/A'}
            </strong>{' '}
            and NO2 at{' '}
            <strong className="text-white theme-cream:text-editorial-ink">
              {pollutants.nitrogen_dioxide.value ? `${pollutants.nitrogen_dioxide.value.toFixed(0)} µg/m³` : 'N/A'}
            </strong>
            , atmospheric chemical interactions accelerate particulate nucleation under direct sunlight.
          </p>
        </div>
      </div>

      {/* Educational Pollutant Awareness Accordion */}
      <div className="p-5 sm:p-6 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-mint-400 theme-cream:text-editorial-primary" />
            <h3 className="font-serif text-lg font-normal text-white theme-cream:text-editorial-ink">
              Environmental Education: Atmospheric Pollutant Directory
            </h3>
          </div>
          <span className="text-xs text-slate-400 theme-cream:text-editorial-muted">
            Click any pollutant for chemical profile
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(glossaryData).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedGlossary(selectedGlossary === key ? null : key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedGlossary === key
                  ? 'border-mint-500 bg-forest-800/90 text-white shadow-sm'
                  : 'border-forest-800 bg-forest-950/60 text-slate-300 hover:bg-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline theme-cream:text-editorial-body'
              }`}
            >
              <span className="font-mono text-xs font-bold block">{item.formula}</span>
              <span className="text-[11px] text-slate-400 theme-cream:text-editorial-muted truncate block">
                {item.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Detail Modal / Panel */}
        {selectedGlossary && glossaryData[selectedGlossary] && (
          <div className="p-4 rounded-xl border border-mint-500/30 bg-forest-950/90 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-primary/30 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-medium text-mint-300 theme-cream:text-editorial-primary">
                {glossaryData[selectedGlossary].name}
              </h4>
              <button
                onClick={() => setSelectedGlossary(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-slate-300 theme-cream:text-editorial-body">
              <div>
                <strong className="text-slate-400 block mb-0.5">Primary Sources:</strong>
                <p>{glossaryData[selectedGlossary].source}</p>
              </div>
              <div>
                <strong className="text-slate-400 block mb-0.5">Physiological Impact:</strong>
                <p>{glossaryData[selectedGlossary].health}</p>
              </div>
              <div>
                <strong className="text-slate-400 block mb-0.5">Protective Mitigation:</strong>
                <p>{glossaryData[selectedGlossary].mitigation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


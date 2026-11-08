import React, { useState } from 'react';
import {
  HeartPulse,
  Baby,
  UserCheck,
  HeartHandshake,
  ShieldAlert,
  Flame,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { AQICategoryLevel } from '../../types';
import {
  getPersonaGuidance,
  getActionableSteps,
  MEDICAL_DISCLAIMER,
} from '../../utils/healthAdvice';

interface HealthRecommendationsProps {
  level: AQICategoryLevel;
  aqi: number;
}

export const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({
  level,
  aqi,
}) => {
  const personas = getPersonaGuidance(level);
  const actionableSteps = getActionableSteps(level);
  const [selectedPersona, setSelectedPersona] = useState<string>('general');

  const activePersona = personas.find((p) => p.id === selectedPersona) || personas[0];

  const getPersonaIcon = (id: string) => {
    switch (id) {
      case 'general':
        return <UserCheck className="w-4 h-4" />;
      case 'kids':
        return <Baby className="w-4 h-4" />;
      case 'seniors':
        return <HeartHandshake className="w-4 h-4" />;
      case 'respiratory':
        return <ShieldAlert className="w-4 h-4" />;
      case 'athletes':
        return <Flame className="w-4 h-4" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'safe':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'caution':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'warning':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'danger':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
          <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
            Targeted Health & Safety Advisory
          </h2>
        </div>
        <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
          Epidemiological exposure guidelines based on WHO 2021 air quality standards and US EPA clinical benchmarks
        </p>
      </div>

      {/* Persona Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {personas.map((p) => {
          const isSelected = p.id === selectedPersona;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-forest-900/70 text-slate-300 border-forest-800 hover:bg-forest-850 hover:text-white theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-body'
              }`}
            >
              {getPersonaIcon(p.id)}
              <span>{p.title}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Persona Deep Advice Card */}
      <div className="p-6 rounded-2xl border border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-forest-800/70 theme-cream:border-editorial-hairline-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800/80 flex items-center justify-center text-mint-400 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-primary">
              {getPersonaIcon(activePersona.id)}
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
                {activePersona.title} Guidance
              </h3>
              <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
                Current Ambient Severity: US AQI {aqi}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-pill text-xs font-mono uppercase tracking-wider border font-medium ${getActionBadgeColor(
              activePersona.action
            )}`}
          >
            {activePersona.shortTag}
          </span>
        </div>

        <p className="text-sm text-slate-200 theme-cream:text-editorial-body leading-relaxed">
          {activePersona.advice}
        </p>

        {/* Specific Actionable Bullet Points */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 theme-cream:text-editorial-muted block">
            Recommended Clinical Precautions
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activePersona.specifics.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-forest-950/60 border border-forest-850/80 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline text-xs text-slate-300 theme-cream:text-editorial-body"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Protective Steps Grid (N95, HEPA, Ventilation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actionableSteps.map((step, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all ${
              step.recommended
                ? 'bg-forest-900/80 border-mint-500/30 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-primary/30'
                : 'bg-forest-950/40 border-forest-850 opacity-70 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white theme-cream:text-editorial-ink">
                {step.title}
              </span>
              <span
                className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  step.recommended
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step.recommended ? 'Urgent' : 'Optional'}
              </span>
            </div>
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl border border-forest-800/80 bg-forest-950/70 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline flex items-start gap-3 text-xs text-slate-400 theme-cream:text-editorial-muted">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{MEDICAL_DISCLAIMER}</p>
      </div>
    </div>
  );
};


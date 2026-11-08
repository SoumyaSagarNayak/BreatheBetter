import React from 'react';
import { Wind, Heart, ShieldCheck, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-forest-800/80 bg-forest-950 text-slate-400 theme-cream:bg-editorial-surface-dark theme-cream:text-editorial-on-dark-soft theme-cream:border-editorial-hairline py-12 px-4 sm:px-6 lg:px-8 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-forest-900 border border-emerald-500/30">
                <img
                  src="/leaf-wind-logo.svg"
                  alt="Logo"
                  className="w-5 h-5 object-contain"
                />
              </div>
              <span className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-on-dark tracking-tight">
                BreatheBetter
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-slate-300 theme-cream:text-editorial-on-dark-soft">
              Real-time environmental air quality intelligence platform designed for the{' '}
              <strong className="text-white theme-cream:text-editorial-on-dark">
                Let's Code Diwali Challenge 2026: Breathe Better
              </strong>
              . Delivering authentic atmospheric telemetry, granular pollutant diagnostics, and predictive health advisories.
            </p>
            <div className="text-xs font-mono text-emerald-400 theme-cream:text-mint-400 pt-1">
              "Breathe Better. Build Smarter."
            </div>
          </div>

          {/* Authentic Data Sources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-on-dark font-semibold">
              Authentic Data Ingestion
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://open-meteo.com/en/docs/air-quality-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-mint-400" />
                  Open-Meteo Air Quality API
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://atmosphere.copernicus.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-mint-400" />
                  Copernicus (CAMS) Models
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/publications/i/item/9789240034228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-mint-400" />
                  WHO 2021 Reference Standards
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.openstreetmap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-mint-400" />
                  OpenStreetMap Cartography
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Challenge & Standards */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-on-dark font-semibold">
              Standards & Integrity
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 theme-cream:text-editorial-on-dark-soft">
              Zero fabricated measurements. Every metric on screen corresponds to an authentic spatial-temporal payload with verified timestamps.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Engineered with React, TypeScript, Leaflet & Recharts.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-forest-900 theme-cream:border-editorial-hairline/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} BreatheBetter Platform. Built for Let's Code Diwali 2026.
          </div>
          <div className="text-slate-500">
            Know Your Air. Protect Your Health.
          </div>
        </div>
      </div>
    </footer>
  );
};


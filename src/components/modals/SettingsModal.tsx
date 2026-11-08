import React, { useState } from 'react';
import { Settings, X, Database, Key, Trash2, CheckCircle, Info } from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { Button } from '../ui/Button';
import { CacheService } from '../../services/cache';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    aqiScale,
    setAqiScale,
    waqiToken,
    openaqKey,
    setApiTokens,
    refreshData,
  } = useAirQuality();

  const [localWaqi, setLocalWaqi] = useState(waqiToken);
  const [localOpenaq, setLocalOpenaq] = useState(openaqKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  if (!isOpen) return null;

  const handleSaveTokens = (e: React.FormEvent) => {
    e.preventDefault();
    setApiTokens(localWaqi.trim(), localOpenaq.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearCache = () => {
    CacheService.clearAll();
    setCacheCleared(true);
    refreshData();
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl border shadow-2xl bg-forest-900 border-forest-700 text-slate-100 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-ink space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-primary">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-normal text-white theme-cream:text-editorial-ink">
              Platform Configuration & Keys
            </h3>
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              Manage environmental calculation scales, API credentials, and cache
            </p>
          </div>
        </div>

        {/* AQI Scale Selection */}
        <div className="space-y-2 pt-1">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-body block">
            Primary Air Quality Scale
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setAqiScale('US')}
              className={`p-3 rounded-xl border text-left transition-all ${
                aqiScale === 'US'
                  ? 'border-mint-500 bg-forest-800 text-white font-medium theme-cream:border-editorial-primary theme-cream:bg-editorial-primary/10 theme-cream:text-editorial-primary'
                  : 'border-forest-800 bg-forest-950/60 text-slate-400 hover:text-white theme-cream:border-editorial-hairline theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-muted'
              }`}
            >
              <strong className="block mb-0.5">US EPA Standard</strong>
              <span className="text-[11px] opacity-80">0-500 scale with particulate breakpoints</span>
            </button>
            <button
              type="button"
              onClick={() => setAqiScale('EU')}
              className={`p-3 rounded-xl border text-left transition-all ${
                aqiScale === 'EU'
                  ? 'border-mint-500 bg-forest-800 text-white font-medium theme-cream:border-editorial-primary theme-cream:bg-editorial-primary/10 theme-cream:text-editorial-primary'
                  : 'border-forest-800 bg-forest-950/60 text-slate-400 hover:text-white theme-cream:border-editorial-hairline theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-muted'
              }`}
            >
              <strong className="block mb-0.5">European CAQI</strong>
              <span className="text-[11px] opacity-80">0-100+ Common Air Quality Index</span>
            </button>
          </div>
        </div>

        {/* Optional Custom API Credentials */}
        <form onSubmit={handleSaveTokens} className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 theme-cream:text-editorial-body">
              Optional Secondary Data Tokens
            </label>
            <span className="text-[10px] text-mint-400 theme-cream:text-editorial-primary font-mono">
              (Never required for core features)
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] text-slate-400 theme-cream:text-editorial-muted block mb-1">
                World Air Quality Index (WAQI) Token:
              </span>
              <input
                type="password"
                placeholder="Enter personal WAQI token if available"
                value={localWaqi}
                onChange={(e) => setLocalWaqi(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-forest-950 border border-forest-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-mint-500 theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-ink theme-cream:border-editorial-hairline"
              />
            </div>

            <div>
              <span className="text-[11px] text-slate-400 theme-cream:text-editorial-muted block mb-1">
                OpenAQ API Key:
              </span>
              <input
                type="password"
                placeholder="Enter OpenAQ v3 API key if available"
                value={localOpenaq}
                onChange={(e) => setLocalOpenaq(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-forest-950 border border-forest-800 text-slate-200 focus:outline-none focus:ring-1 focus:ring-mint-500 theme-cream:bg-editorial-surface-soft theme-cream:text-editorial-ink theme-cream:border-editorial-hairline"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-forest-950/60 border border-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline flex items-start gap-2 text-[11px] text-slate-400 theme-cream:text-editorial-muted">
            <Info className="w-3.5 h-3.5 text-mint-400 shrink-0 mt-0.5" />
            <p>
              Primary atmospheric telemetry is streamed directly from Copernicus Atmosphere Monitoring Service (CAMS) and Open-Meteo without requiring API tokens. Any private keys entered are strictly saved client-side in your browser's localStorage.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" /> Settings saved!
              </span>
            )}
            <Button variant="primary" size="sm" type="submit" className="ml-auto">
              Save Preferences
            </Button>
          </div>
        </form>

        {/* Cache Management */}
        <div className="pt-3 border-t border-forest-800/80 theme-cream:border-editorial-hairline flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-200 theme-cream:text-editorial-body-strong block">
              Local Environmental Cache
            </span>
            <span className="text-[11px] text-slate-400 theme-cream:text-editorial-muted">
              10-minute TTL storage
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="text-xs text-rose-400 hover:text-rose-300 border-rose-900/50 hover:bg-rose-950/30"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            {cacheCleared ? 'Cleared!' : 'Purge Cache'}
          </Button>
        </div>
      </div>
    </div>
  );
};


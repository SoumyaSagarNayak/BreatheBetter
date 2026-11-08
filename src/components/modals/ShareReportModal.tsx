import React, { useState } from 'react';
import { Share2, X, Printer, Copy, Check, FileText } from 'lucide-react';
import { AirQualityData } from '../../types';
import { Button } from '../ui/Button';
import { formatDateTime } from '../../utils/formatters';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AirQualityData;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `BreatheBetter Air Quality Report
Location: ${data.location.name}, ${data.location.country}
US EPA AQI: ${data.usAqi} (${data.category.name})
Dominant Pollutant: ${data.dominantPollutant.name}
PM2.5: ${data.pollutants.pm2_5.value ? `${data.pollutants.pm2_5.value.toFixed(1)} µg/m³` : 'N/A'}
PM10: ${data.pollutants.pm10.value ? `${data.pollutants.pm10.value.toFixed(1)} µg/m³` : 'N/A'}
NO2: ${data.pollutants.nitrogen_dioxide.value ? `${data.pollutants.nitrogen_dioxide.value.toFixed(1)} µg/m³` : 'N/A'}
Updated: ${formatDateTime(data.timestamp)}
Source: ${data.source}
Guidance: ${data.interpretation}
Platform: BreatheBetter - Let's Code Diwali 2026`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl border shadow-2xl bg-forest-900 border-forest-700 text-slate-100 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline theme-cream:text-editorial-ink space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white theme-cream:text-editorial-muted theme-cream:hover:text-editorial-ink"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-mint-400 theme-cream:bg-editorial-surface-card theme-cream:text-editorial-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink">
              Official Air Quality Intelligence Report
            </h3>
            <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
              Certified environmental summary for {data.location.name}
            </p>
          </div>
        </div>

        {/* Report Card Preview (Printable Container) */}
        <div
          id="printable-report"
          className="p-5 rounded-xl border border-forest-800 bg-forest-950/80 theme-cream:bg-editorial-surface-card theme-cream:border-editorial-hairline space-y-4"
        >
          {/* Brand & Location Header */}
          <div className="flex items-center justify-between pb-3 border-b border-forest-850 theme-cream:border-editorial-hairline-soft">
            <div className="flex items-center gap-2">
              <img
                src="/leaf-wind-logo.svg"
                alt="Logo"
                className="w-5 h-5 object-contain"
              />
              <span className="font-serif text-lg font-bold text-white theme-cream:text-editorial-ink">
                BreatheBetter
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 theme-cream:text-editorial-muted">
              {formatDateTime(data.timestamp)}
            </span>
          </div>

          {/* Location & AQI Score */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink">
                {data.location.name}, {data.location.country}
              </h4>
              <p className="text-xs font-mono text-slate-400">
                Coords: {data.location.latitude.toFixed(2)}°, {data.location.longitude.toFixed(2)}°
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">
                US EPA AQI
              </span>
              <span
                className="font-serif text-4xl font-bold"
                style={{ color: data.category.color }}
              >
                {data.usAqi}
              </span>
              <span
                className="text-xs font-semibold block"
                style={{ color: data.category.color }}
              >
                {data.category.name}
              </span>
            </div>
          </div>

          {/* Key Pollutants Summary Table */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Particulate & Trace Gas Analysis
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-forest-900/60 theme-cream:bg-editorial-canvas flex justify-between">
                <span className="text-slate-400">PM2.5:</span>
                <strong className="text-slate-200 theme-cream:text-editorial-ink">
                  {data.pollutants.pm2_5.value
                    ? `${data.pollutants.pm2_5.value.toFixed(1)} µg/m³`
                    : 'Unavailable'}
                </strong>
              </div>
              <div className="p-2 rounded bg-forest-900/60 theme-cream:bg-editorial-canvas flex justify-between">
                <span className="text-slate-400">PM10:</span>
                <strong className="text-slate-200 theme-cream:text-editorial-ink">
                  {data.pollutants.pm10.value
                    ? `${data.pollutants.pm10.value.toFixed(1)} µg/m³`
                    : 'Unavailable'}
                </strong>
              </div>
              <div className="p-2 rounded bg-forest-900/60 theme-cream:bg-editorial-canvas flex justify-between">
                <span className="text-slate-400">NO2:</span>
                <strong className="text-slate-200 theme-cream:text-editorial-ink">
                  {data.pollutants.nitrogen_dioxide.value
                    ? `${data.pollutants.nitrogen_dioxide.value.toFixed(1)} µg/m³`
                    : 'Unavailable'}
                </strong>
              </div>
              <div className="p-2 rounded bg-forest-900/60 theme-cream:bg-editorial-canvas flex justify-between">
                <span className="text-slate-400">Ozone:</span>
                <strong className="text-slate-200 theme-cream:text-editorial-ink">
                  {data.pollutants.ozone.value
                    ? `${data.pollutants.ozone.value.toFixed(1)} µg/m³`
                    : 'Unavailable'}
                </strong>
              </div>
            </div>
          </div>

          {/* Public Guidance */}
          <div className="p-3 rounded-lg bg-forest-900/40 border border-forest-850 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline text-xs text-slate-300 theme-cream:text-editorial-body leading-relaxed">
            <strong className="text-mint-400 theme-cream:text-editorial-primary block mb-0.5">
              Public Advisory:
            </strong>
            {data.interpretation}
          </div>

          {/* Attribution */}
          <div className="pt-1 text-[10px] font-mono text-slate-400 flex justify-between">
            <span>Source: {data.source}</span>
            <span>Let's Code Diwali 2026</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Text Summary
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};


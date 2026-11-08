import React from 'react';
import { AirQualityData } from '../../types';
import { PollutantCard } from './PollutantCard';
import { Layers } from 'lucide-react';

interface PollutantGridProps {
  data: AirQualityData;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ data }) => {
  const { pollutants } = data;

  const corePollutants = [
    pollutants.pm2_5,
    pollutants.pm10,
    pollutants.nitrogen_dioxide,
    pollutants.sulphur_dioxide,
    pollutants.carbon_monoxide,
    pollutants.ozone,
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
          <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
            Key Atmospheric Pollutants
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400 theme-cream:text-editorial-muted">
          All values calibrated to WHO 2021 Reference Standards
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {corePollutants.map((pollutant) => (
          <PollutantCard key={pollutant.id} pollutant={pollutant} />
        ))}
      </div>
    </div>
  );
};


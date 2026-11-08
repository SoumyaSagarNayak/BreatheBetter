import React, { useState } from 'react';
import { Scale, Plus, X, Search, Award, AlertTriangle, RotateCw } from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { searchLocations } from '../../services/openMeteo';
import { LocationInfo } from '../../types';
import { Button } from '../ui/Button';
import { formatDateTime } from '../../utils/formatters';

export const CompareCities: React.FC = () => {
  const {
    comparisonCities,
    addToComparison,
    removeFromComparison,
    setLocation,
  } = useAirQuality();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
      setIsDropdownOpen(true);
    } catch {
      // Ignore
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddCity = (loc: LocationInfo) => {
    addToComparison(loc);
    setSearchQuery('');
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  // Identify Cleanest & Most Polluted cities among loaded comparisons
  const validLoaded = comparisonCities.filter((c) => c.data !== null);

  let cleanestCity: string | null = null;
  let mostPollutedCity: string | null = null;

  if (validLoaded.length >= 2) {
    const sorted = [...validLoaded].sort(
      (a, b) => (a.data?.usAqi || 0) - (b.data?.usAqi || 0)
    );
    cleanestCity = sorted[0].location.name;
    mostPollutedCity = sorted[sorted.length - 1].location.name;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-mint-400 theme-cream:text-editorial-primary" />
            <h2 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink tracking-tight">
              Multi-City Air Quality Comparative Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
            Directly benchmark particulate saturation and gaseous metrics across up to 4 global metropolitan regions
          </p>
        </div>

        {/* Add City Search Bar */}
        {comparisonCities.length < 4 && (
          <div className="relative w-full sm:w-72">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Add city to compare..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-9 pr-8 py-1.5 rounded-lg text-xs bg-forest-900 border border-forest-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-mint-500 theme-cream:bg-editorial-canvas theme-cream:text-editorial-ink theme-cream:border-editorial-hairline"
              />
              {isSearching && (
                <RotateCw className="absolute right-2.5 w-3 h-3 animate-spin text-mint-400" />
              )}
            </div>

            {/* Dropdown Results */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-1 p-1 rounded-xl border shadow-xl z-30 bg-forest-900/95 border-forest-700 text-xs theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline">
                {searchResults.slice(0, 5).map((loc) => (
                  <button
                    key={`${loc.latitude}-${loc.longitude}`}
                    onClick={() => handleAddCity(loc)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-forest-800 transition-colors flex items-center justify-between text-slate-200 theme-cream:hover:bg-editorial-surface-card theme-cream:text-editorial-ink"
                  >
                    <span>
                      {loc.name}, {loc.country}
                    </span>
                    <Plus className="w-3.5 h-3.5 text-mint-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* City Comparison Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparisonCities.map((city) => {
          const { location, data, isLoading, error } = city;
          const isCleanest = cleanestCity === location.name;
          const isPolluted = mostPollutedCity === location.name;

          return (
            <div
              key={location.id}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isCleanest
                  ? 'border-emerald-500/50 bg-forest-900/80 shadow-glow-good theme-cream:bg-editorial-surface-card theme-cream:border-emerald-500/40'
                  : isPolluted
                  ? 'border-red-500/50 bg-forest-900/80 shadow-glow-unhealth theme-cream:bg-editorial-surface-card theme-cream:border-red-500/40'
                  : 'border-forest-800/80 bg-forest-900/60 theme-cream:bg-editorial-canvas theme-cream:border-editorial-hairline'
              }`}
            >
              {/* Cleanest or Most Polluted Ribbon */}
              {isCleanest && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-pill text-[10px] font-mono uppercase tracking-wider bg-emerald-500 text-forest-950 font-bold flex items-center gap-1 shadow-sm">
                  <Award className="w-3 h-3" />
                  Cleanest in Set
                </div>
              )}
              {isPolluted && (
                <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-pill text-[10px] font-mono uppercase tracking-wider bg-rose-500 text-white font-bold flex items-center gap-1 shadow-sm">
                  <AlertTriangle className="w-3 h-3" />
                  Most Polluted
                </div>
              )}

              {/* Remove City Button */}
              <button
                onClick={() => removeFromComparison(location.id)}
                title="Remove city"
                className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white rounded-md theme-cream:hover:text-editorial-ink"
              >
                <X className="w-4 h-4" />
              </button>

              {/* City Title */}
              <div className="space-y-1 mb-4 mt-1">
                <h3 className="font-serif text-2xl font-normal text-white theme-cream:text-editorial-ink">
                  {location.name}
                </h3>
                <p className="text-xs text-slate-400 theme-cream:text-editorial-muted">
                  {location.country} • {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
                </p>
              </div>

              {/* Metrics Display */}
              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RotateCw className="w-4 h-4 animate-spin text-mint-400" />
                  Retrieving authentic atmospheric metrics...
                </div>
              ) : error ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                  {error}
                </div>
              ) : data ? (
                <div className="space-y-4">
                  {/* Big AQI Number & Category */}
                  <div className="flex items-baseline justify-between p-3 rounded-xl bg-forest-950/60 border border-forest-850 theme-cream:bg-editorial-surface-soft theme-cream:border-editorial-hairline">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                        US EPA AQI
                      </span>
                      <span className="font-serif text-4xl font-normal text-white theme-cream:text-editorial-ink">
                        {data.usAqi}
                      </span>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-pill"
                      style={{
                        backgroundColor: `${data.category.color}20`,
                        color: data.category.color,
                      }}
                    >
                      {data.category.name}
                    </span>
                  </div>

                  {/* Particulate Breakdowns */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1 border-b border-forest-850 theme-cream:border-editorial-hairline-soft">
                      <span className="text-slate-400">PM2.5 Conc:</span>
                      <strong className="text-white theme-cream:text-editorial-ink">
                        {data.pollutants.pm2_5.value
                          ? `${data.pollutants.pm2_5.value.toFixed(1)} µg/m³`
                          : 'Unavailable'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-forest-850 theme-cream:border-editorial-hairline-soft">
                      <span className="text-slate-400">PM10 Conc:</span>
                      <strong className="text-white theme-cream:text-editorial-ink">
                        {data.pollutants.pm10.value
                          ? `${data.pollutants.pm10.value.toFixed(1)} µg/m³`
                          : 'Unavailable'}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between pb-1 border-b border-forest-850 theme-cream:border-editorial-hairline-soft">
                      <span className="text-slate-400">Dominant:</span>
                      <strong className="text-mint-400 theme-cream:text-editorial-primary">
                        {data.dominantPollutant.name}
                      </strong>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-1">
                      Observed: {formatDateTime(data.timestamp)}
                    </div>
                  </div>

                  {/* Set as Active Dashboard City */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setLocation(location)}
                  >
                    View in Main Dashboard
                  </Button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};


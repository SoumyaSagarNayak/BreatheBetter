import React, { useState, useMemo } from 'react';
import {
  Trophy,
  Compass,
  ArrowUpDown,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  Wind,
  Flame,
  Globe,
  Sparkles,
} from 'lucide-react';
import { WORLD_STATIONS, WorldStationLocation } from '../../utils/worldStations';
import { useAirQuality } from '../../context/AirQualityContext';
import { Button } from '../ui/Button';

export const PollutionLeaderboard: React.FC = () => {
  const { currentLocation, setLocation } = useAirQuality();
  const [filterMode, setFilterMode] = useState<'all' | 'clean' | 'hotspots' | 'india'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'cleanest' | 'polluted'>('cleanest');

  // Sorted and filtered list
  const rankedStations = useMemo(() => {
    let list = [...WORLD_STATIONS];

    // Filter by category
    if (filterMode === 'clean') {
      list = list.filter((s) => s.baselineAqi <= 80);
    } else if (filterMode === 'hotspots') {
      list = list.filter((s) => s.baselineAqi >= 180);
    } else if (filterMode === 'india') {
      list = list.filter((s) => s.countryCode === 'IN');
    }

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.stationName.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'cleanest') {
      list.sort((a, b) => a.baselineAqi - b.baselineAqi);
    } else {
      list.sort((a, b) => b.baselineAqi - a.baselineAqi);
    }

    return list;
  }, [filterMode, searchQuery, sortBy]);

  const cleanCount = useMemo(
    () => WORLD_STATIONS.filter((s) => s.baselineAqi <= 80).length,
    []
  );

  const hotspotCount = useMemo(
    () => WORLD_STATIONS.filter((s) => s.baselineAqi >= 180).length,
    []
  );

  const getAqiBadgeColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (aqi <= 100) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (aqi <= 150) return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    if (aqi <= 200) return 'bg-red-500/20 text-red-400 border-red-500/40';
    if (aqi <= 300) return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    return 'bg-rose-900/40 text-rose-300 border-rose-700/60';
  };

  const getAqiCategory = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Sensitive Alert';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-forest-950 border border-forest-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Global & Indian Air Quality Leaderboard
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Real-time environmental ranking across 50+ calibrated ground monitoring stations. Discover certified <strong>Clean Air Havens</strong> or inspect regional <strong>Smog Belts</strong>.
          </p>
        </div>

        {/* Quick Clean Air Stats */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-xl bg-forest-900/80 border border-forest-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Clean Havens</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{cleanCount} Stations</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-forest-900/80 border border-forest-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Smog Hotspots</span>
            <span className="text-base font-bold text-rose-400 font-mono">{hotspotCount} Stations</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              filterMode === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-forest-900/60 text-slate-400 hover:text-white border border-forest-800'
            }`}
          >
            All Stations ({WORLD_STATIONS.length})
          </button>
          <button
            onClick={() => setFilterMode('clean')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              filterMode === 'clean'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-forest-900/60 text-emerald-400/80 hover:text-emerald-300 border border-forest-800'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            Clean Air Havens ({cleanCount})
          </button>
          <button
            onClick={() => setFilterMode('hotspots')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              filterMode === 'hotspots'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-forest-900/60 text-rose-400/80 hover:text-rose-300 border border-forest-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Smog Hotspots ({hotspotCount})
          </button>
          <button
            onClick={() => setFilterMode('india')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              filterMode === 'india'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-forest-900/60 text-slate-400 hover:text-white border border-forest-800'
            }`}
          >
            🇮🇳 India Only (26)
          </button>
        </div>

        {/* Sort & Search Controls */}
        <div className="flex items-center gap-2">
          {/* Sort Switcher */}
          <button
            onClick={() => setSortBy(sortBy === 'cleanest' ? 'polluted' : 'cleanest')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-900/80 border border-forest-800 text-slate-300 hover:text-white shrink-0"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sortBy === 'cleanest' ? 'Cleanest First' : 'Most Polluted First'}</span>
          </button>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by city, station..."
              className="w-full pl-8 pr-3 py-1.5 bg-forest-900/90 border border-forest-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard Table / Card Grid */}
      <div className="rounded-2xl border border-forest-800 bg-forest-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-forest-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-forest-800 font-semibold">
              <tr>
                <th className="py-3 px-4 w-14">Rank</th>
                <th className="py-3 px-4">Station & Location</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 text-center">US AQI</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">PM2.5</th>
                <th className="py-3 px-4">PM10</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-800/60 font-mono">
              {rankedStations.map((station, index) => {
                const isCurrent =
                  currentLocation.name.toLowerCase().includes(station.name.toLowerCase()) ||
                  station.name.toLowerCase().includes(currentLocation.name.toLowerCase());
                const aqi = station.baselineAqi;
                const badgeClass = getAqiBadgeColor(aqi);

                return (
                  <tr
                    key={station.id}
                    className={`hover:bg-forest-850/60 transition-colors ${
                      isCurrent ? 'bg-emerald-950/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-slate-400">
                      {index === 0 && sortBy === 'cleanest' ? (
                        <span className="flex items-center gap-1 text-emerald-400">
                          🥇 #1
                        </span>
                      ) : index === 1 && sortBy === 'cleanest' ? (
                        <span className="text-slate-200">🥈 #2</span>
                      ) : index === 2 && sortBy === 'cleanest' ? (
                        <span className="text-amber-500">🥉 #3</span>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{station.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-normal block truncate max-w-xs">
                        {station.stationName || station.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">
                      {station.country} ({station.countryCode})
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold border ${badgeClass}`}>
                        {aqi}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium">
                      <span className="text-slate-200">{getAqiCategory(aqi)}</span>
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-semibold">
                      {station.pm25.toFixed(1)} µg/m³
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-semibold">
                      {station.pm10.toFixed(1)} µg/m³
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <Button
                        variant={isCurrent ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => setLocation(station)}
                        className="text-[11px] px-2.5 py-1 h-auto"
                        disabled={isCurrent}
                      >
                        {isCurrent ? 'Viewing' : 'Inspect'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-forest-800/80">
          {rankedStations.map((station, index) => {
            const isCurrent =
              currentLocation.name.toLowerCase().includes(station.name.toLowerCase()) ||
              station.name.toLowerCase().includes(currentLocation.name.toLowerCase());
            const aqi = station.baselineAqi;
            const badgeClass = getAqiBadgeColor(aqi);

            return (
              <div
                key={station.id}
                className={`p-4 space-y-2 ${isCurrent ? 'bg-emerald-950/30' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-medium text-white text-sm">
                        {station.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {station.stationName || station.state}, {station.country}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-bold border shrink-0 ${badgeClass}`}>
                    {aqi} AQI
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
                  <span>
                    PM2.5: <strong className="text-emerald-400">{station.pm25.toFixed(1)} µg</strong>
                  </span>
                  <span>
                    PM10: <strong className="text-amber-400">{station.pm10.toFixed(1)} µg</strong>
                  </span>
                  <Button
                    variant={isCurrent ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setLocation(station)}
                    className="text-[10px] px-2 py-1 h-auto"
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Viewing' : 'Inspect'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


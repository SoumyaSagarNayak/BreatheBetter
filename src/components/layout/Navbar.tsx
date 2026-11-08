import React, { useState, useEffect, useRef } from 'react';
import {
  Wind,
  Search,
  MapPin,
  RotateCw,
  Star,
  Settings,
  X,
  Compass,
  AlertTriangle,
  Menu,
  Calculator,
  Globe,
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { searchLocations, reverseGeocode } from '../../services/openMeteo';
import { INDIA_STATIONS } from '../../utils/indiaStations';
import { LocationInfo } from '../../types';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenSettings: () => void;
  onOpenAlerts: () => void;
  onOpenReport: () => void;
  onOpenConverter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onOpenAlerts,
  onOpenReport,
  onOpenConverter,
}) => {
  const {
    currentLocation,
    setLocation,
    refreshData,
    isLoading,
    dataSourceMode,
    setDataSourceMode,
    recentSearches,
    isFavorite,
    addFavorite,
    removeFavorite,
  } = useAirQuality();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search autocomplete combining Indian stations and Open-Meteo Geocoding
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const query = searchQuery.toLowerCase().trim();
        // 1. Search local Indian stations database
        const localMatches = INDIA_STATIONS.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.state.toLowerCase().includes(query) ||
            s.stationName.toLowerCase().includes(query)
        );

        // 2. Query remote global geocoding
        let remoteResults: LocationInfo[] = [];
        try {
          remoteResults = await searchLocations(searchQuery);
        } catch {
          // Local matches suffice if offline
        }

        const combined = [...localMatches, ...remoteResults];
        const unique = combined.filter(
          (v, i, a) => a.findIndex((t) => t.name === v.name) === i
        );
        setSearchResults(unique.slice(0, 8));
      } catch (err) {
        console.warn('Search autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationInfo) => {
    setLocation(loc);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setLocation(loc);
        } catch {
          setGpsError('Could not resolve coordinate address.');
        } finally {
          setIsGpsLoading(false);
        }
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsError('Location permission denied. Please search manually.');
        } else {
          setGpsError('Unable to retrieve your location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const isCurrentFav = isFavorite(currentLocation.id);

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-forest-800/80 bg-forest-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-forest-900 border border-emerald-500/30 shadow-glow-good">
              <img
                src="/leaf-wind-logo.svg"
                alt="BreatheBetter Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-normal tracking-tight text-white">
                  BreatheBetter
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {dataSourceMode === 'live' ? 'Live CAMS' : 'Calibrated'}
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400">
                Know Your Air. Protect Your Health.
              </p>
            </div>
          </div>

          {/* Search Box with Autocomplete */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-md hidden sm:block"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Delhi, Mumbai, Bengaluru, London, Tokyo..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-24 py-2 rounded-lg text-sm bg-forest-900/90 border border-forest-700/70 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mint-500/50 focus:border-mint-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {/* GPS Geolocation Button */}
              <button
                onClick={handleGeolocation}
                disabled={isGpsLoading}
                title="Use current GPS location"
                className="absolute right-2 p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-forest-800/60 transition-colors disabled:opacity-50"
              >
                {isGpsLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin text-mint-400" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl border shadow-xl backdrop-blur-xl z-50 bg-forest-900/95 border-forest-700 text-slate-200">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RotateCw className="w-3.5 h-3.5 animate-spin text-mint-400" />
                    Searching authentic monitoring stations...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-1">
                    <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Matching Stations & Cities
                    </div>
                    {searchResults.map((loc) => (
                      <button
                        key={`${loc.latitude}-${loc.longitude}-${loc.name}`}
                        onClick={() => handleSelectLocation(loc)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm hover:bg-forest-800/80 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-mint-400" />
                          <span className="font-medium text-slate-100 group-hover:text-white">
                            {loc.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {loc.admin1 ? `${loc.admin1}, ` : ''}
                            {loc.country}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                        </span>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No locations found for "{searchQuery}". Try an Indian state or major district name.
                  </div>
                ) : (
                  <div>
                    <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Recent Stations
                    </div>
                    {recentSearches.slice(0, 4).map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => handleSelectLocation(loc)}
                        className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-left text-xs hover:bg-forest-800/70 text-slate-300"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {loc.name}, {loc.country}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Live vs Calibrated Demo Mode Toggle */}
            <button
              onClick={() =>
                setDataSourceMode(dataSourceMode === 'live' ? 'demo' : 'live')
              }
              title={`Switch data feed mode (currently ${dataSourceMode})`}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                dataSourceMode === 'demo'
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold'
                  : 'bg-forest-900 border-forest-800 text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-mint-400" />
              {dataSourceMode === 'live' ? 'Live Stream' : 'Static Baseline'}
            </button>

            {/* AQI Calculator Tool */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenConverter}
              className="hidden lg:inline-flex text-xs"
              title="AQI Converter & Calculator"
            >
              <Calculator className="w-3.5 h-3.5 mr-1 text-mint-400" />
              Converter
            </Button>

            {/* Favorite Current City Toggle */}
            <button
              onClick={() => {
                if (isCurrentFav) {
                  removeFavorite(currentLocation.id);
                } else {
                  addFavorite(currentLocation);
                }
              }}
              title={isCurrentFav ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2 rounded-lg border transition-colors ${
                isCurrentFav
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'border-forest-800 bg-forest-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star
                className={`w-4 h-4 ${isCurrentFav ? 'fill-amber-400' : ''}`}
              />
            </button>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={isLoading}
              title="Refresh air quality measurements"
              className="p-2 rounded-lg border border-forest-800 bg-forest-900/60 text-slate-300 hover:text-white hover:bg-forest-800 transition-colors disabled:opacity-50"
            >
              <RotateCw
                className={`w-4 h-4 ${isLoading ? 'animate-spin text-mint-400' : ''}`}
              />
            </button>

            {/* Alerts Modal Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAlerts}
              className="hidden md:inline-flex"
            >
              <Wind className="w-3.5 h-3.5 mr-1 text-mint-400" />
              Alerts
            </Button>

            {/* Share / Report Trigger */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenReport}
              className="hidden lg:inline-flex"
            >
              Export Report
            </Button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              title="Settings & API Keys"
              className="p-2 rounded-lg border border-forest-800 bg-forest-900/60 text-slate-300 hover:text-white hover:bg-forest-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg border border-forest-800 bg-forest-900/60 text-slate-300"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GPS Error Notification if any */}
        {gpsError && (
          <div className="py-2 px-3 mb-2 rounded-lg text-xs flex items-center justify-between bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              {gpsError}
            </span>
            <button
              onClick={() => setGpsError(null)}
              className="text-amber-400 hover:text-amber-200"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Mobile Search Bar & Menu Expansion */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-forest-800/80 space-y-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-9 pr-10 py-2 rounded-lg text-sm bg-forest-900 border border-forest-700 text-slate-100 placeholder-slate-400"
              />
              <button
                onClick={handleGeolocation}
                disabled={isGpsLoading}
                className="absolute right-2 p-1 text-emerald-400"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Quick Action Links */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenConverter();
                }}
              >
                Converter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAlerts();
                }}
              >
                Alerts
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenReport();
                }}
              >
                Report
              </Button>
            </div>
          </div>
        )}

        {/* Quick Indian Metros & Favorite Cities Strip */}
        <div className="flex items-center gap-2 py-2 overflow-x-auto text-xs border-t border-forest-900/60 scrollbar-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 shrink-0 font-medium">
            🇮🇳 Top Metros:
          </span>
          {INDIA_STATIONS.slice(0, 10).map((st) => {
            const active = st.name === currentLocation.name;
            return (
              <button
                key={st.id}
                onClick={() => handleSelectLocation(st)}
                className={`px-2.5 py-1 rounded-pill transition-all shrink-0 flex items-center gap-1.5 ${
                  active
                    ? 'bg-mint-500/20 text-mint-300 border border-mint-500/40 font-medium'
                    : 'bg-forest-900/40 text-slate-400 hover:text-slate-200 hover:bg-forest-850 border border-forest-800/60'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                {st.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

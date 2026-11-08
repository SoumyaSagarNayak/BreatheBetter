import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  List,
  Map as MapIcon,
  Globe,
  Navigation,
  Layers,
  ZoomIn,
  Search,
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { MapLegend } from './MapLegend';
import { WORLD_STATIONS, WorldStationLocation } from '../../utils/worldStations';
import { INDIA_STATIONS } from '../../utils/indiaStations';
import { Button } from '../ui/Button';

export const AirQualityMap: React.FC = () => {
  const { currentLocation, setLocation } = useAirQuality();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);

  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'india' | 'europe' | 'americas' | 'asia'>('india');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Initialize Map with 100% Free OpenStreetMap Tiles (Zero API Keys, Zero Watermarks)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.5937, 78.9629], // Center of India
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Standard OpenStreetMap Tile Layer - Authentically Open & Free with no watermarks
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      const heatGroup = L.layerGroup().addTo(map);
      const markGroup = L.layerGroup().addTo(map);

      heatmapLayerRef.current = heatGroup;
      markersLayerRef.current = markGroup;
      mapInstanceRef.current = map;

      // Guarantee clean canvas dimensions after mount in tabbed workspace
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Ensure map size is recalibrated whenever switching between list and map views
  useEffect(() => {
    if (viewMode === 'map' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [viewMode]);

  // Filter stations based on selection and text query
  const displayedStations = React.useMemo(() => {
    let list = WORLD_STATIONS;

    if (selectedFilter === 'india') {
      list = WORLD_STATIONS.filter((s) => s.countryCode === 'IN');
    } else if (selectedFilter === 'europe') {
      list = WORLD_STATIONS.filter((s) => s.continent === 'Europe');
    } else if (selectedFilter === 'americas') {
      list = WORLD_STATIONS.filter((s) => s.continent === 'Americas');
    } else if (selectedFilter === 'asia') {
      list = WORLD_STATIONS.filter((s) => s.continent === 'Asia');
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.stationName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedFilter, searchFilter]);

  // Render Markers and Heatmap Layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markLayer = markersLayerRef.current;
    const heatLayer = heatmapLayerRef.current;
    if (!map || !markLayer || !heatLayer) return;

    markLayer.clearLayers();
    heatLayer.clearLayers();

    displayedStations.forEach((station) => {
      const isCurrent =
        station.name.toLowerCase().includes(currentLocation.name.toLowerCase()) ||
        currentLocation.name.toLowerCase().includes(station.name.toLowerCase());

      const aqi = station.baselineAqi;

      // Color coding based on EPA Standard
      let markerColor = '#10b981';
      let statusName = 'Good';
      let heatRadius = 35000;

      if (aqi > 300) {
        markerColor = '#881337';
        statusName = 'Hazardous';
        heatRadius = 85000;
      } else if (aqi > 200) {
        markerColor = '#a855f7';
        statusName = 'Very Unhealthy';
        heatRadius = 65000;
      } else if (aqi > 150) {
        markerColor = '#ef4444';
        statusName = 'Unhealthy';
        heatRadius = 50000;
      } else if (aqi > 100) {
        markerColor = '#f97316';
        statusName = 'Sensitive Alert';
        heatRadius = 40000;
      } else if (aqi > 50) {
        markerColor = '#f59e0b';
        statusName = 'Moderate';
        heatRadius = 30000;
      }

      // Heatmap circle layer
      if (showHeatmap) {
        L.circle([station.latitude, station.longitude], {
          radius: heatRadius,
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.22,
          stroke: false,
        }).addTo(heatLayer);
      }

      // Marker Icon
      const customHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; cursor: pointer;">
          ${
            isCurrent
              ? `<div style="position: absolute; width: 48px; height: 48px; border-radius: 9999px; background: ${markerColor}; opacity: 0.45; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <div style="position: relative; width: ${isCurrent ? '36px' : '28px'}; height: ${
        isCurrent ? '36px' : '28px'
      }; border-radius: 9999px; background: ${markerColor}; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: ${
        isCurrent ? '11px' : '10px'
      }; font-family: ui-monospace, monospace;">
            ${aqi}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'custom-aqi-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([station.latitude, station.longitude], {
        icon,
      }).addTo(markLayer);

      const popupHtml = `
        <div style="font-family: inherit; min-width: 230px; padding: 6px; color: #0f172a;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #0f172a;">
            ${station.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${station.stationName || 'Environmental Monitoring Station'}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; padding: 4px 8px; border-radius: 6px; background: ${markerColor}15; border: 1px solid ${markerColor}40;">
            <span style="font-weight: 700; font-size: 13px; color: ${markerColor};">AQI: ${aqi}</span>
            <span style="font-size: 11px; font-weight: 600; color: ${markerColor};">${statusName}</span>
          </div>
          <div style="font-size: 11px; margin-bottom: 4px; color: #334155; font-family: ui-monospace, monospace;">
            PM2.5: <strong>${station.pm25.toFixed(1)} µg/m³</strong> | PM10: <strong>${station.pm10.toFixed(1)} µg/m³</strong>
          </div>
          <button id="btn-select-${station.id}" style="width: 100%; margin-top: 6px; padding: 7px 10px; background: #059669; color: #ffffff; border: none; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            Set As Active Station
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${station.id}`);
        if (btn) {
          btn.onclick = () => {
            setLocation(station);
          };
        }
      });
    });
  }, [displayedStations, currentLocation, showHeatmap, setLocation]);

  const zoomToIndia = () => {
    setSelectedFilter('india');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.5937, 78.9629], 5, { duration: 1.2 });
    }
  };

  const zoomToWorld = () => {
    setSelectedFilter('all');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([20.0, 10.0], 2, { duration: 1.5 });
    }
  };

  const centerOnCurrent = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [currentLocation.latitude, currentLocation.longitude],
        7,
        { duration: 1.0 }
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-mint-400" />
            <h2 className="font-serif text-2xl font-normal text-white tracking-tight">
              Interactive Global & Indian Air Quality Map
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            High-precision OpenStreetMap GIS network with 50+ stations across India, Europe, Americas, and Asia
          </p>
        </div>

        {/* View Mode & Preset Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Geographic Presets */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/90 flex items-center gap-1 text-xs">
            <button
              onClick={zoomToIndia}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                selectedFilter === 'india'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 India (26)
            </button>
            <button
              onClick={zoomToWorld}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌍 World (50+)
            </button>
            <button
              onClick={() => {
                setSelectedFilter('americas');
                mapInstanceRef.current?.flyTo([37.0902, -95.7129], 3);
              }}
              className={`px-2 py-1.5 rounded-md font-medium transition-all hidden md:inline-block ${
                selectedFilter === 'americas' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Americas
            </button>
            <button
              onClick={() => {
                setSelectedFilter('europe');
                mapInstanceRef.current?.flyTo([50.1109, 8.6821], 4);
              }}
              className={`px-2 py-1.5 rounded-md font-medium transition-all hidden md:inline-block ${
                selectedFilter === 'europe' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Europe
            </button>
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showHeatmap
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-forest-800 bg-forest-900/80 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Heatmap Layer
          </button>

          {/* Map vs List View */}
          <div className="p-1 rounded-lg border border-forest-800 bg-forest-900/90 flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md ${
                viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
              title="Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md ${
                viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
              title="Station Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={centerOnCurrent}>
            <Navigation className="w-3.5 h-3.5 mr-1 text-mint-400" />
            Active
          </Button>
        </div>
      </div>

      {/* Map Display */}
      {viewMode === 'map' ? (
        <div className="relative rounded-2xl overflow-hidden border border-forest-800 bg-forest-950 shadow-xl">
          <div
            ref={mapContainerRef}
            className="w-full h-[460px] sm:h-[530px] z-10"
          />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
            <MapLegend />
          </div>
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border overflow-hidden border-forest-800/80 bg-forest-900/60">
          <div className="p-4 border-b border-forest-800 text-sm font-medium text-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span>
                Monitored Station Directory ({displayedStations.length} Stations)
              </span>
            </div>

            {/* Quick Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter stations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-forest-950 border border-forest-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
              />
            </div>
          </div>

          <div className="divide-y divide-forest-800/60 overflow-x-auto max-h-[480px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-forest-950/60 text-xs font-mono uppercase text-slate-400 sticky top-0 backdrop-blur-md">
                <tr>
                  <th className="py-3 px-4">Station / Location</th>
                  <th className="py-3 px-4">Region / Country</th>
                  <th className="py-3 px-4">US AQI</th>
                  <th className="py-3 px-4">PM2.5</th>
                  <th className="py-3 px-4">PM10</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-800/60 text-slate-200 text-xs font-mono">
                {displayedStations.map((st) => {
                  const isCurrent = st.name === currentLocation.name;
                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-forest-850/60 transition-colors ${
                        isCurrent ? 'bg-mint-500/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-sans font-medium flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div>
                          <div className="text-white font-semibold">
                            {st.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {st.stationName}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {st.state ? `${st.state}, ` : ''}{st.country}
                      </td>
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        {st.baselineAqi}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {st.pm25.toFixed(1)} µg/m³
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {st.pm10.toFixed(1)} µg/m³
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setLocation(st)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

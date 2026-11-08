import React, { useState } from 'react';
import { useAirQuality } from './context/AirQualityContext';
import { Navbar } from './components/layout/Navbar';
import { MainAQICard } from './components/dashboard/MainAQICard';
import { PollutantGrid } from './components/dashboard/PollutantGrid';
import { AirQualityMap } from './components/map/AirQualityMap';
import { TrendsSection } from './components/analytics/TrendsSection';
import { ForecastSection } from './components/forecast/ForecastSection';
import { HealthRecommendations } from './components/health/HealthRecommendations';
import { CompareCities } from './components/compare/CompareCities';
import { PollutionInsights } from './components/insights/PollutionInsights';
import { DiwaliSmogWatch } from './components/diwali/DiwaliSmogWatch';
import { AirQualityChatbot } from './components/chat/AirQualityChatbot';
import { Footer } from './components/layout/Footer';
import { AlertsModal } from './components/modals/AlertsModal';
import { ShareReportModal } from './components/modals/ShareReportModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { AQIConverterModal } from './components/tools/AQIConverterModal';
import { Skeleton } from './components/ui/Skeleton';
import {
  AlertCircle,
  RotateCw,
  Gauge,
  Flame,
  Map as MapIcon,
  TrendingUp,
  Calendar,
  HeartPulse,
  Scale,
  Lightbulb,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { Button } from './components/ui/Button';

export const AppContent: React.FC = () => {
  const { airQuality, currentLocation, isLoading, error, refreshData } = useAirQuality();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConverterOpen, setIsConverterOpen] = useState(false);

  // Section Workspace State
  const [activeNav, setActiveNav] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'tabbed' | 'all'>('tabbed');

  const navSections = [
    {
      id: 'dashboard',
      label: 'Overview',
      fullTitle: 'Real-Time Air Quality & Key Pollutants',
      desc: 'Live US EPA AQI gauge, health risk score, rule-based interpretation, and WHO 2021 threshold cards.',
      badge: 'Live Telemetry',
      icon: Gauge,
    },
    {
      id: 'diwali-observatory',
      label: 'Diwali Smog Watch',
      fullTitle: 'Diwali Smog & Pyrotechnic Observatory',
      desc: 'Nocturnal thermal inversion tracker, CSIR-NEERI Green Cracker composition (SWAS, STAR, SAFAL), and heavy metal signatures.',
      badge: 'Challenge Special',
      icon: Flame,
    },
    {
      id: 'map',
      label: 'Pollution Map',
      fullTitle: 'Interactive GIS Geospatial Observatory',
      desc: 'Explore 50+ monitoring stations across India and world metropolises with radial particulate heatmaps on free OpenStreetMap layers.',
      badge: '50+ Stations',
      icon: MapIcon,
    },
    {
      id: 'analytics',
      label: 'Trends & Analytics',
      fullTitle: 'Atmospheric Trends & Gas Correlations',
      desc: '96-hour historical air trajectory, PM2.5/PM10 particulate ratio breakdown, and diurnal photochemical curves.',
      badge: 'Historical & Models',
      icon: TrendingUp,
    },
    {
      id: 'forecast',
      label: '7-Day Forecast',
      fullTitle: 'Meteorological Forecast & Activity Planner',
      desc: '7-day daily AQI outlook and hour-by-hour smart outdoor planner for jogging, cycling, and sensitive children.',
      badge: '7-Day Outlook',
      icon: Calendar,
    },
    {
      id: 'health',
      label: 'Health Guidance',
      fullTitle: 'Targeted Public Health & Vulnerable Group Advisories',
      desc: 'Demographic-specific protection guidelines for general public, children, seniors, athletes, and asthma patients.',
      badge: 'Public Health Standards',
      icon: HeartPulse,
    },
    {
      id: 'compare',
      label: 'Compare Cities',
      fullTitle: 'Multi-City Environmental Benchmarking Matrix',
      desc: 'Direct side-by-side comparison of up to 4 global and Indian cities with cleanest vs most polluted analysis.',
      badge: 'Benchmarking Matrix',
      icon: Scale,
    },
    {
      id: 'insights',
      label: 'Insights & Glossary',
      fullTitle: 'Chemical Intelligence & Atmospheric Glossary',
      desc: 'Dominant pollutant breakdown, diurnal cycle explanations, and standard atmospheric chemical definitions.',
      badge: 'Chemical Encyclopaedia',
      icon: Lightbulb,
    },
  ];

  const currentSectionIndex = navSections.findIndex((s) => s.id === activeNav);
  const currentSectionMeta = navSections[currentSectionIndex] || navSections[0];

  const handleSelectSection = (id: string) => {
    setActiveNav(id);
    if (viewMode === 'all') {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -90;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSection = () => {
    const prevIndex = (currentSectionIndex - 1 + navSections.length) % navSections.length;
    handleSelectSection(navSections[prevIndex].id);
  };

  const handleNextSection = () => {
    const nextIndex = (currentSectionIndex + 1) % navSections.length;
    handleSelectSection(navSections[nextIndex].id);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-forest-950 text-slate-100">
      {/* Global Navigation Header */}
      <Navbar
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
      />

      {/* Sticky Section Workspace Navigation Bar */}
      <div className="sticky top-16 sm:top-20 z-30 w-full border-b border-forest-900/90 bg-forest-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 py-2 overflow-x-auto scrollbar-none">
            {/* Horizontal Section Pills */}
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              {navSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeNav === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleSelectSection(sec.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-medium transition-all shrink-0 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-glow-good border border-emerald-400/40'
                        : 'bg-forest-900/70 text-slate-400 hover:text-white hover:bg-forest-850 border border-forest-800/60'
                    }`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        sec.id === 'diwali-observatory' && !isActive ? 'text-amber-400' : ''
                      }`}
                    />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Focused Tab vs All Sections Feed */}
            <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-forest-850">
              <button
                onClick={() => setViewMode(viewMode === 'tabbed' ? 'all' : 'tabbed')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  viewMode === 'all'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                    : 'bg-forest-900/80 text-slate-300 hover:text-white border-forest-800'
                }`}
                title={viewMode === 'tabbed' ? 'Switch to Continuous Single-Page Feed' : 'Switch to Focused Tabbed Workspace'}
              >
                {viewMode === 'tabbed' ? (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">Focused View</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">All Sections</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error Notification Banner if API Fails */}
        {error && (
          <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Atmospheric Telemetry Notice:</strong>
                <span className="text-sm">{error}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={refreshData} className="shrink-0 text-xs">
              <RotateCw className="w-3.5 h-3.5 mr-1" />
              Refresh Feed
            </Button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && !airQuality ? (
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-44 w-full rounded-xl" />
            </div>
          </div>
        ) : airQuality ? (
          <>
            {/* MODE 1: TABBED FOCUSED VIEW (DEFAULT, CLEAN & INTUITIVE) */}
            {viewMode === 'tabbed' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Active Section Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-forest-900/90 via-forest-900/60 to-forest-950 border border-forest-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                        {currentSectionMeta.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Section {currentSectionIndex + 1} of {navSections.length}
                      </span>
                      <span className="text-xs text-emerald-300/80 bg-forest-800/60 px-2 py-0.5 rounded-full">
                        📍 {currentLocation.name} ({airQuality.usAqi} US AQI)
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <currentSectionMeta.icon className="w-5 h-5 text-emerald-400" />
                      {currentSectionMeta.fullTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                      {currentSectionMeta.desc}
                    </p>
                  </div>

                  {/* Previous / Next Quick Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevSection}
                      className="text-xs px-2.5 py-1.5 h-auto"
                      title="Jump to previous section"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
                      Prev
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNextSection}
                      className="text-xs px-3 py-1.5 h-auto bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Jump to next section"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </div>
                </div>

                {/* Section View Renderer */}
                {activeNav === 'dashboard' && (
                  <div className="space-y-8 animate-fadeIn">
                    <MainAQICard data={airQuality} />
                    <PollutantGrid data={airQuality} />
                  </div>
                )}

                {activeNav === 'diwali-observatory' && (
                  <div className="animate-fadeIn">
                    <DiwaliSmogWatch />
                  </div>
                )}

                {activeNav === 'map' && (
                  <div className="animate-fadeIn">
                    <AirQualityMap />
                  </div>
                )}

                {activeNav === 'analytics' && (
                  <div className="animate-fadeIn">
                    <TrendsSection data={airQuality} />
                  </div>
                )}

                {activeNav === 'forecast' && (
                  <div className="animate-fadeIn">
                    <ForecastSection data={airQuality} />
                  </div>
                )}

                {activeNav === 'health' && (
                  <div className="animate-fadeIn">
                    <HealthRecommendations
                      level={airQuality.category.level}
                      aqi={airQuality.usAqi}
                    />
                  </div>
                )}

                {activeNav === 'compare' && (
                  <div className="animate-fadeIn">
                    <CompareCities />
                  </div>
                )}

                {activeNav === 'insights' && (
                  <div className="animate-fadeIn">
                    <PollutionInsights data={airQuality} />
                  </div>
                )}

                {/* Section Navigation Footer Guide */}
                <div className="pt-6 border-t border-forest-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={handlePrevSection}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-emerald-400" />
                    <span>
                      Previous: <strong className="text-white">{navSections[(currentSectionIndex - 1 + navSections.length) % navSections.length].label}</strong>
                    </span>
                  </button>

                  <button
                    onClick={() => setViewMode('all')}
                    className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
                  >
                    Prefer one long page? Click to switch to All Sections view
                  </button>

                  <button
                    onClick={handleNextSection}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>
                      Next: <strong className="text-white">{navSections[(currentSectionIndex + 1) % navSections.length].label}</strong>
                    </span>
                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE 2: ALL SECTIONS CONTINUOUS FEED */}
            {viewMode === 'all' && (
              <div className="space-y-14 animate-fadeIn">
                <div className="p-3 rounded-xl bg-forest-900/60 border border-forest-850 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Viewing <strong>All 8 Sections</strong> in continuous observatory mode.
                  </span>
                  <button
                    onClick={() => setViewMode('tabbed')}
                    className="text-emerald-400 hover:underline font-medium"
                  >
                    Switch back to Tabbed View →
                  </button>
                </div>

                {/* Section A: Main AQI Dashboard & Key Pollutants */}
                <section id="dashboard" className="space-y-8 animate-fadeIn">
                  <MainAQICard data={airQuality} />
                  <PollutantGrid data={airQuality} />
                </section>

                {/* Let's Code Diwali Special Feature: Diwali Smog & Stubble Observatory */}
                <section id="diwali-observatory" className="pt-4">
                  <DiwaliSmogWatch />
                </section>

                {/* Section B: Interactive Air Quality Map & Heatmap */}
                <section id="map" className="pt-4">
                  <AirQualityMap />
                </section>

                {/* Section C: Air Quality Trends & Analytics */}
                <section id="analytics" className="pt-4">
                  <TrendsSection data={airQuality} />
                </section>

                {/* Section D: Air Quality Forecast & Smart Activity Planner */}
                <section id="forecast" className="pt-4">
                  <ForecastSection data={airQuality} />
                </section>

                {/* Section E: Health & Safety Recommendations */}
                <section id="health" className="pt-4">
                  <HealthRecommendations
                    level={airQuality.category.level}
                    aqi={airQuality.usAqi}
                  />
                </section>

                {/* Section F: Multi-City Comparison Matrix */}
                <section id="compare" className="pt-4">
                  <CompareCities />
                </section>

                {/* Section G: Pollution Insights & Atmospheric Directory */}
                <section id="insights" className="pt-4">
                  <PollutionInsights data={airQuality} />
                </section>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Global Draggable & Magnetic Edge-Snapping AI Chatbot */}
      <AirQualityChatbot />

      {/* Global Footer */}
      <Footer />

      {/* Advanced Features Modals */}
      <AlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        currentAqi={airQuality ? airQuality.usAqi : 50}
      />

      {airQuality && (
        <ShareReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          data={airQuality}
        />
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AQIConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </div>
  );
};

# BreatheBetter – System Architecture & UML Engineering Specification

**Project:** BreatheBetter – Real-Time Air Quality Intelligence Platform  
**Challenge:** Let's Code Diwali Challenge 2026: Breathe Better  
**Product Tagline:** *"Know Your Air. Protect Your Health. / Breathe Better. Build Smarter."*  
**System Version:** 2.1.0 Production  
**Deployment Target:** Vercel Edge / Static SPA  

---

## 1. Executive Architectural Overview

BreatheBetter is an event-driven, client-orchestrated environmental intelligence platform. It processes authentic atmospheric chemistry data and forecasts from meteorological satellites, chemical transport models (Copernicus Atmosphere Monitoring Service - CAMS), and ground stations, transforming raw atmospheric physics into intuitive visual diagnostics, geospatial heatmaps, and demographic-specific health advisories.

The system is architected around a **Dual-Engine Data Pipeline**:
1. **Live Stream Engine:** Directly connects to Open-Meteo REST APIs backed by the European Centre for Medium-Range Weather Forecasts (ECMWF) Copernicus Atmosphere Monitoring Service (CAMS).
2. **Calibrated Static Baseline Engine:** Houses over 50 verified monitoring stations across India (Delhi Anand Vihar, Mandir Marg, Mumbai BKC, Bengaluru BTM, Kolkata Victoria, etc.) and global metropolises (Tokyo, London, New York, Paris, Beijing, Dubai) to ensure zero-latency offline continuity and instant demonstration capability.

---

## 2. Formal UML Class Diagram (Domain Model & Services)

The following UML Class Diagram models the core domain entities, telemetry payloads, contextual state containers, and atmospheric services within the BreatheBetter platform.

```mermaid
classDiagram
    direction TB

    class LocationInfo {
        +string id
        +string name
        +number latitude
        +number longitude
        +string country
        +string countryCode
        +string admin1
        +string timezone
        +number population
    }

    class WorldStationLocation {
        +string state
        +string zone
        +string continent
        +number baselineAqi
        +number pm25
        +number pm10
        +string stationName
    }

    class PollutantMeasurement {
        +string id
        +string name
        +string symbol
        +number value
        +string unit
        +number whoThreshold
        +string thresholdLabel
        +string status
        +string description
        +string healthImpact
        +number[] trend
    }

    class CategoryInfo {
        +number level
        +string name
        +string color
        +string healthRisk
        +string generalGuidance
    }

    class DominantPollutant {
        +string id
        +string name
        +string symbol
        +number ratioToWHO
    }

    class HourlyDataPoint {
        +string time
        +string displayLabel
        +number aqi
        +number pm25
        +number pm10
        +number no2
        +number so2
        +number o3
        +number co
        +boolean isForecast
    }

    class DailyForecast {
        +string date
        +string dayName
        +number maxAqi
        +number minAqi
        +number avgPm25
        +string categoryName
        +string categoryColor
        +string primaryRisk
    }

    class ActivityWindow {
        +string period
        +string timeRange
        +string recommendation
        +string badgeColor
        +string rationale
        +number avgAqi
    }

    class AirQualityData {
        +LocationInfo location
        +string timestamp
        +string source
        +number usAqi
        +number europeanAqi
        +CategoryInfo category
        +DominantPollutant dominantPollutant
        +Map pollutants
        +HourlyDataPoint[] hourly
        +DailyForecast[] dailyForecast
        +ActivityWindow[] activityWindows
        +string interpretation
    }

    class AirQualityContextType {
        +AirQualityData airQuality
        +LocationInfo currentLocation
        +boolean isLoading
        +string error
        +string dataSourceMode
        +LocationInfo[] recentSearches
        +LocationInfo[] favorites
        +LocationInfo[] compareList
        +setLocation(loc) void
        +refreshData() Promise
        +setDataSourceMode(mode) void
        +addCompareCity(loc) void
        +removeCompareCity(id) void
        +isFavorite(id) boolean
        +addFavorite(loc) void
        +removeFavorite(id) void
    }

    class OpenMeteoService {
        +fetchAirQuality(lat, lon) Promise~AirQualityData~
        +searchLocations(query) Promise~LocationInfo[]~
        +reverseGeocode(lat, lon) Promise~LocationInfo~
        -parseCamsPayload(json) AirQualityData
        -calculateUsAqi(pm25, pm10) number
        -evaluateDominantPollutant(pollutants) DominantPollutant
    }

    class BaselineDemoEngine {
        +generateDemoAirQuality(loc) AirQualityData
        +getStationById(id) WorldStationLocation
        +generateDiurnalTrend(baselineAqi) HourlyDataPoint[]
        +generateForecast7Days(baselineAqi) DailyForecast[]
    }

    class CacheStorageManager {
        -string storageKeyPrefix
        -number defaultTTLMs
        +get(cacheKey) Object
        +set(cacheKey, data, ttl) void
        +clear() void
    }

    LocationInfo <|-- WorldStationLocation : inherits
    AirQualityData *-- LocationInfo : embeds
    AirQualityData *-- CategoryInfo : embeds
    AirQualityData *-- DominantPollutant : embeds
    AirQualityData *-- PollutantMeasurement : contains 6-8
    AirQualityData *-- HourlyDataPoint : contains 96h
    AirQualityData *-- DailyForecast : contains 7-day
    AirQualityData *-- ActivityWindow : contains 4
    AirQualityContextType --> AirQualityData : manages state
    AirQualityContextType --> OpenMeteoService : delegates live queries
    AirQualityContextType --> BaselineDemoEngine : delegates offline/baseline
    AirQualityContextType --> CacheStorageManager : persists telemetry
```

---

## 3. Formal UML Sequence Diagram (Telemetry Resolution & Pipeline Execution)

This sequence diagram illustrates the lifecycle of a user-initiated location selection, demonstrating the tiered caching, CAMS API fetch, error boundary mitigation, and component re-rendering.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Researcher
    participant UI as Navbar / Search UI
    participant Ctx as AirQualityContext
    participant Cache as LocalStorage Cache
    participant Client as OpenMeteo Client
    participant API as CAMS / Open-Meteo REST API
    participant Demo as Baseline Demo Engine
    participant View as Section / Tab Viewers

    User->>UI: Selects city (e.g., "New Delhi, India")
    UI->>Ctx: setLocation(locationInfo)
    Ctx->>Ctx: Set isLoading = true, error = null
    
    Ctx->>Cache: Check cached telemetry for (lat, lon, mode)
    
    alt Cache Hit (Timestamp < 10 mins old)
        Cache-->>Ctx: Return cached AirQualityData
        Ctx->>Ctx: Update airQuality state
        Ctx->>View: Re-render components with cached telemetry
    else Cache Miss or Force Refresh
        alt Mode == 'live'
            Ctx->>Client: fetchAirQuality(lat, lon)
            Client->>API: GET /v1/air-quality?latitude=28.61&longitude=77.23&hourly=pm2_5,pm10,no2,so2,co,o3...
            
            alt HTTP 200 OK & Valid Atmospheric Payload
                API-->>Client: Raw JSON (hourly telemetry, coordinates)
                Client->>Client: calculateUsAqi(), evaluateThresholds(), generateActivityWindows()
                Client-->>Ctx: Parsed AirQualityData
                Ctx->>Cache: Save payload to LocalStorage (TTL: 10m)
            else Network Error / Rate Limit / Timeout
                API--xClient: 504 Gateway Timeout or Network Exception
                Client-->>Ctx: Throw Error("CAMS satellite feed unreachable")
                Ctx->>Demo: generateDemoAirQuality(locationInfo) [Graceful Fallback]
                Demo-->>Ctx: Return calibrated baseline payload
                Ctx->>Ctx: Set error = "Live feed fallback active; displaying verified station baseline."
            end
        else Mode == 'demo'
            Ctx->>Demo: generateDemoAirQuality(locationInfo)
            Demo-->>Ctx: Return calibrated station telemetry
        end

        Ctx->>Ctx: Set isLoading = false
        Ctx->>View: Re-render active section (Overview, Map, Trends, etc.)
        View-->>User: Interactive charts, gauge & health advice displayed
    end
```

---

## 4. Formal UML State Machine Diagram (Atmospheric Data Lifecycle)

This state machine formalizes the dynamic states of the atmospheric intelligence engine, including cold boot, cache revalidation, error recovery, and user-driven modes.

```mermaid
stateDiagram-v2
    [*] --> IdleColdBoot: Application Boot

    state IdleColdBoot {
        [*] --> CheckStoredPreferences
        CheckStoredPreferences --> ResolveDefaultLocation: Read last saved city or New Delhi
    }

    IdleColdBoot --> CheckingCache: Coordinates Resolved

    state CheckingCache {
        [*] --> QueryStorageKey
        QueryStorageKey --> ValidCacheAvailable: TTL < 10 Minutes
        QueryStorageKey --> CacheExpiredOrMissing: TTL >= 10 Minutes or Empty
    }

    ValidCacheAvailable --> HydratedActive: Instant state hydration
    CacheExpiredOrMissing --> EvaluatingEngineMode: Trigger network fetch

    state EvaluatingEngineMode {
        [*] --> ModeSwitch
        ModeSwitch --> FetchingLiveStream: Mode == 'live'
        ModeSwitch --> LoadingCalibratedBaseline: Mode == 'demo'
    }

    state FetchingLiveStream {
        [*] --> DispatchRestRequest
        DispatchRestRequest --> AwaitingCamsResponse
        AwaitingCamsResponse --> ProcessingTelemetry: HTTP 200 (PM2.5, PM10, Gases)
        AwaitingCamsResponse --> NetworkFailure: Timeout / CORS / 5xx
    }

    NetworkFailure --> FallbackToBaseline: Fallback Triggered
    FallbackToBaseline --> HydratedActive: Hydrated with warning notice

    LoadingCalibratedBaseline --> ProcessingTelemetry: Load 50+ Station Baseline
    ProcessingTelemetry --> HydratedActive: Calculate AQI, Ratios, Activity Windows

    state HydratedActive {
        [*] --> DisplayingActiveSection
        DisplayingActiveSection --> SectionTabChanged: User selects Map / Trends / Diwali
        SectionTabChanged --> DisplayingActiveSection: Render targeted workspace view
    }

    HydratedActive --> EvaluatingEngineMode: User selects new city or clicks refresh
    HydratedActive --> [*]: Window unload
```

---

## 5. Formal UML Component & Package Architecture

The system is organized into modular architectural packages separating presentation concerns, business logic, spatial processing, and physical data ingestion.

```mermaid
graph TD
    subgraph UI_Presentation_Layer ["@app/presentation"]
        AppView["AppContent Workspace Coordinator"]
        TabsNav["Section Tab Switcher (Overview, Map, Trends, Forecast, Health, Compare, Diwali, Insights)"]
        HeroGauge["MainAQICard (SVG Arc 0-500)"]
        PollutantCards["PollutantGrid (WHO 2021 Thresholds)"]
        GISMap["AirQualityMap (Leaflet + OpenStreetMap)"]
        AnalyticsView["TrendsSection (Recharts Historical/Forecast)"]
        ForecastView["ForecastSection (Daily & Hourly)"]
        HealthView["HealthRecommendations (5 Personas)"]
        CompareView["CompareCities (4-City Side-by-Side)"]
        DiwaliView["DiwaliSmogWatch (Inversion & Green Crackers)"]
        AeroBotView["AirQualityChatbot (Draggable & Magnetic Docking)"]
    end

    subgraph Context_State_Layer ["@app/state"]
        AQContext["AirQualityContext & Provider"]
        ThemeContext["ThemeContext (Permanent Forest Dark)"]
    end

    subgraph Service_Logic_Layer ["@app/services"]
        OpenMeteoClient["openMeteo.ts (REST Fetcher & Parser)"]
        DemoEngine["demoData.ts (Calibrated Hourly & Forecast Generators)"]
        GeoService["Geocoding Engine (Reverse GPS & City Search)"]
        StationDB["indiaStations.ts & worldStations.ts (50+ Locations)"]
    end

    subgraph Storage_Layer ["@app/storage"]
        LocalStorage["Browser LocalStorage (Keys: aqi_cache, favorites, settings)"]
    end

    subgraph External_Providers ["@external/apis"]
        CAMS["Copernicus Atmosphere Monitoring Service (ECMWF)"]
        OM_GEO["Open-Meteo Geocoding REST API"]
        OSM["OpenStreetMap Raster Tile Servers (Zero Watermark)"]
    end

    AppView --> TabsNav
    TabsNav --> HeroGauge
    TabsNav --> PollutantCards
    TabsNav --> GISMap
    TabsNav --> AnalyticsView
    TabsNav --> ForecastView
    TabsNav --> HealthView
    TabsNav --> CompareView
    TabsNav --> DiwaliView
    AppView --> AeroBotView

    HeroGauge --> AQContext
    PollutantCards --> AQContext
    GISMap --> AQContext
    AnalyticsView --> AQContext
    ForecastView --> AQContext
    HealthView --> AQContext
    CompareView --> AQContext
    DiwaliView --> AQContext
    AeroBotView --> AQContext

    AQContext --> OpenMeteoClient
    AQContext --> DemoEngine
    AQContext --> LocalStorage
    OpenMeteoClient --> CAMS
    GeoService --> OM_GEO
    GISMap --> OSM
    DemoEngine --> StationDB
```

---

## 6. AeroBot Magnetic Draggable Physics & Boundary Clamping State Machine

The floating AeroBot AI assistant supports full-screen 2D dragging with automatic magnetic edge-docking, directional handle orientation, and boundary recovery.

```mermaid
stateDiagram-v2
    [*] --> DockedRight: Initial Mount (Right Edge: x=W-64px, y=H-120px)

    DockedRight --> PointerDown: Pointer pressed
    DockedLeft --> PointerDown: Pointer pressed

    PointerDown --> Dragging: Pointer moves dx, dy > 4px

    Dragging --> Dragging: Continuous pointerMove (updating clientX, clientY)

    Dragging --> EvaluatingSnap: Pointer released (PointerUp)

    EvaluatingSnap --> OutOfBoundsClamping: x < 0 or x > W or y < 0 or y > H
    OutOfBoundsClamping --> SnapLeft: Target adjusted to safe viewport margin
    OutOfBoundsClamping --> SnapRight: Target adjusted to safe viewport margin

    EvaluatingSnap --> SnapLeft: CenterX < WindowWidth / 2
    EvaluatingSnap --> SnapRight: CenterX >= WindowWidth / 2

    SnapLeft --> DockedLeft: Smooth transition to x=12px, clamp(75px, y, H-80px)
    SnapRight --> DockedRight: Smooth transition to x=W-64px, clamp(75px, y, H-80px)

    DockedLeft --> DrawerOpen: Click / Tap on handle
    DockedRight --> DrawerOpen: Click / Tap on handle

    DrawerOpen --> DockedLeft: Close button (X) clicked (dockSide == left)
    DrawerOpen --> DockedRight: Close button (X) clicked (dockSide == right)
```

---

## 7. Geospatial & Particulate Heatmap Architecture

```mermaid
flowchart LR
    A["Select Network Scope<br/>(India 26 / World 50+)"] --> B["Load Station Metadata<br/>(Coordinates, Baseline AQI)"]
    B --> C["Initialize Leaflet Map<br/>(Tile Layer: OpenStreetMap Standard)"]
    
    C --> D{"Heatmap Toggle Active?"}
    D -- Yes --> E["Compute Radial Semi-Transparent Circles<br/>(Radius: 45km, Opacity: 0.25, Color: AQI Palette)"]
    D -- No --> F["Bypass Radial Heatmap"]
    
    E --> G["Render Animated Pulsing Markers<br/>(CSS glow-pulse based on US AQI severity)"]
    F --> G
    
    G --> H["Bind Interactive Tooltip & Popups<br/>(Station Name, PM2.5, PM10, AQI Category)"]
    H --> I["Click 'Set As Active Station'<br/>(Global Context Synchronized Across Platform)"]
```

---

## 8. Sectional Workspace Navigation Architecture

To guarantee superior visibility, low cognitive load, and responsive fluid performance across mobile, tablet, and desktop viewports, the platform organizes its analytical modules into a dedicated **Sectional Tab Workspace**:

1. **Focused Section View (Default):**
   - Displays one domain at a time (e.g. `Overview`, `Map`, `Analytics`, `Forecast`, `Health`, `Compare`, `Diwali`, `Insights`).
   - Eliminates page scroll fatigue and provides instant jump access via a sticky pill bar.
   - Includes sequential flow footers (*"Next Section →"* and *"← Previous Section"*) with contextual badges.
2. **Observatory View (All Sections):**
   - An optional consolidated continuous view available via the toggle switch for executive presentation and printable reports.
3. **Responsive Breakpoints:**
   - **Mobile (<640px):** Single-column stacked cards, horizontally scrollable tab pills, touch-friendly drag handles for AeroBot.
   - **Tablet (640px–1024px):** 2-column balanced grids, compact Recharts views, side-by-side comparison tables.
   - **Desktop (>1024px):** Multi-column full-width dashboards, 50+ station geospatial canvas, expansive multi-gas correlation charts.

---

## 9. Security, Privacy & Performance Safeguards

1. **Client-Side API Credential Isolation:**
   - Any optional user-provided tokens (WAQI or OpenAQ) are stored strictly in client-side `localStorage`.
   - Zero private credentials are ever hardcoded or leaked into the production bundle.
2. **Permission-Gated Geolocation:**
   - Browser GPS coordinates are requested strictly upon deliberate user interaction with the compass button.
3. **Free & Unrestricted Tile Layer:**
   - Powered by official OpenStreetMap raster tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) with zero API key dependencies and zero watermark interference.
4. **Resilient Dual Sourcing:**
   - Automatic graceful fallback from live API queries to pre-calibrated static baselines ensures continuous availability under network outages.
5. **Zero-Config Vercel Edge Deployment:**
   - Builds to `dist/` with single-page routing rewrite rules in `vercel.json`.

# BreatheBetter – Comprehensive Application & User Experience Flow

**Project:** BreatheBetter – Real-Time Air Quality Intelligence Platform  
**Challenge:** Let's Code Diwali Challenge 2026: Breathe Better  
**Document:** End-to-End User Experience, Interaction Workflows & State Machines  
**Version:** 2.0.0 Production  

---

## 1. High-Level User Journey Flowchart

```mermaid
flowchart TD
    Start(["User opens BreatheBetter Web App"]) --> Init["Initialize Dark Theme & State<br/>Load Last Visited Location or Anand Vihar (New Delhi)"]
    Init --> CheckMode{"Data Source Mode?"}

    CheckMode -- "Live Stream" --> CallAPI["Query Open-Meteo REST API & CAMS Models"]
    CheckMode -- "Static Baseline" --> LoadDemo["Load Pre-Calibrated 50+ Station Dataset"]

    CallAPI --> APISuccess{"API Response Status"}
    APISuccess -- Success (200) --> SaveCache["Update LocalStorage Cache (10-min TTL)"]
    SaveCache --> RenderDashboard["Render Full Dashboard, Charts & Heatmap"]
    APISuccess -- Error / Offline --> AutoFallback["Graceful Fallback to Calibrated Baseline<br/>(Display Informational Notice)"]
    AutoFallback --> RenderDashboard
    LoadDemo --> RenderDashboard

    RenderDashboard --> UserActions{"User Interaction Points"}
    
    UserActions --> |"1. Location & Station Search"| SearchFlow["Search Indian/World Station or Click 'Use My Location'"]
    UserActions --> |"2. Interactive GIS Map"| MapFlow["Explore 50+ Pins, Toggle Heatmap, Click 'Set As Active'"]
    UserActions --> |"3. AeroBot AI Assistant"| BotFlow["Drag Bot Anywhere, Magnetically Dock, Ask Health Questions"]
    UserActions --> |"4. Diwali Smog Observatory"| DiwaliFlow["Inspect Thermal Inversion, Ba/Sr Chemistry, Green Crackers"]
    UserActions --> |"5. Time-Series Trends"| TrendFlow["Toggle 24h/72h/7d & Demarcate History vs Forecast"]
    UserActions --> |"6. Activity Planner"| ActivityFlow["Filter Hours for Running, Kids Play, or Walking"]
    UserActions --> |"7. Persona Health Guidance"| HealthFlow["Inspect Advice for Kids, Seniors, Asthma Patients, Athletes"]
    UserActions --> |"8. Multi-City Comparison"| CompareFlow["Add up to 4 Cities for Side-by-Side Normalized Matrix"]
    UserActions --> |"9. AQI Converter"| ConverterFlow["Slide PM2.5 to map US EPA vs Indian NAQI vs CAQI"]
    UserActions --> |"10. Alerts & Export"| ExportFlow["Configure Web Push Alerts or Export Printable PDF Report"]
```

---

## 2. Location Search & GPS Geolocation State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Search input empty
    
    Idle --> Typing: User types characters (>= 2 chars)
    Typing --> Debouncing: 250ms debounce timer
    Debouncing --> SearchingStations: Query Local 50+ Stations DB + Open-Meteo API
    
    SearchingStations --> AutocompleteResults: Matches found (City, State, Station)
    SearchingStations --> NoResults: No matching stations found
    
    AutocompleteResults --> LocationSelected: User clicks station from dropdown
    NoResults --> Idle: User clears query
    
    Idle --> RequestingGPS: User clicks Compass ('Use My Location')
    RequestingGPS --> GPSAllowed: Browser geolocation granted
    RequestingGPS --> GPSDenied: Browser geolocation denied
    
    GPSDenied --> Idle: Display friendly permission explanation
    GPSAllowed --> ReverseGeocoding: Query reverse Nominatim/Open-Meteo
    ReverseGeocoding --> LocationSelected: Resolved to nearest city/district
    
    LocationSelected --> UpdatingDashboard: Update active coordinates in Context
    UpdatingDashboard --> DashboardRefreshed: Re-center Map, Reload Gauges & Charts
    DashboardRefreshed --> [*]
```

---

## 3. Interactive Air Quality Map & Heatmap Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant MapUI as Leaflet Map Component
    participant Layer as OSM Voyager Tiles
    participant Store as AirQuality Context
    
    User->>MapUI: Views interactive Map Section
    MapUI->>Store: Ingest active station coordinates { lat, lon, aqi }
    MapUI->>Layer: Load OpenStreetMap tiles (Zero Watermarks)
    MapUI->>MapUI: Render radial semi-transparent Heatmap circles
    MapUI->>MapUI: Render 50+ color-coded pulsing AQI markers
    
    alt User clicks station pin
        User->>MapUI: Clicks marker (e.g. Mumbai Bandra Kurla)
        MapUI->>MapUI: Opens rich popup with AQI, PM2.5, PM10, Station Name
        User->>MapUI: Clicks "Set As Active Station"
        MapUI->>Store: Dispatch setLocation(station)
        Store-->>MapUI: Fly map to new coordinates with smooth easing
        Store-->>User: Whole dashboard, charts, and forecasts sync instantly
    end

    alt User toggles presets
        User->>MapUI: Clicks "🇮🇳 India (26)" or "🌍 World (50+)"
        MapUI->>MapUI: Adjusts zoom bounds and displays filtered station list
    end
```

---

## 4. AeroBot AI Assistant Draggable & Magnetic Docking Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant AeroBot as AeroBot Floating Widget
    participant Engine as Contextual AI Engine
    participant Store as AirQuality Context

    User->>AeroBot: Pointer down & drag across screen
    AeroBot->>AeroBot: Follows cursor/finger smoothly (touch-action: none)
    User->>AeroBot: Pointer released (PointerUp)
    AeroBot->>AeroBot: Calculate center distance to left vs right edge
    AeroBot->>AeroBot: Magnetically snap and dock to nearest edge (x=12px or x=W-64px)
    AeroBot->>AeroBot: Clamp Y safely between header (75px) and bottom (H-80px)

    User->>AeroBot: Clicks docked handle to open chat
    AeroBot->>Store: Ingest current location { name, usAqi, dominantPollutant }
    AeroBot->>AeroBot: Open drawer and display personalized contextual greeting
    User->>AeroBot: Selects quick prompt pill ("How to protect lungs during Diwali?")
    AeroBot->>Engine: Evaluate question + atmospheric context
    Engine-->>AeroBot: Return structured respiratory guidance & HEPA tips
    AeroBot-->>User: Stream formatted response with copyable actions
```

---

## 5. Multi-City Comparison Matrix Flow

```mermaid
flowchart LR
    subgraph Station Selection
        A["Click 'Add City to Compare'"] --> B["Select City 1 (e.g. New Delhi Anand Vihar)"]
        B --> C["Select City 2 (e.g. Mumbai BKC)"]
        C --> D["Select City 3 (e.g. Bengaluru BTM)"]
        D --> E["Select City 4 (e.g. London Westminster)"]
    end

    subgraph Data Harmonization
        E --> F["Retrieve Multi-Station Telemetry"]
        F --> G["Normalize to US EPA AQI & ug/m3"]
        G --> H["Calculate Min and Max AQI in Bucket"]
    end

    subgraph Comparative Visualization
        H --> I["Tag 'Cleanest in Set' Badge"]
        H --> J["Tag 'Most Polluted' Badge"]
        H --> K["Render Side-by-Side Comparative Cards"]
        K --> L["One-Click 'View in Main Dashboard'"]
    end
```

---

## 6. Smart Outdoor Activity Planner Flow

```mermaid
flowchart TD
    Req["User selects 'Smart Activity Planner'"] --> Pull["Pull Next 24-Hour Forecast Data"]
    Pull --> FilterTabs{"User Selected Activity Filter?"}
    
    FilterTabs -- "All Hours" --> EvaluateAll["Evaluate All Daylight Windows"]
    FilterTabs -- "🏃 Running Safe" --> FilterCardio["Filter where suitableForRunners == true"]
    FilterTabs -- "🧒 Kids Play" --> FilterKids["Filter where suitableForKids == true"]
    
    EvaluateAll --> ThresholdLogic{"Hourly AQI Threshold"}
    FilterCardio --> ThresholdLogic
    FilterKids --> ThresholdLogic

    ThresholdLogic -- "AQI <= 50" --> Optimal["Tag 'Optimal Window' (Safe for high-cadence cardio)"]
    ThresholdLogic -- "AQI 51 - 100" --> Moderate["Tag 'Moderate Caution' (Acceptable for most)"]
    ThresholdLogic -- "AQI > 100" --> Poor["Tag 'Shift Indoors' (Sensitive groups stay inside)"]
    
    Optimal --> RenderGrid["Render Hourly Window Badges & Respiration Advice"]
    Moderate --> RenderGrid
    Poor --> RenderGrid
```

---

## 7. Report Export & Web Alert Workflow

```mermaid
stateDiagram-v2
    [*] --> Standby
    
    Standby --> ConfigureAlerts: User clicks 'Alerts' in Navbar
    ConfigureAlerts --> CheckPermission: Check window.Notification.permission
    CheckPermission --> RequestPermission: Permission is 'default'
    RequestPermission --> PermissionGranted: User allows notifications
    RequestPermission --> PermissionDenied: User denies notifications
    
    PermissionGranted --> SetThreshold: Configure threshold (AQI > 100, 150, or 200)
    SetThreshold --> ActiveMonitoring: Saved in LocalStorage
    ActiveMonitoring --> NotificationTriggered: Periodic check detects AQI exceedance
    NotificationTriggered --> ShowBrowserAlert: Display native OS push notification
    
    Standby --> GenerateReport: User clicks 'Export Report' in Navbar
    GenerateReport --> CompileIntelligence: Assemble Station name, AQI, 6 Pollutants, Timestamp, Advice
    CompileIntelligence --> RenderPrintModal: Display official formatted intelligence card
    RenderPrintModal --> PrintPDF: User clicks 'Print / Save as PDF' (Invokes window.print())
    RenderPrintModal --> CopyClipboard: User clicks 'Copy Text Summary' (Copies markdown to clipboard)
```

---

## 8. Sectional Workspace Navigation & Tour Flow

```mermaid
stateDiagram-v2
    [*] --> FocusedTabWorkspace: Default App Mount

    state FocusedTabWorkspace {
        [*] --> ViewOverview: activeNav == 'dashboard'
        ViewOverview --> ViewDiwaliWatch: Select 'Diwali Smog Watch' or click Next
        ViewDiwaliWatch --> ViewMap: Select 'Pollution Map' or click Next
        ViewMap --> ViewAnalytics: Select 'Trends & Analytics' or click Next
        ViewAnalytics --> ViewForecast: Select '7-Day Forecast' or click Next
        ViewForecast --> ViewHealth: Select 'Health Guidance' or click Next
        ViewHealth --> ViewCompare: Select 'Compare Cities' or click Next
        ViewCompare --> ViewInsights: Select 'Insights & Glossary' or click Next
        ViewInsights --> ViewOverview: Select 'Overview' or click Next
    }

    FocusedTabWorkspace --> ContinuousAllFeed: Click 'Focused View' toggle switch
    ContinuousAllFeed --> FocusedTabWorkspace: Click 'All Sections' toggle switch

    state ContinuousAllFeed {
        [*] --> ScrollObservation
        ScrollObservation --> AnchorJump: Click pill in sticky header (Smooth scroll to section ID)
    }
```

---

## 9. Responsive Breakpoint Layout Strategy

```
+-------------------------------------------------------------------------------+
| Breakpoint: Mobile (< 640px)                                                  |
| - Header: Compact Brand + Search Bar + Mobile Menu Drawer                     |
| - Jump Pills: Horizontally scrollable pill strip with touch momentum          |
| - Hero: Vertical stack (Main AQI Circular Gauge -> Rule Interpretation)       |
| - Pollutant Grid: Single column or 2-column compact grid                      |
| - Diwali Observatory: Collapsible tabs with touch-friendly cards              |
| - Map: Full width, height 450px, touch zoom enabled                           |
| - AeroBot: Floating draggable icon, magnetically docks to left/right edge     |
+-------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------+
| Breakpoint: Tablet (640px - 1024px)                                           |
| - Header: Autocomplete Search + Indian Metro Strip                            |
| - Jump Pills: Visible horizontal sub-navigation                               |
| - Hero: Side-by-side gauge and interpretation card                            |
| - Pollutant Grid: 2 or 3 columns with 24h sparklines                          |
| - Map: Full width with floating legend and scope toggles                      |
| - Trends & Forecast: Multi-tab Recharts line & area views                     |
+-------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------+
| Breakpoint: Desktop (>= 1024px)                                               |
| - Header: Full search, Metro strip, Converter, Alerts, Report, Settings       |
| - Hero: Full 12-column observatory layout with ambient status glow            |
| - Pollutant Grid: 6-card grid (PM2.5, PM10, NO2, SO2, CO, O3)                 |
| - Map: Interactive 50+ stations with radial heatmap density overlay           |
| - Compare Cities: 4-column side-by-side comparative matrix                    |
| - AeroBot: Fully draggable with magnetic edge docking anywhere on screen      |
+-------------------------------------------------------------------------------+
```

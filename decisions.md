# BreatheBetter – Architectural & Design Decisions

**Project:** BreatheBetter – Real-Time Air Quality Intelligence Platform  
**Challenge:** Let's Code Diwali Challenge 2026: Breathe Better  
**Product Tagline:** *"Know Your Air. Protect Your Health. / Breathe Better. Build Smarter."*  
**Date:** November 2026  
**Status:** Approved & Implemented in Production  

---

## 1. Context & Challenge Objectives

Air pollution is a critical public health hazard, especially during seasonal peaks such as Diwali and winter inversions in major urban centers. Existing consumer air quality apps often suffer from several deficiencies:
1. **Opaque Aggregations:** Users see a single number without understanding the underlying particulate or gas pollutants.
2. **Fabricated or Stale Data:** Outdated readings or simulated values are shown when stations drop offline.
3. **Cluttered UI:** Generic dashboards with aggressive advertisements, jarring gradients, and chaotic visual hierarchies.
4. **Lack of Actionable Health Insights:** Users are given generic warnings without demographic context (children, seniors, athletes, respiratory patients).

**BreatheBetter** was architected to be an authentic, production-grade environmental intelligence platform that pairs real-time public environmental APIs with an editorial, human-centered design system.

---

## 2. Key Architectural Decisions (ADR Register)

### ADR-01: Framework & Tooling Selection
* **Decision:** Vite 5 + React 18 + TypeScript + Tailwind CSS.
* **Rationale:**
  - Ultra-fast HMR and build performance (production bundle built in under 8 seconds).
  - Type-safe domain models for complex meteorological and atmospheric chemistry data.
  - Zero-configuration static and serverless deployment to Vercel via `vercel.json`.
  - Rich ecosystem compatibility with Leaflet, Recharts, and Lucide React.
* **Alternatives Considered:**
  - *Next.js 14/15:* Powerful for SSR, but introduces unnecessary server overhead for an app primarily querying client-authorized geolocations and public CORS-enabled environmental APIs.
  - *Plain HTML/JS:* Insufficient state management for multi-city comparisons, interactive mapping, and reactive charting.

---

### ADR-02: Public Environmental Data Sourcing Strategy
* **Decision:** Open-Meteo Air Quality API + Open-Meteo Geocoding API as the authentic, zero-token primary data provider, coupled with optional OpenAQ and WAQI key support.
* **Rationale:**
  - **Open-Meteo Air Quality API:** Backed by Copernicus Atmosphere Monitoring Service (CAMS) and national environmental agencies. Provides global coverage, current real-time observations, 168-hour historical data, and 7-day hourly forecasts without proprietary API key requirements or restrictive rate limits.
  - **Open-Meteo Geocoding API:** Instant worldwide city and coordinate resolution with population and administrative region data.
  - **OpenAQ & WAQI Support:** Configurable by the user in Settings. When keys are not supplied, the platform honestly documents the exact data source (CAMS / Open-Meteo) rather than fabricating fake station readings.
* **Strict Principle:** **Zero Mock Data.** Every measurement on screen is tied to an authentic API payload with an explicit timestamp, provider tag, and geographic coordinate.

---

### ADR-03: AQI Calculation Standards & Unit Disambiguation
* **Decision:** Standardize primarily on the **US EPA AQI (0–500 scale)** while simultaneously exposing the **Indian National AQI (NAQI 0–500)**, the **European Common Air Quality Index (CAQI 0–100+)**, and raw pollutant concentrations in $\mu\text{g/m}^3$ and $\text{mg/m}^3$.
* **Rationale:**
  - The US EPA AQI is globally recognized and provides well-calibrated breakpoints for PM2.5, PM10, Ozone, Carbon Monoxide, Sulfur Dioxide, and Nitrogen Dioxide.
  - Indian NAQI adheres to CPCB categories (*Good*, *Satisfactory*, *Moderately Polluted*, *Poor*, *Very Poor*, *Severe*), which are essential for citizens in India.
  - Raw concentrations must never be confused with unitless AQI values. The UI distinctly separates concentration cards ($\mu\text{g/m}^3$) from composite index cards.
* **AQI Categories & Breakpoints:**
  | Range | Category | Color Token | Health Impact |
  |---|---|---|---|
  | 0 – 50 | Good | `#10b981` (Emerald) | Air quality is considered satisfactory; air pollution poses little or no risk. |
  | 51 – 100 | Moderate | `#f59e0b` (Amber) | Acceptable quality; may cause moderate health concern for a very small number of unusually sensitive individuals. |
  | 101 – 150 | Unhealthy for Sensitive Groups | `#f97316` (Orange) | Members of sensitive groups may experience health effects; general public is less likely to be affected. |
  | 151 – 200 | Unhealthy | `#ef4444` (Red) | Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects. |
  | 201 – 300 | Very Unhealthy | `#a855f7` (Purple) | Health alert: risk of health effects is increased for everyone. |
  | 301 – 500+ | Hazardous | `#881337` (Maroon) | Health warning of emergency conditions: everyone is more likely to be affected. |

---

### ADR-04: UI/UX & Brand Identity
* **Decision:** Permanent Dark Forest Green & Charcoal Theme (`bg-forest-950`), inspired by modern observatories (Linear, Apple Weather).
* **Rationale:**
  - High data density demands maximum visual contrast: luminous status dots, glowing SVG progress rings, and emerald/mint/amber tones stand out against dark charcoal and near-black surfaces.
  - Eliminating the light mode toggle simplifies cognitive overhead and provides a cohesive, premium SaaS visual atmosphere.
  - Typography pairs **Cormorant Garamond** (literary serif display headers) with **Inter** (humanist sans body) and **JetBrains Mono** (technical telemetry).

---

### ADR-05: Geospatial Visualization & Watermark Elimination
* **Decision:** Leaflet + Standard OpenStreetMap (OSM) Tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
* **Rationale:**
  - Initial tests with CartoDB showed watermarked "API KEY REQUIRED" tiles.
  - Switching to official OSM tiles completely eliminated all third-party watermarks while remaining 100% free, open, and reliable.
  - Renders custom HTML/SVG pulsing circular AQI markers, semi-transparent radial heatmaps, and rich station popups with one-click "Set as Active Station" functionality.

---

### ADR-06: Time-Series Analytics & Temporal Demarcation
* **Decision:** Recharts-powered responsive charts with strict visual separation between historical observations and numerical forecast periods.
* **Rationale:**
  - Atmospheric forecasts represent numerical models, whereas past measurements represent recorded observations.
  - A vertical demarcation line ("NOW") clearly separates historical trend data from projected hourly forecasts.
  - Reference lines display international health thresholds (e.g., WHO PM2.5 24h limit of $15\ \mu\text{g/m}^3$).

---

### ADR-07: Public Health Guidance & Persona Matrix
* **Decision:** Rule-based public health advice engine calibrated to WHO and US EPA guidelines across five distinct personas:
  1. *General Population*
  2. *Children & Infants*
  3. *Elderly Individuals (65+)*
  4. *People with Respiratory/Cardiovascular Sensitivities (Asthma, COPD)*
  5. *Outdoor Workers & Athletes*
* **Compliance:** Explicit disclaimer included stating that BreatheBetter provides environmental intelligence for informational purposes and is not a clinical medical diagnostic tool.

---

### ADR-08: Multi-City Benchmarking Engine
* **Decision:** In-memory side-by-side comparison matrix for up to four user-selected global cities with auto-highlighting of the cleanest and most polluted locations.
* **Rationale:**
  - Normalizes metric units ($\mu\text{g/m}^3$) across cities.
  - Displays timestamps and data sources for each city.

---

### ADR-09: Caching & Throttling Layer
* **Decision:** Client-side cache with LocalStorage persistence and a 10-minute TTL per coordinate grid.
* **Rationale:**
  - Atmospheric conditions update hourly at public monitoring stations.
  - Eliminates redundant API queries during rapid tab switching or repeated searches.
  - Automatic eviction and manual "Refresh Data" bypass button.

---

### ADR-10: Privacy-Preserving Geolocation
* **Decision:** Geolocation via browser `navigator.geolocation` triggers *only* when the user explicitly clicks the "Use My Location" button.
* **Rationale:**
  - Respects user privacy.
  - Never auto-requests GPS permissions on initial page load.
  - Reverse geocodes coordinates to city/region name via Open-Meteo reverse search.

---

### ADR-11: Zero-Config Vercel Deployment
* **Decision:** Static Single Page Application build (`dist/`) with `vercel.json` rewrite routing.
* **Rationale:**
  - Instant deployment to Vercel without server container configuration.
  - Zero-maintenance, globally cached CDN delivery.
  - Environment variables (`VITE_WAQI_TOKEN`, `VITE_OPENAQ_KEY`) seamlessly plug into Vercel Project Settings.

---

### ADR-12: Context-Aware AeroBot AI Assistant
* **Decision:** Context-aware conversational AI assistant (`src/components/chat/AirQualityChatbot.tsx`) equipped with local environmental knowledge, dynamic location awareness, and prompt shortcut pills.
* **Rationale:**
  - Users need immediate, human-friendly interpretations beyond raw numbers (e.g., "Is it safe to jog right now?", "Which indoor plants clean air best?", "How to protect children during smog?").
  - Dynamically injected with the currently selected city's live AQI and dominant pollutant, ensuring guidance is tailored to the exact atmospheric conditions on screen.

---

### ADR-13: Deep Indian Monitoring Station Network
* **Decision:** Modeled 26+ real environmental monitoring stations across all Indian geographic zones (North, South, East, West, Central) with specific station names (DPCC Anand Vihar, MPCB Bandra Kurla, KSPCB BTM Layout, WBPCB Victoria Memorial, etc.) in `src/utils/indiaStations.ts`.
* **Rationale:**
  - Directly aligns with the theme of the **Let's Code Diwali Challenge 2026: Breathe Better**.
  - Highlights critical regional differences: the acute winter inversion belt of the Indo-Gangetic Plain versus coastal Southern air dynamics.

---

### ADR-14: Hybrid Dual-Engine Architecture (Live Stream + Calibrated Static Baseline)
* **Decision:** Implemented a user-toggleable data mode (`live` vs `demo` in `src/utils/demoData.ts` and `AirQualityContext`).
* **Rationale:**
  - If a user experiences network throttling or API server latency, switching to "Static Baseline" mode guarantees zero-latency rendering of all 168h historical charts, 7-day forecasts, and map markers with 100% data reliability.
  - Automatic graceful fallback ensures that if live network queries fail, the platform seamlessly loads calibrated station data without crashing.

---

### ADR-15: Diwali Smog & Thermal Inversion Observatory Module
* **Decision:** Specialized module (`src/components/diwali/DiwaliSmogWatch.tsx`) analyzing temporal accumulation curves, chemical fingerprints of pyrotechnics (Barium, Strontium, Potassium Nitrate, Sulfur), and CSIR-NEERI Green Cracker specifications.
* **Rationale:**
  - Serves as the marquee theme showcase for the national coding challenge.

---

### ADR-16: Physics-Based Draggable & Magnetic Edge-Snapping Assistant
* **Decision:** Pointer-event-based draggable floating widget for AeroBot that magnetically snaps to either the left or right edge of the screen upon release.
* **Rationale:**
  - Users on desktop or mobile can position the assistant anywhere without obscuring charts or maps.
  - Prevents the button from being lost: if thrown outside the viewport, it automatically clamps within bounds and rebounds to the nearest edge.

# 🍃 BreatheBetter – Real-Time Air Quality Intelligence Platform

> **"Know Your Air. Protect Your Health."**  
> *Developed for the **Let's Code Diwali Challenge 2026: Breathe Better***  
> *Product Tagline: "Breathe Better. Build Smarter."*

---

## 🌟 Executive Summary

**BreatheBetter** is a production-grade environmental intelligence platform engineered to help citizens, athletes, parents, and healthcare professionals understand atmospheric pollution and make informed decisions about outdoor exposure. 

Built specifically to address the severe seasonal pollution surges across the Indo-Gangetic Plain and metropolitan hubs during Diwali and winter thermal inversions, BreatheBetter moves beyond generic single-number AQI summaries. It connects directly to authentic public satellite telemetry, chemical transport models, and ground monitoring stations—delivering real-time multi-pollutant diagnostics, demographic-specific health advisories, and predictive forecasts.

---

## 🚀 Live Localhost Development

The application is running and accessible locally at:  
👉 **[http://localhost:5173/](http://localhost:5173/)**

To launch manually:
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build optimized production bundle
npm run build
```

---

## ✨ Flagship Innovations & Core Features

### 1. 🗂️ Sectional Tab Workspace Navigation (Zero Clutter)
- **Focused Tabbed Workspace (Default):** Instead of stacking all 8 modules on a single overwhelming page, BreatheBetter organizes analytical domains into dedicated views (Overview, Diwali Smog Watch, Pollution Map, Trends & Analytics, 7-Day Forecast, Health Guidance, Compare Cities, and Insights & Glossary).
- **Interactive Section Banners:** Each section features a domain badge, active station summary, and descriptive subtitle.
- **Sequential Flow Tour:** Guided `← Previous Section` and `Next Section →` navigation controls at the bottom of each view allow users to tour through the platform step-by-step.
- **Continuous All-Sections Feed Mode:** Users can toggle from the sticky pill bar at any time to switch to an executive single-page scroll view.

---

### 2. 🤖 AeroBot – Magnetic Draggable AI Environmental Assistant
- **Move Anywhere:** You can drag the floating AeroBot widget anywhere across your screen using a mouse or touch gestures.
- **Magnetic Edge Docking:** When released, AeroBot automatically calculates the nearest edge and **magnetically snaps and docks to either the left or right side of the screen** (just like assistive touch on smartphones).
- **Anti-Lost Auto-Rebound:** If thrown or dragged off-screen, it automatically rebounds and clamps safely inside the viewport bounds.
- **7 Categorized Question Domains:**
  - `🩺 Health & Vulnerable` • `🏃 Running & Fitness` • `🏠 Air Purifiers & Home` • `🎇 Diwali & Smog Defense` • `🚦 GRAP Rules & Laws` • `🔬 Atmospheric Science` • `All FAQs`
- **Context-Aware Intelligence:** Injects the currently active station's live AQI and dominant pollutant to provide immediate answers on:
  - CAQM GRAP regulations (Stages I, II, III, and IV in Delhi-NCR).
  - Why early morning jogging is the most hazardous during thermal winter smog.
  - Certified mask standards (N95/FFP2 vs surgical vs cloth) and reusability limits.
  - Air purifier CADR sizing formulas ($\text{CADR} \ge 2/3 \times \text{sq ft}$) and HEPA maintenance.
  - NASA-researched indoor air purifying plants (Snake Plant, Areca Palm, Peace Lily).
  - Pyrotechnic heavy metal smoke defense and nocturnal window sealing protocols.

---

### 3. 📐 Formal UML Diagrams & System Specifications
Documented in comprehensive detail in [`architecture.md`](./architecture.md):
- **Formal UML Class Diagram (`classDiagram`)**: Full object-oriented domain model with types, methods, fields, and inheritance/composition.
- **Formal UML Sequence Diagram (`sequenceDiagram`)**: Step-by-step asynchronous telemetry query, caching, fallback logic, and UI rendering.
- **Formal UML State Machine Diagram (`stateDiagram-v2`)**: Atmospheric data lifecycle across cold boot, live ingestion, CAMS satellite streaming, and baseline fallbacks.
- **Formal UML Component & Package Diagram (`graph TD`)**: Package architecture separating `@app/presentation`, `@app/state`, `@app/services`, `@app/storage`, and `@external/apis`.
- **AeroBot Physics State Machine (`stateDiagram-v2`)**: Physics-based dragging, clamping, and magnetic docking.

---

### 4. 🇮🇳 Deep Indian Monitoring Station Network (26+ Stations)
Extensive coverage across all Indian geographic zones and pollution belts:
- **Indo-Gangetic Smog Belt & North:** New Delhi (Anand Vihar, Mandir Marg, RK Puram), Noida, Gurugram, Lucknow (Lalbagh), Kanpur, Patna, Varanasi (BHU), Jaipur, Chandigarh, Srinagar (Dal Lake).
- **West & Central:** Mumbai (Bandra Kurla Complex, Colaba Coastal), Pune (Shivajinagar SAFAR), Ahmedabad (Maninagar), Bhopal, Indore.
- **South:** Bengaluru (BTM Layout, Peenya), Chennai (Alandur), Hyderabad (Sanathnagar), Kochi (Vyttila).
- **East:** Kolkata (Victoria Memorial), Bhubaneswar (Patia IT Corridor), Guwahati (Pan Bazaar).
- **One-Click Metro Strip:** Jump between India's top metropolitan centers with instant updates.

---

### 3. 🗺️ Interactive Geospatial Map & Density Heatmaps (Zero Watermark)
- **100% Free OpenStreetMap Cartography:** Powered by official OSM standard tiles (`tile.openstreetmap.org`) with zero third-party API key requirements and **zero watermarks**.
- **50+ Global & Indian Ground Stations:** One-click presets for `🇮🇳 India (26)` and `🌍 World (50+)` covering London, New York, Tokyo, Beijing, Paris, Dubai, Sydney, etc.
- **Atmospheric Heatmap Layer:** Visual radial gradient circles calibrated to ambient $PM_{2.5}$ density.
- **Interactive Station Pins:** Click any marker to view real-time readings and click **"Set As Active Station"** to re-center the entire dashboard.

---

### 4. ⚡ Dual Engine Architecture: Live Stream + Calibrated Static Baseline
- **⚡ Live Stream:** Queries live Open-Meteo REST APIs backed by the Copernicus Atmosphere Monitoring Service (CAMS).
- **📁 Static Baseline Mode:** Houses over 50 pre-calibrated station datasets for instant zero-latency demonstration and offline evaluation.
- **Automatic Fallback:** Seamlessly shifts to calibrated baseline telemetry if external network queries encounter latency or firewalls.

---

### 5. 🎇 Special Challenge Module: Diwali & Seasonal Smog Observatory
- **Thermal Inversion Mechanics:** Explains why nocturnal winter boundaries trap ground-level smoke.
- **Chemical Fingerprints:** Detailed chemical breakdown of heavy metal pyrotechnic colorants (Barium, Strontium, Potassium Nitrate, Sulfur).
- **Green Crackers (CSIR-NEERI):** Explains SWAS, STAR, and SAFAL formulations and their 30-35% particulate reduction.
- **Protective Protocol:** Room-by-room air isolation, pre-filtering bedrooms, and saline nasal rinses.

---

### 6. 🧮 Multi-Scale AQI & Concentration Converter Tool
- Interactive slider to input raw $PM_{2.5}$ concentration ($0$ to $500\ \mu\text{g/m}^3$).
- Instant simultaneous calculation across:
  1. **US EPA AQI (0–500 scale)**
  2. **Indian National AQI (NAQI 0–500 scale)** with official CPCB categories
  3. **European CAQI (0–100+ scale)**
  4. **WHO 24-hr guideline multiple** ($15\ \mu\text{g/m}^3$ baseline)

---

### 7. 📊 Key Pollutants Grid with WHO 2021 Reference Standards
- Dedicated diagnostic cards for **PM2.5, PM10, NO2, SO2, CO, and Ozone (O3)**.
- Real concentrations in $\mu\text{g/m}^3$, WHO threshold comparisons, health status badges, and **24-hour SVG sparkline trendlines**.

---

### 8. 📈 Time-Series Analytics & Temporal Demarcation (Recharts)
- 24-Hour, 72-Hour, and 7-Day interactive charts.
- **Strict Separation:** A dashed vertical demarcation line ("NOW") distinctly separates recorded historical observations from numerical forecast models.

---

### 9. 🏃 7-Day Forecast & Smart Outdoor Activity Planner
- Hourly and daily projections.
- Filter hours by activity: **"All Hours"**, **"🏃 Running Safe"**, or **"🧒 Kids Play"**.

---

### 10. 🏥 Demographic Health & Safety Guidance
- Targeted clinical advisories for **General Population**, **Children & Infants**, **Elderly Individuals (65+)**, **Asthma & Respiratory Patients**, and **Athletes & Outdoor Workers**.
- Actionable steps for N95 masks, HEPA purifiers, window sealing, and hydration.
- Explicit public health medical disclaimer.

---

### 11. ⚖️ 4-City Multi-Region Benchmarking Matrix
- Add up to 4 global or Indian cities simultaneously.
- Automatic **"Cleanest in Set"** and **"Most Polluted"** ribbons with side-by-side metric normalization.

---

### 12. 🔔 Web Notification Alerts & Shareable Official PDF Report
- Configure custom browser push notifications when AQI exceeds selected thresholds (>100, >150, >200).
- Formatted official air quality intelligence report ready for **Print / PDF export** or markdown clipboard copying.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite 5 |
| **Styling & Design System** | Tailwind CSS, Permanent Forest Dark Theme (`bg-forest-950`), Lucide React |
| **Data Visualization** | Recharts (responsive time-series, area charts, line charts) |
| **Geospatial Engine** | Leaflet, React-Leaflet, OpenStreetMap Standard Tiles (Zero Watermark) |
| **Environmental APIs** | Copernicus Atmosphere Monitoring Service (CAMS), Open-Meteo Air Quality & Geocoding |
| **State & Caching** | React Context API, LocalStorage + In-Memory LRU Cache (10-minute TTL) |
| **Deployment** | Vercel Edge Static + Serverless (`vercel.json`) |

---

## 📁 Project Directory Structure

```
d:\projects\letscodediwali\
├── public/
│   ├── favicon.svg                # Brand icon
│   └── leaf-wind-logo.svg         # Flowing wind and leaf emblem
├── src/
│   ├── components/
│   │   ├── analytics/             # Recharts temporal trends & gaseous charts
│   │   ├── chat/                  # Draggable & magnetic AeroBot AI assistant
│   │   ├── compare/               # 4-city comparative benchmarking matrix
│   │   ├── dashboard/             # Main AQI gauge, pollutant cards & grid
│   │   ├── diwali/                # Seasonal smog & pyrotechnic observatory
│   │   ├── forecast/              # 7-day forecast & smart activity planner
│   │   ├── health/                # 5-demographic health guidance & persona cards
│   │   ├── insights/              # Dominant driver analysis & chemical glossary
│   │   ├── layout/                # Navbar, metro strip, jump pills, footer
│   │   ├── map/                   # Leaflet OSM map, heatmaps & station popups
│   │   ├── modals/                # Alerts, share report & settings modals
│   │   ├── tools/                 # AQI converter & concentration calculator
│   │   └── ui/                    # Reusable buttons, badges, skeletons
│   ├── context/                   # AirQualityContext & ThemeContext
│   ├── services/                  # Open-Meteo REST client & cache manager
│   ├── types/                     # TypeScript interfaces & domain models
│   ├── utils/                     # AQI math, WHO thresholds, 50+ stations DB
│   ├── App.tsx                    # Main orchestrator component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Tailwind styles & print CSS
├── architecture.md                # System topology, component tree & Mermaid diagrams
├── decisions.md                   # 16 Architectural Decision Records (ADR-01 to ADR-16)
├── design.md                      # Design tokens, color system & specifications
├── webflow.md                     # User journeys, sequence diagrams & state machines
├── vercel.json                    # One-click Vercel SPA deployment configuration
└── README.md                      # Master documentation
```

---

## 🌐 Deploying to Vercel

The platform is pre-configured for instant zero-configuration deployment to Vercel:

1. Push this repository to your GitHub or GitLab account:
   ```bash
   git init
   git add .
   git commit -m "feat: BreatheBetter production release"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Import the project in your [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects the Vite framework with build command `tsc && vite build` and output directory `dist`.
4. The included [`vercel.json`](file:///d:/projects/letscodediwali/vercel.json) rewrites all client routes to `/index.html`:
   ```json
   {
     "framework": "vite",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
5. *(Optional)* Add `VITE_WAQI_TOKEN` or `VITE_OPENAQ_KEY` in Vercel's Environment Variables (core functionality operates without tokens).

---

## 📜 Public Health Disclaimer

BreatheBetter provides real-time environmental data and public health advisories for general informational and educational purposes only. It is not a clinical medical diagnostic tool. If you experience severe shortness of breath, chest tightness, or respiratory distress, contact emergency medical services or a licensed physician immediately.

---

**Breathe Better. Build Smarter.**  
*Let's Code Diwali Challenge 2026*

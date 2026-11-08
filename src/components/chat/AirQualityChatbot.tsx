import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  GripVertical,
  Flame,
  ShieldCheck,
  HeartPulse,
  Home,
  BookOpen,
  Activity,
  AlertTriangle,
  CloudRain,
  Wind,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAirQuality } from '../../context/AirQualityContext';
import { Button } from '../ui/Button';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AirQualityChatbot: React.FC = () => {
  const { currentLocation, airQuality } = useAirQuality();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'health' | 'sports' | 'purifiers' | 'diwali' | 'rules' | 'science'
  >('all');
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Position & Draggable State with Magnetic Snapping
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(16, window.innerWidth - 72),
        y: Math.max(80, window.innerHeight - 130),
      };
    }
    return { x: 300, y: 500 };
  });

  const [dockSide, setDockSide] = useState<'left' | 'right'>('right');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    moved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    moved: false,
  });

  const initialGreeting = `Hello! I am **AeroBot**, your environmental AI health assistant. 

Currently in **${currentLocation.name}**, the air quality is at **${
    airQuality ? airQuality.usAqi : '...'
  } US AQI** (${airQuality ? airQuality.category.name : 'Active Monitoring'}).

Select a category below or ask me any question about outdoor exercise, N95 masks, air purifiers, Diwali smog defense, GRAP regulations, or lung protection!`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: initialGreeting,
      timestamp: 'Just now',
    },
  ]);

  // Contextual update when location changes
  useEffect(() => {
    if (airQuality) {
      setMessages((prev) => [
        ...prev,
        {
          id: `loc-update-${Date.now()}`,
          sender: 'assistant',
          text: `📍 Location context switched to **${currentLocation.name}**: Current AQI is **${airQuality.usAqi}** (${airQuality.category.name}). Dominant pollutant is **${airQuality.dominantPollutant.name}** (${airQuality.dominantPollutant.ratioToWHO}x WHO Guideline). Feel free to ask how this impacts your outdoor plans or respiratory health!`,
          timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
        },
      ]);
    }
  }, [currentLocation.name]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Window resize bounds handler
  useEffect(() => {
    const handleResize = () => {
      setPos((prev) => {
        const snapX = dockSide === 'left' ? 12 : window.innerWidth - 64;
        const clampedY = Math.max(70, Math.min(window.innerHeight - 80, prev.y));
        return { x: snapX, y: clampedY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dockSide]);

  // Magnetic Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: pos.x,
      initialY: pos.y,
      moved: false,
    };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }

    const newX = dragStartRef.current.initialX + dx;
    const newY = dragStartRef.current.initialY + dy;

    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (!dragStartRef.current.moved) {
      setIsOpen((prev) => !prev);
      return;
    }

    // Magnetic edge snap
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonWidth = 56;
    const buttonHeight = 56;

    const centerX = pos.x + buttonWidth / 2;
    const isCloserToLeft = centerX < viewportWidth / 2;

    const targetX = isCloserToLeft ? 12 : viewportWidth - buttonWidth - 12;
    const clampedY = Math.max(75, Math.min(viewportHeight - buttonHeight - 20, pos.y));

    setDockSide(isCloserToLeft ? 'left' : 'right');
    setPos({ x: targetX, y: clampedY });
  };

  // Categorized Question Prompts
  const questionCategories = [
    { id: 'all', label: 'All FAQs', icon: Sparkles },
    { id: 'health', label: '🩺 Health & Vulnerable', icon: HeartPulse },
    { id: 'sports', label: '🏃 Running & Fitness', icon: Activity },
    { id: 'purifiers', label: '🏠 Air Purifiers & Home', icon: Home },
    { id: 'diwali', label: '🎇 Diwali & Smog Defense', icon: Flame },
    { id: 'rules', label: '🚦 GRAP Rules & Laws', icon: AlertTriangle },
    { id: 'science', label: '🔬 Atmospheric Science', icon: BookOpen },
  ];

  const categorizedPrompts: Record<string, string[]> = {
    all: [
      '🏃 Is it safe to run or exercise outdoors right now?',
      '😷 What mask works best against PM2.5 (N95 vs surgical)?',
      '🎇 How to protect lungs during Diwali festival smog?',
      '🏠 What CADR rating should my air purifier have?',
      '👶 What precautions should asthma patients and kids take?',
      '🚦 What are GRAP Stage I, II, III, and IV rules?',
      '🌿 Which indoor plants clean air best (NASA study)?',
      '🌡️ What is a thermal inversion layer and why does it trap smog?',
    ],
    health: [
      '👶 What precautions should asthma patients and kids take?',
      '👵 How does severe PM2.5 affect elderly heart patients?',
      '🫁 What immediate steps help if suffering from throat burning or coughing?',
      '🤰 Is high PM2.5 dangerous during pregnancy?',
      '🩸 Can high air pollution lower blood oxygen saturation (SpO2)?',
      '🍯 What foods or antioxidants help lungs combat smog (Vitamin C, Jaggery/Gur)?',
    ],
    sports: [
      '🏃 Is it safe to run or exercise outdoors right now?',
      '🌅 Why is morning running worse than afternoon running during winter smog?',
      '🫁 How much more particulate matter do lungs inhale during cardio workout?',
      '🚴 Does cycling with an N95 mask restrict oxygen intake?',
      '🏋️ What indoor cardio alternatives are safest when AQI > 200?',
    ],
    purifiers: [
      '🏠 What CADR rating should my air purifier have for my room?',
      '🌿 Which indoor plants clean air best (NASA study)?',
      '💨 Do ionic air purifiers produce dangerous ozone?',
      '🍳 How much pollution do gas stoves and cooking generate?',
      '🧹 How does wet-mopping reduce indoor particulate count?',
      '🔄 When should I replace the HEPA filter in my air purifier?',
    ],
    diwali: [
      '🎇 How to protect lungs during Diwali festival smog?',
      '🎆 What are Green Crackers (SWAS, STAR, SAFAL by CSIR-NEERI)?',
      '🧪 What toxic heavy metals are in firecracker smoke (Barium, Strontium)?',
      '🌫️ Why does pollution peak between 10 PM and 4 AM after Diwali?',
      '🌾 How does stubble burning combine with Diwali smoke in North India?',
      '🏠 Can indoor air purifiers handle heavy firecracker smoke?',
    ],
    rules: [
      '🚦 What are GRAP Stage I, II, III, and IV rules in Delhi NCR?',
      '🚗 Can private diesel/petrol cars be banned under GRAP Stage IV?',
      '🏢 What are smog towers and do they actually clean city air?',
      '🌧️ What is cloud seeding / artificial rain and how does it work?',
      '⚖️ What are the legal penalties for bursting non-green firecrackers?',
    ],
    science: [
      '🔬 What is the difference between PM2.5 and PM10?',
      '🌡️ What is a thermal inversion layer and why does it trap smog?',
      '☀️ Why is ground-level ozone worse on sunny afternoons?',
      '⚖️ How does US EPA AQI compare with Indian National AQI (NAQI)?',
      '🌫️ How does high humidity turn smoke and fog into toxic smog?',
      '💨 Why are winter wind speeds so low in Northern India?',
    ],
  };

  const activePrompts = categorizedPrompts[activeCategory] || categorizedPrompts.all;

  // AI Knowledge Engine
  const generateBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    const aqi = airQuality ? airQuality.usAqi : 120;
    const city = currentLocation.name;

    // Running / Workout
    if (q.includes('run') || q.includes('jog') || q.includes('exercise') || q.includes('workout') || q.includes('cardio') || q.includes('outdoor')) {
      if (aqi <= 50) {
        return `✅ **Optimal for Outdoor Cardio**: In **${city}**, the AQI is currently **${aqi} (Good)**. Atmospheric conditions are prime for morning jogging, marathon training, cycling, and park workouts. Enjoy the clean air!`;
      } else if (aqi <= 100) {
        return `⚠️ **Moderate Conditions**: Current AQI is **${aqi}**. Running is acceptable for most healthy adults, but if you have mild asthma or respiratory sensitivities, restrict high-intensity efforts to under 45 minutes and avoid high-traffic road corridors.`;
      } else if (aqi <= 150) {
        return `🟠 **Caution for Aerobic Cardio**: AQI is **${aqi} (Unhealthy for Sensitive Groups)**. Heavy breathing pulls microscopic particulates deep into pulmonary alveoli. We recommend shifting workouts to an air-conditioned indoor gym or treadmill.`;
      } else {
        return `🛑 **Strict Indoor Advisory**: AQI is currently **${aqi} (${airQuality?.category.name})** in **${city}**. Strenuous outdoor breathing increases respiratory ventilation by up to 10-fold ($60\text{--}100\text{ L/min}$), pulling grams of carcinogenic PM2.5 into deep pulmonary capillaries. Cease all outdoor workouts and exercise indoors with HEPA filtration.`;
      }
    }

    // Morning vs Afternoon running
    if (q.includes('morning') && (q.includes('worse') || q.includes('afternoon') || q.includes('running') || q.includes('jogging'))) {
      return `🌅 **Why Morning Running is Most Dangerous in Winter**:
1. **Planetary Boundary Layer Collapse:** During cold winter nights, cold dense air sinks to the ground, trapping vehicle exhaust and biomass smoke within 50–100 meters of the surface (thermal inversion).
2. **Peak Nocturnal Trapping:** Ground-level PM2.5 concentrations are typically **2x to 4x higher between 5:00 AM and 8:30 AM** than at 2:00 PM.
3. **Solar Dispersal in Afternoons:** As sunlight warms the earth around 1:00 PM to 4:00 PM, warm air rises (convective mixing), diluting smog. If you must exercise outside, **mid-afternoon (1:00 PM – 4:00 PM)** is dramatically safer than sunrise!`;
    }

    // Mask guidance
    if (q.includes('mask') || q.includes('n95') || q.includes('kn95') || q.includes('surgical') || q.includes('cloth')) {
      return `😷 **Mask Standards & Filtration Hierarchy**:
1. **Certified N95 / FFP2 / KN95:** The global gold standard for particulate air pollution. Filters at least **95%** of airborne particles down to 0.3 microns. Ensure the metallic nose clip is pinched tightly to prevent perimeter leaks.
2. **Surgical 3-Ply Masks:** Designed to stop fluid droplets from escaping, NOT fine inhalable smoke. They leak heavily along cheeks and only capture ~20-30% of PM2.5.
3. **Cloth / Cotton Masks:** Ineffective against PM2.5 (<15% filtration efficiency).
4. **Valved vs Non-Valved:** Valved masks reduce moisture and breathing resistance during walking, but do not filter your exhaled breath.
5. **Reusability:** A standard N95 mask can be reused for 40–50 hours of light walking if kept dry in a clean paper bag. Do NOT wash with water or spray with alcohol, as this destroys the electrostatic charge in the meltblown filtration fabric!`;
    }

    // Air Purifier & CADR
    if (q.includes('cadr') || q.includes('purifier') || q.includes('hepa') || q.includes('filter')) {
      return `🏠 **Air Purifier Selection & CADR Guide**:
• **CADR (Clean Air Delivery Rate):** Measures cubic feet of clean air produced per minute. As a rule of thumb: **CADR rating should equal at least 2/3 of your room area in square feet** (e.g., a 300 sq.ft bedroom requires CADR $\ge 200\text{ CFM}$).
• **True HEPA H13 / H14:** Traps 99.97% of particles down to 0.3 microns. Avoid "HEPA-type" or "HEPA-like" imitation filters.
• **Activated Carbon Bed:** Crucial for adsorbing toxic gases (NO2, SO2, VOCs, benzene, and pyrotechnic sulfur smells).
• **Avoid Ozone/Ionic Generators:** Electrostatic and ionizing cleaners often emit trace ozone, which is an aggressive pulmonary irritant.
• **Filter Replacement:** In heavily polluted metropolitan winters, replace the True HEPA filter every 4 to 6 months. Clean the outer pre-filter every 2 weeks using a vacuum or damp cloth.`;
    }

    // GRAP (Graded Response Action Plan)
    if (q.includes('grap') || q.includes('stage') || q.includes('ban') || q.includes('diesel') || q.includes('rule')) {
      return `🚦 **GRAP (Graded Response Action Plan) Enforcement Stages**:
Implemented by the Commission for Air Quality Management (CAQM) across Delhi-NCR:
• **Stage I ('Poor' AQI 201–300):** Dust suppression at construction sites, ban on open biomass/garbage burning, synchronized traffic lights.
• **Stage II ('Very Poor' AQI 301–400):** Ban on diesel generator sets (except essential services), enhanced parking fees to discourage private vehicles, daily mechanized road sweeping.
• **Stage III ('Severe' AQI 401–450):** Strict ban on non-essential construction and demolition, ban on BS-III petrol and BS-IV diesel four-wheelers, shift of primary schools (up to Class 5) to online mode.
• **Stage IV ('Severe+' AQI > 450):** Ban on entry of non-electric/non-CNG commercial trucks into Delhi, ban on BS-IV and older diesel medium/heavy goods vehicles, 50% work-from-home mandate for government/private offices, closure of all school classes up to Class 9 and 11.`;
    }

    // Plants
    if (q.includes('plant') || q.includes('indoor plants') || q.includes('snake plant') || q.includes('areca')) {
      return `🌿 **NASA Clean Air Study – Top Indoor Botanical Purifiers**:
1. **Snake Plant (Sansevieria trifasciata):** One of the few plants that performs Crassulacean Acid Metabolism (CAM)—releasing oxygen and absorbing CO2 **at night**. Absorbs airborne formaldehyde, benzene, and nitrogen oxides.
2. **Areca Palm (Dypsis lutescens):** High natural transpiration rate; humidifies dry winter air while neutralizing heavy VOCs.
3. **Spider Plant (Chlorophytum comosum):** Safe for households with pets; exceptionally resilient at breaking down carbon monoxide and xylene.
4. **Peace Lily (Spathiphyllum):** Absorbs trichloroethylene and mold spores (keep away from cats/dogs).
5. **Money Plant (Golden Pothos):** Clears indoor air of carbon monoxide and formaldehydes emitted by carpet adhesives.`;
    }

    // Diwali protocol
    if (q.includes('diwali') || q.includes('cracker') || q.includes('smog') || q.includes('pyrotechnic')) {
      return `🎇 **Comprehensive Diwali Smog Defense Protocol**:
1. **Nocturnal Window Sealing (6 PM to 9 AM):** Evening firecracker smoke coincides with the rapid drop in planetary boundary layer height, trapping thick aerosol plumes within 100 meters of the ground.
2. **Pre-Purify Bedrooms:** Run your HEPA air cleaner on maximum speed for 2 hours before bedtime with bedroom doors closed.
3. **Wet-Wiping vs Dry Sweeping:** Sweep floors with damp microfiber mops. Dry sweeping resuspends toxic heavy metal dust into the breathing zone.
4. **Nasal Saline Rinse:** Use isotonic saline spray or a neti pot before sleep to wash trapped particulate soot from nasal mucosa.
5. **Advocate for Green Crackers:** Traditional crackers use banned barium salts; CSIR-NEERI green crackers emit water vapor and cut emissions by 30-35%.`;
    }

    // Green Crackers
    if (q.includes('green cracker') || q.includes('swas') || q.includes('star') || q.includes('safal')) {
      return `🎆 **What Are Green Crackers (CSIR-NEERI)?**:
Developed by the National Environmental Engineering Research Institute (NEERI):
• **SWAS (Safe Water Releaser):** Releases water vapor upon combustion to suppress dust particles; does not use potassium nitrate or sulfur. Cuts particulate emissions by 30%.
• **STAR (Safe Thermite Cracker):** Eliminates barium nitrate and potassium chlorate; reduces sound and particulate emissions by 30-35%.
• **SAFAL (Safe Minimal Aluminium):** Replaces aluminum with magnesium powder, cutting down toxic smoke density.
• **Verification:** Look for the official CSIR-NEERI green leaf logo and verifiable QR code on firecracker packaging.`;
    }

    // Heavy Metals
    if (q.includes('metal') || q.includes('barium') || q.includes('strontium') || q.includes('lead') || q.includes('chemistry')) {
      return `🧪 **Toxic Heavy Metals in Pyrotechnic Smoke**:
• **Barium Nitrate (Ba):** Generates brilliant green colors. Inhalation triggers severe upper respiratory inflammation, muscle spasms, and cardiac arrhythmias. Banned by the Supreme Court of India.
• **Strontium Salts (Sr):** Generates crimson red flames. Binds to lung tissue and mimics calcium in bone marrow.
• **Potassium Nitrate (KNO3):** Primary oxidizer. Reacts at high temperatures to emit toxic Nitrogen Dioxide (NO2).
• **Antimony & Lead:** Trace amounts produce white glitter effects but pose chronic neurological, liver, and cellular hazards.`;
    }

    // Inversion
    if (q.includes('inversion') || q.includes('thermal') || q.includes('trapped') || q.includes('winter')) {
      return `🌡️ **Thermal Inversion Layer Explained**:
• Under normal daytime conditions, warm air near the ground rises into the cooler upper atmosphere, carrying smoke away (vertical convective mixing).
• During cold winter nights, the ground rapidly radiates heat away into clear skies. The air layer directly touching the ground becomes colder and denser than the air above it.
• This creates a **temperature inversion "lid"** that traps vehicle exhaust, biomass smoke, and firecracker emissions within a shallow layer of just 50 to 100 meters, causing pollution spikes of 500+ AQI until midday solar heating re-establishes normal convection.`;
    }

    // Asthma & vulnerable groups
    if (q.includes('asthma') || q.includes('child') || q.includes('kid') || q.includes('elderly') || q.includes('baby') || q.includes('pregnancy')) {
      return `👶 **Vulnerable Populations & Emergency Medical Steps**:
• **Children:** Breathe 50% more air per pound of body weight and possess narrower airway diameters. Keep children strictly indoors during early mornings and late evenings.
• **Asthma Patients:** Always carry your fast-acting rescue inhaler (Albuterol / Salbutamol). Check spacer cleanliness. Pre-treat with preventive corticosteroids as prescribed by your physician.
• **Elderly & Cardiovascular Patients:** Fine PM2.5 crosses into blood vessels, elevating arterial thrombosis and myocardial infarction risks. Avoid outdoor morning walks when temperatures drop below 15°C.
• **Pregnancy:** Ambient PM2.5 exposure is correlated with low birth weight and intrauterine inflammation. Maintain continuous HEPA indoor filtration.`;
    }

    // Throat burning / cough
    if (q.includes('throat') || q.includes('cough') || q.includes('burning') || q.includes('eye') || q.includes('remed')) {
      return `🫁 **Immediate Relief for Smog-Induced Throat & Eye Burning**:
1. **Steam Inhalation:** Inhale warm water vapor (with a drop of eucalyptus oil or plain saline) for 5–7 minutes to hydrate irritated mucous membranes and liquefy trapped soot.
2. **Warm Saline Gargle:** Gargle with warm water and half a teaspoon of salt twice daily to reduce pharyngeal inflammation.
3. **Nasal Saline Mist:** Flushes particulate matter from the nasal turbinates before it migrates to the trachea.
4. **Antioxidant Warm Drinks:** Warm water with honey, grated ginger, and turmeric contains curcumin and gingerol, potent anti-inflammatory compounds.
5. **Lubricating Eye Drops:** Use preservative-free artificial tear drops to flush particulate matter from burning or conjunctival eyes.`;
    }

    // Nutrition & Antioxidants
    if (q.includes('food') || q.includes('diet') || q.includes('antioxidant') || q.includes('jaggery') || q.includes('gur') || q.includes('vitamin')) {
      return `🍯 **Pulmonary Nutrition & Anti-Smog Diet**:
• **Vitamin C & E (Ascorbic Acid & Tocopherol):** Found in amla (Indian gooseberry), citrus fruits, almonds, and sunflower seeds. They scavenge free radicals generated when PM2.5 hits lung surfactant.
• **Jaggery (Gur):** Traditional natural expectorant; helps ease throat irritation and loosen mucus in bronchial passages.
• **Omega-3 Fatty Acids:** Flaxseeds, chia seeds, and walnuts combat systemic vascular inflammation caused by inhaled particulates.
• **Curcumin (Turmeric with black pepper):** Powerful natural inhibitor of NF-kB, dampening pulmonary cytokine storms.`;
    }

    // Smog Towers & Cloud Seeding
    if (q.includes('smog tower') || q.includes('cloud seeding') || q.includes('artificial rain') || q.includes('technology')) {
      return `🏢 **Smog Towers & Cloud Seeding Realities**:
• **Smog Towers:** Giant air purifiers (like Delhi's Connaught Place tower). Scientific evaluations by IIT Bombay and CPCB showed they only purify air within a 50–100 meter radius at immense electrical cost. They cannot fix open-air airshed pollution.
• **Cloud Seeding (Artificial Rain):** Dispersing silver iodide (AgI) or salt into moisture-bearing clouds to induce rain and wash down aerosols (wet deposition). However, it requires **at least 40–50% atmospheric moisture/cloud cover** to work, which is rarely present during Northern India's dry, cloudless November winters!`;
    }

    // Stubble Burning
    if (q.includes('stubble') || q.includes('parali') || q.includes('punjab') || q.includes('haryana') || q.includes('farm')) {
      return `🌾 **Crop Residue (Stubble / Parali) Burning Dynamics**:
• Farmers harvest paddy with combine harvesters in October-November, leaving 6-8 inch stalks.
• To clear fields quickly for the wheat sowing window (15–20 day turnaround), farmers set fire to residue.
• **North-Westerly Winds:** Wind patterns in autumn carry the smoke southeastward directly across the Indo-Gangetic Plain toward Delhi, UP, and Bihar.
• **Aerosol Chemistry:** Stubble smoke is rich in black carbon, carbon monoxide, and volatile hydrocarbons, which merge with urban vehicular exhaust and firecracker smoke.`;
    }

    // Cooking & Stoves
    if (q.includes('cooking') || q.includes('stove') || q.includes('exhaust') || q.includes('indoor') || q.includes('incense') || q.includes('agarbatti')) {
      return `🍳 **Indoor Pollution Sources in Homes**:
1. **Gas Stoves:** Combustion of LPG/natural gas produces massive indoor spikes of Nitrogen Dioxide (NO2) and ultrafine particles. Always operate an exterior-vented range hood or open a kitchen window during cooking.
2. **Incense (Agarbatti) & Dhoop:** Burning incense sticks generates higher concentrations of particulate matter, benzene, and polycyclic aromatic hydrocarbons than cigarette smoke.
3. **Mosquito Coils:** A single burning mosquito coil releases particulate matter equivalent to ~75-100 cigarettes. Use liquid vaporizers or physical bed netting instead.
4. **Frying & Roasting:** High-heat oil frying aerosolizes volatile organic compounds (VOCs). Keep kitchen doors closed from living spaces.`;
    }

    // PM2.5 vs PM10
    if (q.includes('pm2.5') || q.includes('pm10') || q.includes('difference')) {
      return `🔬 **PM2.5 vs PM10 Physical Differences**:
• **PM2.5 (Fine Inhalable Particles ≤ 2.5 µm):** ~30 times smaller than the cross-section of a human hair. Emitted by vehicle engines, factory smokestacks, and firecracker smoke. They bypass nasal cilia and bronchial filters, traveling deep into lung alveoli and passing directly into the bloodstream.
• **PM10 (Coarse Inhalable Particles ≤ 10 µm):** Road grit, fly ash, construction dust, and pollen. They deposit in the nasal passages, sinuses, and trachea, causing mechanical coughing, sneezing, and ocular irritation.`;
    }

    // NAQI vs US EPA
    if (q.includes('naqi') || q.includes('indian') || q.includes('scale') || q.includes('epa')) {
      return `⚖️ **Indian NAQI vs US EPA AQI Standards**:
• **US EPA AQI (0–500):** Stricter breakpoints for PM2.5 (e.g., $12\ \mu\text{g/m}^3$ for Good, $35.4\ \mu\text{g/m}^3$ for Moderate).
• **Indian National AQI (NAQI 0–500):** Tailored to subcontinental conditions by CPCB:
  - **Good (0-50):** PM2.5 $0-30\ \mu\text{g/m}^3$
  - **Satisfactory (51-100):** PM2.5 $31-60\ \mu\text{g/m}^3$
  - **Moderately Polluted (101-200):** PM2.5 $61-90\ \mu\text{g/m}^3$
  - **Poor (201-300):** PM2.5 $91-120\ \mu\text{g/m}^3$
  - **Very Poor (301-400):** PM2.5 $121-250\ \mu\text{g/m}^3$
  - **Severe (401-500):** PM2.5 $>250\ \mu\text{g/m}^3$
*You can test live conversions using our built-in **Converter** tool in the navbar!*`;
    }

    // Default Fallback
    return `Thank you for your question regarding atmospheric quality in **${city}**.

Currently, the ambient reading is **${aqi} US AQI**.
To protect your pulmonary health:
1. Limit strenuous outdoor cardio during peak nocturnal and morning smog hours.
2. Use a certified N95 respirator if traveling along congested avenues.
3. Keep indoor living areas filtered with true HEPA air cleaners.

Would you like specific details on air purifier CADR sizing, certified masks, GRAP rules, or Diwali smog defense?`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(userText);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date()),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  // Voice Assistant: Speech Recognition (Speech-to-Text)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not natively supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Voice Assistant: Text-to-Speech Synthesis
  const handleToggleSpeech = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`•]/g, '').slice(0, 350);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Draggable Floating Trigger Handle */}
      {!isOpen && (
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            position: 'fixed',
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            touchAction: 'none',
            zIndex: 9999,
            transition: isDragging ? 'none' : 'left 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2), top 0.15s ease',
          }}
          className="cursor-grab active:cursor-grabbing select-none group"
          title="Drag anywhere • Click to open AeroBot AI • Snaps magnetically to edges"
        >
          <div
            className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-full shadow-2xl transition-all duration-200 border ${
              dockSide === 'left'
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-forest-900 border-emerald-400/50 shadow-glow-good'
                : 'bg-gradient-to-l from-emerald-600 via-emerald-700 to-forest-900 border-emerald-400/50 shadow-glow-good'
            }`}
          >
            {dockSide === 'right' && (
              <div className="flex items-center text-emerald-200/80 group-hover:text-emerald-100 pl-1">
                <ChevronLeft className="w-3.5 h-3.5 animate-pulse" />
              </div>
            )}

            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-forest-950/80 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            <div className="hidden sm:flex flex-col pr-2 text-left">
              <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
                AeroBot AI
                <Sparkles className="w-3 h-3 text-emerald-300" />
              </span>
              <span className="text-[10px] text-emerald-200/90 font-mono">
                AQI {airQuality ? airQuality.usAqi : '...'} • Ask Questions
              </span>
            </div>

            {dockSide === 'left' && (
              <div className="flex items-center text-emerald-200/80 group-hover:text-emerald-100 pr-1">
                <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Interactive Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-[9999] inset-x-3 bottom-3 sm:bottom-6 sm:inset-x-auto w-auto sm:w-[460px] md:w-[480px] max-h-[88vh] flex flex-col rounded-2xl bg-forest-950/95 border border-forest-800 shadow-2xl backdrop-blur-xl animate-scaleUp overflow-hidden ${
            dockSide === 'left' ? 'sm:left-6' : 'sm:right-6'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-forest-900 to-forest-950 border-b border-forest-800/80">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-forest-950 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-white">AeroBot Environmental AI</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium border border-emerald-500/30">
                    Live CAMS
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentLocation.name} • {airQuality ? `${airQuality.usAqi} US AQI` : 'Loading...'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: `reset-${Date.now()}`,
                      sender: 'assistant',
                      text: initialGreeting,
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-forest-850 transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-forest-850 transition-colors"
                title="Minimize AeroBot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categorized Question Filter Pills */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-forest-900/60 border-b border-forest-850/80 overflow-x-auto scrollbar-none text-[11px]">
            {questionCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-forest-800/60 text-slate-400 hover:text-slate-200 hover:bg-forest-750'
                  }`}
                >
                  <Icon className="w-3 h-3 shrink-0" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[48vh] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs'
                      : 'bg-forest-900/90 text-slate-200 border border-forest-800/80 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose-invert">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('• ') || line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
                        return (
                          <div key={i} className="pl-1 py-0.5">
                            {line}
                          </div>
                        );
                      }
                      return (
                        <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[9px] mt-1 pt-1 border-t border-forest-800/40 text-slate-400">
                    {msg.sender === 'assistant' ? (
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.text)}
                        className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                        title={speakingId === msg.id ? 'Stop Voice Playback' : 'Read Out Loud (Voice Assistant)'}
                      >
                        {speakingId === msg.id ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-400 animate-pulse" />
                            <span className="text-rose-400">Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-emerald-400" />
                            <span>Voice Assistant</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span />
                    )}
                    <span className="opacity-60">{msg.timestamp}</span>
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-xs pl-2">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>AeroBot is formulating atmospheric health guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Prompt Chips */}
          <div className="px-3 py-2 bg-forest-900/40 border-t border-forest-850/80">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Suggested Questions ({activeCategory}):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {activePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-forest-850 hover:bg-forest-800 text-[11px] text-emerald-300/90 hover:text-emerald-200 border border-forest-750 shrink-0 text-left transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-forest-950 border-t border-forest-850">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2 rounded-xl border transition-all shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-md'
                    : 'bg-forest-900/90 text-slate-400 hover:text-white border-forest-800 hover:bg-forest-850'
                }`}
                title={isListening ? 'Listening to speech... Click to finish' : 'Voice Assistant: Click to speak'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-400" />
                )}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening to voice dictation...' : 'Ask about masks, jogging, purifiers, Diwali smog...'}
                className={`flex-1 bg-forest-900/90 border rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  isListening ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-forest-800 focus:border-emerald-500/80'
                }`}
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!input.trim()}
                className="rounded-xl px-3 py-2 text-xs shrink-0"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                Ask
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

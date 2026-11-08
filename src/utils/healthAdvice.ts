import { AQICategoryLevel } from '../types';

export interface PersonaGuidance {
  id: string;
  title: string;
  icon: string; // Lucide icon identifier
  shortTag: string;
  action: 'safe' | 'caution' | 'warning' | 'danger';
  advice: string;
  specifics: string[];
}

export interface ActionableStep {
  title: string;
  description: string;
  recommended: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export function getPersonaGuidance(level: AQICategoryLevel): PersonaGuidance[] {
  switch (level) {
    case 1: // Good (0-50)
      return [
        {
          id: 'general',
          title: 'General Population',
          icon: 'UserCheck',
          shortTag: 'Safe Outdoors',
          action: 'safe',
          advice: 'Perfect atmospheric conditions. Ideal time for outdoor activities, open windows, and sports.',
          specifics: ['Outdoor cardio and recreation encouraged', 'Open windows for fresh air circulation', 'No personal protective equipment needed'],
        },
        {
          id: 'kids',
          title: 'Children & Infants',
          icon: 'Baby',
          shortTag: 'Fully Safe',
          action: 'safe',
          advice: 'Safe for playgrounds, school sports, and extended park visits.',
          specifics: ['Unrestricted playground play', 'Encourage physical activity in parks'],
        },
        {
          id: 'seniors',
          title: 'Elderly (65+)',
          icon: 'HeartHandshake',
          shortTag: 'Healthy',
          action: 'safe',
          advice: 'Optimal time for morning walks and garden activities without respiratory stress.',
          specifics: ['Regular outdoor walking encouraged', 'No respiratory strain expected'],
        },
        {
          id: 'respiratory',
          title: 'Asthma & Sensitive Groups',
          icon: 'ShieldAlert',
          shortTag: 'Minimal Risk',
          action: 'safe',
          advice: 'Particulate matter is minimal; keep normal preventative inhalers on hand as customary.',
          specifics: ['Normal symptom monitoring', 'Safe for outdoor walks'],
        },
        {
          id: 'athletes',
          title: 'Athletes & Outdoor Workers',
          icon: 'Flame',
          shortTag: 'Peak Performance',
          action: 'safe',
          advice: 'Maximum oxygen intake with clean lung absorption. Excellent for marathon training and heavy construction.',
          specifics: ['High-intensity outdoor workouts favored', 'Unrestricted work shifts'],
        },
      ];

    case 2: // Moderate (51-100)
      return [
        {
          id: 'general',
          title: 'General Population',
          icon: 'UserCheck',
          shortTag: 'Acceptable',
          action: 'safe',
          advice: 'Air quality is acceptable for the general public. No widespread restrictions needed.',
          specifics: ['Continue normal outdoor activities', 'Ventilate home during peak sunlight hours'],
        },
        {
          id: 'kids',
          title: 'Children & Infants',
          icon: 'Baby',
          shortTag: 'Safe with Observation',
          action: 'safe',
          advice: 'Normal outdoor play permitted. Observe children with mild allergic asthma.',
          specifics: ['Regular school activities permitted', 'Ensure hydration after active play'],
        },
        {
          id: 'seniors',
          title: 'Elderly (65+)',
          icon: 'HeartHandshake',
          shortTag: 'Mild Caution',
          action: 'caution',
          advice: 'Seniors with pre-existing heart or lung conditions should avoid overexertion during midday traffic.',
          specifics: ['Slightly shorten strenuous walking', 'Stay hydrated'],
        },
        {
          id: 'respiratory',
          title: 'Asthma & Sensitive Groups',
          icon: 'ShieldAlert',
          shortTag: 'Monitor Symptoms',
          action: 'caution',
          advice: 'Unusually sensitive individuals may notice mild coughing or shortness of breath.',
          specifics: ['Carry quick-relief inhaler', 'Avoid heavy traffic corridors'],
        },
        {
          id: 'athletes',
          title: 'Athletes & Outdoor Workers',
          icon: 'Flame',
          shortTag: 'Good for Training',
          action: 'safe',
          advice: 'Athletes can proceed with workouts; sensitive runners can schedule runs for early mornings.',
          specifics: ['Slightly favor morning or evening sessions', 'Monitor breathing recovery'],
        },
      ];

    case 3: // Unhealthy for Sensitive Groups (101-150)
      return [
        {
          id: 'general',
          title: 'General Population',
          icon: 'UserCheck',
          shortTag: 'Moderate Caution',
          action: 'caution',
          advice: 'Most people will feel fine, but prolonged heavy outdoor exertion can cause minor throat irritation.',
          specifics: ['Take regular breaks during heavy work', 'Consider closing windows facing busy roads'],
        },
        {
          id: 'kids',
          title: 'Children & Infants',
          icon: 'Baby',
          shortTag: 'Reduce Strenuous Play',
          action: 'warning',
          advice: 'Children breathe more air per pound of body weight. Reduce prolonged tag games or soccer practice outdoors.',
          specifics: ['Move intense games indoors when possible', 'Watch for sneezing, watery eyes, or wheezing'],
        },
        {
          id: 'seniors',
          title: 'Elderly (65+)',
          icon: 'HeartHandshake',
          shortTag: 'Limit Outdoor Exertion',
          action: 'warning',
          advice: 'Seniors with coronary artery disease or COPD should reschedule prolonged outdoor walks.',
          specifics: ['Prefer indoor mall walking or stationary exercise', 'Keep daily medication scheduled'],
        },
        {
          id: 'respiratory',
          title: 'Asthma & Sensitive Groups',
          icon: 'ShieldAlert',
          shortTag: 'High Sensitivity',
          action: 'warning',
          advice: 'Expect increased airway reactivity. Limit outdoor time; keep rescue inhalers within arm’s reach.',
          specifics: ['Avoid outdoor cardio', 'Use HEPA air purifier in bedroom', 'Keep rescue inhaler readily accessible'],
        },
        {
          id: 'athletes',
          title: 'Athletes & Outdoor Workers',
          icon: 'Flame',
          shortTag: 'Modify Intensity',
          action: 'caution',
          advice: 'Reduce intensity or duration of outdoor endurance sessions. Shift high-heart-rate cardio indoors.',
          specifics: ['Shorten high-intensity interval training', 'Take frequent recovery breaks'],
        },
      ];

    case 4: // Unhealthy (151-200)
      return [
        {
          id: 'general',
          title: 'General Population',
          icon: 'UserCheck',
          shortTag: 'Reduce Outdoors',
          action: 'warning',
          advice: 'Everyone may begin to experience irritation in throat, sinuses, and eyes. Cut down on outdoor jogging.',
          specifics: ['Avoid running or biking near traffic', 'Keep household windows shut', 'Wear N95/FFP2 mask if outdoors for extended periods'],
        },
        {
          id: 'kids',
          title: 'Children & Infants',
          icon: 'Baby',
          shortTag: 'Move Indoors',
          action: 'danger',
          advice: 'Schools should keep recess and sports indoors. Avoid taking infants out in strollers along main roads.',
          specifics: ['Cancel outdoor physical education', 'Maintain clean indoor air with closed windows'],
        },
        {
          id: 'seniors',
          title: 'Elderly (65+)',
          icon: 'HeartHandshake',
          shortTag: 'Stay Indoors',
          action: 'danger',
          advice: 'Cardiovascular stress increases with fine particulate exposure. Stay in air-filtered spaces.',
          specifics: ['Do not perform yard work or brisk outdoor walks', 'Contact physician if chest tightness occurs'],
        },
        {
          id: 'respiratory',
          title: 'Asthma & Sensitive Groups',
          icon: 'ShieldAlert',
          shortTag: 'Strict Isolation',
          action: 'danger',
          advice: 'Significantly elevated risk of asthma flare-ups and broncho-spasms. Remain indoors with air filtration.',
          specifics: ['Continuous HEPA air cleaner operation', 'Wear certified N95 if leaving home', 'Follow Asthma Action Plan closely'],
        },
        {
          id: 'athletes',
          title: 'Athletes & Outdoor Workers',
          icon: 'Flame',
          shortTag: 'Shift Indoors',
          action: 'warning',
          advice: 'Deep lung ventilation pulls PM2.5 deep into alveoli. Do not do outdoor tempo runs or heavy lifting outdoors.',
          specifics: ['Shift workouts to gym or indoor treadmill', 'Workers should wear N95 respirators with exhalation valves'],
        },
      ];

    case 5: // Very Unhealthy (201-300)
    case 6: // Hazardous (301-500)
      return [
        {
          id: 'general',
          title: 'General Population',
          icon: 'UserCheck',
          shortTag: 'Health Alert',
          action: 'danger',
          advice: 'Emergency atmospheric conditions. Immediate throat burning and eye irritation. Strictly avoid outdoor exposure.',
          specifics: ['Keep all windows and doors sealed', 'Run HEPA air purifiers on high', 'Wear N95/N99 respirator if outdoor movement is required'],
        },
        {
          id: 'kids',
          title: 'Children & Infants',
          icon: 'Baby',
          shortTag: 'Hazardous for Kids',
          action: 'danger',
          advice: 'Children must remain strictly inside sealed, air-conditioned/filtered rooms. Zero outdoor playtime.',
          specifics: ['Keep children indoors all day', 'Use saline nasal mist to soothe irritated membranes'],
        },
        {
          id: 'seniors',
          title: 'Elderly (65+)',
          icon: 'HeartHandshake',
          shortTag: 'Severe Vulnerability',
          action: 'danger',
          advice: 'Substantial elevation in myocardial infarction and stroke risks from fine particulates. Strictly stay indoors.',
          specifics: ['Remain in clean-air rooms', 'Have emergency contact numbers ready'],
        },
        {
          id: 'respiratory',
          title: 'Asthma & Sensitive Groups',
          icon: 'ShieldAlert',
          shortTag: 'Emergency Warning',
          action: 'danger',
          advice: 'Severe risk of hospitalization. Pre-treat with preventive bronchodilators as advised by medical team.',
          specifics: ['Operate indoor HEPA air cleaner 24/7', 'Seek immediate medical attention if wheezing persists'],
        },
        {
          id: 'athletes',
          title: 'Athletes & Outdoor Workers',
          icon: 'Flame',
          shortTag: 'Cease Outdoor Activity',
          action: 'danger',
          advice: 'Outdoor physical exertion will deposit massive quantities of toxic particulates into lung tissue. Halt all outdoor sports.',
          specifics: ['Cancel all outdoor training and matches', 'Outdoor workers require fit-tested N95/P100 respirators'],
        },
      ];
  }
}

export function getActionableSteps(level: AQICategoryLevel): ActionableStep[] {
  return [
    {
      title: 'Wear N95 / FFP2 Respirator',
      description: 'Standard surgical or cloth masks do not filter PM2.5. A well-fitted N95 or KN95 blocks 95% of fine particulates.',
      recommended: level >= 3,
      priority: level >= 4 ? 'critical' : level === 3 ? 'high' : 'low',
    },
    {
      title: 'Operate Indoor HEPA Air Purifier',
      description: 'True HEPA filters capture microscopic particles down to 0.3 microns. Run continuously in bedrooms and living quarters.',
      recommended: level >= 3,
      priority: level >= 4 ? 'critical' : level === 3 ? 'high' : 'medium',
    },
    {
      title: 'Seal Windows & Ventilate Strategically',
      description: 'Keep doors and windows closed during peak smog hours. Use recirculating air mode in vehicles and air conditioning.',
      recommended: level >= 3,
      priority: level >= 4 ? 'critical' : 'medium',
    },
    {
      title: 'Hydration & Saline Rinse',
      description: 'Drink warm water and use isotonic saline nasal spray to clear particulate buildup from mucosal membranes.',
      recommended: level >= 2,
      priority: level >= 4 ? 'high' : 'medium',
    },
  ];
}

export const MEDICAL_DISCLAIMER =
  'Medical Disclaimer: BreatheBetter provides real-time environmental data and public health advisories for general informational and educational purposes only. It is not a clinical medical diagnostic tool and does not provide personalized medical advice. If you experience severe shortness of breath, chest tightness, or respiratory distress, contact emergency medical services or a licensed physician immediately.';


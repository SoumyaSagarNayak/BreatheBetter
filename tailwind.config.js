/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Warm Design System tokens (from design.md)
        editorial: {
          primary: '#cc785c',
          'primary-active': '#a9583e',
          'primary-disabled': '#e6dfd8',
          ink: '#141413',
          body: '#3d3d3a',
          'body-strong': '#252523',
          muted: '#6c6a64',
          'muted-soft': '#8e8b82',
          hairline: '#e6dfd8',
          'hairline-soft': '#ebe6df',
          canvas: '#faf9f5',
          'surface-soft': '#f5f0e8',
          'surface-card': '#efe9de',
          'surface-cream-strong': '#e8e0d2',
          'surface-dark': '#181715',
          'surface-dark-elevated': '#252320',
          'surface-dark-soft': '#1f1e1b',
          'on-primary': '#ffffff',
          'on-dark': '#faf9f5',
          'on-dark-soft': '#a09d96',
          teal: '#5db8a6',
          amber: '#e8a55a',
        },
        // Environmental Deep Forest Intelligence tokens
        forest: {
          950: '#060d09',
          900: '#0a1410',
          850: '#0f1f18',
          800: '#142a20',
          700: '#1d3b2e',
          600: '#285341',
          500: '#346d56',
        },
        charcoal: {
          950: '#0d1110',
          900: '#141817',
          800: '#1d2321',
          700: '#28312e',
        },
        mint: {
          300: '#a7f3d0',
          400: '#6ee7b7',
          500: '#34d399',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        },
        // AQI Standard Semantic Colors
        aqi: {
          good: '#10b981',         // 0 - 50
          moderate: '#f59e0b',     // 51 - 100
          sensitive: '#f97316',    // 101 - 150
          unhealthy: '#ef4444',    // 151 - 200
          veryUnhealthy: '#a855f7',// 201 - 300
          hazardous: '#881337',    // 301+
        }
      },
      fontFamily: {
        serif: ['Copernicus', 'Tiempos Headline', 'Cormorant Garamond', 'EB Garamond', 'serif'],
        sans: ['StyreneB', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(20,20,19,0.08)',
        'glow-good': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-mod': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-sens': '0 0 25px -5px rgba(249, 115, 22, 0.35)',
        'glow-unhealth': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-very': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-hazard': '0 0 25px -5px rgba(136, 19, 55, 0.45)',
      }
    },
  },
  plugins: [],
}


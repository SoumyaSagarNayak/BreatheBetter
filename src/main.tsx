import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './context/ThemeContext';
import { AirQualityProvider } from './context/AirQualityContext';
import { AppContent } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AirQualityProvider>
        <AppContent />
      </AirQualityProvider>
    </ThemeProvider>
  </React.StrictMode>
);


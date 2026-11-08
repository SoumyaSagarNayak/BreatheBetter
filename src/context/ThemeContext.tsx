import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'forest';

interface ThemeContextType {
  theme: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: ThemeMode = 'forest';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-cream');
    root.classList.add('dark');
    document.body.className =
      'bg-forest-950 text-slate-100 antialiased selection:bg-mint-500/30 selection:text-mint-300 min-h-screen';
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

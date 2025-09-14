import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme configurations
export const themes = {
  default: {
    name: 'RETRO CYBER DEFAULT',
    primary: '#ffffff', // white
    primaryRgb: '255, 255, 255',
    secondary: '#06b6d4', // cyan-500
    secondaryRgb: '6, 182, 212',
    accent: '#10b981', // emerald-500
    accentRgb: '16, 185, 129',
    highlight: '#f59e0b', // amber-500
    highlightRgb: '245, 158, 11',
    danger: '#ef4444', // red-500
    dangerRgb: '239, 68, 68',
    success: '#22c55e', // green-500
    successRgb: '34, 197, 94',
    // UI styling
    borderRadius: '12px', // More rounded
    borderStyle: 'solid',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // More transparent
    borderColor: '#ffffff', // White borders
    controlColor: '#ffffff' // White for controls
  },
  pink: {
    name: 'CYBER PINK HEARTS',
    primary: '#f472b6', // pink-400
    primaryRgb: '244, 114, 182',
    secondary: '#e879f9', // fuchsia-400
    secondaryRgb: '232, 121, 249',
    accent: '#fb7185', // rose-400
    accentRgb: '251, 113, 133',
    highlight: '#fbbf24', // amber-400
    highlightRgb: '251, 191, 36',
    danger: '#f87171', // red-400
    dangerRgb: '248, 113, 113',
    success: '#4ade80', // green-400
    successRgb: '74, 222, 128',
    // UI styling
    borderRadius: '0px',
    borderStyle: 'solid',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#f472b6',
    controlColor: '#f472b6' // Pink for controls
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pixelPagesTheme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pixelPagesTheme', currentTheme);
    
    // Apply CSS custom properties to root
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-primary-rgb', theme.primaryRgb);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-secondary-rgb', theme.secondaryRgb);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-accent-rgb', theme.accentRgb);
    root.style.setProperty('--theme-highlight', theme.highlight);
    root.style.setProperty('--theme-highlight-rgb', theme.highlightRgb);
    root.style.setProperty('--theme-danger', theme.danger);
    root.style.setProperty('--theme-danger-rgb', theme.dangerRgb);
    root.style.setProperty('--theme-success', theme.success);
    root.style.setProperty('--theme-border-radius', theme.borderRadius);
    root.style.setProperty('--theme-background-color', theme.backgroundColor);
    root.style.setProperty('--theme-border-color', theme.borderColor);
    root.style.setProperty('--theme-control-color', theme.controlColor);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const getThemeColors = () => themes[currentTheme];

  const value = {
    currentTheme,
    themes,
    switchTheme,
    getThemeColors
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

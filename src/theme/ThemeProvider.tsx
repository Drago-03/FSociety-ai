import React, { createContext, useContext, ReactNode } from 'react';
import { colors, componentThemes, gradients, chartColors } from './colors';

interface ThemeContextType {
  colors: typeof colors;
  componentThemes: typeof componentThemes;
  gradients: typeof gradients;
  chartColors: typeof chartColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = {
    colors,
    componentThemes,
    gradients,
    chartColors,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility function to get CSS variables for dynamic theming
export const getCssVariables = () => {
  const cssVars = {} as Record<string, string>;

  // Primary colors
  Object.entries(colors.primary).forEach(([key, value]) => {
    cssVars[`--color-primary-${key.toLowerCase()}`] = value;
  });

  // Alert colors
  Object.entries(colors.alert).forEach(([key, value]) => {
    cssVars[`--color-alert-${key.toLowerCase()}`] = value;
  });

  // Neutral colors
  Object.entries(colors.neutral).forEach(([key, value]) => {
    cssVars[`--color-neutral-${key.toLowerCase()}`] = value;
  });

  // Data colors
  Object.entries(colors.data).forEach(([key, value]) => {
    cssVars[`--color-data-${key.toLowerCase()}`] = value;
  });

  return cssVars;
}; 
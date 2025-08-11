
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

const AVAILABLE_THEMES = ["default", "zinc", "rose", "blue", "green", "orange", "doom"];
const DEFAULT_THEME = "default";
const STORAGE_KEY = "tweak-theme";

interface TweakThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  themes: string[];
}

const TweakThemeContext = createContext<TweakThemeContextType | undefined>(undefined);

export function TweakThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME;
    }
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: string) => {
    if (AVAILABLE_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };
  
  const value = useMemo(() => ({
    theme,
    setTheme,
    themes: AVAILABLE_THEMES,
  }), [theme]);

  return (
    <TweakThemeContext.Provider value={value}>
      {children}
    </TweakThemeContext.Provider>
  );
}

export const useTweakTheme = () => {
  const context = useContext(TweakThemeContext);
  if (context === undefined) {
    throw new Error('useTweakTheme must be used within a TweakThemeProvider');
  }
  return context;
};

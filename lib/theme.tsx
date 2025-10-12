'use client';

import React, { createContext, useContext, useEffect } from 'react';

type ThemeContextType = { auto: true };
const ThemeContext = createContext<ThemeContextType>({ auto: true });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // automático por prefers-color-scheme; no toggles.
    document.documentElement.removeAttribute('data-theme');
  }, []);
  return <ThemeContext.Provider value={{ auto: true }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
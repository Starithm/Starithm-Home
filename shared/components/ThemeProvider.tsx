import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
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
  children: React.ReactNode;
  defaultTheme?: Theme;
  /**
   * Force a specific theme and ignore user/system preference.
   * If provided, toggling has no effect and the app stays on this theme.
   */
  forceTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark',
  forceTheme,
}) => {
  // Also support env-driven forcing (Vite): VITE_FORCE_THEME=dark|light
  const envForce = (import.meta as any)?.env?.VITE_FORCE_THEME as Theme | undefined;
  const forced = (forceTheme || envForce);
  try {
    console.log('[ThemeProvider] init', {
      defaultTheme,
      forceThemeProp: forceTheme,
      envForce,
      forcedEffective: forced,
    });
  } catch {}
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1) Persisted preference wins
    let savedTheme: Theme | null = null;
    try {
      savedTheme = localStorage.getItem('starithm-theme') as Theme;
      console.log('[ThemeProvider] savedTheme from localStorage =', savedTheme);
    } catch (e) {
      console.warn('[ThemeProvider] failed reading localStorage', e);
    }
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // 2) Default to dark unless explicitly overridden by saved preference
    // We intentionally ignore system preference here to ensure first load is dark.
    return defaultTheme;
  });

  const setTheme = (newTheme: Theme) => {
    if (forced) return; // ignore changes when forced
    setThemeState(newTheme);
    try {
      localStorage.setItem('starithm-theme', newTheme);
      console.log('[ThemeProvider] setTheme -> persisted', newTheme);
    } catch (e) {
      console.warn('[ThemeProvider] setTheme -> failed to persist', e);
    }
  };

  const toggleTheme = () => {
    if (forced) return; // ignore toggle when forced
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = forced ?? theme;
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(activeTheme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', activeTheme === 'dark' ? '#0E0B16' : '#ffffff');
    }
    try {
      console.log('[ThemeProvider] applied theme class on <html> ->', activeTheme);
    } catch {}
  }, [theme, forced]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('starithm-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme: (forced ?? theme),
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

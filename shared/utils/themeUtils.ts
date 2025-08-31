export type Theme = 'light' | 'dark';

/**
 * Set the theme programmatically
 * @param theme - The theme to set ('light' or 'dark')
 */
export const setTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  // Save to localStorage
  localStorage.setItem('starithm-theme', theme);
  
  // Update document class
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0E0B16' : '#ffffff');
  }
};

/**
 * Get the current theme
 * @returns The current theme or null if not set
 */
export const getTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null;
  
  const savedTheme = localStorage.getItem('starithm-theme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }
  
  // Check system preference
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  return systemTheme;
};

/**
 * Toggle between light and dark themes
 * @returns The new theme
 */
export const toggleTheme = (): Theme => {
  const currentTheme = getTheme() || 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Initialize theme on page load
 * This should be called early in the application lifecycle
 */
export const initializeTheme = (): void => {
  const theme = getTheme() || 'dark';
  setTheme(theme);
};

/**
 * Listen for system theme changes
 * @param callback - Function to call when system theme changes
 * @returns Function to remove the listener
 */
export const onSystemThemeChange = (callback: (theme: Theme) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    // Only update if user hasn't manually set a theme
    if (!localStorage.getItem('starithm-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      callback(newTheme);
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
};

/**
 * Force a specific theme (ignores user preference)
 * @param theme - The theme to force
 */
export const forceTheme = (theme: Theme): void => {
  setTheme(theme);
};

/**
 * Reset theme to system preference
 */
export const resetToSystemTheme = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('starithm-theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(systemTheme);
};

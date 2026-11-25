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

// Helper function to safely access theme properties
export const getThemeValue = (theme: any, path: string, fallback: any) => {
  if (!theme) return fallback;
  const keys = path.split('.');
  let value = theme;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback;
    }
  }
  return value || fallback;
};

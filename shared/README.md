# Starithm Theme System

A comprehensive dark/light theme system for all Starithm microfrontends with programmatic control and automatic system preference detection.

## Features

- 🌙 **Dark Mode by Default** - All microfrontends start in dark mode
- 🔄 **Theme Switching** - Toggle between light and dark themes
- 💾 **Persistent Storage** - Theme preference saved in localStorage
- 🖥️ **System Detection** - Automatically detects system theme preference
- 🎨 **Consistent Styling** - Unified color scheme across all microfrontends
- ⚡ **Programmatic Control** - Switch themes via code when needed

## Quick Start

### 1. Wrap Your App with UnifiedThemeProvider

```tsx
import { UnifiedThemeProvider } from '../../../shared/components/UnifiedThemeProvider';

function App() {
  return (
    <UnifiedThemeProvider defaultTheme="dark">
      <YourApp />
    </UnifiedThemeProvider>
  );
}
```

### 2. Add Theme Toggle Component

```tsx
import { ThemeToggle } from '../../../shared/components/ThemeToggle';

// Icon variant (recommended for headers)
<ThemeToggle variant="icon" size="md" />

// Button variant with text
<ThemeToggle variant="button" size="lg" />

// Switch variant
<ThemeToggle variant="switch" />
```

### 3. Use Dark Mode Classes

```tsx
// Background colors
<div className="bg-white dark:bg-starithm-rich-black">
  <h1 className="text-starithm-rich-black dark:text-starithm-platinum">
    Your Content
  </h1>
</div>
```

## Programmatic Theme Control

### Using the useTheme Hook

```tsx
import { useTheme } from '../../../shared/components/ThemeProvider';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </div>
  );
}
```

### Using Theme Utilities Directly

```tsx
import { 
  setTheme, 
  getTheme, 
  toggleTheme, 
  forceTheme, 
  resetToSystemTheme 
} from '../../../shared/utils/themeUtils';

// Set a specific theme
setTheme('dark');

// Get current theme
const currentTheme = getTheme();

// Toggle between themes
const newTheme = toggleTheme();

// Force a theme (ignores user preference)
forceTheme('light');

// Reset to system preference
resetToSystemTheme();
```

## Color Palette

### Light Theme Colors
- **Background**: `#ffffff` (white)
- **Text**: `#1A1A1A` (starithm-rich-black)
- **Primary**: `#770ff5` (starithm-electric-violet)
- **Secondary**: `#A239CA` (starithm-veronica)
- **Accent**: `#FFB400` (starithm-selective-yellow)

### Dark Theme Colors
- **Background**: `#0E0B16` (starithm-rich-black)
- **Text**: `#E7DFDD` (starithm-platinum)
- **Primary**: `#770ff5` (starithm-electric-violet)
- **Secondary**: `#A239CA` (starithm-veronica)
- **Accent**: `#FFB400` (starithm-selective-yellow)

## CSS Classes

### Background Colors
```css
.bg-white.dark:bg-starithm-rich-black
.bg-gray-50.dark:bg-gray-900
```

### Text Colors
```css
.text-starithm-rich-black.dark:text-starithm-platinum
.text-starithm-rich-black/70.dark:text-starithm-platinum/70
```

### Border Colors
```css
.border-gray-200.dark:border-gray-700
```

## Implementation Status

### ✅ Completed
- **Home Microfrontend**: Full dark mode support with theme toggle
- **Blog Microfrontend**: Dark mode styling with theme toggle
- **NovaTrace Microfrontend**: Theme toggle in navbar
- **Shared Components**: ThemeProvider, ThemeToggle, utilities
- **Global Styling**: Dark mode CSS variables and classes

### 🔄 In Progress
- Additional NovaTrace components dark mode styling
- Blog page content dark mode optimization

## Usage Examples

### Theme Demo Component

```tsx
import { ThemeDemo } from '../../../shared/components/ThemeDemo';

// Use this component for testing theme functionality
<ThemeDemo />
```

### Custom Theme Toggle

```tsx
import { useTheme } from '../../../shared/components/ThemeProvider';

function CustomThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## Notes

- Theme preference is stored in `localStorage` as `starithm-theme`
- System theme detection uses `prefers-color-scheme` media query
- All microfrontends default to dark mode
- Theme changes are applied immediately without page refresh
- Meta theme-color is updated automatically for mobile browsers

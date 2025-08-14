// Shared Starithm Color Palette & Typography
// This file defines the unified color scheme and typography for all Starithm microfrontends

export const starithmColors = {
  // Primary Brand Colors
  electricViolet: '#8D0FF5',    // Main brand color
  veronica: '#A239CA',          // Secondary purple
  selectiveYellow: '#FFB400',   // Accent yellow
  richBlack: '#1A1A1A',         // Dark text
  
  // Semantic Colors (using Starithm palette)
  success: '#10B981',           // Green for success states
  warning: '#F59E0B',           // Amber for warnings
  error: '#EF4444',             // Red for errors
  info: '#3B82F6',              // Blue for info
  
  // Neutral Colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

// Tailwind CSS configuration for easy import
export const tailwindColors = {
  'starithm-electric-violet': starithmColors.electricViolet,
  'starithm-veronica': starithmColors.veronica,
  'starithm-selective-yellow': starithmColors.selectiveYellow,
  'starithm-rich-black': starithmColors.richBlack,
  'starithm-success': starithmColors.success,
  'starithm-warning': starithmColors.warning,
  'starithm-error': starithmColors.error,
  'starithm-info': starithmColors.info,
};

// Typography Configuration
export const typography = {
  fontFamily: {
    primary: '"Google Sans Code", monospace',
    monospace: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export default starithmColors;

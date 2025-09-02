export interface Theme {
  // Base colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  inputBackground: string;
  switchBackground: string;
  ring: string;
  radius: string;

  // Starithm brand colors
  starithmRichBlack: string;
  starithmBgBlack: string;
  starithmPlatinum: string;
  starithmElectricViolet: string;
  starithmVeronica: string;
  starithmSelectiveYellow: string;
  starithmGoldenYellow: string;
  starithmElectricVioletDark: string;
  starithmVeronicaDark: string;
  starithmLink: string;

  // Typography
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };

  // Spacing
  spacing: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    56: string;
    64: string;
  };

  // Breakpoints
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };

  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Transitions
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

export const lightTheme: Theme = {
  // Base colors
  background: 'white',
  foreground: '#0E0B16',
  card: 'white',
  cardForeground: '#0E0B16',
  popover: 'white',
  popoverForeground: '#0E0B16',
  primary: '#770ff5',
  primaryForeground: 'white',
  secondary: '#C84BF7',
  secondaryForeground: 'white',
  muted: 'hsl(60, 4.8%, 95.9%)',
  mutedForeground: 'hsl(25, 5.3%, 44.7%)',
  accent: 'hsl(60, 4.8%, 95.9%)',
  accentForeground: '#0E0B16',
  destructive: 'hsl(0, 84.2%, 60.2%)',
  destructiveForeground: 'hsl(60, 9.1%, 97.8%)',
  border: '#686868',
  input: 'hsl(20, 5.9%, 90%)',
  inputBackground: 'white',
  switchBackground: 'hsl(20, 5.9%, 90%)',
  ring: 'hsl(20, 14.3%, 4.1%)',
  radius: '0.5rem',

  // Starithm brand colors
  starithmRichBlack: '#0E0B16',
  starithmBgBlack: '#0E0B16',
  starithmPlatinum: '#E7DFDD',
  starithmElectricViolet: '#770ff5',
  starithmVeronica: '#A239CA',
  starithmSelectiveYellow: '#FFB400',
  starithmGoldenYellow: '#ffc332',
  starithmElectricVioletDark: '#9A48FF',
  starithmVeronicaDark: '#C84BF7',
  starithmLink: '#69acf4',

  // Typography
  fontFamily: 'Google Sans Code, system-ui, sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
    40: '10rem',
    48: '12rem',
    56: '14rem',
    64: '16rem',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  // Override with dark mode values
  background: '#0E0B16',
  foreground: '#E7DFDD',
  card: '#0E0B16',
  cardForeground: '#E7DFDD',
  popover: '#0E0B16',
  popoverForeground: '#E7DFDD',
  primary: '#770ff5',
  primaryForeground: '#E7DFDD',
  secondary: '#E7DFDD',
  secondaryForeground: '#A239CA',
  muted: 'hsl(240, 3.7%, 15.9%)',
  mutedForeground: 'hsl(240, 5%, 64.9%)',
  accent: 'hsl(240, 3.7%, 15.9%)',
  accentForeground: '#E7DFDD',
  destructive: 'hsl(0, 62.8%, 30.6%)',
  destructiveForeground: '#E7DFDD',
  border: '#686868',
  input: 'hsl(240, 3.7%, 15.9%)',
  inputBackground: '#0E0B16',
  switchBackground: 'hsl(240, 3.7%, 15.9%)',
  ring: '#E7DFDD',
};

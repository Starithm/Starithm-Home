import React from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { useTheme } from './ThemeProvider';
import { lightTheme, darkTheme, Theme } from '../theme/theme';

// Extend the styled-components DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

interface StyledThemeProviderProps {
  children: React.ReactNode;
}

export const StyledThemeProviderNew: React.FC<StyledThemeProviderProps> = ({ children }) => {
  console.log('StyledThemeProviderNew - Component is rendering');
  
  try {
    const { theme } = useTheme();
    console.log('StyledThemeProviderNew - useTheme() result:', { theme });
    
    // Map your theme state to styled-components theme
    console.log('StyledThemeProviderNew - theme state:', theme);
    const styledTheme = theme === 'light' ? lightTheme : darkTheme;
    
    // Debug logging
    console.log('StyledThemeProviderNew - styledTheme:', styledTheme);
    console.log('StyledThemeProviderNew - spacing[6]:', styledTheme.spacing[6]);
    console.log('StyledThemeProviderNew - background color:', styledTheme.background);
    
    // Safety check
    if (!styledTheme || !styledTheme.spacing) {
      console.error('StyledThemeProviderNew - Invalid theme object:', styledTheme);
      return <div>Theme loading...</div>;
    }
    
    console.log('StyledThemeProviderNew - About to render with theme:', styledTheme);
    
    return (
      <StyledThemeProvider theme={styledTheme}>
        {children}
      </StyledThemeProvider>
    );
  } catch (error) {
    console.error('StyledThemeProviderNew - Error occurred:', error);
    return <div>Theme error: {String(error)}</div>;
  }
};

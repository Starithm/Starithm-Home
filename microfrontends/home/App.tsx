import { Homepage } from "./components/Homepage";
import { Analytics } from '@vercel/analytics/react';
import '../../shared/styles/globals.css';
import { ThemeProvider } from '../../shared/components/ThemeProvider';
import { StyledThemeProviderNew } from '../../shared/components/StyledThemeProviderNew';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" forceTheme="dark">
      <StyledThemeProviderNew>
        <Homepage />
        <Analytics />
      </StyledThemeProviderNew>
    </ThemeProvider>
  );
}

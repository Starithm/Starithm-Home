import { Homepage } from "./components/Homepage";
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '../../shared/components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Homepage />
      <Analytics />
    </ThemeProvider>
  );
}
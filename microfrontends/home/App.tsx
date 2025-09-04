import { Homepage } from "./components/Homepage";
import { Analytics } from '@vercel/analytics/react';
import '../../shared/styles/globals.css';

export default function App() {
  return (
    <>
      <Homepage />
      <Analytics />
    </>
  );
}

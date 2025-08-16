import { Homepage } from "./components/Homepage";
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <Homepage />
      <Analytics />
    </>
  );
}
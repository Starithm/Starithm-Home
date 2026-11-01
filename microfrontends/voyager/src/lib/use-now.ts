import { useEffect, useState } from 'react';

/* Re-renders the caller every `ms`. Each ticking readout owns one, so a 10 Hz clock doesn't
 * re-render the whole page. */
export function useNow(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

import { useEffect, useState } from 'react';

/* NASA's DSN Now feed: what every Deep Space Network antenna is doing, refreshed about every
 * 5 s. It is served with Access-Control-Allow-Origin: *, so the browser reads it directly. */
const FEED = 'https://eyes.nasa.gov/dsn/data/dsn.xml';
const POLL_MS = 10_000;
export const VOYAGER_1 = 'VGR1';

export interface Dish {
  name: string;
  station: string;
  activity: string;
  azimuth: number;
  elevation: number;
  targets: string[];
}

export interface VoyagerLink {
  dish: string;
  station: string;
  elevation: number;
  azimuth: number;
  /** Downlink: what Voyager is sending us. */
  down: { active: boolean; bps: number; dbm: number; band: string } | null;
  /** Uplink: what we are sending Voyager. */
  up: { active: boolean; kw: number; band: string } | null;
}

export interface DsnState {
  status: 'loading' | 'ok' | 'error';
  updated: number | null;
  stations: { name: string; dishes: Dish[] }[];
  voyager: VoyagerLink | null;
}

function parse(xml: string): Omit<DsnState, 'status'> {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const stations: DsnState['stations'] = [];
  let voyager: VoyagerLink | null = null;
  let updated: number | null = null;

  // <station> and <dish> are flat siblings: each dish belongs to the station before it.
  for (const el of Array.from(doc.documentElement.children)) {
    if (el.tagName === 'station') {
      stations.push({ name: el.getAttribute('friendlyName') ?? '', dishes: [] });
      updated = Number(el.getAttribute('timeUTC')) || updated;
    } else if (el.tagName === 'dish' && stations.length) {
      const station = stations[stations.length - 1];
      const dish: Dish = {
        name: el.getAttribute('name') ?? '',
        station: station.name,
        activity: el.getAttribute('activity') ?? '',
        azimuth: Number(el.getAttribute('azimuthAngle')),
        elevation: Number(el.getAttribute('elevationAngle')),
        targets: Array.from(el.getElementsByTagName('target')).map((t) => t.getAttribute('name') ?? ''),
      };
      station.dishes.push(dish);

      const sig = (tag: string) =>
        Array.from(el.getElementsByTagName(tag)).find((s) => s.getAttribute('spacecraft') === VOYAGER_1);
      const down = sig('downSignal');
      const up = sig('upSignal');
      if (down || up || dish.targets.includes(VOYAGER_1)) {
        voyager = {
          dish: dish.name,
          station: station.name,
          elevation: dish.elevation,
          azimuth: dish.azimuth,
          down: down
            ? {
                active: down.getAttribute('active') === 'true',
                bps: Number(down.getAttribute('dataRate')),
                dbm: Number(down.getAttribute('power')),
                band: down.getAttribute('band') ?? '',
              }
            : null,
          up: up
            ? {
                active: up.getAttribute('active') === 'true',
                kw: Number(up.getAttribute('power')),
                band: up.getAttribute('band') ?? '',
              }
            : null,
        };
      }
    }
  }
  return { stations, voyager, updated };
}

export function useDsn(): DsnState {
  const [state, setState] = useState<DsnState>({ status: 'loading', updated: null, stations: [], voyager: null });

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${FEED}?r=${Math.floor(Date.now() / 5000)}`);
        if (!res.ok) throw new Error(String(res.status));
        const next = parse(await res.text());
        if (alive) setState({ status: 'ok', ...next });
      } catch {
        // keep the last good picture on screen; just flag that it is stale
        if (alive) setState((s) => ({ ...s, status: 'error' }));
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return state;
}

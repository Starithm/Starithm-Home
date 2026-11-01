// Regenerates src/data/ephemeris.json from JPL Horizons (Voyager 1 = -31, seen from Earth's centre).
// Daily rows; the page interpolates between them with the range-rate, so metres stay right.
//   node microfrontends/voyager/scripts/fetch-ephemeris.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const START = '2026-08-01';
const STOP = '2028-03-01';

const params = new URLSearchParams({
  format: 'text',
  COMMAND: "'-31'",
  OBJ_DATA: "'NO'",
  MAKE_EPHEM: "'YES'",
  EPHEM_TYPE: "'OBSERVER'",
  CENTER: "'500@399'",
  START_TIME: `'${START}'`,
  STOP_TIME: `'${STOP}'`,
  STEP_SIZE: "'1d'",
  QUANTITIES: "'1,19,20'", // RA/Dec, Sun range + rate, Earth range + rate
  ANG_FORMAT: "'DEG'",
  CSV_FORMAT: "'YES'",
});

const res = await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`);
const text = await res.text();
const body = text.split('$$SOE')[1]?.split('$$EOE')[0];
if (!body) throw new Error(`Horizons returned no ephemeris:\n${text.slice(0, 2000)}`);

// date, , , ra, dec, r, rdot, delta, deldot
const rows = body
  .trim()
  .split('\n')
  .map((line) => line.split(',').map((s) => s.trim()))
  .map((c) => [
    Date.parse(c[0].replace(/-(\w{3})-/, ' $1 ') + ' UTC') / 1000,
    +c[3], +c[4], +c[5], +c[6], +c[7], +c[8],
  ]);

const out = {
  source: 'JPL Horizons, target -31 (Voyager 1), observer 500@399 (geocentre)',
  generated: new Date().toISOString(),
  columns: ['unixSeconds', 'raDeg', 'decDeg', 'sunAu', 'sunKmS', 'earthAu', 'earthKmS'],
  rows,
};
const file = fileURLToPath(new URL('../src/data/ephemeris.json', import.meta.url));
writeFileSync(file, JSON.stringify(out));
console.log(`wrote ${rows.length} rows to ${file}`);

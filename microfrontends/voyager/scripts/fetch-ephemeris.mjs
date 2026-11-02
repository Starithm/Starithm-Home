// Regenerates src/data/ephemeris.json from JPL Horizons (Voyager 1 = -31).
// Distances are geometric: where Voyager 1 is at that instant, not where it was when the light now
// arriving left it. That is the convention NASA uses for the one-light-day moment (18 Nov 2026,
// 10:16:07 UTC). Daily rows; the page interpolates between them with the range-rate, so metres stay right.
//   node microfrontends/voyager/scripts/fetch-ephemeris.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const START = '2026-08-01';
const STOP = '2028-03-01';
const AU_KM = 149_597_870.7;

async function horizons(extra) {
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: "'-31'",
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    START_TIME: `'${START}'`,
    STOP_TIME: `'${STOP}'`,
    STEP_SIZE: "'1d'",
    CSV_FORMAT: "'YES'",
    ...extra,
  });
  const text = await (await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`)).text();
  const body = text.split('$$SOE')[1]?.split('$$EOE')[0];
  if (!body) throw new Error(`Horizons returned no ephemeris:\n${text.slice(0, 2000)}`);
  return body.trim().split('\n').map((line) => line.split(',').map((s) => s.trim()));
}

// Geometric state vectors, UT: JD, calendar, x, y, z, vx, vy, vz, LT, RG, RR
const vectors = (center) =>
  horizons({ EPHEM_TYPE: "'VECTORS'", CENTER: `'${center}'`, VEC_TABLE: "'3'", VEC_CORR: "'NONE'", OUT_UNITS: "'KM-S'", TIME_TYPE: "'UT'" });

// one at a time: Horizons rejects parallel requests
const sky = await horizons({ EPHEM_TYPE: "'OBSERVER'", CENTER: "'500@399'", QUANTITIES: "'1'", ANG_FORMAT: "'DEG'" });
const earth = await vectors('500@399');
const sun = await vectors('500@10');
if (sky.length !== earth.length || sky.length !== sun.length) throw new Error('Horizons tables differ in length');

const rows = sky.map((c, i) => {
  const unix = Date.parse(c[0].replace(/-(\w{3})-/, ' $1 ') + ' UTC') / 1000;
  const e = earth[i].map(Number);
  const s = sun[i].map(Number);
  if (Math.abs((e[0] - 2440587.5) * 86400 - unix) > 1) throw new Error(`row ${i}: tables out of step`);
  return [unix, +c[3], +c[4], s[9] / AU_KM, s[10], e[9] / AU_KM, e[10], Math.hypot(s[5], s[6], s[7])];
});

const out = {
  source: 'JPL Horizons, target -31 (Voyager 1); geometric ranges from the geocentre (500@399) and the Sun (500@10)',
  generated: new Date().toISOString(),
  columns: ['unixSeconds', 'raDeg', 'decDeg', 'sunAu', 'sunKmS', 'earthAu', 'earthKmS', 'sunSpeedKmS'],
  rows,
};
const file = fileURLToPath(new URL('../src/data/ephemeris.json', import.meta.url));
writeFileSync(file, JSON.stringify(out));
console.log(`wrote ${rows.length} rows to ${file}`);

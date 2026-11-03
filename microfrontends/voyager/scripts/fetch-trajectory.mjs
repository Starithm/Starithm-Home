// Regenerates src/data/trajectory.json from JPL Horizons: Voyager 1's path from launch, Earth's orbit,
// and where the other planets and Voyager 2 are (no paths drawn for those), as heliocentric ecliptic
// positions in AU. Drawn by the 3D solar view (?view=3d).
//   node microfrontends/voyager/scripts/fetch-trajectory.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

async function vectors(command, start, stop, step) {
  const params = new URLSearchParams({
    format: 'text',
    COMMAND: `'${command}'`,
    OBJ_DATA: "'NO'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'VECTORS'",
    CENTER: "'500@10'",
    REF_PLANE: "'ECLIPTIC'",
    VEC_TABLE: "'1'",
    OUT_UNITS: "'AU-D'",
    CSV_FORMAT: "'YES'",
    START_TIME: `'${start}'`,
    STOP_TIME: `'${stop}'`,
    STEP_SIZE: `'${step}'`,
  });
  const text = await (await fetch(`https://ssd.jpl.nasa.gov/api/horizons.api?${params}`)).text();
  const body = text.split('$$SOE')[1]?.split('$$EOE')[0];
  if (!body) throw new Error(`Horizons returned no ephemeris:\n${text.slice(0, 2000)}`);
  // JD, calendar, x, y, z
  return body.trim().split('\n').map((line) => {
    const c = line.split(',').map((s) => s.trim());
    const unix = Math.round((Number(c[0]) - 2440587.5) * 86400);
    return [unix, ...[c[2], c[3], c[4]].map((v) => Math.round(Number(v) * 1e4) / 1e4)];
  });
}

// one at a time: Horizons rejects parallel requests. Ten-day steps keep the Jupiter and Saturn bends.
const voyager = await vectors('-31', '1977-09-06', '2028-03-01', '10d');
const earth = await vectors('399', '2026-08-01', '2027-08-01', '4d');
const BODIES = {
  Mercury: '199', Venus: '299', Mars: '499', Jupiter: '599', Saturn: '699', Uranus: '799', Neptune: '899', 'Voyager 2': '-32',
};
const bodies = {};
for (const [name, id] of Object.entries(BODIES)) bodies[name] = await vectors(id, '2026-08-01', '2028-03-01', '4d');

const out = {
  source: 'JPL Horizons; heliocentric (500@10), ecliptic J2000, AU',
  generated: new Date().toISOString(),
  columns: ['unixSeconds', 'x', 'y', 'z'],
  voyager,
  earth,
  bodies,
};
const file = fileURLToPath(new URL('../src/data/trajectory.json', import.meta.url));
writeFileSync(file, JSON.stringify(out));
console.log(`wrote ${voyager.length} Voyager rows, ${earth.length} Earth rows and ${Object.keys(bodies).length} bodies to ${file}`);

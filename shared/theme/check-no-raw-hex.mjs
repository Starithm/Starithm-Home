#!/usr/bin/env node
/**
 * Raw-hex ratchet — design-library step 5.
 *
 * `shared/styles/globals.css` is the single source of design tokens. A page-local palette
 * is how the circulars archive silently drifted off-brand (its own `#08080b` ground and
 * `#a855f7` accent while the brand is `#0E0B16` / `#8D0FF5`) — and the token-sync guard
 * could not see it, because that guard only compares theme.ts against globals.css.
 *
 * This is deliberately a RATCHET, not a clean-room rule. 621 raw hex literals already
 * existed when it was written, so failing on all of them would just get the check disabled.
 * Instead it records a per-file baseline and fails only when a file's count INCREASES, or
 * when a new file appears with raw hex. Counts may drop freely — that's the point.
 *
 *   npm run check:no-raw-hex            # verify (CI / pre-merge)
 *   npm run check:no-raw-hex -- --update  # re-baseline after intentional reductions
 *
 * Scope: styled-component and page modules. Not globals.css (that is where hex belongs),
 * not the shared `ui/` primitives, not build output or node_modules.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..', '..');
const BASELINE = path.join(here, 'raw-hex-baseline.json');
const UPDATE = process.argv.includes('--update');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vercel', 'build', 'public']);
const SCAN_ROOTS = ['src', 'shared', 'microfrontends'];
// Hex is legitimate in these: the token definitions themselves, and categorical data
// colours (event-type chips, sky-map kinds) which are data encodings, not theme surfaces.
const ALLOW = [
  /shared\/styles\/globals\.css$/,
  /shared\/theme\//,
  /shared\/utils\/eventColors\.ts$/,
];

const HEX = /#[0-9a-fA-F]{3,8}\b/g;

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

/** Strip comments and string-free regions so a hex inside a comment doesn't count. */
function strip(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

const counts = {};
for (const root of SCAN_ROOTS) {
  for (const file of walk(path.join(ROOT, root))) {
    const rel = path.relative(ROOT, file);
    if (ALLOW.some(re => re.test(rel))) continue;
    const n = (strip(fs.readFileSync(file, 'utf8')).match(HEX) || []).length;
    if (n > 0) counts[rel] = n;
  }
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);

if (UPDATE || !fs.existsSync(BASELINE)) {
  fs.writeFileSync(BASELINE, JSON.stringify(counts, null, 1) + '\n');
  console.log(`✓ raw-hex baseline written: ${Object.keys(counts).length} files, ${total} literals`);
  process.exit(0);
}

const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
const regressions = [];
for (const [file, n] of Object.entries(counts)) {
  const was = base[file];
  if (was === undefined) regressions.push(`  NEW FILE  ${file} — ${n} raw hex literal(s)`);
  else if (n > was) regressions.push(`  INCREASED ${file} — ${was} → ${n}`);
}

if (regressions.length) {
  console.error('✖ raw hex colours increased. Use a token from globals.css instead.\n');
  regressions.forEach(r => console.error(r));
  console.error(
    `\n  Tokens live in shared/styles/globals.css (--surface-*, --line-*, --text-*, --accent-*).` +
    `\n  If the addition is genuinely a data colour, add the file to ALLOW in this script.` +
    `\n  After an intentional reduction, re-baseline with: npm run check:no-raw-hex -- --update\n`
  );
  process.exit(1);
}

const baseTotal = Object.values(base).reduce((a, b) => a + b, 0);
const delta = total - baseTotal;
console.log(
  `✓ no new raw hex — ${total} literal(s) across ${Object.keys(counts).length} file(s)` +
  (delta < 0 ? ` (${-delta} fewer than baseline — run with --update to lock it in)` : '')
);

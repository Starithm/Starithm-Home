#!/usr/bin/env node
/**
 * Token drift guard.
 *
 * `shared/styles/globals.css` is the single source of truth for design tokens
 * (see docs/design-library.md). `shared/theme/theme.ts` exists only as a bridge for
 * the ~473 legacy `getThemeValue()` call sites in NovaTrace, which need real literal
 * values — several of them string-concatenate hex alpha (`${violet}1A`), so they
 * cannot consume `var(--token)`.
 *
 * That bridge is a copy, and copies drift. This script fails the build when
 * theme.ts stops agreeing with globals.css, so the two can never silently diverge
 * the way the circulars-archive palette did.
 *
 * Run: node shared/theme/check-token-sync.mjs   (wired into `npm run check:tokens`)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const CSS = path.join(root, 'shared/styles/globals.css');
const TS = path.join(root, 'shared/theme/theme.ts');

/** `--card-foreground` -> `cardForeground` */
const camel = k => {
  const p = k.split('-');
  return p[0] + p.slice(1).map(x => x[0].toUpperCase() + x.slice(1)).join('');
};

function cssBlock(css, selector) {
  const re = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([\\s\\S]*?)\\n\\}`);
  const m = css.match(re);
  if (!m) throw new Error(`selector ${selector} not found in globals.css`);
  const out = {};
  for (const line of m[1].split('\n')) {
    const d = line.match(/^\s*--([a-z0-9-]+):\s*([^;]+);/);
    if (d) out[d[1]] = d[2].trim();
  }
  return out;
}

function tsBlock(ts, name) {
  const m = ts.match(new RegExp(`export const ${name}: Theme = \\{([\\s\\S]*?)\\n\\};`));
  if (!m) throw new Error(`export const ${name} not found in theme.ts`);
  const out = {};
  for (const line of m[1].split('\n')) {
    const d = line.match(/^\s*([a-zA-Z0-9_]+):\s*'([^']*)'/);
    if (d) out[d[1]] = d[2];
  }
  return out;
}

const css = fs.readFileSync(CSS, 'utf8');
const ts = fs.readFileSync(TS, 'utf8');

// :root holds the dark defaults (there is deliberately no .dark block — it would duplicate them).
const pairs = [
  { ts: 'darkTheme', sel: ':root' },
  { ts: 'lightTheme', sel: '.light' },
];

let drift = 0;
let checked = 0;

for (const { ts: tsName, sel } of pairs) {
  const c = cssBlock(css, sel);
  const t = tsBlock(ts, tsName);
  for (const [key, cssVal] of Object.entries(c)) {
    const tsKey = camel(key);
    if (!(tsKey in t)) continue; // css-only token (brand palette, react-day-picker) — fine
    checked++;
    if (t[tsKey].trim().toLowerCase() !== cssVal.trim().toLowerCase()) {
      drift++;
      console.error(
        `  DRIFT  --${key}\n` +
        `         globals.css ${sel}  = ${cssVal}\n` +
        `         theme.ts ${tsName}  = ${t[tsKey]}`
      );
    }
  }
}

if (drift) {
  console.error(
    `\n✖ ${drift} token(s) drifted (${checked} checked).\n` +
    `  globals.css is the source of truth — update theme.ts to match it, not the reverse.\n`
  );
  process.exit(1);
}

console.log(`✓ tokens in sync — ${checked} checked across :root/darkTheme and .light/lightTheme`);

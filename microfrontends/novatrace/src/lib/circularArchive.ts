/**
 * Shared constants + derivation logic for the Circulars Archive page.
 *
 * Kept out of the components so the filtering/grouping rules are testable and so the
 * design tokens live in one place (the handoff exposes `accent` as a themeable prop).
 */

// ── Design tokens (from design_handoff_gcn_archive/README.md) ─────────────────
export const T = {
  bg: '#08080b',
  surface: '#0d0d13',
  raised: '#101017',
  sunken: '#0a0a10',

  hairline: '#16161e',
  subtle: '#1c1c24',
  control: '#22222c',
  dialog: '#2a2a36',
  hover: '#4a4a5a',
  dashed: '#26262f',

  text: '#e8e8ee',
  body: '#dcdce6',
  secondary: '#c4c4d2',
  raw: '#b4b4c2',
  muted: '#8a8a99',
  faint: '#7a7a88',
  disabled: '#2e2e38',
  placeholder: '#4a4a58',

  accent: '#a855f7',
  accentText: '#c98bff',
  accentSurface: '#1b1226',
  accentBorder: '#4c2a6e',

  rowHover: '#101017',
  timelineActive: '#141019',
  dot: '#3a3a48',
} as const;

// Wider than the handoff's 900/860: those were specified before the real subject lines
// (which are long) and the measurement key/value rows were in place.
export const PAGE_MAX_WIDTH = 1240;
export const DIALOG_MAX_WIDTH = 1100;

export const PER_PAGE_DEFAULT = 8;
// No plot data exists in the pipeline yet, so the dashed placeholder is pure noise.
// Flip to true (or pass showPlots) once light curves / skymaps are actually generated.
export const SHOW_PLOTS_DEFAULT = false;

// ── Types ─────────────────────────────────────────────────────────────────────
/**
 * Type tabs. The handoff specified All/GRB/EP/GW/NU, but GW is omitted: there are zero
 * GW circulars because `igwn.gwalert` is not an enabled Kafka topic. X-ray and Optical
 * are added because they exist in the data and would otherwise be invisible outside
 * "All". Re-add GW here (label 'GW', match /^GW$/i) once LVK ingestion is turned on.
 */
export const TYPE_TABS = [
  { label: 'All', match: null },
  { label: 'GRB', match: /^GRB$/i },
  { label: 'EP', match: /^EP$/i },
  { label: 'NU', match: /^(NU|Neutrino)$/i },
  { label: 'X-ray', match: /^X-?ray$/i },
  { label: 'Optical', match: /^Optical$/i },
] as const;

export type TypeTab = (typeof TYPE_TABS)[number]['label'];

export const DATE_RANGES = [
  { label: 'All dates', value: 'all' },
  { label: 'Last 24 hours', value: '1' },
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Custom range…', value: 'custom' },
] as const;

export type DateRange = (typeof DATE_RANGES)[number]['value'];

/**
 * Instrument filter. Replaces the handoff's `broker` select, which would have been a dead
 * control: all 12,691 circulars carry broker='gcn'.
 *
 * Matching is "mentions this instrument", not "belongs to it" — a circular names every
 * telescope that observed, so one circular can match several entries. The canonical list is
 * deliberately short: telescope strings have a long tail (731 distinct values, ~52% of
 * mentions) dominated by one-off ground-based follow-ups. Listing them all is unusable;
 * these cover the missions that actually recur.
 */
export const INSTRUMENTS: { label: string; match: RegExp }[] = [
  { label: 'Swift', match: /swift|\bbat\b|\buvot\b|\bxrt\b/i },
  { label: 'Fermi', match: /fermi|\bgbm\b|\blat\b/i },
  { label: 'SVOM', match: /svom|eclairs|\bgrm\b|\bmxt\b/i },
  { label: 'Einstein Probe', match: /\bep[-/ ]|einstein probe|wide-field x-ray|follow-up x-ray/i },
  { label: 'Konus-Wind', match: /konus/i },
  { label: 'VLT', match: /\bvlt\b|very large telescope/i },
  { label: 'Gemini', match: /gemini/i },
  { label: 'AstroSat', match: /astrosat|czti/i },
  { label: 'GECAM', match: /gecam/i },
  { label: 'IceCube', match: /icecube/i },
  { label: 'CHIME', match: /chime/i },
  { label: 'MAXI', match: /maxi/i },
  { label: 'Insight-HXMT', match: /hxmt/i },
  { label: 'INTEGRAL', match: /integral/i },
  { label: 'NuSTAR', match: /nustar/i },
];

export const TYPE_COLORS: Record<string, string> = {
  GRB: '#a855f7',
  EP: '#38bdf8',
  GW: '#fbbf24',
  NU: '#34d399',
  'X-ray': '#38bdf8',
  Optical: '#f472b6',
};

// ── Derivation helpers ────────────────────────────────────────────────────────

/** Circular `type` as stored (data.basic_data.eventType), normalised to a tab label. */
export function circularType(alert: any): string {
  const raw = String(alert?.data?.basic_data?.eventType ?? '').trim();
  if (!raw) return '';
  const hit = TYPE_TABS.find(t => t.match && t.match.test(raw));
  return hit ? hit.label : raw;
}

/** Every telescope/instrument string a circular mentions. */
export function circularTelescopes(alert: any): string[] {
  const t = alert?.data?.telescopes ?? {};
  return [
    ...(Array.isArray(t.telescopes) ? t.telescopes : []),
    ...(Array.isArray(t.instruments) ? t.instruments : []),
    ...(Array.isArray(t.facilities) ? t.facilities : []),
  ].map(String);
}

/** Primary instrument for display — first canonical mission mentioned, else first raw value. */
export function primaryInstrument(alert: any): string {
  const tels = circularTelescopes(alert);
  for (const inst of INSTRUMENTS) {
    if (tels.some(t => inst.match.test(t))) return inst.label;
  }
  return tels[0] ?? '—';
}

/**
 * The circular's SUBJECT line — "GRB 260909A: EP-FXT follow-up observation".
 *
 * The `event` column holds only the short event name ("GRB 260909A"); the descriptive
 * subject exists solely inside the raw circular text, so it has to be parsed out. Falls
 * back to the event name when raw is unavailable.
 */
export function circularSubject(alert: any): string {
  const raw = String(alert?.data?.raw ?? '');
  const m = raw.match(/^SUBJECT:\s*(.+)$/m);
  return m ? m[1].trim() : String(alert?.event ?? '—');
}

/** GCN number from an alertKey like "GCN-45526". Returns null when unparseable. */
export function gcnNumber(alert: any): number | null {
  const m = String(alert?.alertKey ?? '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

export interface ArchiveFilters {
  gcnQuery: string;
  eventQuery: string;
  type: TypeTab;
  range: DateRange;
  customFrom: string;
  customTo: string;
  instrument: string; // 'All' | INSTRUMENTS[].label
}

export const EMPTY_FILTERS: ArchiveFilters = {
  gcnQuery: '',
  eventQuery: '',
  type: 'All',
  range: 'all',
  customFrom: '',
  customTo: '',
  instrument: 'All',
};

export function isFiltered(f: ArchiveFilters): boolean {
  return (
    f.gcnQuery !== '' || f.eventQuery !== '' || f.type !== 'All' ||
    f.range !== 'all' || f.instrument !== 'All'
  );
}

/**
 * Filter order per the handoff: type → instrument → GCN substring → event → date range.
 * Then sort descending by GCN number (falling back to date when unparseable).
 */
export function applyFilters(alerts: any[], f: ArchiveFilters): any[] {
  const typeTab = TYPE_TABS.find(t => t.label === f.type);
  const inst = INSTRUMENTS.find(i => i.label === f.instrument);

  let cutoff: number | null = null;
  let until: number | null = null;
  if (f.range === 'custom') {
    if (f.customFrom) cutoff = new Date(f.customFrom).getTime();
    if (f.customTo) until = new Date(f.customTo).getTime() + 86_400_000; // inclusive day
  } else if (f.range !== 'all') {
    cutoff = Date.now() - parseInt(f.range, 10) * 86_400_000;
  }

  const out = alerts.filter(a => {
    if (typeTab?.match && !typeTab.match.test(circularType(a))) return false;
    if (inst && !circularTelescopes(a).some(t => inst.match.test(t))) return false;
    if (f.gcnQuery && !String(gcnNumber(a) ?? '').includes(f.gcnQuery)) return false;
    if (f.eventQuery) {
      const hay = `${a?.event ?? ''} ${circularSubject(a)} ${a?.summary ?? ''}`.toLowerCase();
      if (!hay.includes(f.eventQuery.toLowerCase())) return false;
    }
    if (cutoff != null || until != null) {
      const ts = new Date(a?.date ?? a?.createdAt ?? 0).getTime();
      if (!Number.isFinite(ts)) return false;
      if (cutoff != null && ts < cutoff) return false;
      if (until != null && ts >= until) return false;
    }
    return true;
  });

  return out.sort((a, b) => {
    const ga = gcnNumber(a), gb = gcnNumber(b);
    if (ga != null && gb != null) return gb - ga;
    return new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime();
  });
}

/** Group a page of circulars by UTC date, newest date first. */
export function groupByDate(alerts: any[]): { key: string; label: string; items: any[] }[] {
  const groups = new Map<string, any[]>();
  for (const a of alerts) {
    const d = new Date(a?.date ?? a?.createdAt ?? 0);
    const key = Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : 'unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }
  return [...groups.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([key, items]) => ({
      key,
      label:
        key === 'unknown'
          ? 'Unknown date'
          : new Date(`${key}T00:00:00Z`).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
            }),
      items,
    }));
}

/**
 * Circulars belonging to the same event, ascending by GCN number — the popup's side rail.
 *
 * Grouped on the `event` STRING rather than canonical_id on purpose: circular→canonical
 * linking sat at 0% from Aug–Sep 2026, so canonical_id is null for most of the archive and
 * would yield single-row timelines. canonical_id is used only as a secondary match, so the
 * rail improves automatically as linking backfills.
 */
export function eventTimeline(all: any[], current: any): any[] {
  const ev = String(current?.event ?? '').trim();
  const cid = current?.canonicalId ?? null;
  if (!ev && !cid) return [current];
  return all
    .filter(a => {
      if (cid && a?.canonicalId && a.canonicalId === cid) return true;
      return ev !== '' && String(a?.event ?? '').trim() === ev;
    })
    .sort((a, b) => (gcnNumber(a) ?? 0) - (gcnNumber(b) ?? 0));
}

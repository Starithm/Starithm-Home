/* Figures and data files linked from an event's notices and circulars. Shared by the event
 * page and the Ask Evren fact sheet, so both find the same images. */

/* Circular urls occasionally point at finder charts and light-curve PNGs. Most events carry none. */
export const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

export const FITS_EXTS = /\.fits(\.gz)?(\?.*)?$/i;

export const imageUrls = (urls?: string[] | null): string[] =>
  (urls || []).filter(u => typeof u === 'string' && IMAGE_EXTS.test(u));

const KNOWN_LABELS: Record<string, string> = { lightcurve: 'Light curve', 'light curve': 'Light curve', locationmap: 'Location map' };

/** Label a `*_url` payload key: LightCurve_URL -> "Light curve", healpix_url -> "healpix". */
const urlLabel = (k: string) => {
  const key = k.replace(/_url$/i, '').replace(/_/g, ' ').trim().toLowerCase();
  return KNOWN_LABELS[key] ?? key;
};

/* GCN Classic VOEvents of Konus-Wind and CALET name the field `Light_Curve` (no `_url`). */
const ASSET_KEY = /_url$|^light_?curve$/i;

/**
 * Notice assets hang off payload keys ending in `_url` (lightcurve_url,
 * LightCurve_URL, locationmap_url, healpix_url, …) or named `Light_Curve`, with `links` as a
 * fallback. `pages` are the rest: a linked page, not a file (CALET's light curve is an HTML page).
 */
export function noticeAssets(n: { payload?: Record<string, any> | null; links?: Record<string, any> | null }) {
  const pool: Array<[string, string]> = [];
  for (const src of [n.payload || {}, n.links || {}]) {
    for (const [k, v] of Object.entries(src)) {
      if (typeof v !== 'string' || !/^https?:\/\//i.test(v)) continue;
      if (!ASSET_KEY.test(k)) continue;
      if (!pool.some(([, u]) => u === v)) pool.push([urlLabel(k), v]);
    }
  }
  return {
    images: pool.filter(([, u]) => IMAGE_EXTS.test(u)),
    fits: pool.filter(([, u]) => FITS_EXTS.test(u)),
    pages: pool.filter(([label, u]) => /light curve/i.test(label) && !IMAGE_EXTS.test(u) && !FITS_EXTS.test(u)),
  };
}

/* Figures and data files linked from an event's notices and circulars. Shared by the event
 * page and the Ask Cosmos fact sheet, so both find the same images. */

/* Circular urls occasionally point at finder charts and light-curve PNGs. Most events carry none. */
export const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

export const FITS_EXTS = /\.fits(\.gz)?(\?.*)?$/i;

export const imageUrls = (urls?: string[] | null): string[] =>
  (urls || []).filter(u => typeof u === 'string' && IMAGE_EXTS.test(u));

/** Label a `*_url` payload key: lightcurve_url -> "lightcurve". */
const urlLabel = (k: string) => k.replace(/_url$/i, '').replace(/_/g, ' ').trim().toLowerCase();

/**
 * Notice assets hang off payload keys ending in `_url` (lightcurve_url,
 * LightCurve_URL, locationmap_url, healpix_url, …) with `links` as a fallback —
 * the same places the previous page looked.
 */
export function noticeAssets(n: { payload?: Record<string, any> | null; links?: Record<string, any> | null }) {
  const pool: Array<[string, string]> = [];
  for (const src of [n.payload || {}, n.links || {}]) {
    for (const [k, v] of Object.entries(src)) {
      if (typeof v !== 'string' || !/^https?:\/\//i.test(v)) continue;
      if (!/_url$/i.test(k)) continue;
      if (!pool.some(([, u]) => u === v)) pool.push([urlLabel(k), v]);
    }
  }
  return {
    images: pool.filter(([, u]) => IMAGE_EXTS.test(u)),
    fits: pool.filter(([, u]) => FITS_EXTS.test(u)),
  };
}

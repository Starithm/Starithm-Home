import { useState } from 'react';

/* Sky-survey cutouts of a position, shared by Ask Evren's context panel and the event page's Position
 * section. One is shown at a time; a failed one gives way to the next. */

export type SkyCutout = { key: string; src: string; caption: string; credit: string; viewer?: string };

/** A cutout only means something for a well-localised source (a GW "position" is the centre of a
 *  ~1000 deg² region); above this error, none is shown. */
export const SKY_CUTOUT_MAX_ERR_DEG = 0.5;

/** Field of view (degrees) for an error radius: four times the error, between 0.05° and 1°. */
export const skyFov = (errDeg: number | null | undefined) => Math.min(Math.max((errDeg ?? 0.02) * 4, 0.05), 1);

/* Galactic latitude (degrees) of an ICRS position, from the north Galactic pole at 192.85948°, +27.12825°. */
function galacticLat(ra: number, dec: number): number {
  const r = Math.PI / 180, dG = 27.12825 * r;
  return Math.asin(Math.sin(dec * r) * Math.sin(dG) + Math.cos(dec * r) * Math.cos(dG) * Math.cos((ra - 192.85948) * r)) / r;
}

/* In the order to try:
   - Legacy Surveys DR10 (deep, colour) only where it has data: outside its footprint it returns a blank or
     one-band image rather than an error, so the choice is by position (the plane and the far south excluded).
   - NASA SkyView DSS2 red: the whole sky, black and white.
   - CDS hips2fits Pan-STARRS: the original source. Down since 2026-11-12 (CDS cybersecurity incident,
     cds.unistra.fr); kept last so it is used again if the others fail once CDS is back.
   All are square, `fov` degrees across, centred on the position. */
export function skyCutouts(ra: number, dec: number, fov: number): SkyCutout[] {
  const at = `${ra.toFixed(4)}°, ${dec >= 0 ? '+' : ''}${dec.toFixed(4)}°`;
  const out: SkyCutout[] = [];
  if (dec >= -65 && Math.abs(galacticLat(ra, dec)) >= 20) {
    out.push({
      key: 'sky-legacy',
      src: `https://www.legacysurvey.org/viewer/cutout.jpg?ra=${ra}&dec=${dec}&layer=ls-dr10&pixscale=${((fov * 3600) / 400).toFixed(3)}&size=400`,
      caption: `Legacy Surveys DR10 · ${at}`,
      credit: 'Legacy Surveys',
      // zoom 16 is ~0.26″ per pixel; each step down doubles it
      viewer: `https://www.legacysurvey.org/viewer?ra=${ra}&dec=${dec}&layer=ls-dr10&zoom=${Math.max(10, Math.min(16, Math.round(16 - Math.log2((fov * 3600) / 400 / 0.262))))}&mark=${ra},${dec}`,
    });
  }
  out.push({
    key: 'sky-dss',
    src: `https://skyview.gsfc.nasa.gov/current/cgi/runquery.pl?Survey=DSS2+Red&Position=${ra},${dec}&Size=${fov}&Pixels=400&Return=JPEG`,
    caption: `DSS2 red · NASA SkyView · ${at}`,
    credit: 'DSS2 via NASA SkyView',
  });
  out.push({
    key: 'sky-hips',
    src: `https://alasky.cds.unistra.fr/hips-image-services/hips2fits?hips=CDS%2FP%2FPanSTARRS%2FDR1%2Fcolor-z-zg-g&width=400&height=400&fov=${fov}&projection=TAN&coordsys=icrs&ra=${ra}&dec=${dec}&format=jpg`,
    caption: `Pan-STARRS · ${at}`,
    credit: 'Pan-STARRS via CDS hips2fits',
  });
  return out;
}

/** The cutout to show for a position, and what to call when its image fails to load (the next one is then
 *  returned). null when the error is unknown or too large, or every survey failed (`allFailed`). */
export function useSkyCutout(ra: number | null | undefined, dec: number | null | undefined, errDeg: number | null | undefined) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const usable = ra != null && dec != null && errDeg != null && errDeg > 0 && errDeg < SKY_CUTOUT_MAX_ERR_DEG;
  const fov = skyFov(errDeg);
  const cutout = usable ? skyCutouts(ra, dec, fov).find((c: SkyCutout) => !failed[c.key]) ?? null : null;
  return {
    cutout, fov,
    allFailed: usable && !cutout,
    onError: () => { if (cutout) setFailed(f => ({ ...f, [cutout.key]: true })); },
  };
}

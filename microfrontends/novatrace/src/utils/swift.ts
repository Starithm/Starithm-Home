/* Links to Swift's own pages for a burst Swift triggered on.
 *
 * Swift's circulars name both the burst and the BAT trigger:
 *   "the Swift Burst Alert Telescope (BAT) triggered and located GRB 261017A (trigger=1519536)"  (GCN 45974)
 *   "we report further analysis of BAT GRB 261017A (trigger #1519536)"  (BAT refined, GCN 45985)
 * GBM circulars write "(trigger 813945910/261017670)", with neither "=" nor "#", so they never match.
 *
 * The UK Swift Science Data Centre pages are keyed by the trigger, zero-padded to 8 digits, and
 * always resolve. The GSFC GRB table is keyed by the burst name as the table spells it; that is
 * the circular's spelling except for an old burst renamed later (GRB 090904 → 090904A), whose
 * link lands on an empty table page rather than a wrong burst.
 */

interface CircularLike { data?: { raw?: string } }

const DETECTION = /GRB\s*(\d{6}[A-Z]?)\s*\(trigger\s*[=#]\s*(\d{5,7})\)/i;

export interface SwiftLinks { name: string; trigger: string; links: { label: string; url: string }[] }

export function swiftLinks(circulars: CircularLike[]): SwiftLinks | null {
  for (const c of circulars) {
    const m = (c.data?.raw ?? '').match(DETECTION);
    if (!m) continue;
    const [, name, trigger] = m;
    const t8 = trigger.padStart(8, '0');
    return {
      name, trigger,
      links: [
        { label: 'Swift GRB table', url: `https://swift.gsfc.nasa.gov/archive/grb_table/fullview/${name}/` },
        { label: 'XRT position', url: `https://www.swift.ac.uk/xrt_positions/${t8}/` },
        { label: 'XRT light curve', url: `https://www.swift.ac.uk/xrt_curves/${t8}/` },
        { label: 'Burst analyser', url: `https://www.swift.ac.uk/burst_analyser/${t8}/` },
      ],
    };
  }
  return null;
}

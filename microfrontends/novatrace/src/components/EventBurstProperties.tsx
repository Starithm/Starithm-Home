import { useMemo } from 'react';
import {
  SectionHead, SectionNote, Card, FieldHint, Muted, ScrollTableWrap, Table, UrlLink, Disclaimer,
} from '../styled_pages/EventRecord.styled';
import {
  burstProperties, catalogUrl, fmtObservationValue, CATALOG_LABEL, PROMPT_PROPERTIES, SPECTRAL_MODEL_LABEL,
  type CatalogValues, type ObservationRow,
} from '../utils/observations';
import { RecordSection, SectionToggle } from './RecordSection';

/* The burst's own properties — duration, fluence, peak flux, photon index, Epeak — as each
 * instrument's circular reported them (data.observations rows with object "prompt", v3). The Swift
 * GRB table shows these per burst; here every instrument's value is listed with its band and
 * spectral model, so a BAT and a GBM fluence sit side by side rather than one silently winning.
 * Burst-catalogue values (GBM's own catalogue) come first in each property, linked to the catalogue. */

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

const gcnNo = (k: string) => k.replace(/^GCN-/, '');

export function EventBurstProperties({ circulars, catalogs, onOpenCircular }: {
  circulars: CircularLike[]; catalogs?: CatalogValues[]; onOpenCircular: (alertKey: string) => void;
}) {
  const rows = useMemo(() => burstProperties(circulars, catalogs), [circulars, catalogs]);
  if (!rows.length) return null;
  const fromCatalog = rows.filter(o => o.source === 'catalog').length;

  return (
    <RecordSection id="burst">
      <SectionHead>
        <SectionToggle>Burst properties</SectionToggle>
        <SectionNote>
          {rows.length} values · {fromCatalog ? `${fromCatalog} from catalogues, ${rows.length - fromCatalog} from circulars` : 'as reported in circulars'}
        </SectionNote>
      </SectionHead>
      <Card>
        <ScrollTableWrap tabIndex={0} role="region" aria-label="Burst properties table">
          <Table>
            <thead>
              <tr><th>Property</th><th>Value</th><th>Band</th><th>Instrument</th><th>Model</th><th>Source</th></tr>
            </thead>
            <tbody>
              {rows.map((o, i) => (
                <tr key={i} title={o.quote ?? undefined}>
                  <td>{PROMPT_PROPERTIES.find(p => p.id === o.quantity)?.label}</td>
                  <td>{fmtObservationValue(o)}{o.analysis === 'refined' && o.source !== 'catalog' && <FieldHint>refined</FieldHint>}</td>
                  <td>{o.band ?? '—'}</td>
                  <td style={{ whiteSpace: 'normal' }}>{o.instrument || o.telescope || '—'}</td>
                  <td>{o.spectral_model ? SPECTRAL_MODEL_LABEL[o.spectral_model] ?? o.spectral_model : <Muted>—</Muted>}</td>
                  <td>
                    {o.source === 'catalog' ? (
                      catalogUrl(o)
                        ? <UrlLink href={catalogUrl(o)!} target="_blank" rel="noopener noreferrer">{CATALOG_LABEL[o.catalog ?? ''] ?? o.catalog}</UrlLink>
                        : CATALOG_LABEL[o.catalog ?? ''] ?? o.catalog
                    ) : (
                      <UrlLink href={`#circ-${o.alertKey}`} onClick={e => { e.preventDefault(); onOpenCircular(o.alertKey); }}>
                        GCN {gcnNo(o.alertKey)}
                      </UrlLink>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollTableWrap>
        <Disclaimer>
          Circular values are model-parsed from the circular text; hover a row for the sentence it came from.
          {fromCatalog > 0 && ' Catalogue values are from the Fermi GBM Burst Catalog (HEASARC) and the Swift GRB table (GSFC), each measured the same way for every burst it lists; Swift\'s errors are 90%.'}
        </Disclaimer>
      </Card>
    </RecordSection>
  );
}

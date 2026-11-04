import { useMemo } from 'react';
import {
  SectionHead, SectionNote, Card, FieldHint, Muted, TableWrap, Table, UrlLink, Disclaimer,
} from '../styled_pages/EventRecord.styled';
import {
  burstProperties, fmtObservationValue, PROMPT_PROPERTIES, SPECTRAL_MODEL_LABEL, type ObservationRow,
} from '../utils/observations';
import { RecordSection, SectionToggle } from './RecordSection';

/* The burst's own properties — duration, fluence, peak flux, photon index, Epeak — as each
 * instrument's circular reported them (data.observations rows with object "prompt", v3). The Swift
 * GRB table shows these per burst; here every instrument's value is listed with its band and
 * spectral model, so a BAT and a GBM fluence sit side by side rather than one silently winning. */

interface CircularLike { alertKey: string; date: string; data?: { observations?: { rows?: ObservationRow[] } } }

const gcnNo = (k: string) => k.replace(/^GCN-/, '');

export function EventBurstProperties({ circulars, onOpenCircular }: {
  circulars: CircularLike[]; onOpenCircular: (alertKey: string) => void;
}) {
  const rows = useMemo(() => burstProperties(circulars), [circulars]);
  if (!rows.length) return null;

  return (
    <RecordSection id="burst">
      <SectionHead>
        <SectionToggle>Burst properties</SectionToggle>
        <SectionNote>{rows.length} values · as reported in circulars</SectionNote>
      </SectionHead>
      <Card>
        <TableWrap>
          <Table>
            <thead>
              <tr><th>Property</th><th>Value</th><th>Band</th><th>Instrument</th><th>Model</th><th>Source</th></tr>
            </thead>
            <tbody>
              {rows.map((o, i) => (
                <tr key={i} title={o.quote ?? undefined}>
                  <td>{PROMPT_PROPERTIES.find(p => p.id === o.quantity)?.label}</td>
                  <td>{fmtObservationValue(o)}{o.analysis === 'refined' && <FieldHint>refined</FieldHint>}</td>
                  <td>{o.band ?? '—'}</td>
                  <td style={{ whiteSpace: 'normal' }}>{o.instrument || o.telescope || '—'}</td>
                  <td>{o.spectral_model ? SPECTRAL_MODEL_LABEL[o.spectral_model] ?? o.spectral_model : <Muted>—</Muted>}</td>
                  <td>
                    <UrlLink href={`#circ-${o.alertKey}`} onClick={e => { e.preventDefault(); onOpenCircular(o.alertKey); }}>
                      GCN {gcnNo(o.alertKey)}
                    </UrlLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
        <Disclaimer>Values are model-parsed from the circular text; hover a row for the sentence it came from.</Disclaimer>
      </Card>
    </RecordSection>
  );
}

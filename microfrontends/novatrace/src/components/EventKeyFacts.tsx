import { FieldLabel, FieldValue, FieldHint, UrlLink, KeyFactList, KeyFactItem } from '../styled_pages/EventRecord.styled';
import type { KeyFact } from '../utils/keyFacts';

/* Key facts beside the summary: each a structured value with who reported it and a link to the
 * circular. Desktop: a column to the right of the prose. Phone: a two-up grid below it, with long
 * values (the position) on a row of their own. */
export function EventKeyFacts({ facts, onOpenCircular }: { facts: KeyFact[]; onOpenCircular: (alertKey: string) => void }) {
  if (!facts.length) return null;
  return (
    <KeyFactList aria-label="Key facts">
      {facts.map(f => (
        <KeyFactItem key={f.id} $wide={!!f.wide}>
          <FieldLabel>{f.label}</FieldLabel>
          <FieldValue>{f.value}</FieldValue>
          <div>
            {f.by && <FieldHint style={{ marginLeft: 0 }}>{f.by}</FieldHint>}
            {f.alertKey && (
              <FieldHint style={{ marginLeft: f.by ? 6 : 0 }}>
                <UrlLink href={`#circ-${f.alertKey}`} onClick={e => { e.preventDefault(); onOpenCircular(f.alertKey!); }}>
                  {f.alertKey.replace(/^GCN-/, 'GCN ')}
                </UrlLink>
              </FieldHint>
            )}
            {!!f.more && f.more > 0 && <FieldHint>+{f.more} more</FieldHint>}
          </div>
        </KeyFactItem>
      ))}
    </KeyFactList>
  );
}

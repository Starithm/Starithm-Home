import React, { useState } from 'react';
import { type AnswerSentence, type AskSource, circularUrl, opensInPopup, sourceLabel } from '@novatrace/lib/askCosmos';
import {
  CiteCard, CiteChip, CiteWrap, Link, Mono, Sentence, SummaryText,
} from '@novatrace/styled_pages/AskPage.styled';

/* The cited summary. While Claude streams, `draft` blocks render as they arrive; once the
 * backend has checked citations, `answer` (whole sentences, each with its circulars)
 * replaces the draft. Hovering a chip highlights its source card, and the reverse. */

interface Props {
  draft: { text: string; cites: string[] }[];
  answer: AnswerSentence[] | null;
  sources: Record<string, AskSource>;
  hoverKey: string | null;
  onHover: (key: string | null) => void;
  onOpen: (key: string) => void;
}

export default function AskSummary({ draft, answer, sources, hoverKey, onHover, onOpen }: Props) {
  const parts = answer ?? draft.map((d) => ({ text: d.text, cites: d.cites, absence: false }));
  return (
    <SummaryText>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <Sentence $highlight={!!hoverKey && p.cites.includes(hoverKey)} $absence={p.absence}>{p.text}</Sentence>
          {p.cites.map((key, j) => (
            <Cite key={key} sourceKey={key} source={sources[key]} first={j === 0}
              active={hoverKey === key} onHover={onHover} onOpen={onOpen} />
          ))}
          {answer ? ' ' : ''}
        </React.Fragment>
      ))}
    </SummaryText>
  );
}

function Cite({ sourceKey, source, first, active, onHover, onOpen }: {
  sourceKey: string; source?: AskSource; first: boolean; active: boolean; onHover: (k: string | null) => void;
  onOpen: (k: string) => void;
}) {
  const popup = opensInPopup(sourceKey);
  // Circulars open in the popup; the notice digest links to its event page.
  const openPopup = (e: React.MouseEvent) => { if (popup) { e.preventDefault(); onOpen(sourceKey); } };
  const [open, setOpen] = useState(false);
  const n = source?.n ?? sourceKey.replace(/^GCN-/, '');
  const full = sourceLabel({ key: sourceKey, n });
  // After the first chip in a sentence, GCN chips show the bare number to save space.
  const label = first || !full.startsWith('GCN ') ? full : n;
  return (
    <CiteWrap
      onMouseEnter={() => { setOpen(true); onHover(sourceKey); }}
      onMouseLeave={() => { setOpen(false); onHover(null); }}
    >
      <CiteChip $active={active} href={source ? circularUrl(source) : undefined} onClick={openPopup}
        onFocus={() => onHover(sourceKey)} onBlur={() => onHover(null)}>
        {label}
      </CiteChip>
      {open && source && (
        <CiteCard role="tooltip">
          <span style={{ display: 'flex', gap: 8 }}>
            <Mono style={{ color: 'var(--accent-text)' }}>{full}</Mono>
            <Mono style={{ color: 'var(--text-muted)' }}>{source.date}</Mono>
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-body)' }}>{source.subject}</span>
          <Link href={circularUrl(source)} onClick={openPopup}>
            {popup ? (source.archive ? 'Open circular (archive text)' : 'Open circular') : 'Event page →'}
          </Link>
        </CiteCard>
      )}
    </CiteWrap>
  );
}

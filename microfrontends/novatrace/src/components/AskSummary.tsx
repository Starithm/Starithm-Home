import React, { useState } from 'react';
import { type AnswerSentence, type AskSource, circularUrl, sourceLabel } from '@novatrace/lib/askCosmos';
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
}

export default function AskSummary({ draft, answer, sources, hoverKey, onHover }: Props) {
  const parts = answer ?? draft.map((d) => ({ text: d.text, cites: d.cites, absence: false }));
  return (
    <SummaryText>
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          <Sentence $highlight={!!hoverKey && p.cites.includes(hoverKey)} $absence={p.absence}>{p.text}</Sentence>
          {p.cites.map((key, j) => (
            <Cite key={key} sourceKey={key} source={sources[key]} first={j === 0}
              active={hoverKey === key} onHover={onHover} />
          ))}
          {answer ? ' ' : ''}
        </React.Fragment>
      ))}
    </SummaryText>
  );
}

function Cite({ sourceKey, source, first, active, onHover }: {
  sourceKey: string; source?: AskSource; first: boolean; active: boolean; onHover: (k: string | null) => void;
}) {
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
      <CiteChip $active={active} href={source ? circularUrl(source) : undefined}
        {...(sourceKey.startsWith('NOTICES-') ? {} : { target: '_blank', rel: 'noreferrer' })}
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
          <Link href={circularUrl(source)} {...(sourceKey.startsWith('NOTICES-') ? {} : { target: '_blank', rel: 'noreferrer' })}>
            {sourceKey.startsWith('NOTICES-') ? 'Event page →' : source.archive ? 'Archive circular · View on gcn.nasa.gov ↗' : 'Open circular ↗'}
          </Link>
        </CiteCard>
      )}
    </CiteWrap>
  );
}

// Ask Evren from an event page (decided 2026-11-23, under the summary): the question in an editable
// input, with suggestions for this kind of event. It opens /novatrace/ask in a new tab, which runs the
// question in its `q` parameter, so the record stays open.
//
// Nothing is asked until the reader submits, so a page view never uses a question from the daily limit,
// and there are no links to /ask?q= on the page for a crawler to follow. Crawlers get the prerendered
// HTML (api/event-page.ts), not this component.
import React, { useState } from 'react';
import styled from 'styled-components';

/** Questions worth asking about an event of this kind, by name. */
export function eventQuestions(name: string, kind: string | null | undefined): string[] {
  const k = (kind ?? '').toLowerCase();
  const first = `What do we know about ${name} so far?`;
  if (k.includes('grb')) return [first, `Has an afterglow been reported for ${name}?`, `What is the best position for ${name}?`, `Is there a redshift for ${name}?`];
  if (k.includes('gw')) return [first, `Which counterparts were proposed for ${name}?`, `Which telescopes followed up ${name}?`];
  if (k.includes('neutrino')) return [first, `Which known sources are in the error region of ${name}?`, `Which telescopes followed up ${name}?`];
  return [first, `Which instruments detected ${name}?`, `Which telescopes followed up ${name}?`];
}

const squash = (s: string) => s.toLowerCase().replace(/\s+/g, '');

/** The question as sent: prefixed with the event's name ("GRB 261017A: was it short?") when the reader's
 *  wording no longer names it, so Evren still knows which event is meant. */
export function scopedQuestion(name: string, q: string): string {
  const t = q.trim();
  return squash(t).includes(squash(name)) ? t : `${name}: ${t}`;
}

export function EventAsk({ name, kind }: { name: string; kind: string | null | undefined }) {
  const questions = eventQuestions(name, kind);
  const [q, setQ] = useState(questions[0]);
  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    window.open(`/novatrace/ask?q=${encodeURIComponent(scopedQuestion(name, q))}`, '_blank', 'noopener');
  };
  return (
    <Panel onSubmit={ask}>
      <Head>Ask Evren about this event</Head>
      <Row>
        <Input value={q} onChange={e => setQ(e.target.value)} aria-label={`Question for Evren about ${name}`} />
        <Button type="submit">Ask →</Button>
      </Row>
      <Chips>
        {questions.slice(1).map(s => <Chip key={s} type="button" onClick={() => setQ(s)}>{s}</Chip>)}
      </Chips>
      <Note>Opens in a new tab. Evren answers from the circulars, notices and ATels, and cites each one.</Note>
    </Panel>
  );
}

const Panel = styled.form`
  margin-top: 12px; padding: 14px 16px; border: 1px solid var(--line-subtle); background: var(--surface-raised);
  display: flex; flex-direction: column; gap: 10px;
`;
const Head = styled.div`font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted);`;
const Note = styled.p`margin: 0; font-size: 12px; color: var(--text-muted);`;
const Row = styled.div`display: flex; gap: 8px; @media (max-width: 560px) { flex-direction: column; }`;
const Input = styled.input`
  flex: 1; min-width: 0; padding: 9px 12px; font-family: var(--font-prose); font-size: 15px;
  color: var(--foreground); background: var(--surface-sunken); border: 1px solid var(--line-control);
  &:focus { outline: none; border-color: var(--primary); }
`;
const Button = styled.button`
  padding: 9px 16px; font-family: var(--font-mono); font-size: 13px; cursor: pointer;
  color: var(--primary-foreground); background: var(--primary); border: 1px solid var(--primary);
  &:hover { filter: brightness(1.1); }
`;
const Chips = styled.div`display: flex; flex-wrap: wrap; gap: 6px;`;
const Chip = styled.button`
  padding: 5px 10px; font-family: var(--font-prose); font-size: 13px; cursor: pointer; text-align: left;
  color: var(--text-secondary); background: none; border: 1px solid var(--line-subtle);
  &:hover { color: var(--foreground); border-color: var(--line-hover); }
`;

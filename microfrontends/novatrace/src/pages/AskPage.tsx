import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useAuth, useClerk } from '@clerk/react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Navbar } from '@novatrace/components/Navbar';
import AskSummary from '@novatrace/components/AskSummary';
import AskSources from '@novatrace/components/AskSources';
import { EventsInvolved, FactSheet } from '@novatrace/components/AskContext';
import { saveReturnUrl } from '@shared/lib/auth';
import {
  type AnswerSentence, type AskEvent, type AskEventFacts, type AskKind, type AskSource, type AskStep,
  EXAMPLE_QUESTIONS, anonAskedCount, anonId, noteAnonAsked, sendFeedback, streamAsk,
} from '@novatrace/lib/askCosmos';
import * as S from '@novatrace/styled_pages/AskPage.styled';

/* Ask Cosmos: the question box and its answer page. Replaces the old keyword event search at
 * /novatrace/search (the question lives in ?q=). Requirements: NovaTrace
 * docs/search/ask-cosmos-requirements.md; design: Claude Design direction 1a. */

const STEPS: { step: AskStep; label: string }[] = [
  { step: 'understanding', label: 'Understanding your question…' },
  { step: 'searching', label: 'Searching circulars…' },
  { step: 'found', label: 'Ranking sources…' },
  { step: 'writing', label: 'Writing summary…' },
  { step: 'checking', label: 'Checking citations…' },
];

interface State {
  phase: 'idle' | 'working' | 'done' | 'limited' | 'error';
  steps: Partial<Record<AskStep, string>>;
  sources: AskSource[] | null;
  degraded: boolean;
  event: AskEventFacts | null;
  events: (AskEventFacts & { sources: number })[] | null;
  draft: { text: string; cites: string[] }[];
  answer: AnswerSentence[] | null;
  kind: AskKind | null;
  message: string | null;
  searchId: string | null;
  check: { sentences: number; circulars: number } | null;
  ms: number | null;
  // The answer on screen before this question, restored if the server refuses it (limits).
  prev?: State;
}

const EMPTY: State = {
  phase: 'idle', steps: {}, sources: null, degraded: false, event: null, events: null, draft: [],
  answer: null, kind: null, message: null, searchId: null, check: null, ms: null,
};

type Action = { type: 'start' } | { type: 'event'; e: AskEvent };

function reduce(s: State, a: Action): State {
  if (a.type === 'start') return { ...EMPTY, phase: 'working', prev: s.phase === 'done' ? { ...s, prev: undefined } : undefined };
  const e = a.e;
  switch (e.type) {
    case 'status': return { ...s, steps: { ...s.steps, [e.step]: e.text } };
    case 'sources': return { ...s, sources: e.sources, degraded: e.degraded };
    case 'context': return e.mode === 'event' ? { ...s, event: e.event } : { ...s, events: e.events };
    case 'text': {
      const draft = [...s.draft];
      draft[e.block] = { text: (draft[e.block]?.text ?? '') + e.text, cites: draft[e.block]?.cites ?? [] };
      return { ...s, draft };
    }
    case 'citation': {
      const draft = [...s.draft];
      const b = draft[e.block] ?? { text: '', cites: [] };
      draft[e.block] = { ...b, cites: b.cites.includes(e.key) ? b.cites : [...b.cites, e.key] };
      return { ...s, draft };
    }
    case 'done': return {
      ...s, phase: 'done', kind: e.kind, message: e.message ?? null, searchId: e.searchId,
      answer: e.answer, check: e.check, ms: e.ms,
    };
    // Refused before answering: put the previous answer back (the gate says it stays).
    case 'limited': return s.prev ? { ...s.prev, prev: undefined } : { ...s, phase: 'limited', kind: 'limited', message: e.message };
    case 'error': return { ...s, phase: 'error', kind: 'error', message: e.message };
  }
}

function readQuery(): { q: string; mock: string | null } {
  const p = new URLSearchParams(window.location.search);
  return { q: p.get('q') ?? '', mock: import.meta.env.DEV ? p.get('mock') : null };
}

export default function AskPage() {
  const { getToken, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const initial = useMemo(readQuery, []);
  const [input, setInput] = useState(initial.q);
  const [asked, setAsked] = useState(initial.q);
  const [state, dispatch] = useReducer(reduce, EMPTY);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [gate, setGate] = useState<string | null>(null);
  const [tab, setTab] = useState<'answer' | 'sources' | 'events'>('answer');
  const abort = useRef<AbortController | null>(null);

  const run = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q) return;
    // One free question per browser; the backend enforces it too, this just avoids a round trip.
    if (!isSignedIn && !initial.mock && anonAskedCount() >= 1 && state.phase !== 'idle') {
      setGate(q);
      return;
    }
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setAsked(q);
    setTab('answer');
    const url = new URL(window.location.href);
    url.searchParams.set('q', q);
    window.history.replaceState(null, '', url);
    dispatch({ type: 'start' });
    const token = isSignedIn ? await getToken() : null;
    try {
      await streamAsk(q, { token, anonId: isSignedIn ? null : anonId(), signal: controller.signal, mock: initial.mock },
        (e) => {
          if (e.type === 'limited' && e.reason === 'sign_in') setGate(q);
          dispatch({ type: 'event', e });
        });
      if (!isSignedIn && !initial.mock) noteAnonAsked();
    } catch (err) {
      if (!controller.signal.aborted) dispatch({ type: 'event', e: { type: 'error', message: 'Cosmos could not answer right now. Please try again.' } });
    }
  }, [getToken, isSignedIn, initial.mock, state.phase]);

  useEffect(() => {
    if (initial.q) run(initial.q);
    return () => abort.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sourcesByKey = useMemo(
    () => Object.fromEntries((state.sources ?? []).map((s) => [s.key, s])), [state.sources]);
  const eventCount = new Set((state.sources ?? []).map((s) => s.event).filter(Boolean)).size;
  const countText = state.sources ? `${state.sources.length} circulars · ${eventCount} event${eventCount === 1 ? '' : 's'}` : '';

  const submit = (e: React.FormEvent) => { e.preventDefault(); run(input); };
  const signIn = () => { saveReturnUrl(); openSignIn({ forceRedirectUrl: window.location.href }); };

  if (state.phase === 'idle' && !asked) {
    return (
      <S.AskPageRoot>
        <Navbar />
        <S.Idle>
          <S.IdleTitle>Ask Cosmos</S.IdleTitle>
          <S.IdleNote>Gamma-ray bursts, gravitational-wave events, neutrino alerts and X-ray transients.</S.IdleNote>
          <AskBar value={input} onChange={setInput} onSubmit={submit} large autoFocus />
          <S.SectionLabel>Try asking</S.SectionLabel>
          <S.Chips>
            {EXAMPLE_QUESTIONS.map((x) => (
              <S.ExampleChip key={x.q} onClick={() => { setInput(x.q); run(x.q); }}>
                {x.q}<S.KindTag>{x.kind}</S.KindTag>
              </S.ExampleChip>
            ))}
          </S.Chips>
          <S.IdleNote>Covers 45,000 GCN Circulars (1997 to today) and recent ATels. Answers cite every circular they use.</S.IdleNote>
        </S.Idle>
      </S.AskPageRoot>
    );
  }

  const working = state.phase === 'working';
  const outOfScope = state.phase === 'done' && (state.kind === 'out_of_scope' || (state.sources?.length ?? 0) === 0);
  const badge = state.event ? `Event question → ${state.event.name.replace(/^LIGO\/Virgo\/KAGRA /, '')}`
    : state.phase === 'done' && !outOfScope ? 'Topic question' : null;

  return (
    <S.AskPageRoot>
      <Navbar />
      <S.QuestionHeader>
        <AskBar value={input} onChange={setInput} onSubmit={submit} disabled={working} />
        <S.MetaRow>
          {badge && <S.Badge>{badge}</S.Badge>}
          {state.check && state.ms != null && (state.sources?.length ?? 0) > 0 && (
            <span>{countText} · {state.check.circulars} cited · {(state.ms / 1000).toFixed(1)} s</span>
          )}
        </S.MetaRow>
      </S.QuestionHeader>

      {!outOfScope && state.phase !== 'limited' && (
        <S.MobileTabs role="tablist">
          <S.MobileTab $active={tab === 'answer'} onClick={() => setTab('answer')}>Answer</S.MobileTab>
          <S.MobileTab $active={tab === 'sources'} onClick={() => setTab('sources')}>Sources {state.sources?.length ?? ''}</S.MobileTab>
          {(state.event || state.events?.length) && (
            <S.MobileTab $active={tab === 'events'} onClick={() => setTab('events')}>Events {state.event ? 1 : state.events?.length}</S.MobileTab>
          )}
        </S.MobileTabs>
      )}

      <S.Body>
        <S.AnswerColumn>
          {state.degraded && (
            <S.Notice $tone="warn">
              Semantic search is unavailable right now. Showing keyword and exact-name matches only, so circulars that
              use different words may be missing.
              <S.SmallButton onClick={() => run(asked)} style={{ marginLeft: 'auto' }}>Retry</S.SmallButton>
            </S.Notice>
          )}

          {(state.phase === 'error' || (state.phase === 'limited' && !gate)) && (
            <S.Notice $tone="warn">{state.message}</S.Notice>
          )}

          {outOfScope ? (
            <OutOfScope message={state.message} onAsk={(q) => { setInput(q); run(q); }} />
          ) : state.phase !== 'error' && state.phase !== 'limited' && (
            <S.MobileOnly $show={tab === 'answer'}>
              <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <S.SectionHead>
                  <S.SectionLabel>Summary</S.SectionLabel>
                  {state.check ? (
                    <S.CheckedLine>Citations checked · {state.check.sentences} sentences · {state.check.circulars} circulars</S.CheckedLine>
                  ) : state.steps.writing ? <S.CheckedLine>Writing…</S.CheckedLine> : null}
                </S.SectionHead>
                {state.draft.length === 0 && !state.answer ? (
                  <WorkingSteps steps={state.steps} done={state.phase === 'done'} />
                ) : (
                  <AskSummary draft={state.draft} answer={state.answer} sources={sourcesByKey}
                    hoverKey={hoverKey} onHover={setHoverKey} />
                )}
                {state.draft.length > 0 && working && <WorkingSteps steps={state.steps} done={false} compact />}
              </section>

              {state.phase === 'done' && state.searchId && (
                <Feedback searchId={state.searchId} getToken={() => (isSignedIn ? getToken() : Promise.resolve(null))} />
              )}
              {state.phase === 'done' && (
                <S.SectionNote>Every sentence cites its circulars. Uncited sentences are not shown.</S.SectionNote>
              )}
            </S.MobileOnly>
          )}

          {!outOfScope && state.phase !== 'error' && state.phase !== 'limited' && (state.event || state.events) && (
            // Below the summary on desktop; on mobile, shown on both the Answer and Events tabs.
            <S.MobileOnly $show={tab === 'answer' || tab === 'events'}>
              {state.event && <FactSheet event={state.event} />}
              {!state.event && state.events && <EventsInvolved events={state.events} />}
            </S.MobileOnly>
          )}
        </S.AnswerColumn>

        {!outOfScope && state.phase !== 'error' && state.phase !== 'limited' && (
          <S.Rail $hiddenOnMobile={tab !== 'sources'}>
            <AskSources sources={state.sources} countText={countText} hoverKey={hoverKey} onHover={setHoverKey} />
          </S.Rail>
        )}
      </S.Body>

      {gate && (
        <S.GateBackdrop role="dialog" aria-modal="true" aria-labelledby="gate-title">
          <S.GateCard>
            <S.SectionLabel id="gate-title">Sign in to ask another question</S.SectionLabel>
            <S.SectionNote style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Your first question is free. Sign in to ask about “{gate}”. Your current answer stays on this page.
            </S.SectionNote>
            <S.AskButton onClick={signIn}>Sign in</S.AskButton>
            <S.SectionNote>Questions are logged to improve search. <S.Link href="/privacy">Privacy</S.Link></S.SectionNote>
            <S.SmallButton onClick={() => setGate(null)}>Not now</S.SmallButton>
          </S.GateCard>
        </S.GateBackdrop>
      )}
    </S.AskPageRoot>
  );
}

function AskBar({ value, onChange, onSubmit, disabled, large, autoFocus }: {
  value: string; onChange: (v: string) => void; onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean; large?: boolean; autoFocus?: boolean;
}) {
  return (
    <S.AskForm $large={large} onSubmit={onSubmit} role="search">
      <S.AskInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="Ask Cosmos"
        aria-label="Ask Cosmos a question" autoFocus={autoFocus} maxLength={500} />
      <S.AskButton type="submit" disabled={disabled || !value.trim()}>Ask</S.AskButton>
    </S.AskForm>
  );
}

function WorkingSteps({ steps, done, compact }: { steps: Partial<Record<AskStep, string>>; done: boolean; compact?: boolean }) {
  const reached = STEPS.filter((s) => steps[s.step]).length;
  const list = compact ? STEPS.filter((s) => s.step === 'writing' || s.step === 'checking') : STEPS;
  return (
    <S.Steps aria-live="polite">
      {list.map((s) => {
        const i = STEPS.indexOf(s);
        const state = done || i < reached - 1 ? 'done' : i === reached - 1 ? 'active' : 'pending';
        return (
          <S.Step key={s.step} $state={state}>
            <S.StepDot $state={state} />{steps[s.step] ?? s.label}
          </S.Step>
        );
      })}
    </S.Steps>
  );
}

function OutOfScope({ message, onAsk }: { message: string | null; onAsk: (q: string) => void }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: '78ch' }}>
      <S.SectionLabel>No matching circulars · no summary generated</S.SectionLabel>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--text-body)' }}>
        {message ?? 'Cosmos covers GCN Circulars (1997 to today) and recent ATels, and found nothing for this question.'}
      </p>
      <S.Chips>
        {EXAMPLE_QUESTIONS.slice(0, 3).map((x) => (
          <S.ExampleChip key={x.q} onClick={() => onAsk(x.q)}>{x.q}</S.ExampleChip>
        ))}
      </S.Chips>
    </section>
  );
}

function Feedback({ searchId, getToken }: { searchId: string; getToken: () => Promise<string | null> }) {
  const [value, setValue] = useState<1 | -1 | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);
  const send = async (v: 1 | -1, text?: string) => {
    setValue(v);
    if (v === 1 || text !== undefined) {
      await sendFeedback(await getToken(), searchId, v, text || undefined);
      setSent(true);
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <S.FeedbackRow>
        Was this answer useful?
        <S.ThumbButton $on={value === 1} aria-label="Useful" onClick={() => send(1)} disabled={sent}><ThumbsUp size={14} /></S.ThumbButton>
        <S.ThumbButton $on={value === -1} aria-label="Not useful" onClick={() => setValue(-1)} disabled={sent}><ThumbsDown size={14} /></S.ThumbButton>
        {sent && <span>Thanks, noted.</span>}
      </S.FeedbackRow>
      {value === -1 && !sent && (
        <>
          <S.NoteBox placeholder="What was missing? (optional)" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
          <div style={{ display: 'flex', gap: 8 }}>
            <S.SmallButton $primary onClick={() => send(-1, note)}>Send</S.SmallButton>
            <S.SmallButton onClick={() => send(-1, '')}>Skip</S.SmallButton>
          </div>
        </>
      )}
    </div>
  );
}

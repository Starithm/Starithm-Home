import React, { useState, useEffect, useRef } from 'react';
import { useSignIn, useAuth, useClerk, UserButton } from '@clerk/react';
import { saveReturnUrl } from '../../../shared/lib/auth';
import { API_ENDPOINTS, ASK_ASSISTANT } from '../../../shared/lib/config';
import {
  Page, Wrap, Header, NavRow, Brand, NavLinks, NavButton,
  Section, Stack, Kicker, H2, Muted, LiveDot, PrimaryButton, GhostButton,
  Hero, HeroRow, HeroCopy, H1, Lede, AskForm, VisuallyHidden, Chips,
  CardSlot, EventCard, CardHead, CardStats, CardRows, CardRow, CardFoot,
  Ticker, TickerLabel, TickerTrack, TickerRun, TickerDot,
  Typed, Caret, Sub, Dots, DotBar, HeadRow,
  DeckRow, Deck, DeckCard, DeckTitle, DeckBody, DeckNav,
  Bars, BarRow, BarLabel, BarTrack, BarFill, BarValue,
  Flow, FlowNode, FlowLink,
  SplitRow, Providers, ErrorNote, FormCard, FormTitle, FakeField, FieldRow,
  Closing, Contact, Footer, FooterCols, line,
} from '../styled_components/HomepageV3.styled';

/* Homepage v3 (2026-11-12), built from the Claude Design canvas "Starithm homepage redesign"
   (docs/homepage-redesign-brief.md holds the facts it may state). Every number here is checked:
   the hero card is a real record and the accuracy figures are the published ones. */

/* Event-type colours mirror the legend the product paints (shared/components/ui/celestial-sphere.tsx). */
const TYPE_GRB = '#FF6B6B';
const TYPE_POSITION = '#4ECDC4';
const KIND_COLOR: Record<string, string> = { grb: TYPE_GRB, position: TYPE_POSITION, extracted: 'var(--accent-text)' };

const ASK_URL = '/novatrace/search';
const askHref = (q: string) => `${ASK_URL}?q=${encodeURIComponent(q)}`;
const ASK_EXAMPLES: [string, string][] = [
  ['Which telescopes observed S250818k?', 'Which telescopes observed S250818k?'],
  ['Kilonova candidates with a red near-infrared excess', 'Kilonova candidates, red NIR excess'],
];

/* GRB 260924A (canonical 811905208): times from its notices and circulars, checked 2026-11-12. */
const HERO_EVENT = { id: '811905208', name: 'GRB 260924A', redshift: '3.51', circulars: 29, notices: 10 };
const HERO_ROWS: [string, string, string][] = [
  ['T+4.4s', 'Fermi GBM notice', 'grb'],
  ['T+28m', 'GCN 45713 · Swift detection', 'grb'],
  ['T+4.0h', 'GCN 45715 · Swift-XRT position', 'position'],
  ['T+6.0h', 'GCN 45717 · optical afterglow, OSN 1.5 m', 'extracted'],
  ['T+1.3d', 'GCN 45740 · z = 3.51, CAHA 2.2 m', 'extracted'],
];

const SLIDES = [
  { text: 'GCN delivers, then forgets.', sub: 'The notice is broadcast. Nothing links it to what came after.' },
  { text: 'Brokers filter, then forget.', sub: 'Volume is reduced. History is not retained.' },
  { text: 'Observatories publish later.', sub: 'The measurement lands in circular text, unlinked and unstructured.' },
  { text: 'Starithm keeps the record.', sub: 'One page per event. Every value linked to the circular it came from.' },
];

const STEPS: [string, string, string][] = [
  ['01', 'Ingest', 'GCN Kafka and circulars, continuously.'],
  ['02', 'Normalise', 'One notice type for every instrument.'],
  ['03', 'Extract', 'Values read out of circular text.'],
  ['04', 'Cross-match', 'Position, time, false-alarm check.'],
  ['05', 'Publish', 'One event page, updated live.'],
];

/* What it does, dealt as a deck. Each claim is live and backed (docs/homepage-redesign-brief.md). */
const FEATURES: { label: string; color: string; title: string; body: string; href?: string; cta?: string; feature?: boolean }[] = [
  { label: ASK_ASSISTANT.toUpperCase(), color: 'var(--accent-text)', feature: true, href: ASK_URL, cta: 'Try it →',
    title: 'Ask in plain English. Every sentence cites a circular.',
    body: 'Answers from about 45,000 GCN Circulars since 1997, recent ATels and GCN notices, each sentence linked to the circular it came from.' },
  { label: 'EVENT PAGES', color: 'var(--starithm-nebula-teal)', href: '/novatrace/events', cta: 'Browse events →',
    title: 'One page per event.',
    body: 'Notices timeline, circulars, best position, key facts, every reported observation, a sky map of the error region and a citation.' },
  { label: 'VALUES AS DATA', color: 'var(--starithm-golden-yellow)',
    title: 'A source on every value.',
    body: 'Magnitudes, upper limits, fluxes, fluences, T90 and redshifts read out of the circular text, each quoting the sentence it came from.' },
  { label: 'COUNTERPARTS', color: TYPE_GRB,
    title: 'Matched by time and position.',
    body: 'Related events with a false-alarm check, optical candidates from Lasair, TNS and Fink, known catalogue sources in the error region, and X-ray light curves.' },
  { label: 'LIVE', color: 'var(--starithm-nebula-teal)',
    title: 'New circulars appear within minutes.',
    body: 'Fermi, Swift, Einstein Probe, SVOM, LIGO/Virgo/KAGRA, IceCube, CHIME, MAXI and more, in one schema, updated as notices and circulars arrive.' },
];

/* Accuracy against independent catalogues (blog: how-accurate-is-starithm-extraction, 2026-11-12). */
const ACCURACY: { label: string; note: string; value: number; muted?: boolean }[] = [
  { label: 'Redshift', note: 'vs GRBweb · 327 of 346 bursts · Δz ≤ 0.01', value: 94.5 },
  { label: 'T90', note: 'Swift-BAT vs the Swift GRB table · within 10%', value: 92.2 },
  { label: 'Fluence', note: 'Swift-BAT vs the Swift GRB table · within 10%', value: 94.5 },
  { label: 'Redshift shown on the event page', note: 'telling a burst’s redshift from a host’s or a limit: work in progress', value: 86.0, muted: true },
];

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* A counter that ticks every `ms` unless motion is reduced; each animated block owns one so the
   rest of the page doesn't re-render with it. */
function useTick(ms: number, paused = false) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (paused || reducedMotion()) return;
    const id = setInterval(() => setT(x => x + 1), ms);
    return () => clearInterval(id);
  }, [ms, paused]);
  return t;
}

function AskBox({ id, placeholder, icon }: { id: string; placeholder: string; icon?: boolean }) {
  const [q, setQ] = useState('');
  return (
    <AskForm onSubmit={e => { e.preventDefault(); window.location.href = q.trim() ? askHref(q.trim()) : ASK_URL; }}>
      {icon && (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
      )}
      <VisuallyHidden htmlFor={id}>{ASK_ASSISTANT}</VisuallyHidden>
      <input id={id} type="text" value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder} />
      <button type="submit">Ask</button>
    </AskForm>
  );
}

function HeroCard() {
  const t = useTick(1800);
  const active = t % HERO_ROWS.length;
  return (
    <EventCard href={`/novatrace/events/${HERO_EVENT.id}`} aria-label={`Open the ${HERO_EVENT.name} event page`}>
      <CardHead>
        <span><LiveDot $size={7} $still />{HERO_EVENT.name}</span>
        <span>● SIGNIFICANCE HIGH</span>
      </CardHead>
      <CardStats>
        <div><small>REDSHIFT</small><strong>{HERO_EVENT.redshift}</strong></div>
        <div><small>CIRCULARS</small><strong>{HERO_EVENT.circulars}</strong></div>
        <div><small>NOTICES</small><strong>{HERO_EVENT.notices}</strong></div>
      </CardStats>
      <CardRows>
        {HERO_ROWS.map(([time, what, kind], i) => (
          <CardRow key={time} $active={i === active}>
            <span>{time}</span><span>{what}</span><span style={{ color: KIND_COLOR[kind] }}>{kind}</span>
          </CardRow>
        ))}
      </CardRows>
      <CardFoot><span>Model-extracted · each value links to its circular</span><span>Open →</span></CardFoot>
    </EventCard>
  );
}

/* The newest circulars, live from NovaTrace (/api/public/latest). Nothing is shown until they load,
   and nothing if they don't: a "just in" strip must never show stale or sample rows. */
interface Latest { alertKey: string; label: string; event: string; canonicalId: string | null; date: string; what: string }
const eventColor = (name: string) =>
  /^GRB|^sb\d/i.test(name) ? TYPE_GRB : /^EP|^IceCube|^S\d{6}/.test(name) ? TYPE_POSITION : 'var(--accent-text)';
const ago = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
  return m < 60 ? `${m} min ago` : m < 48 * 60 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
};

function JustIn() {
  const [items, setItems] = useState<Latest[] | null>(null);
  useEffect(() => {
    let off = false;
    const load = async () => {
      try {
        const r = await fetch(API_ENDPOINTS.publicLatest);
        if (r.ok) return (await r.json()) as Latest[];
        // Until the endpoint is deployed, the dev server reads the heavy /api/alerts instead.
        if (!import.meta.env.DEV) return null;
        const all = await (await fetch(`${API_ENDPOINTS.alerts}?limit=12`)).json();
        return all.map((a: any) => {
          const subject = (String(a.data?.raw ?? '').match(/^SUBJECT:\s*(.+)$/m)?.[1] ?? '').trim();
          return { alertKey: a.alertKey, label: String(a.alertKey).replace(/^GCN-/, 'GCN '), event: a.event,
            canonicalId: a.canonicalId, date: a.date, what: subject.includes(':') ? subject.slice(subject.indexOf(':') + 1).trim() : subject };
        });
      } catch { return null; }
    };
    load().then(x => { if (!off && x?.length) setItems(x); });
    return () => { off = true; };
  }, []);
  if (!items) return null;
  /* Old rows can hold a circular's subject as their "event" ("The EP-WXT trigger … is likely a flare");
     a name is at most 3 words and 40 characters (NovaTrace normaliser isSpecificEventName). */
  const named = (e: string) => (e && e.length <= 40 && e.trim().split(/\s+/).length <= 3 ? e : '');
  const run = items.map(k => (
    <a key={k.alertKey} href={k.canonicalId ? `/novatrace/events/${encodeURIComponent(k.canonicalId)}` : '/novatrace/events'}>
      <TickerDot $color={eventColor(k.event)} />
      {named(k.event) && <span style={{ color: line(0.6) }}>{named(k.event)}</span>}
      <span>{k.label} · {k.what}</span>
      <span style={{ color: line(0.45) }}>{ago(k.date)}</span>
    </a>
  ));
  return (
    <Ticker aria-label="Latest circulars">
      <TickerLabel href="/novatrace/events"><LiveDot $size={6} />JUST IN</TickerLabel>
      <TickerTrack>
        <TickerRun $seconds={Math.max(40, items.length * 7)}>{run}<span aria-hidden="true" style={{ display: 'contents' }}>{run}</span></TickerRun>
      </TickerTrack>
    </Ticker>
  );
}

function ProblemCarousel() {
  const [slide, setSlide] = useState(0);
  const [chars, setChars] = useState(reducedMotion() ? 999 : 0);
  const [paused, setPaused] = useState(false);
  const hold = useRef(0);
  const t = useTick(50, paused);
  useEffect(() => {
    if (t === 0) return;
    const len = SLIDES[slide].text.length;
    if (chars < len) setChars(c => c + 1);
    else if (hold.current < 60) hold.current += 1;
    else { hold.current = 0; setSlide(s => (s + 1) % SLIDES.length); setChars(0); }
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = SLIDES[slide];
  const done = chars >= s.text.length;
  return (
    <Section $alt aria-roledescription="carousel" aria-label="The problem">
      <Wrap>
        <Stack>
          <Stack $gap={19} style={{ minHeight: 211, justifyContent: 'center' }}>
            <Typed $accent={slide === SLIDES.length - 1} aria-live="polite">
              {s.text.slice(0, chars)}<Caret aria-hidden="true">|</Caret>
            </Typed>
            {done && <Sub key={slide}>{s.sub}</Sub>}
          </Stack>
          <Dots>
            {SLIDES.map((x, i) => (
              <button key={x.text} type="button" className="dot" aria-label={`Show slide ${i + 1}`}
                onClick={() => { setSlide(i); setChars(paused || reducedMotion() ? 999 : 0); hold.current = 0; }}>
                <DotBar $on={i === slide} />
              </button>
            ))}
            <button type="button" className="pause" aria-label={paused ? 'Play carousel' : 'Pause carousel'}
              onClick={() => { setPaused(p => !p); setChars(999); }}>
              {paused ? '▶' : '❚❚'}
            </button>
          </Dots>
        </Stack>
      </Wrap>
    </Section>
  );
}

function FlowChart() {
  const t = useTick(1600);
  return (
    <Flow aria-label="How it works">
      {STEPS.map(([n, name, desc], i) => (
        <React.Fragment key={n}>
          {i > 0 && <FlowLink aria-hidden="true"><i /><i /><i /></FlowLink>}
          <FlowNode $on={!reducedMotion() && i === t % STEPS.length}>
            <small>{n}</small><strong>{name}</strong><span>{desc}</span>
          </FlowNode>
        </React.Fragment>
      ))}
    </Flow>
  );
}

function FeatureDeck() {
  const [top, setTop] = useState(0);
  const [hold, setHold] = useState(false);
  const t = useTick(4500, hold);
  useEffect(() => { if (t > 0) setTop(x => (x + 1) % FEATURES.length); }, [t]);
  const n = FEATURES.length;
  const go = (i: number) => setTop(((i % n) + n) % n);
  return (
    <DeckRow>
      <Stack $gap={18}>
        <H2>One page per event. A source on every value.</H2>
        <Muted $size={15} style={{ maxWidth: 440 }}>
          Every notice and circular about an event, read, linked and kept in one record you can search, open and cite.
        </Muted>
        <DeckNav>
          <button type="button" className="arrow" aria-label="Previous feature" onClick={() => go(top - 1)}>←</button>
          {FEATURES.map((f, i) => (
            <button key={f.label} type="button" className="dot" aria-label={`Show ${f.label.toLowerCase()}`} onClick={() => go(i)}>
              <DotBar $on={i === top} />
            </button>
          ))}
          <button type="button" className="arrow" aria-label="Next feature" onClick={() => go(top + 1)}>→</button>
        </DeckNav>
      </Stack>
      <Deck onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}
        aria-roledescription="carousel" aria-label="What it does">
        {FEATURES.map((f, i) => {
          const pos = (i - top + n) % n;
          return (
            <DeckCard key={f.label} as={f.href ? 'a' : 'div'} href={f.href} $pos={pos} $out={pos === n - 1} $feature={f.feature}
              aria-hidden={pos !== 0} tabIndex={pos === 0 ? 0 : -1}>
              <Stack $gap={12}>
                <Kicker $color={f.color}>{f.label}</Kicker>
                <DeckTitle>{f.title}</DeckTitle>
              </Stack>
              <Stack $gap={14}>
                <DeckBody>{f.body}</DeckBody>
                {f.cta && <Muted $size={13} style={{ color: 'var(--accent-text)' }}>{f.cta}</Muted>}
              </Stack>
            </DeckCard>
          );
        })}
      </Deck>
    </DeckRow>
  );
}

/* Bars fill to their value, and the number counts up, once the block scrolls into view. */
function AccuracyBars() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(reducedMotion());
  const [k, setK] = useState(reducedMotion() ? 1 : 0);
  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === 'undefined') { setShown(true); setK(1); return; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setShown(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  useEffect(() => {
    if (!shown || k >= 1) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => { const x = Math.min(1, (now - start) / 1600); setK(1 - (1 - x) ** 3); if (x < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Bars ref={ref}>
      {ACCURACY.map(a => (
        <BarRow key={a.label}>
          <BarLabel>{a.label}<small>{a.note}</small></BarLabel>
          <BarTrack><BarFill $pct={shown ? a.value : 0} $muted={a.muted} /></BarTrack>
          <BarValue $muted={a.muted}>{(a.value * k).toFixed(1)}%</BarValue>
        </BarRow>
      ))}
    </Bars>
  );
}

/* Clerk OAuth strategies — these three are what the privacy policy documents and
   what the Clerk instance is configured for. LinkedIn is the OIDC variant on v6. */
const PROVIDERS = [
  {
    id: 'oauth_github',
    label: 'GitHub',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    ),
  },
  {
    id: 'oauth_google',
    label: 'Google',
    icon: (
      <svg width="15" height="15" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z" />
        <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
      </svg>
    ),
  },
  {
    id: 'oauth_linkedin_oidc',
    label: 'LinkedIn',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#0A66C2" aria-hidden="true">
        <path d="M13.63 13.63h-2.37V9.92c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.97v3.77H6.22V6h2.28v1.04h.03c.32-.6 1.09-1.24 2.25-1.24 2.4 0 2.85 1.58 2.85 3.64v4.19ZM3.55 4.96a1.38 1.38 0 1 1 0-2.75 1.38 1.38 0 0 1 0 2.75Zm1.19 8.67H2.36V6h2.38v7.63ZM14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0Z" />
      </svg>
    ),
  },
];
export function Homepage() {
  const { signIn } = useSignIn();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [busy, setBusy] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const openModal = () => {
    saveReturnUrl();
    openSignIn({ forceRedirectUrl: window.location.href });
  };

  /* Provider-specific OAuth via Clerk's SSO flow.
     `redirectUrl` is where the user lands once SSO completes; `redirectCallbackUrl`
     is the intermediate route Clerk returns to when the session needs more
     information, and is handled by <AuthenticateWithRedirectCallback /> registered
     at /sso-callback in src/App.tsx — without that route the flow dead-ends.
     signIn.sso() resolves with { error } rather than throwing, so check both that
     and the catch, falling back to the standard modal (which lists every enabled
     provider) rather than stranding the user. */
  const signInWith = async (strategy: string) => {
    setAuthError(null);
    if (!signIn) {
      openModal();
      return;
    }
    saveReturnUrl();
    setBusy(strategy);
    try {
      const { error } = await signIn.sso({
        strategy: strategy as never,
        redirectUrl: window.location.href,
        redirectCallbackUrl: `${window.location.origin}/sso-callback`,
      });
      if (error) throw error;
    } catch {
      setBusy(null);
      setAuthError('Could not open that provider — showing all sign-in options instead.');
      openModal();
    }
  };

  return (
    <Page>
      <Header>
        <Wrap>
          <NavRow>
            <Brand href="/">
              <img src="/logo_without_name.png" alt="" width={23} height={23} />
              <span>STARITHM</span>
            </Brand>
            <NavLinks aria-label="Main">
              <a href="/novatrace/events" className="hide-sm">NovaTrace</a>
              <a href={ASK_URL}>{ASK_ASSISTANT}</a>
              <a href="/blog" className="hide-sm">Blog</a>
              <a href="/blog/roadmap" className="hide-sm">Roadmap</a>
              {isSignedIn ? <UserButton /> : <NavButton type="button" onClick={openModal}>Sign in</NavButton>}
            </NavLinks>
          </NavRow>
        </Wrap>
      </Header>

      <Hero>
        <Wrap>
          <HeroRow>
            <HeroCopy>
              <Stack $gap={16}>
                <Kicker>An operating system for observational astronomy</Kicker>
                <H1>Astronomy&rsquo;s <em>memory</em> layer.</H1>
                <Lede>
                  A transient is announced in seconds and understood over months. Starithm holds the whole
                  arc, machine notice &rarr; final measurement, as one structured record you can open, cite and follow.
                </Lede>
              </Stack>
              <Stack $gap={12} style={{ maxWidth: 563 }}>
                <AskBox id="ask" icon placeholder={`${ASK_ASSISTANT}: what redshift was measured for GRB 221009A?`} />
                <Chips>{ASK_EXAMPLES.map(([q, label]) => <a key={q} href={askHref(q)}>{label}</a>)}</Chips>
              </Stack>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <PrimaryButton href="/novatrace/events">Open NovaTrace <span aria-hidden="true">→</span></PrimaryButton>
                {!isSignedIn && <GhostButton href="#signin">Join early</GhostButton>}
              </div>
              <Muted $size={11} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <LiveDot />Live · new circulars are read within minutes of publication
              </Muted>
            </HeroCopy>
            <CardSlot><HeroCard /></CardSlot>
          </HeroRow>
        </Wrap>
      </Hero>

      <JustIn />

      <ProblemCarousel />

      <Section>
        <Wrap>
          <FeatureDeck />
        </Wrap>
      </Section>

      <Section $alt>
        <Wrap>
          <Stack $gap={36}>
            <HeadRow>
              <H2>Measured, not claimed.</H2>
              <GhostButton href="/blog/how-accurate-is-starithm-extraction">How we measured →</GhostButton>
            </HeadRow>
            <AccuracyBars />
          </Stack>
        </Wrap>
      </Section>

      <Section>
        <Wrap>
          <Stack $gap={32}>
            <H2>From alert to event page.</H2>
            <FlowChart />
          </Stack>
        </Wrap>
      </Section>

      <Section $alt id="signin">
        <Wrap>
          <SplitRow>
            <Stack $gap={25}>
              <Kicker>Join early</Kicker>
              <H2 $size={36}>The record is being written now.</H2>
              <Muted $size={15} style={{ maxWidth: 440 }}>
                Every new event starts its page the moment the first notice lands. Sign in to add what you saw,
                or correct what we got wrong, while the record is still taking shape.
              </Muted>
              {isSignedIn ? (
                <Muted>You&rsquo;re signed in. Open any event to add an observation or a correction.</Muted>
              ) : (
                <>
                  <Providers>
                    {PROVIDERS.map(p => (
                      <button key={p.id} type="button" onClick={() => signInWith(p.id)} disabled={busy !== null}
                        aria-label={`Continue with ${p.label}`}>
                        {p.icon}{busy === p.id ? 'Redirecting…' : `Continue with ${p.label}`}
                      </button>
                    ))}
                  </Providers>
                  {authError && <ErrorNote role="alert" $color={TYPE_GRB}>{authError}</ErrorNote>}
                </>
              )}
              <Muted $size={11}>Read anything. Sign in to weigh in. Free.</Muted>
            </Stack>
            <div>
              <FormCard aria-hidden="true">
                <div><span>{HERO_EVENT.name}</span><span>Observations</span></div>
                <div>
                  <FormTitle>Add an observation or a correction</FormTitle>
                  <FieldRow><FakeField>Telescope</FakeField><FakeField>Filter · magnitude</FakeField></FieldRow>
                  <FakeField $tall>Source and a note</FakeField>
                  <PrimaryButton as="span" style={{ alignSelf: 'flex-end', minHeight: 42, padding: '0 18px', fontSize: 12 }}>Sign in to post</PrimaryButton>
                </div>
              </FormCard>
            </div>
          </SplitRow>
        </Wrap>
      </Section>

      <Closing>
        <Wrap $narrow>
          <H2 $size={36}>Start with a question.</H2>
          <AskBox id="ask2" placeholder="Which telescopes observed S250818k?" />
          <Contact>
            <Kicker>Built for astronomers</Kicker>
            <Muted $size={13}>
              Values are extracted by language models, and each links to its circular. Spot an error, or want to
              collaborate? We&rsquo;d like to hear from you.
            </Muted>
            <div>
              <GhostButton href="mailto:contact.starithm@gmail.com" aria-label="Email contact.starithm@gmail.com">Email</GhostButton>
              <GhostButton href="https://www.linkedin.com/company/starithm" target="_blank" rel="noopener noreferrer">LinkedIn</GhostButton>
            </div>
          </Contact>
        </Wrap>
      </Closing>

      <Footer>
        <Wrap>
          <Stack $gap={9}>
            <Brand href="/"><img src="/logo_without_name.png" alt="" width={19} height={19} /><span>STARITHM</span></Brand>
            <Muted $size={11}>Built on public GCN data. © {new Date().getFullYear()}</Muted>
          </Stack>
          <FooterCols>
            <div><span>Product</span><a href="/novatrace/events">NovaTrace</a><a href="/ears-to-the-universe">Ears to the Universe</a><a href="/novatrace/status">Status</a></div>
            <div><span>Writing</span><a href="/blog">Blog</a><a href="/blog/roadmap">Roadmap</a></div>
            <div>
              <span>Contact</span>
              <a href="mailto:contact.starithm@gmail.com">Email</a>
              {/* Platform names, not handles: @starithm_ai and @starithm.ai differ only by underscore vs dot. */}
              <a href="https://x.com/starithm_ai" target="_blank" rel="noopener noreferrer" aria-label="Starithm on X (@starithm_ai)">X</a>
              <a href="https://www.instagram.com/starithm.ai/" target="_blank" rel="noopener noreferrer" aria-label="Starithm on Instagram (@starithm.ai)">Instagram</a>
              <a href="/privacy">Privacy</a>
            </div>
          </FooterCols>
        </Wrap>
      </Footer>
    </Page>
  );
}

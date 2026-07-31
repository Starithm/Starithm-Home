import { useState, useEffect, useRef } from 'react';
import { useSignIn, useAuth, useClerk, UserButton } from '@clerk/react';
import { saveReturnUrl } from '../../../shared/lib/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../shared/components/ui/dialog';
import {
  Page, Shell, Section, Eyebrow,
  Nav, Brand, NavLinks, NavSignIn,
  HeroGrid, HeroKicker, HeroTitle, HeroLede, HeroActions, PrimaryCta, SecondaryCta, TextLink,
  EventCard, EventHead, EventId, Significance, EventBlurb, Timeline, TimelineRow, Tag, EventFoot,
  ProblemGrid, ProblemItem, ProblemKicker,
  FeatureGrid, FeatureCard, FeatureTitle, FeatureBody,
  StepGrid, StepRail, Step, StepNo, StepName, StepBody,
  SectionHeading, Shot, ShotHead, DisclosureGrid,
  SignInSection, SignInLede, ProviderGrid, ProviderButton, SignInNote, SignInError,
  Disclosure, FooterBar, FooterCols, FooterCol, FooterMark,
} from '../styled_components/HomepageV2.styled';

/* Event-type colours mirror the legend the product actually paints
   (shared/components/ui/celestial-sphere.tsx) so the marketing page and the
   real dashboard agree. */
const TYPE_GRB = '#FF6B6B';
const TYPE_POSITION = '#4ECDC4';
const VIOLET_D = 'var(--starithm-electric-violet-dark, #9A48FF)';

const PROBLEMS: [string, string][] = [
  ['GCN delivers, then forgets.', 'The notice is broadcast. Nothing links it to what came after.'],
  ['Brokers filter, then forget.', 'Volume is reduced. History is not retained.'],
  ['Observatories publish later.', 'The measurement lands in a PDF, unlinked and unstructured.'],
];

const FEATURES: [string, string][] = [
  ['One schema for every instrument',
   'Fermi, Swift, Einstein Probe, SVOM, LVK, IceCube, CHIME, DSA-110, MAXI, Super-K. JSON and VOEvent XML, one normalised notice type.'],
  ['Measurements pulled out of prose',
   'Circulars parsed for flux, fluence, T90, redshift, position, spectral fits, telescopes and observers — as fields, not paragraphs.'],
  ['Counterparts, proposed and shown',
   'Spatial and temporal matching with per-instrument error radii, a Bayesian false-alarm pre-filter, and a stated confidence on every group.'],
  ['A record that stays citable',
   'Conflicting reports are flagged rather than averaged. Versioned, so a citation still resolves to what the record said that day.'],
];

const STEPS: [string, string, string][] = [
  ['STEP 01', 'Ingest', 'Kafka consumer across GCN topics; circular inbox polled continuously.'],
  ['STEP 02', 'Normalise', 'Per-instrument mappers produce one canonical notice type.'],
  ['STEP 03', 'Extract', 'Measurements and entities read out of the circular text.'],
  ['STEP 04', 'Cross-match', 'Position, time, false-alarm probability, then verification.'],
  ['STEP 05', 'Publish', 'One event page, refreshed as new notices arrive.'],
];

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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  /* The demo clip sits well below the fold. Don't let it compete with the hero for
     bandwidth — only attach the <source> once it's near the viewport. Until then the
     poster (the screenshot) is all that has been fetched. */
  const demoRef = useRef<HTMLVideoElement>(null);
  const [demoVisible, setDemoVisible] = useState(false);

  useEffect(() => {
    const el = demoRef.current;
    if (!el || demoVisible) return;
    if (typeof IntersectionObserver === 'undefined') {
      setDemoVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setDemoVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [demoVisible]);

  /* Attaching <source> after mount doesn't restart the element on its own, and the
     autoplay attribute is only honoured on the initial load in some browsers — so
     kick playback off explicitly once the source is in. A rejected play() just means
     the browser declined autoplay; the poster stays up, which is the intended
     fallback. */
  useEffect(() => {
    if (!demoVisible) return;
    const el = demoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  }, [demoVisible]);

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
      <Shell>
        <Nav>
          <Brand href="/">
            <img src="/logo_without_name.png" alt="Starithm" width={32} height={32} />
            <span>STARITHM</span>
          </Brand>
          <NavLinks>
            <a href="/novatrace/events">NovaTrace</a>
            <a href="/blog">Blog</a>
            <a href="/blog/roadmap">Roadmap</a>
            {isSignedIn ? (
              <UserButton />
            ) : (
              <NavSignIn onClick={openModal}>Sign in</NavSignIn>
            )}
          </NavLinks>
        </Nav>

        <HeroGrid>
          <div>
            <HeroKicker>AN OPERATING SYSTEM FOR OBSERVATIONAL ASTRONOMY</HeroKicker>
            <HeroTitle>
              Astronomy&rsquo;s <em>memory</em> layer.
            </HeroTitle>
            <HeroLede>
              A transient is announced in seconds and understood over months. Starithm holds the
              whole arc, machine notice &rarr; final measurement, as one structured, versioned
              record you can open, cite and follow.
            </HeroLede>
            <HeroActions>
              <PrimaryCta href="/novatrace/events">Open a live event</PrimaryCta>
              {!isSignedIn && <SecondaryCta onClick={openModal}>Sign in</SecondaryCta>}
            </HeroActions>
          </div>

          <EventCard>
            <EventHead>
              <EventId>GRB 260411B</EventId>
              <Significance>
                <span />
                SIGNIFICANCE HIGH
              </Significance>
            </EventHead>
            <EventBlurb>
              Long GRB with a confirmed optical counterpart at z = 1.24, detected within 3 s by two
              instruments.
            </EventBlurb>
            <Timeline>
              <TimelineRow>
                <span>T+0.0s</span><span>Fermi GBM · notice</span><Tag $color={TYPE_GRB}>grb</Tag>
              </TimelineRow>
              <TimelineRow>
                <span>T+2.9s</span><span>Swift BAT GUANO · notice</span><Tag $color={TYPE_GRB}>grb</Tag>
              </TimelineRow>
              <TimelineRow $highlight>
                <span>T+18m</span><span>GCN 44312 · redshift z = 1.24</span><Tag $color={VIOLET_D}>extracted</Tag>
              </TimelineRow>
              <TimelineRow>
                <span>T+4.1h</span><span>GCN 44361 · BALROG localisation</span><Tag $color={TYPE_POSITION}>position</Tag>
              </TimelineRow>
              <TimelineRow>
                <span>T+2d</span><span>7 circulars · 3 telescopes</span><Tag $color={VIOLET_D}>discussed</Tag>
              </TimelineRow>
            </Timeline>
            <EventFoot>Summary is model-generated · every field links to its source</EventFoot>
          </EventCard>
        </HeroGrid>

        <Section>
          <Eyebrow>01 / THE PROBLEM</Eyebrow>
          <SectionHeading $left>Every system in this pipeline is amnesiac.</SectionHeading>
          <ProblemGrid>
            {PROBLEMS.map(([title, body]) => (
              <ProblemItem key={title}>
                <strong>{title}</strong>
                <div>{body}</div>
              </ProblemItem>
            ))}
          </ProblemGrid>
          <ProblemKicker>
            While others lose context, <em>Starithm keeps the record.</em>
          </ProblemKicker>
        </Section>

        <Section>
          <Eyebrow>02 / WHAT IT DOES</Eyebrow>
          <FeatureGrid>
            {FEATURES.map(([title, body]) => (
              <FeatureCard key={title}>
                <FeatureTitle>{title}</FeatureTitle>
                <FeatureBody>{body}</FeatureBody>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </Section>

        <Section>
          <Eyebrow>03 / HOW IT WORKS</Eyebrow>
          <SectionHeading $left>Alert to record, without a human in the loop.</SectionHeading>
          <StepRail />
          <StepGrid>
            {STEPS.map(([no, name, body], i) => {
              /* Publish is the terminal step — accented so the pipeline resolves. */
              const accent = i === STEPS.length - 1;
              return (
                <Step key={no} $accent={accent}>
                  <StepNo $accent={accent}>{no}</StepNo>
                  <StepName>{name}</StepName>
                  <StepBody $accent={accent}>{body}</StepBody>
                </Step>
              );
            })}
          </StepGrid>
        </Section>

        <Section>
          <ShotHead>
            <SectionHeading $left style={{ margin: 0 }}>See it on a real week of sky.</SectionHeading>
            <TextLink href="/novatrace/events">Open NovaTrace →</TextLink>
          </ShotHead>
          <Shot>
            {/* The poster is the screenshot, so this renders identically before the
                clip loads — and stays a still image if /novatrace-demo.mp4 is absent
                or the browser blocks autoplay. muted + playsInline are both required
                or mobile Safari/Chrome refuse to autoplay at all. */}
            <video
              poster="/novatrace-screenshot.png"
              width={1800}
              height={980}
              autoPlay
              muted
              loop
              playsInline
              preload={demoVisible ? 'auto' : 'none'}
              ref={demoRef}
              aria-label="NovaTrace events dashboard showing the sky map and an event detail panel"
            >
              {demoVisible && <source src="/novatrace-demo.mp4" type="video/mp4" />}
            </video>
          </Shot>
        </Section>
      </Shell>

      <SignInSection>
        <SectionHeading>Read anything. Sign in to weigh in.</SectionHeading>
        <SignInLede>
          The platform is open — no account, no waitlist. An account lets you join the discussion on
          any event, so the reasoning around a record lives beside the record itself.
        </SignInLede>
        {isSignedIn ? (
          <SignInNote>You&rsquo;re signed in — open any event to join the discussion.</SignInNote>
        ) : (
          <>
            <ProviderGrid>
              {PROVIDERS.map(p => (
                <ProviderButton
                  key={p.id}
                  type="button"
                  onClick={() => signInWith(p.id)}
                  disabled={busy !== null}
                  aria-label={`Sign in with ${p.label}`}
                >
                  {p.icon}
                  {busy === p.id ? 'Redirecting…' : p.label}
                </ProviderButton>
              ))}
            </ProviderGrid>
            {authError && <SignInError role="alert">{authError}</SignInError>}
            <SignInNote>Reading needs no account.</SignInNote>
          </>
        )}
      </SignInSection>

      <Shell>
        <Section>
          <DisclosureGrid>
            <Eyebrow $accent>HOW TO READ THIS</Eyebrow>
            <Disclosure>
            Event summaries, extracted measurements and cross-match groups are produced by language
            models and labelled as such throughout the product. They have not been reviewed by
            professional astronomers. Treat them as a navigational index into the primary sources —
            every field links back to the notice or circular it came from. Known limitations are
              described on the <TextLink href="/blog/roadmap">roadmap</TextLink>.
            </Disclosure>
          </DisclosureGrid>
        </Section>

        <FooterBar>
          <FooterCols>
            <FooterCol>
              <span>Product</span>
              <a href="/novatrace/events">NovaTrace</a>
              <a href="/novatrace/status">Status</a>
            </FooterCol>
            <FooterCol>
              <span>Writing</span>
              <a href="/blog">Blog</a>
              <a href="/blog/roadmap">Roadmap</a>
            </FooterCol>
            <FooterCol>
              <span>Contact</span>
              <button type="button" onClick={() => setIsContactDialogOpen(true)}>Contact us</button>
              <a href="https://x.com/starithm_ai" target="_blank" rel="noopener noreferrer">@starithm_ai</a>
              <a href="/privacy">Privacy</a>
            </FooterCol>
          </FooterCols>
          <FooterMark>
            <div>STARITHM</div>
            <div>Built on public GCN data. © {new Date().getFullYear()}</div>
          </FooterMark>
        </FooterBar>
      </Shell>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-starithm-electric-violet">Contact Us</DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 14 }}>
            <a href="mailto:contact.starithm@gmail.com">contact.starithm@gmail.com</a>
          </p>
        </DialogContent>
      </Dialog>
    </Page>
  );
}

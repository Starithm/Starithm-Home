// /outreach: Starithm's projects for a general audience, linked from the homepage footer in place of
// Ears to the Universe (decided 2026-11-16, layout "two equal cards"). Each project gets one card;
// films appear under the cards once FILMS lists them (YouTube ids), so adding one is a data change.
import React, { useEffect } from 'react';
import styled from 'styled-components';

interface Project {
  when: string; title: string; text: string; img: string; imgAlt: string;
  links: [string, string][]; credit?: string;
}

const PROJECTS: Project[] = [
  {
    when: '18 November 2026',
    title: 'Voyager 1 · One light-day',
    text: 'Voyager 1 becomes the first spacecraft one light-day from Earth: its signal, travelling at the speed of light, takes a full day to reach us. A live page follows the crossing, and the films we made with the NYUAD Space Art Lab for Leonardo Barilaro\'s concert tell its story.',
    img: '/voyager/voyager-1-pia17049.jpg',
    imgAlt: 'Artist\'s view of Voyager 1 among the stars (NASA/JPL-Caltech)',
    links: [['Follow it live', '/voyager-1']],
    credit: 'With the NYUAD Space Art Lab',
  },
  {
    when: 'Every day',
    title: 'Ears to the Universe',
    text: 'Each day\'s observations from the sky, turned into music you can listen to.',
    img: '/og/ears-share.png',
    imgAlt: 'Ears to the Universe: the universe, as music',
    links: [['Listen', '/ears-to-the-universe']],
  },
];

/* Reels on @starithm.ai, picked from its analytics (2026-11-23): the most watched one, and three on the
   kinds of event Starithm tracks. Covers are each reel's own thumbnail, saved once into public/outreach/reels
   (Instagram's thumbnail URLs expire, and its embed loads Instagram's script on our page). */
const INSTAGRAM = 'https://www.instagram.com/starithm.ai/';
const REELS: { title: string; url: string; cover: string }[] = [
  { title: 'A message for the year 40,272', url: 'https://www.instagram.com/reel/Df4DqAoIXj6/', cover: '/outreach/reels/message-40272.jpg' },
  { title: 'The first gravitational waves, September 2015', url: 'https://www.instagram.com/reel/DfSCAe-Cjxq/', cover: '/outreach/reels/first-gravitational-waves.jpg' },
  { title: 'The flash that blinded our gamma-ray detectors', url: 'https://www.instagram.com/reel/DfPiWcWlUsx/', cover: '/outreach/reels/gamma-ray-flash.jpg' },
  { title: 'A neutrino, a flaring galaxy, and a clue in old data', url: 'https://www.instagram.com/reel/De_ErkHDv9r/', cover: '/outreach/reels/neutrino-flaring-galaxy.jpg' },
];

/* Films on YouTube, embedded without cookies. Empty until they are uploaded; until then the section
   shows COMING_SOON's posters (NASA images already in public/voyager). */
const FILMS: { title: string; youtubeId: string; note?: string }[] = [];
const COMING_SOON = {
  text: 'The two films we made with the NYUAD Space Art Lab for Leonardo Barilaro\'s Voyager concert.',
  posters: [
    ['/voyager/pale-blue-dot-pia23645.jpg', 'The Pale Blue Dot, Earth seen by Voyager 1 in 1990 (NASA/JPL-Caltech)'],
    ['/voyager/golden-record-pia14113.jpg', 'The Golden Record carried by Voyager 1 (NASA/JPL-Caltech)'],
  ],
};

export default function OutreachPage() {
  useEffect(() => { document.title = 'Outreach · Starithm'; }, []);
  return (
    <Page>
      <Eyebrow>Outreach</Eyebrow>
      <H1>The sky, for everyone</H1>
      <Lead>The data behind Starithm, made to be listened to and watched.</Lead>

      <Grid>
        {PROJECTS.map(p => (
          <Card key={p.title}>
            <Img src={p.img} alt={p.imgAlt} loading="lazy" />
            <Body>
              <Eyebrow>{p.when}</Eyebrow>
              <H2>{p.title}</H2>
              <P>{p.text}</P>
              {p.credit && <Credit>{p.credit}</Credit>}
              <Links>{p.links.map(([t, h]) => <a key={h} href={h}>{t} →</a>)}</Links>
            </Body>
          </Card>
        ))}
      </Grid>

      <section id="reels" style={{ marginTop: 40 }}>
        <Eyebrow>Reels</Eyebrow>
        <P style={{ marginTop: 8 }}>Short films about what the sky is doing, on Instagram.</P>
        <ReelGrid>
          {REELS.map(r => (
            <Reel key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">
              <Cover>
                <img src={r.cover} alt="" loading="lazy" />
                <Play aria-hidden="true">▶</Play>
              </Cover>
              <span>{r.title}</span>
              <small>Watch on Instagram →</small>
            </Reel>
          ))}
        </ReelGrid>
        <Follow href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Follow @starithm.ai on Instagram</Follow>
      </section>

      {FILMS.length === 0 && (
        <section id="films" style={{ marginTop: 40 }}>
          <Eyebrow>Films</Eyebrow>
          <P style={{ marginTop: 8 }}>{COMING_SOON.text}</P>
          <Grid style={{ marginTop: 12 }}>
            {COMING_SOON.posters.map(([src, alt]) => (
              <Poster key={src}>
                <Img src={src} alt={alt} loading="lazy" style={{ opacity: 0.55 }} />
                <Soon>Coming soon</Soon>
              </Poster>
            ))}
          </Grid>
        </section>
      )}

      {FILMS.length > 0 && (
        <section id="films" style={{ marginTop: 40 }}>
          <Eyebrow>Films</Eyebrow>
          <Grid style={{ marginTop: 12 }}>
            {FILMS.map(f => (
              <div key={f.youtubeId}>
                <Video src={`https://www.youtube-nocookie.com/embed/${f.youtubeId}`} title={f.title} loading="lazy"
                  allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
                <FilmTitle>{f.title}{f.note && <Credit as="span"> · {f.note}</Credit>}</FilmTitle>
              </div>
            ))}
          </Grid>
        </section>
      )}
    </Page>
  );
}

const Page = styled.div`
  max-width: 1040px; margin: 0 auto; padding: 48px 16px 80px;
  font-family: var(--font-mono); color: var(--text-body);
`;
const Eyebrow = styled.div`font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted);`;
const H1 = styled.h1`font-family: var(--font-display); font-weight: 400; font-size: clamp(30px, 5vw, 42px); margin: 6px 0 8px; color: var(--foreground);`;
const H2 = styled.h2`font-family: var(--font-display); font-weight: 400; font-size: 24px; margin: 4px 0 8px; color: var(--foreground);`;
const Lead = styled.p`font-family: var(--font-prose); max-width: var(--measure); color: var(--text-secondary); margin: 0 0 28px; line-height: 1.6;`;
const P = styled.p`font-family: var(--font-prose); max-width: var(--measure); margin: 0 0 8px; line-height: 1.6;`;
const Credit = styled.div`font-size: 12px; color: var(--text-muted);`;
const Links = styled.div`display: flex; gap: 18px; margin-top: 12px; a { color: var(--accent-text); text-decoration: none; font-size: 13px; } a:hover { text-decoration: underline; }`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;`;
const Card = styled.article`border: 1px solid var(--line-subtle); background: var(--surface-raised);`;
const Img = styled.img`display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: var(--surface-sunken);`;
const Body = styled.div`padding: 16px 18px 18px;`;
const Video = styled.iframe`display: block; width: 100%; aspect-ratio: 16 / 9; border: 1px solid var(--line-subtle); background: var(--surface-sunken);`;
const Poster = styled.div`position: relative; border: 1px solid var(--line-subtle); background: var(--surface-sunken);`;
const Soon = styled.span`
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; white-space: nowrap;
  color: var(--foreground); background: var(--surface-raised); border: 1px solid var(--line-control); padding: 6px 12px;
`;
// Four across, two on a phone.
const ReelGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-top: 12px;
  @media (max-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;
const Reel = styled.a`
  display: flex; flex-direction: column; gap: 8px; text-decoration: none;
  span { font-family: var(--font-prose); font-size: 14px; line-height: 1.4; color: var(--foreground); }
  small { font-size: 12px; color: var(--accent-text); margin-top: auto; }
  &:hover img { opacity: 1; }
  &:hover span { text-decoration: underline; }
`;
const Cover = styled.div`
  position: relative; border: 1px solid var(--line-subtle); background: var(--surface-sunken);
  img { display: block; width: 100%; aspect-ratio: 9 / 16; object-fit: cover; opacity: 0.9; transition: opacity 0.15s; }
`;
const Play = styled.div`
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; padding-left: 3px;
  font-size: 15px; color: var(--foreground); background: var(--surface-raised); border: 1px solid var(--line-control); opacity: 0.85;
`;
const Follow = styled.a`
  display: inline-block; margin-top: 18px; padding: 10px 16px; font-size: 13px; text-decoration: none;
  color: var(--primary-foreground); background: var(--primary); border: 1px solid var(--primary);
  &:hover { filter: brightness(1.1); }
`;
const FilmTitle = styled.div`font-size: 13px; margin-top: 6px; color: var(--foreground);`;

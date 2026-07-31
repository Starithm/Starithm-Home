import React, { useEffect, useMemo, useState } from 'react';
import { fetchPostList, Post } from '../lib/posts';
import { AREAS, ROADMAP_ITEMS } from '../data/roadmap';
import {
  BlogContainer,
  Page,
  Masthead,
  MastheadText,
  Eyebrow,
  Title,
  Standfirst,
  FeedLink,
  Featured,
  FeaturedBody,
  FeaturedKicker,
  FeaturedTag,
  FeaturedMeta,
  FeaturedTitle,
  FeaturedExcerpt,
  FeaturedCta,
  Filters,
  FilterRow,
  FilterLabel,
  Chip,
  ChipCount,
  Rows,
  Row,
  RowDate,
  RowSpine,
  RowBody,
  RowKicker,
  RowKind,
  RowCategory,
  RowTitle,
  RowExcerpt,
  RowMeta,
  RowMetaItem,
  RowRead,
  EmptyState,
  Pager,
  PagerRange,
  PagerButtons,
  PagerButton,
} from '../styled_components/BlogList.styled';

const PER_PAGE = 8;

/* One hue per science category — the spine down the left of each row, and the
 * category label in its kicker. */
const CAT_HUE: Record<string, string> = {
  'GRB': '#FF8A5C',
  'Gravitational Waves': '#5CC8FF',
  'Fast Radio Bursts': '#22D39A',
  'Tidal Disruption Events': '#FFD166',
  'Neutrinos': '#B678FF',
  'Supernovae': '#FF6B9D',
  'Magnetars': '#FFA94D',
  'Astronomy Research': '#9A93AC',
  'Space Exploration': '#8FA8FF',
  'Platform': '#8D0FF5',
};
const CAT_FALLBACK = '#9A93AC';

const SIG_HUE: Record<string, string> = { High: '#FF8A5C', Medium: '#FFD166', Low: '#6E6880' };

type Kind = 'event' | 'paper' | 'post';

const KIND_META: Record<Kind, { label: string; plural: string; hue: string; glyph: string }> = {
  event: { label: 'Event report', plural: 'Event reports', hue: '#22D39A', glyph: '◈' },
  paper: { label: 'Paper summary', plural: 'Paper summaries', hue: '#5CC8FF', glyph: '❖' },
  post: { label: 'From the team', plural: 'Team posts', hue: '#8D0FF5', glyph: '✦' },
};

const KINDS: Kind[] = ['event', 'paper', 'post'];

/* What a post is follows from what the record gave it: an event id means the
 * pipeline wrote it from an event, an arXiv id means it summarises a preprint,
 * neither means a human wrote it. */
function kindOf(post: Post): Kind {
  if (post.event_id) return 'event';
  if (post.arxiv_id) return 'paper';
  return 'post';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDay(date: string) {
  const dt = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(dt.getTime())) return date;
  return `${MONTHS[dt.getUTCMonth()]} ${dt.getUTCDate()}`;
}

function shortRead(readTime: string) {
  return readTime.replace(/\s*read$/i, '');
}

/* Excerpts are lifted from the post body, so some still carry markdown
 * emphasis. The index renders plain text — strip the markers. */
function plain(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1$2')
    .replace(/\*+/g, '')   // unpaired markers left behind by the generator
    .replace(/`/g, '');
}

interface MetaEntry {
  key: string;
  label: string;
  hue: string;
}

/* The right-hand column carries whatever that kind of piece actually knows. */
function metaFor(post: Post): MetaEntry[] {
  const kind = kindOf(post);

  if (kind === 'event') {
    const circulars = Number(post.circular_count) || 0;
    return [
      {
        key: 'sig',
        label: post.significance ? `${post.significance} significance` : 'Event record',
        hue: SIG_HUE[post.significance] || '#8B8499',
      },
      { key: 'notices', label: `${post.notice_count || 0} notices`, hue: '#7A7390' },
      {
        key: 'circulars',
        label: `${circulars} ${circulars === 1 ? 'circular' : 'circulars'}`,
        hue: circulars > 0 ? '#7A7390' : '#4E4863',
      },
    ];
  }

  if (kind === 'paper') {
    const entries: MetaEntry[] = [];
    if (post.authors) entries.push({ key: 'authors', label: post.authors, hue: '#7A7390' });
    if (post.arxiv_id) entries.push({ key: 'arxiv', label: `arXiv:${post.arxiv_id}`, hue: '#5CC8FF' });
    return entries;
  }

  return [{ key: 'authors', label: post.authors || 'Starithm Team', hue: '#7A7390' }];
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<Kind | 'All'>('All');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPostList()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map(p => p.category)))],
    [posts],
  );

  const kindCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length, event: 0, paper: 0, post: 0 };
    posts.forEach(p => { counts[kindOf(p)] += 1; });
    return counts;
  }, [posts]);

  const filtered = useMemo(
    () => posts.filter(p =>
      (category === 'All' || p.category === category) &&
      (kind === 'All' || kindOf(p) === kind),
    ),
    [posts, category, kind],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const goTo = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Small tilt on the pinned card only — the rows stay still. */
  const tilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = 'transform 90ms ease-out, border-color 0.2s';
    el.style.transform = `perspective(900px) rotateY(${(px * 3).toFixed(2)}deg) rotateX(${(-py * 3).toFixed(2)}deg) translateZ(0)`;
  };

  const untilt = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s';
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
  };

  const range = filtered.length === 0
    ? '0'
    : `${(current - 1) * PER_PAGE + 1}–${Math.min(current * PER_PAGE, filtered.length)} of ${filtered.length}`;

  return (
    <BlogContainer>
      <Page>
        <Masthead>
          <MastheadText>
            <Eyebrow>Starithm</Eyebrow>
            <Title>Writing</Title>
            <Standfirst>
              Reports written from each event's own alerts and Circulars, summaries of new
              preprints, and notes from the team.
            </Standfirst>
          </MastheadText>
          <FeedLink href="/feed.xml">RSS ↗</FeedLink>
        </Masthead>

        {/* The roadmap stays pinned above the index. */}
        <Featured to="/blog/roadmap" onMouseMove={tilt} onMouseLeave={untilt}>
          <FeaturedBody>
            <FeaturedKicker>
              <FeaturedTag>Roadmap</FeaturedTag>
              <FeaturedMeta>Mar 2026 · 2 min</FeaturedMeta>
            </FeaturedKicker>
            <FeaturedTitle>Where the work stands</FeaturedTitle>
            <FeaturedExcerpt>
              {ROADMAP_ITEMS.length} steps across {AREAS.length} layers of the platform — what runs
              today, what we are crossing into now, and the order the rest is built in.
            </FeaturedExcerpt>
          </FeaturedBody>
          <FeaturedCta>Read →</FeaturedCta>
        </Featured>

        <Filters>
          <FilterRow>
            <FilterLabel>Type</FilterLabel>
            <Chip $on={kind === 'All'} onClick={() => { setKind('All'); setPage(1); }}>
              Everything <ChipCount>{kindCounts.All}</ChipCount>
            </Chip>
            {KINDS.map(k => (
              <Chip
                key={k}
                $on={kind === k}
                $hue={KIND_META[k].hue}
                onClick={() => { setKind(k); setPage(1); }}
              >
                {KIND_META[k].plural} <ChipCount>{kindCounts[k]}</ChipCount>
              </Chip>
            ))}
          </FilterRow>

          <FilterRow>
            <FilterLabel>Category</FilterLabel>
            {categories.map(c => (
              <Chip
                key={c}
                $on={category === c}
                $hue={c === 'All' ? undefined : CAT_HUE[c] || CAT_FALLBACK}
                onClick={() => { setCategory(c); setPage(1); }}
              >
                {c}
              </Chip>
            ))}
          </FilterRow>
        </Filters>

        {loading && <EmptyState>Loading…</EmptyState>}

        {!loading && shown.length === 0 && (
          <EmptyState>Nothing written under that filter yet.</EmptyState>
        )}

        {!loading && shown.length > 0 && (
          <Rows>
            {shown.map(post => {
              const k = kindOf(post);
              const catHue = CAT_HUE[post.category] || CAT_FALLBACK;
              return (
                <Row key={post.slug} to={`/blog/posts/${post.slug}`} state={{ post }}>
                  <RowDate>
                    {formatDay(post.date)}
                    <small>{post.date.slice(0, 4)}</small>
                  </RowDate>
                  <RowSpine $hue={catHue} />
                  <RowBody>
                    <RowKicker>
                      <RowKind $hue={KIND_META[k].hue}>
                        {KIND_META[k].glyph} {KIND_META[k].label}
                      </RowKind>
                      <RowCategory $hue={catHue}>{post.category}</RowCategory>
                    </RowKicker>
                    <RowTitle>{post.title}</RowTitle>
                    <RowExcerpt>{plain(post.excerpt)}</RowExcerpt>
                  </RowBody>
                  <RowMeta>
                    {metaFor(post).map(m => (
                      <RowMetaItem key={m.key} $hue={m.hue}>{m.label}</RowMetaItem>
                    ))}
                    <RowRead>{shortRead(post.read_time)}</RowRead>
                  </RowMeta>
                </Row>
              );
            })}
          </Rows>
        )}

        {!loading && filtered.length > 0 && (
          <Pager>
            <PagerRange>{range}</PagerRange>
            <PagerButtons>
              <PagerButton disabled={current === 1} onClick={() => goTo(current - 1)}>←</PagerButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <PagerButton key={n} $on={n === current} onClick={() => goTo(n)}>{n}</PagerButton>
              ))}
              <PagerButton disabled={current === totalPages} onClick={() => goTo(current + 1)}>→</PagerButton>
            </PagerButtons>
          </Pager>
        )}
      </Page>
    </BlogContainer>
  );
}

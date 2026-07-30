import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  AREAS,
  ROADMAP_ITEMS,
  STATUS_LABEL,
  STATUS_LEGEND,
  type RoadmapItem as RoadmapItemType,
  type RoadmapStatus,
} from '../data/roadmap';
import {
  Page, Shell, BackLink, Card,
  Masthead, Kicker, Title, Lede, Legend, LegendRow,
  Grid, Frontier, FrontierLabel, ColumnHead, ColumnLabel,
  Band, BandMeta, BandDepth, BandName, BandNote,
  Column, ColumnTag, Item, ItemHead, ItemGlyph, ItemTitle, ItemBody, Empty,
  Footnote, STATUS_GLYPH,
} from '../styled_components/RoadmapFrontier.styled';

const ORDER: RoadmapStatus[] = ['held', 'crossing', 'ahead'];

export default function Roadmap() {
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = 'Roadmap — Where the work stands | Starithm';
  }, []);

  const toggle = (id: string) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /* Group once: area -> status -> items, preserving declaration order. */
  const byArea = useMemo(() => {
    const map = new Map<string, Record<RoadmapStatus, RoadmapItemType[]>>();
    for (const area of AREAS) map.set(area.key, { held: [], crossing: [], ahead: [] });
    for (const item of ROADMAP_ITEMS) map.get(item.area)?.[item.status].push(item);
    return map;
  }, []);

  const held = ROADMAP_ITEMS.filter(i => i.status === 'held').length;
  const crossing = ROADMAP_ITEMS.filter(i => i.status === 'crossing').length;

  const renderItem = (item: RoadmapItemType) => {
    const isOpen = open.has(item.id);
    return (
      <Item
        key={item.id}
        type="button"
        $status={item.status}
        $open={isOpen}
        aria-expanded={isOpen}
        onClick={() => toggle(item.id)}
      >
        <ItemHead>
          <ItemGlyph $status={item.status} aria-hidden="true">
            {STATUS_GLYPH[item.status]}
          </ItemGlyph>
          <ItemTitle $status={item.status}>{item.title}</ItemTitle>
        </ItemHead>
        {isOpen && <ItemBody>{item.description}</ItemBody>}
      </Item>
    );
  };

  return (
    <Page>
      <Shell>
        <BackLink as={Link as any} to="/blog">
          <ArrowLeft size={13} /> Blog
        </BackLink>

        <Card>
          <Masthead>
            <div>
              <Kicker>Starithm roadmap</Kicker>
              <Title>Where the work stands</Title>
              <Lede>
                Different layers of the platform, from raw alerts up to joint inference.
                Everything left of the frontier runs today. Everything right of it is built
                in the order each piece needs the one before it.
              </Lede>
            </div>
            <Legend>
              {STATUS_LEGEND.map(l => (
                <LegendRow key={l.status} $status={l.status}>{l.text}</LegendRow>
              ))}
            </Legend>
          </Masthead>

          <Grid>
            <Frontier aria-hidden="true" />
            <FrontierLabel aria-hidden="true">Frontier</FrontierLabel>

            <ColumnHead>
              <span />
              {ORDER.map(s => (
                <ColumnLabel key={s} $status={s}>{STATUS_LABEL[s]}</ColumnLabel>
              ))}
            </ColumnHead>

            {AREAS.map(area => {
              const groups = byArea.get(area.key)!;
              return (
                <Band key={area.key}>
                  <BandMeta>
                    <BandDepth>{area.depth}</BandDepth>
                    <BandName>{area.name}</BandName>
                    <BandNote>{area.note}</BandNote>
                  </BandMeta>

                  {ORDER.map(status => {
                    const items = groups[status];
                    /* "Ahead" carries the most items, so it splits into sub-columns on
                       wide screens; the other two stay single-file. */
                    return (
                      <Column key={status} $split={status === 'ahead'}>
                        {items.length > 0 && (
                          <ColumnTag $status={status}>{STATUS_LABEL[status]}</ColumnTag>
                        )}
                        {items.length > 0 ? items.map(renderItem) : <Empty>—</Empty>}
                      </Column>
                    );
                  })}
                </Band>
              );
            })}
          </Grid>

          <Footnote>
            {held} shipped · {crossing} in progress · {ROADMAP_ITEMS.length} total. Dates are
            deliberately absent — order is the commitment, not timing. Questions or
            corrections: <a href="mailto:contact.starithm@gmail.com">contact.starithm@gmail.com</a>.
          </Footnote>
        </Card>
      </Shell>
    </Page>
  );
}

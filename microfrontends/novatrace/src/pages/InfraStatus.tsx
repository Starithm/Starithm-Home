import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
} from "recharts";
import {
  Page, Container, Header, Title, Subtitle,
  RangeBar, RangeButton, Controls, DateField, ClearBtn,
  TilesRow, Tile, TileValue, TileLabel,
  FacetGrid, Facet, FacetHead, FacetTitle, FacetKind, FacetTotal, FacetAxis,
  TipBox, TipDate, TipCount, Centered, TableDetails, DataTable,
} from "../styled_pages/InfraStatus.styled";

type Row = { date: string; topic: string; count: number };

const RANGES = [
  { label: "1w", days: 7 },
  { label: "15d", days: 15 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const TODAY = new Date().toISOString().slice(0, 10);

// Drop the noisy common prefixes so the facet title is readable; keep the rest.
function shortTopic(topic: string): { name: string; kind: string } {
  if (topic.startsWith("gcn.classic.voevent.")) return { name: topic.slice("gcn.classic.voevent.".length), kind: "classic" };
  if (topic.startsWith("gcn.notices.")) return { name: topic.slice("gcn.notices.".length), kind: "notice" };
  return { name: topic, kind: "" };
}

const fmt = (n: number) => n.toLocaleString();
const shortDate = (d: string) => d.slice(5); // MM-DD

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <TipBox>
      <TipDate>{label}</TipDate>
      <TipCount>{fmt(payload[0].value)} notice{payload[0].value === 1 ? "" : "s"}</TipCount>
    </TipBox>
  );
}

export default function InfraStatus() {
  const [range, setRange] = useState(7);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const custom = !!(from || to);

  // Custom from/to wins over the preset; otherwise the trailing-days window (0 = all).
  const qs = custom
    ? `?${[from && `from=${from}`, to && `to=${to}`].filter(Boolean).join("&")}`
    : range > 0 ? `?days=${range}` : "";

  const pickPreset = (days: number) => { setFrom(""); setTo(""); setRange(days); };
  const clearCustom = () => { setFrom(""); setTo(""); };

  const { data, isLoading, isError } = useQuery<Row[]>({
    queryKey: [`/api/topic-trends${qs}`],
  });

  // All-time trends — fetched once (cached) to fix a STABLE facet set + ordering, so a topic
  // never disappears when it has no notices in the selected window; it just renders flat.
  const { data: allData } = useQuery<Row[]>({
    queryKey: [`/api/topic-trends`],
  });

  const model = useMemo(() => {
    const rows = data ?? [];
    const byTopic = new Map<string, Map<string, number>>();
    const allDates = new Set<string>();
    let total = 0;
    for (const r of rows) {
      allDates.add(r.date);
      total += r.count;
      if (!byTopic.has(r.topic)) byTopic.set(r.topic, new Map());
      byTopic.get(r.topic)!.set(r.date, r.count);
    }
    const dates = [...allDates].sort();

    // Topic universe + stable order = all-time totals (falls back to the window until the
    // all-time query resolves). Order is by all-time volume so facets don't reshuffle when
    // the range changes.
    const allTotals = new Map<string, number>();
    for (const r of (allData ?? rows)) allTotals.set(r.topic, (allTotals.get(r.topic) ?? 0) + r.count);
    const universe = [...allTotals.keys()].sort((a, b) => (allTotals.get(b)! - allTotals.get(a)!) || a.localeCompare(b));

    // Shared x-domain across every facet (fill gaps with 0) → time is comparable; each facet
    // keeps its own y-scale so a low-volume topic's trend is still visible. Empty topics get
    // an all-zero series over the same dates.
    const facets = universe.map((topic) => {
      const m = byTopic.get(topic);
      const series = dates.map((d) => ({ date: d, count: m?.get(d) ?? 0 }));
      const topicTotal = m ? [...m.values()].reduce((a, b) => a + b, 0) : 0;
      return { topic, topicTotal, series };
    });
    return { facets, dates, total };
  }, [data, allData]);

  return (
    <Page>
      <Container>
        <Header>
          <div>
            <Title>Infra · Ingestion Status</Title>
            <Subtitle>GCN streaming notices ingested per topic per day — one facet per topic, newest data on the right.</Subtitle>
          </div>
          <Controls>
            <RangeBar role="group" aria-label="Quick range">
              {RANGES.map((r) => (
                <RangeButton key={r.label} $active={!custom && range === r.days} onClick={() => pickPreset(r.days)}>
                  {r.label}
                </RangeButton>
              ))}
            </RangeBar>
            <DateField $active={custom}>
              From
              <input type="date" value={from} max={to || TODAY}
                onChange={(e) => setFrom(e.target.value)} />
            </DateField>
            <DateField $active={custom}>
              To
              <input type="date" value={to} min={from || undefined} max={TODAY}
                onChange={(e) => setTo(e.target.value)} />
            </DateField>
            {custom && <ClearBtn onClick={clearCustom}>Clear</ClearBtn>}
          </Controls>
        </Header>

        {isLoading && <Centered>Loading ingestion trends…</Centered>}
        {isError && <Centered>Couldn’t load topic trends. Is the gateway reachable?</Centered>}
        {!isLoading && !isError && model.facets.length === 0 && (
          <Centered>No notices ingested in this window.</Centered>
        )}

        {!isLoading && !isError && model.facets.length > 0 && (
          <>
            <TilesRow>
              <Tile><TileValue>{fmt(model.total)}</TileValue><TileLabel>Notices ingested</TileLabel></Tile>
              <Tile><TileValue>{model.facets.filter((f) => f.topicTotal > 0).length}/{model.facets.length}</TileValue><TileLabel>Topics active in range</TileLabel></Tile>
              <Tile><TileValue>{model.dates.length}</TileValue><TileLabel>Days with data</TileLabel></Tile>
              <Tile><TileValue>{model.dates.length ? model.dates[model.dates.length - 1] : "—"}</TileValue><TileLabel>Last ingest (UTC)</TileLabel></Tile>
            </TilesRow>

            <FacetGrid>
              {model.facets.map(({ topic, topicTotal, series }) => {
                const { name, kind } = shortTopic(topic);
                const empty = topicTotal === 0;
                return (
                  <Facet key={topic} $empty={empty}>
                    <FacetHead>
                      <FacetTitle title={topic}>
                        {name} {kind && <FacetKind>· {kind}</FacetKind>}
                      </FacetTitle>
                      <FacetTotal $empty={empty}>{fmt(topicTotal)}</FacetTotal>
                    </FacetHead>
                    <ResponsiveContainer width="100%" height={88}>
                      <BarChart data={series} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap={1}>
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip content={<ChartTip />} cursor={{ fill: "var(--muted)", opacity: 0.25 }} />
                        <Bar dataKey="count" fill="var(--starithm-veronica)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                    <FacetAxis>
                      <span>{series.length ? shortDate(series[0].date) : ""}</span>
                      <span>{series.length ? shortDate(series[series.length - 1].date) : ""}</span>
                    </FacetAxis>
                  </Facet>
                );
              })}
            </FacetGrid>

            {/* Accessible fallback — identity + exact numbers without relying on the chart */}
            <TableDetails>
              <summary>Show as table</summary>
              <DataTable>
                <thead><tr><th>Topic</th><th>Notices</th></tr></thead>
                <tbody>
                  {model.facets.map(({ topic, topicTotal }) => (
                    <tr key={topic}><td>{topic}</td><td>{fmt(topicTotal)}</td></tr>
                  ))}
                </tbody>
              </DataTable>
            </TableDetails>
          </>
        )}
      </Container>
    </Page>
  );
}

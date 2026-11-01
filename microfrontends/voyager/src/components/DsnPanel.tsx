import { VOYAGER_1, type DsnState, type VoyagerLink } from '../lib/dsn';
import { useNow } from '../lib/use-now';
import {
  DishRow, Fine, LinkReadout, Panel, PanelHead, PanelTitle, Pill, Prose, Station, Stations, Stat, StatLabel, StatValue, Tag,
} from '../styled_components/Voyager.styled';

interface Props {
  dsn: DsnState;
  link: VoyagerLink | null;
  simulated: boolean;
  onSimulate: (on: boolean) => void;
}

const STATIONS = ['Goldstone', 'Madrid', 'Canberra'];
const PLACE: Record<string, string> = { Goldstone: 'California', Madrid: 'Spain', Canberra: 'Australia' };

export function DsnPanel({ dsn, link, simulated, onSimulate }: Props) {
  const now = useNow(1000);
  const receiving = !!link?.down?.active;
  const age = dsn.updated ? Math.max(0, Math.round((now - dsn.updated) / 1000)) : null;

  return (
    <Panel>
      <PanelHead>
        <PanelTitle>Deep Space Network · live</PanelTitle>
        {simulated ? (
          <Tag $tone="sim">Simulated pass</Tag>
        ) : receiving ? (
          <Tag $tone="live">Receiving Voyager 1</Tag>
        ) : link ? (
          <Tag $tone="live">Dish on Voyager 1</Tag>
        ) : (
          <Tag $tone="idle">No dish on Voyager 1</Tag>
        )}
        <Pill style={{ marginLeft: 'auto' }} $on={simulated} onClick={() => onSimulate(!simulated)}>
          {simulated ? 'Back to live' : 'Rehearse a pass'}
        </Pill>
      </PanelHead>

      {link ? (
        <Prose>
          <strong>{link.dish}</strong> in {link.station}, {PLACE[link.station] ?? ''}, is pointed at Voyager 1,{' '}
          {link.elevation}° above the horizon.
          {link.down?.active && ' The signal arriving now left the spacecraft about 24 hours ago.'}
        </Prose>
      ) : (
        <Prose>
          Three stations, a third of the world apart, keep a dish on deep space at all times. Right now none of
          them is listening to Voyager 1. Every station can see it for part of each day; it gets a dish for a
          few hours at a time, when the schedule allows.
        </Prose>
      )}

      {link && (
        <LinkReadout>
          <Stat>
            <StatLabel>Downlink</StatLabel>
            <StatValue>{link.down?.active ? `${link.down.bps}` : '—'}<small>bit/s</small></StatValue>
          </Stat>
          <Stat>
            <StatLabel>Received power</StatLabel>
            <StatValue>{link.down ? link.down.dbm.toFixed(1) : '—'}<small>dBm</small></StatValue>
          </Stat>
          <Stat>
            <StatLabel>Band</StatLabel>
            <StatValue>{link.down?.band || link.up?.band || '—'}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Uplink</StatLabel>
            <StatValue>{link.up?.active ? link.up.kw.toFixed(1) : '—'}<small>kW</small></StatValue>
          </Stat>
        </LinkReadout>
      )}

      <Stations style={{ marginTop: 16 }}>
        {STATIONS.map((name) => {
          const st = dsn.stations.find((s) => s.name === name);
          const active = link?.station === name;
          return (
            <Station key={name} $active={active}>
              <h3>{name}</h3>
              {(st?.dishes ?? []).map((d) => {
                const isV = d.targets.includes(VOYAGER_1) || (active && link?.dish === d.name);
                const target = isV ? 'Voyager 1' : d.targets.filter((t) => t !== 'DSN').join(', ') || 'idle';
                return (
                  <DishRow key={d.name} $voyager={isV}>
                    <span>{d.name}</span>
                    <span>{target}</span>
                  </DishRow>
                );
              })}
              {!st && <DishRow><span>{dsn.status === 'loading' ? 'connecting…' : 'no data'}</span></DishRow>}
            </Station>
          );
        })}
      </Stations>

      <Fine>
        Source: NASA DSN Now, polled every 10 s
        {age != null && ` · updated ${age}s ago`}
        {dsn.status === 'error' && ' · feed unreachable, showing last known state'}
        {simulated && ' · the Voyager readout above is a rehearsal, not real data'}
      </Fine>
    </Panel>
  );
}

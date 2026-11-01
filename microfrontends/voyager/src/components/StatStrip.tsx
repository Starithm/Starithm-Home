import { AU_KM, LAUNCH_UTC, positionAt } from '../lib/ephemeris';
import { useNow } from '../lib/use-now';
import { Stat, StatLabel, StatNote, StatValue, Stats } from '../styled_components/Voyager.styled';

const km = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const fmtArrive = new Intl.DateTimeFormat(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });

export function StatStrip() {
  const now = useNow(100);
  const p = positionAt(now);
  const days = (now - LAUNCH_UTC) / 86_400_000;
  const years = Math.floor(days / 365.25);
  const arrive = now + p.lightSeconds * 1000;

  return (
    <Stats>
      <Stat>
        <StatLabel>From Earth</StatLabel>
        <StatValue>{km.format(p.earthKm)}<small>km</small></StatValue>
        <StatNote>{(p.earthKm / AU_KM).toFixed(5)} AU · {p.earthKmS >= 0 ? '+' : ''}{p.earthKmS.toFixed(2)} km/s</StatNote>
      </Stat>
      <Stat>
        <StatLabel>From the Sun</StatLabel>
        <StatValue>{km.format(p.sunKm)}<small>km</small></StatValue>
        <StatNote>{(p.sunKm / AU_KM).toFixed(5)} AU · {p.sunKmS.toFixed(2)} km/s outward</StatNote>
      </Stat>
      <Stat>
        <StatLabel>In flight</StatLabel>
        <StatValue>{km.format(Math.floor(days))}<small>days</small></StatValue>
        <StatNote>{years} years · on its original 1977 hardware</StatNote>
      </Stat>
      <Stat>
        <StatLabel>A signal sent now arrives</StatLabel>
        <StatValue>{fmtArrive.format(arrive)}</StatValue>
        <StatNote>a reply would land {fmtArrive.format(now + 2 * p.lightSeconds * 1000)}, two days on</StatNote>
      </Stat>
    </Stats>
  );
}

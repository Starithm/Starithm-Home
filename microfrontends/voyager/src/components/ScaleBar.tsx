import { AU_KM, HELIOPAUSE_AU, LIGHT_DAY_KM, positionAt } from '../lib/ephemeris';
import { useNow } from '../lib/use-now';
import { Dot, Fine, Mark, Panel, PanelHead, PanelTitle, ScaleLine, ScaleWrap } from '../styled_components/Voyager.styled';

/* To scale, linear from the Sun. The planets bunch into the first fifth; that is the point. */
const MAX_AU = 180;
const LIGHT_DAY_AU = LIGHT_DAY_KM / AU_KM;
const PLANETS: [string, number][] = [
  ['Earth', 1],
  ['Jupiter', 5.2],
  ['Saturn', 9.5],
  ['Uranus', 19.2],
  ['Neptune', 30.1],
];

export function ScaleBar() {
  const now = useNow(1000);
  const sunAu = positionAt(now).sunKm / AU_KM;
  const at = (au: number) => (au / MAX_AU) * 100;

  return (
    <Panel style={{ marginTop: 20 }}>
      <PanelHead>
        <PanelTitle>How far is that · to scale</PanelTitle>
      </PanelHead>
      <ScaleWrap>
        <ScaleLine>
          <Mark $left={0} $up $tone="gold"><span>Sun</span></Mark>
          {PLANETS.map(([n, au], i) => (
            <Mark key={n} $left={at(au)} $up={i % 2 === 1}><span>{i === 0 || i === 4 ? n : ''}</span></Mark>
          ))}
          <Mark $left={at(HELIOPAUSE_AU)} $up><span>Heliopause<br />crossed Aug 2012</span></Mark>
          <Mark $left={at(LIGHT_DAY_AU)} $tone="gold"><span>One light-day<br />{LIGHT_DAY_AU.toFixed(1)} AU</span></Mark>
          <Dot $left={at(sunAu)} />
          <Mark $left={at(sunAu)} $up $tone="accent"><span>Voyager 1<br />{sunAu.toFixed(2)} AU</span></Mark>
        </ScaleLine>
      </ScaleWrap>
      <Fine>
        1 AU is the Earth–Sun distance. All eight planets sit inside the first 30 AU, the first sixth of this
        line. Voyager 1 left the Sun's bubble of solar wind in 2012 and has been in interstellar space since.
        The light-day mark is measured from Earth, which is why Voyager 1 meets it here a little before reaching
        173.1 AU from the Sun.
      </Fine>
    </Panel>
  );
}

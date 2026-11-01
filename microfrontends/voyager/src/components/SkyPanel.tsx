import { formatDec, formatRa, positionAt } from '../lib/ephemeris';
import { useNow } from '../lib/use-now';
import { Fine, KV, Panel, PanelHead, PanelTitle, Prose } from '../styled_components/Voyager.styled';

export function SkyPanel() {
  const now = useNow(1000);
  const p = positionAt(now);
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>Where to look</PanelTitle>
      </PanelHead>
      <KV>
        <dt>Constellation</dt>
        <dd>Ophiuchus, the Serpent-bearer</dd>
        <dt>Right ascension</dt>
        <dd>{formatRa(p.raDeg)}</dd>
        <dt>Declination</dt>
        <dd>{formatDec(p.decDeg)}</dd>
      </KV>
      <Prose>
        Voyager 1 is far too faint for any telescope: its 23-watt transmitter is about as powerful as a fridge
        light. Only the 70 m and 34 m dishes of the Deep Space Network can still hear it, at a power of around
        a ten-billionth of a billionth of a watt.
      </Prose>
      <Fine>Position as seen from Earth's centre · JPL Horizons</Fine>
    </Panel>
  );
}

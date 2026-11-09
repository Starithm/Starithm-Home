import { useEffect, useRef } from 'react';
import { formatDec, formatRa, positionAt } from '../lib/ephemeris';
import { drawStars, useFlow } from '../lib/starfield';
import { useNow } from '../lib/use-now';
import { useStageFit } from '../lib/use-stage-fit';
import { SlideTitle, Sky, Stage, STAGE_H, STAGE_W } from '../styled_components/LiveSlide.styled';
import { Craft, Disc, Facts, Look, SceneFrame } from '../styled_components/Stage.styled';

/* Stage scene 3: the Golden Record turning at the speed it was cut for, what it carries in numbers,
 * and Voyager with where to find it in our sky tonight. */

const FACTS: [string, string][] = [
  ['115', 'images'],
  ['55', 'languages'],
  ['27', 'pieces of music'],
  ['90', 'minutes of music'],
  ['12″', 'gold-plated copper'],
  ['16⅔', 'rpm'],
];

export function RecordScene() {
  const { ref, transform } = useStageFit<HTMLElement>();
  const starsRef = useRef<HTMLCanvasElement>(null);
  const flowRef = useRef<HTMLCanvasElement>(null);
  useFlow(flowRef);
  useEffect(() => {
    if (starsRef.current) drawStars(starsRef.current);
  }, []);
  const p = positionAt(useNow(1000));

  return (
    <SceneFrame ref={ref} aria-label="The Golden Record">
      <Stage style={{ transform }}>
        <Sky>
          <canvas ref={starsRef} width={STAGE_W} height={STAGE_H} />
          <canvas ref={flowRef} width={STAGE_W} height={STAGE_H} />
        </Sky>

        <SlideTitle>
          The Golden Record <span>— on board since 1977</span>
        </SlideTitle>

        <Disc>
          <img src="/voyager/golden-record-spin-pia14113.jpg" alt="The Golden Record, turning" />
        </Disc>

        <Facts>
          {FACTS.map(([n, w]) => (
            <div key={w}>
              <div>{n}</div>
              <div>{w}</div>
            </div>
          ))}
        </Facts>

        <Craft src="/voyager/voyager-1-cutout-pia17049.webp" alt="Voyager 1 (NASA/JPL-Caltech render)" />

        <Look>
          <div>Where to look tonight</div>
          <div>Ophiuchus, the Serpent-bearer</div>
          <div>RA {formatRa(p.raDeg)} · Dec {formatDec(p.decDeg)}</div>
          <div>Too faint for any telescope: only the Deep Space Network can still hear it.</div>
        </Look>
      </Stage>
    </SceneFrame>
  );
}

import { useEffect, useRef, useState } from 'react';
import { LiveSlide } from '../components/LiveSlide';
import { RecordScene } from '../components/RecordScene';
import { SignalScene } from '../components/SignalScene';
import { SceneDots, StageRoot } from '../styled_components/Stage.styled';

/* The concert stage for Space Art Lab's "One Light-Day from Earth" (18 Nov 2026), separate from the
 * public page and its countdown. Three scenes for the three parts of Für Alina:
 *   1  Voyager in 3D, sending the piece's notes home to Earth
 *   2  the signal as a waterfall over the three Deep Space Network complexes, and the distance to scale
 *   3  the Golden Record, what it carries, and where Voyager is in the sky
 * Keys: 1–3 jump to a scene; → ↓ PageDown next, ← ↑ PageUp back (a presentation clicker sends these);
 * F full screen; Space cues the piece's notes, as on the slide. */

const SCENES = 3;

export default function StagePage() {
  const [scene, setScene] = useState(() => {
    const n = Number(new URLSearchParams(window.location.search).get('scene'));
    return n >= 1 && n <= SCENES ? n : 1;
  });
  const [dots, setDots] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Voyager 1 · Stage · Starithm';
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const go = (n: number) => setScene(Math.max(1, Math.min(SCENES, n)));
      if (e.key >= '1' && e.key <= String(SCENES)) go(Number(e.key));
      else if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) setScene((s) => Math.min(SCENES, s + 1));
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) setScene((s) => Math.max(1, s - 1));
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else rootRef.current?.requestFullscreen?.();
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // the scene dots show briefly after each change, then get out of the way
  useEffect(() => {
    setDots(true);
    const id = setTimeout(() => setDots(false), 2500);
    return () => clearTimeout(id);
  }, [scene]);

  return (
    <StageRoot ref={rootRef}>
      {scene === 1 && <LiveSlide key="1" clock={null} stage />}
      {scene === 2 && <SignalScene key="2" />}
      {scene === 3 && <RecordScene key="3" />}
      <SceneDots $show={dots}>
        {Array.from({ length: SCENES }, (_, i) => <span key={i} data-on={i + 1 === scene} />)}
      </SceneDots>
    </StageRoot>
  );
}

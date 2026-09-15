import { useEffect, useRef, useState } from 'react';
import type { PlayerData } from '../lib/melodies';
import { brightnessAt, pointAt } from '../lib/playerMath';
import { MapBox, MapCanvas, MapFrame, MapImage } from '../styled_components/Ears.styled';

interface Props {
  mapUrl: string;
  player: PlayerData;
  time: number;
  alt: string;
}

/* The target's white-light map, one pixel per region, with the song's real scan path:
 * the played trail, the path still to come, and a glowing dot where the song is now. */
export function SkyMap({ mapUrl, player, time, alt }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { w, h } = size;
    if (!canvas || !w || !h || !player.path.length) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const g = canvas.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);

    const css = getComputedStyle(canvas);
    const token = (name: string) => css.getPropertyValue(name).trim();
    const violet = token('--starithm-electric-violet');
    const amber = token('--starithm-selective-yellow');
    const ink = token('--text-body');

    const [cx, cy] = pointAt(player, time);

    // path still to come
    g.globalAlpha = 0.22;
    g.strokeStyle = ink;
    g.lineWidth = 1;
    g.setLineDash([2, 5]);
    g.beginPath();
    player.path.forEach(([, x, y], k) => (k ? g.lineTo(x * w, y * h) : g.moveTo(x * w, y * h)));
    g.stroke();

    // played trail: kept light so the target stays the focus
    g.setLineDash([]);
    g.globalAlpha = 0.4;
    g.strokeStyle = violet;
    g.lineWidth = 1;
    g.beginPath();
    let started = false;
    for (const [t, x, y] of player.path) {
      if (t > time) break;
      if (started) g.lineTo(x * w, y * h);
      else {
        g.moveTo(x * w, y * h);
        started = true;
      }
    }
    if (started) {
      g.lineTo(cx * w, cy * h);
      g.stroke();
    }

    // where the song is now: glow grows with the region's brightness
    const px = cx * w;
    const py = cy * h;
    const radius = 3 + 5 * brightnessAt(player, time);
    const glow = g.createRadialGradient(px, py, 0, px, py, radius * 5);
    glow.addColorStop(0, amber);
    glow.addColorStop(1, 'transparent');
    g.globalAlpha = 0.45;
    g.fillStyle = glow;
    g.beginPath();
    g.arc(px, py, radius * 5, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = 1;
    g.fillStyle = amber;
    g.beginPath();
    g.arc(px, py, Math.max(2.5, radius * 0.55), 0, Math.PI * 2);
    g.fill();
  }, [size, time, player]);

  const ratio = player.grid.width / player.grid.height;

  return (
    <MapFrame>
      <MapBox ref={boxRef} $ratio={ratio}>
        <MapImage src={mapUrl} alt={alt} />
        <MapCanvas ref={canvasRef} aria-hidden="true" />
      </MapBox>
    </MapFrame>
  );
}

import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Event } from '@shared/types';
import { kindColor, LEGEND } from '@shared/utils/eventColors';
// Use a generic Event interface that matches the expected structure


interface ConeSearch {
  raDeg: number;
  decDeg: number;
  radiusDeg: number;
}

interface CelestialSphereProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedEvent?: Event | null;
  coneSearch?: ConeSearch | null;
  className?: string;
}

interface ViewState {
  azimuth: number;    // Horizontal rotation (0-360)
  altitude: number;   // Vertical rotation (-90 to 90)
}

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 6;
/* ~0.1°/tick at 20fps → a full turn in about 3 minutes: visible, not distracting. */
const SPIN_DEG_PER_TICK = 0.1;
const DOT_BASE = 4.6;
const STAR_COUNT = 220;

/* posErrorDeg is jsonb ({radius,type}); older rows are plain numbers, and SVOM
   sends -1 to mean "not reported". Kept local so the shared sphere doesn't take a
   dependency on a NovaTrace util. */
function errorRadius(v: unknown): number | null {
  if (v == null) return null;
  const raw = typeof v === 'object' ? (v as any).radius : v;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  momentum: { x: number; y: number };
}

export function CelestialSphere({ events, onEventClick, selectedEvent, coneSearch, className }: CelestialSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [viewState, setViewState] = useState<ViewState>({
    /* Tilted, matching the reference (az ≈ 23°, alt ≈ 24°). At altitude 0 the
       declination parallels collapse to straight horizontal chords and the whole
       thing reads as a 2D dial; a little tilt is what makes it a globe. */
    azimuth: 23,
    altitude: 24,
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    momentum: { x: 0, y: 0 }
  });

  /* Sunflower (phyllotaxis) spread over a disc: golden-angle steps with a sqrt
     radius give an even scatter with no visible rows or clumping. Base alpha runs
     0.12–0.38 so the field stays well under the event dots. */
  const starfield = useMemo(
    () => Array.from({ length: STAR_COUNT }, (_, i) => {
      const g = i * 2.399963;
      const r = Math.sqrt(i / STAR_COUNT);
      return {
        x: Math.cos(g) * r,
        y: Math.sin(g) * r,
        a: 0.12 + ((i * 37) % 100) / 380,
        phase: (i % 29) * 0.41,
      };
    }),
    [],
  );

  /* Scales the projected disc. The sphere previously had no zoom at all, which
     made a busy week unreadable — overlapping dots were simply unclickable. */
  const [zoom, setZoom] = useState(1);
  const zoomBy = (f: number) => setZoom(z => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z * f)));

  /* The sphere drifts on its own so the page reads as live. Any interaction
     stops it — it resumes a few seconds after the user lets go, and never fights
     a drag in progress. */
  const [spin, setSpin] = useState(true);
  const resumeRef = useRef<ReturnType<typeof setTimeout>>();
  const pauseSpin = useCallback(() => {
    setSpin(false);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setSpin(true), 6000);
  }, []);

  useEffect(() => {
    if (!spin || dragState.isDragging) return;
    const id = setInterval(() => {
      setViewState(prev => ({ ...prev, azimuth: (prev.azimuth + SPIN_DEG_PER_TICK) % 360 }));
    }, 50);
    return () => clearInterval(id);
  }, [spin, dragState.isDragging]);

  // Convert RA/DEC to screen coordinates with current view rotation
  const celestialToScreen = useCallback((ra: number, dec: number, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.46 * zoom;

    // Convert degrees to radians
    const raRad = (ra * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const azRad = (viewState.azimuth * Math.PI) / 180;
    const altRad = (viewState.altitude * Math.PI) / 180;

    // Apply celestial sphere rotation
    let x = Math.cos(decRad) * Math.cos(raRad);
    let y = Math.cos(decRad) * Math.sin(raRad);
    let z = Math.sin(decRad);

    // Apply azimuth rotation (left/right)
    const cosAz = Math.cos(azRad);
    const sinAz = Math.sin(azRad);
    const newX = x * cosAz - y * sinAz;
    const newY = x * sinAz + y * cosAz;
    x = newX;
    y = newY;

    // Apply altitude rotation (up/down)
    const cosAlt = Math.cos(altRad);
    const sinAlt = Math.sin(altRad);
    const newZ = z * cosAlt - y * sinAlt;
    const finalY = z * sinAlt + y * cosAlt;
    z = newZ;
    y = finalY;

    // Project to screen coordinates
    const screenX = centerX + x * radius;
    const screenY = centerY - y * radius; // Flip Y for screen coordinates
    
    // Calculate depth for 3D effects (z represents distance from viewer)
    const depth = (z + 1) / 2; // Normalize to 0-1
    
    // Check if point is visible (not behind the sphere)
    const isVisible = z > -0.1; // Small tolerance for edge cases
    
    return { x: screenX, y: screenY, depth, isVisible };
  }, [viewState, zoom]);

  // Handle mouse/touch events for dragging
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    pauseSpin();
    setDragState({
      isDragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
      momentum: { x: 0, y: 0 }
    });

    e.preventDefault();
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragState.isDragging) return;

    const deltaX = e.clientX - dragState.lastX;
    const deltaY = e.clientY - dragState.lastY;

    // Convert pixel movement to rotation (adjust sensitivity)
    const sensitivity = 0.5;
    const azimuthDelta = -deltaX * sensitivity; // Negative for natural drag direction
    const altitudeDelta = deltaY * sensitivity;

    setViewState(prev => ({
      azimuth: (prev.azimuth + azimuthDelta) % 360,
      altitude: Math.max(-90, Math.min(90, prev.altitude + altitudeDelta))
    }));

    // Update momentum for inertia
    setDragState(prev => ({
      ...prev,
      lastX: e.clientX,
      lastY: e.clientY,
      momentum: { x: deltaX, y: deltaY }
    }));

    e.preventDefault();
  }, [dragState]);

  const handlePointerUp = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false
    }));

    // Apply momentum for smooth stopping
    const applyMomentum = () => {
      setDragState(current => {
        if (!current.isDragging && (Math.abs(current.momentum.x) > 0.1 || Math.abs(current.momentum.y) > 0.1)) {
          const sensitivity = 0.5;
          const azimuthDelta = -current.momentum.x * sensitivity * 0.95;
          const altitudeDelta = current.momentum.y * sensitivity * 0.95;

          setViewState(prev => ({
            azimuth: (prev.azimuth + azimuthDelta) % 360,
            altitude: Math.max(-90, Math.min(90, prev.altitude + altitudeDelta))
          }));

          return {
            ...current,
            momentum: { 
              x: current.momentum.x * 0.95, 
              y: current.momentum.y * 0.95 
            }
          };
        }
        return current;
      });
    };

    // Continue momentum
    const momentumInterval = setInterval(() => {
      setDragState(current => {
        if (Math.abs(current.momentum.x) < 0.1 && Math.abs(current.momentum.y) < 0.1) {
          clearInterval(momentumInterval);
          return current;
        }
        applyMomentum();
        return current;
      });
    }, 16); // ~60fps
  }, []);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.46 * zoom;

    // Clear canvas with deep space background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    /* Background starfield. Fixed in screen space rather than pinned to the
       sphere — it reads as depth behind the globe, and positions are computed
       once instead of 300 projections a frame. Each star twinkles on its own slow
       sine, phase-offset by position, so the field breathes instead of flickering
       (the old version rolled Math.random() every frame, which strobed). */
    const tw = Date.now() / 1000;
    ctx.fillStyle = '#E7DFDD';
    for (const st of starfield) {
      ctx.globalAlpha = st.a * (0.6 + 0.4 * Math.sin(tw * 0.7 + st.phase));
      ctx.fillRect(centerX + st.x * width * 0.62, centerY + st.y * height * 0.62, 1.2, 1.2);
    }
    ctx.globalAlpha = 1;

    // Create 3D sphere background with gradient
    /* Off-centre light source — the single strongest 3D cue on a flat disc. */
    const sphereGradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.35, radius * 0.05,
      centerX, centerY, radius
    );
    sphereGradient.addColorStop(0, 'rgba(28, 18, 44, 0.90)');
    sphereGradient.addColorStop(1, 'rgba(10, 9, 15, 0.96)');

    ctx.fillStyle = sphereGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Halo, drawn behind the body as a filled disc that fades out.
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.1,
      centerX, centerY, radius * 1.35
    );
    glowGradient.addColorStop(0, 'rgba(141, 15, 245, 0.10)');
    glowGradient.addColorStop(0.62, 'rgba(141, 15, 245, 0.045)');
    glowGradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.35, 0, 2 * Math.PI);
    ctx.fill();

    // Glowing limb — reads as the sphere's edge catching light.
    ctx.strokeStyle = 'rgba(141, 15, 245, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(141, 15, 245, 0.7)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw RA lines (meridians)
    for (let ra = 0; ra < 360; ra += 30) {
      ctx.strokeStyle = 'rgba(231, 223, 221, 0.055)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let dec = -90; dec <= 90; dec += 5) {
        const pos = celestialToScreen(ra, dec, width, height);
        const distFromCenter = Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
        
        if (pos.isVisible && distFromCenter <= radius) {
          if (firstPoint) {
            ctx.moveTo(pos.x, pos.y);
            firstPoint = false;
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
        } else if (!firstPoint) {
          // Break the line when going behind the sphere
          ctx.stroke();
          ctx.beginPath();
          firstPoint = true;
        }
      }
      ctx.stroke();
    }

    // Draw DEC lines (parallels)
    for (let dec = -60; dec <= 60; dec += 30) {
      ctx.strokeStyle = 'rgba(231, 223, 221, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      let firstPoint = true;
      for (let ra = 0; ra < 360; ra += 5) {
        const pos = celestialToScreen(ra, dec, width, height);
        const distFromCenter = Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
        
        if (pos.isVisible && distFromCenter <= radius) {
          if (firstPoint) {
            ctx.moveTo(pos.x, pos.y);
            firstPoint = false;
          } else {
            ctx.lineTo(pos.x, pos.y);
          }
        } else if (!firstPoint) {
          ctx.stroke();
          ctx.beginPath();
          firstPoint = true;
        }
      }
      ctx.stroke();
    }

    /* Cardinals sit just outside the limb as bare text — the old version painted
       a grey plate behind each one, which read as a UI chip stuck to the sphere. */
    ctx.font = "500 10px 'Google Sans Code', ui-monospace, monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(231, 223, 221, 0.42)';
    ([['N', 0], ['E', 90], ['S', 180], ['W', 270]] as Array<[string, number]>).forEach(([label, ra]) => {
      const raRad = (ra * Math.PI) / 180;
      const azRad = (viewState.azimuth * Math.PI) / 180;
      const altRad = (viewState.altitude * Math.PI) / 180;
      let x = Math.cos(raRad), y = Math.sin(raRad), z = 0;
      const nx = x * Math.cos(azRad) - y * Math.sin(azRad);
      const ny = x * Math.sin(azRad) + y * Math.cos(azRad);
      x = nx; y = ny;
      const nz = z * Math.cos(altRad) - y * Math.sin(altRad);
      y = z * Math.sin(altRad) + y * Math.cos(altRad);
      z = nz;
      if (z < -0.15) return;                       // behind the sphere
      const rr = radius * 1.09;                    // just off the limb
      ctx.fillText(label, centerX + x * rr, centerY - y * rr);
    });

    // Draw galactic plane
    ctx.strokeStyle = 'rgba(200, 75, 247, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 7]);
    ctx.beginPath();
    
    let gpFirstPoint = true;
    for (let ra = 0; ra < 360; ra += 2) {
      // Simplified galactic plane (roughly along RA 0-180, tilted)
      const gpDec = 20 * Math.sin((ra * Math.PI) / 180); // Sinusoidal approximation
      const pos = celestialToScreen(ra, gpDec, width, height);
      const distFromCenter = Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
      
      if (pos.isVisible && distFromCenter <= radius) {
        if (gpFirstPoint) {
          ctx.moveTo(pos.x, pos.y);
          gpFirstPoint = false;
        } else {
          ctx.lineTo(pos.x, pos.y);
        }
      } else if (!gpFirstPoint) {
        ctx.stroke();
        ctx.beginPath();
        gpFirstPoint = true;
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw cone search region
    if (coneSearch) {
      const { raDeg: cRA, decDeg: cDec, radiusDeg: r } = coneSearch;
      const cRArad = (cRA * Math.PI) / 180;
      const cDecRad = (cDec * Math.PI) / 180;
      const rRad = (r * Math.PI) / 180;

      // Generate the small-circle boundary at angular radius r from center
      const STEPS = 180;
      const circlePoints: Array<{ ra: number; dec: number }> = [];
      for (let i = 0; i <= STEPS; i++) {
        const bearing = (i / STEPS) * 2 * Math.PI;
        // Standard spherical destination formula
        const sinDec = Math.sin(cDecRad) * Math.cos(rRad)
          + Math.cos(cDecRad) * Math.sin(rRad) * Math.cos(bearing);
        const dec2 = Math.asin(Math.max(-1, Math.min(1, sinDec)));
        const dRA = Math.atan2(
          Math.sin(bearing) * Math.sin(rRad) * Math.cos(cDecRad),
          Math.cos(rRad) - Math.sin(cDecRad) * sinDec
        );
        const ra2 = ((cRA + dRA * 180 / Math.PI) % 360 + 360) % 360;
        circlePoints.push({ ra: ra2, dec: dec2 * 180 / Math.PI });
      }

      const screenPts = circlePoints.map(p => ({
        ...celestialToScreen(p.ra, p.dec, width, height),
      }));

      // Clip drawing to sphere disk
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.clip();

      // Filled shaded region (visible portion only)
      ctx.beginPath();
      let inPath = false;
      for (const pt of screenPts) {
        if (!pt.isVisible) { inPath = false; continue; }
        if (!inPath) { ctx.moveTo(pt.x, pt.y); inPath = true; }
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.fillStyle = 'rgba(141, 15, 245, 0.10)';
      ctx.fill();

      // Dashed boundary — only visible segments
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(141, 15, 245, 0.75)';
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      inPath = false;
      for (const pt of screenPts) {
        if (!pt.isVisible) { if (inPath) { ctx.stroke(); ctx.beginPath(); inPath = false; } continue; }
        if (!inPath) { ctx.moveTo(pt.x, pt.y); inPath = true; }
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();

      // Center crosshair
      const cp = celestialToScreen(cRA, cDec, width, height);
      if (cp.isVisible) {
        const dfc = Math.sqrt((cp.x - centerX) ** 2 + (cp.y - centerY) ** 2);
        if (dfc <= radius) {
          const ARM = 9;
          ctx.strokeStyle = 'rgba(141, 15, 245, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cp.x - ARM, cp.y); ctx.lineTo(cp.x + ARM, cp.y);
          ctx.moveTo(cp.x, cp.y - ARM); ctx.lineTo(cp.x, cp.y + ARM);
          ctx.stroke();
          ctx.fillStyle = 'rgba(141, 15, 245, 1)';
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, 2.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    /* Every positioned event is projected — including the far hemisphere. The
       sphere is translucent, so events behind it render as faint ghosts rather
       than disappearing. Sorted far-to-near so near dots paint over them. */
    const eventPositions = events
      .filter(e => e.raDeg != null && e.decDeg != null)
      .map(event => ({ event, position: celestialToScreen(event.raDeg!, event.decDeg!, width, height) }))
      .sort((a, b) => a.position.depth - b.position.depth);

    eventPositions.forEach(({ event, position }) => {
      const { x, y, depth, isVisible: front } = position;
      const color = kindColor(event.alertKind);
      const isSelected = selectedEvent?.id === event.id
        || (!!selectedEvent?.canonicalId && selectedEvent.canonicalId === event.canonicalId);

      // Behind the sphere: small, dim, no glow. In front: scales with depth.
      const dotSize = DOT_BASE * (front ? 0.72 + depth * 0.55 : 0.55);
      const alpha = front ? 0.62 + depth * 0.38 : 0.16;

      // Localisation error, to scale — selected event only, front side only.
      if (front && isSelected) {
        const errDeg = errorRadius((event as any).posErrorDeg);
        const errPx = errDeg == null ? 0 : (errDeg / 90) * radius;
        if (errPx > dotSize + 3) {
          ctx.globalAlpha = 0.42;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.arc(x, y, errPx, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 0.12;
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      ctx.globalAlpha = alpha;
      if (front) { ctx.shadowBlur = 10; ctx.shadowColor = color; }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Selection is gold so it never collides with a messenger colour.
      if (isSelected && front) {
        const pulse = 1 + Math.sin(Date.now() / 1000 * 2.2) * 0.18;
        ctx.strokeStyle = '#FFB400';
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, (dotSize + 7) * pulse, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(x, y, (dotSize + 13) * pulse, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    });

    // Draw drag feedback
    if (dragState.isDragging) {
      ctx.strokeStyle = 'rgba(141, 15, 245, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* Legend and view read-out moved out of the canvas into DOM below — the
       reference draws them as bare labels with no box, and DOM text stays crisp
       and selectable instead of being repainted every frame. */

  }, [events, selectedEvent, coneSearch, viewState, dragState, celestialToScreen, starfield, zoom]);

  // Handle click events
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragState.isDragging) return; // Don't handle clicks while dragging

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Find closest event to click
    let closestEvent: Event | null = null;
    let closestDistance = Infinity;

    events.forEach((event) => {
      if (event.raDeg !== undefined && event.decDeg !== undefined) {
        const pos = celestialToScreen(event.raDeg, event.decDeg, rect.width, rect.height);
        if (pos.isVisible) {
          const distance = Math.sqrt((clickX - pos.x) ** 2 + (clickY - pos.y) ** 2);
          if (distance <= 20 && distance < closestDistance) {
            closestDistance = distance;
            closestEvent = event;
          }
        }
      }
    });

    if (closestEvent) {
      onEventClick(closestEvent);
    }
  }, [events, dragState.isDragging, celestialToScreen, onEventClick]);

  // Animation loop for smooth rendering
  useEffect(() => {
    const animate = () => {
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`h-full bg-gradient-to-br from-background via-background to-muted/20 rounded-xl overflow-hidden backdrop-blur-sm relative ${className || ''}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleCanvasClick}
        onWheel={e => { pauseSpin(); zoomBy(e.deltaY < 0 ? 1.12 : 1 / 1.12); }}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Zoom controls — right edge, mid-height: the only band not claimed by the
          event card (bottom-left), the nearby panel (top-right) or the legend. */}
      <div
        className="flex flex-col gap-1.5"
        style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}
      >
        {([
          { label: '+', title: 'Zoom in', onClick: () => { pauseSpin(); zoomBy(1.35); } },
          { label: '−', title: 'Zoom out', onClick: () => { pauseSpin(); zoomBy(1 / 1.35); } },
          { label: '⌂', title: 'Reset view', onClick: () => { pauseSpin(); setZoom(1); setViewState({ azimuth: 0, altitude: 0 }); } },
        ]).map(b => (
          <button
            key={b.label}
            onClick={b.onClick}
            title={b.title}
            style={{
              width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Google Sans Code', ui-monospace, monospace",
              fontSize: 14, lineHeight: 1,
              color: 'rgba(231, 223, 221, 0.7)',
              background: 'rgba(14, 11, 22, 0.72)',
              border: '1px solid rgba(231, 223, 221, 0.14)',
              borderRadius: 8,
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* Legend — bare labels, right-aligned, no container. The reference has no
          box here, and a bordered card competed with the nearby panel above it. */}
      <div
        style={{
          position: 'absolute', right: 8, bottom: 16,
          display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end',
          pointerEvents: 'none',
        }}
      >
        {LEGEND.map(l => (
          <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              fontFamily: "'Google Sans Code', ui-monospace, monospace",
              fontSize: 11,
              color: 'rgba(231, 223, 221, 0.55)',
            }}>{l.label}</span>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: l.color, boxShadow: `0 0 7px ${l.color}`,
            }} />
          </div>
        ))}
      </div>

      {/* Interaction hint */}
      <div
        style={{
          position: 'absolute', top: 14, right: 20,
          fontFamily: "'Google Sans Code', ui-monospace, monospace",
          fontSize: 11,
          color: 'rgba(231, 223, 221, 0.38)',
          pointerEvents: 'none',
        }}
      >
        {dragState.isDragging
          ? 'Rotating…'
          : `Drag to rotate · scroll to zoom${zoom !== 1 ? ` · ${zoom.toFixed(1)}×` : ''}`}
      </div>
    </div>
  );
}

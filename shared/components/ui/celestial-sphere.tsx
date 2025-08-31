import React, { useRef, useEffect, useState, useCallback } from 'react';

// Use a generic Event interface that matches the expected structure
interface Event {
  id: string;
  canonicalId?: string;
  alertKind: string;
  sourceName: string;
  phase: string;
  t0: string;
  producedAt: string;
  raDeg?: number;
  decDeg?: number;
  posErrorDeg?: number;
  hasSkymap: boolean;
  classification?: Record<string, any>;
}

interface CelestialSphereProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  selectedEvent?: Event | null;
  className?: string;
}

interface ViewState {
  azimuth: number;    // Horizontal rotation (0-360)
  altitude: number;   // Vertical rotation (-90 to 90)
}

interface DragState {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  momentum: { x: number; y: number };
}

export function CelestialSphere({ events, onEventClick, selectedEvent, className }: CelestialSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  
  const [viewState, setViewState] = useState<ViewState>({
    azimuth: 0,    // Start facing north
    altitude: 0    // Start at horizon
  });
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    momentum: { x: 0, y: 0 }
  });

  // Convert RA/DEC to screen coordinates with current view rotation
  const celestialToScreen = useCallback((ra: number, dec: number, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;

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
  }, [viewState]);

  // Handle mouse/touch events for dragging
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

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
    const radius = Math.min(width, height) * 0.4;

    // Clear canvas with deep space background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Create dynamic starfield that rotates with view
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 300; i++) {
      // Generate consistent star positions based on seed
      const starRA = (i * 137.5) % 360; // Golden angle distribution
      const starDec = Math.asin((i / 150) - 1) * (180 / Math.PI); // Even distribution
      
      const starPos = celestialToScreen(starRA, starDec, width, height);
      if (starPos.isVisible && 
          Math.sqrt((starPos.x - centerX) ** 2 + (starPos.y - centerY) ** 2) < radius) {
        const brightness = Math.random();
        ctx.globalAlpha = brightness * starPos.depth * 0.6;
        ctx.beginPath();
        ctx.arc(starPos.x, starPos.y, brightness * 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Create 3D sphere background with gradient
    const sphereGradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX, centerY, radius * 1.2
    );
    sphereGradient.addColorStop(0, 'rgba(119, 15, 245, 0.15)');
    sphereGradient.addColorStop(0.4, 'rgba(119, 15, 245, 0.08)');
    sphereGradient.addColorStop(0.7, 'rgba(19, 19, 24, 0.3)');
    sphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

    ctx.fillStyle = sphereGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Add outer glow
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.95,
      centerX, centerY, radius * 1.1
    );
    glowGradient.addColorStop(0, 'rgba(119, 15, 245, 0.3)');
    glowGradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = glowGradient;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw main sphere boundary
    ctx.strokeStyle = 'rgba(119, 15, 245, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw RA lines (meridians)
    for (let ra = 0; ra < 360; ra += 30) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
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

    // Draw cardinal direction indicators
    ctx.fillStyle = '#8b8b94';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    // North, South, East, West
    const directions = [
      { ra: 0, dec: 0, label: 'N', offset: 25 },
      { ra: 180, dec: 0, label: 'S', offset: 25 },
      { ra: 90, dec: 0, label: 'E', offset: 25 },
      { ra: 270, dec: 0, label: 'W', offset: 25 }
    ];

    directions.forEach(dir => {
      const pos = celestialToScreen(dir.ra, dir.dec, width, height);
      if (pos.isVisible) {
        const distFromCenter = Math.sqrt((pos.x - centerX) ** 2 + (pos.y - centerY) ** 2);
        if (distFromCenter <= radius) {
          // Calculate direction for label offset
          const angle = Math.atan2(pos.y - centerY, pos.x - centerX);
          const labelX = pos.x + Math.cos(angle) * dir.offset;
          const labelY = pos.y + Math.sin(angle) * dir.offset;
          
          ctx.fillStyle = 'rgba(139, 139, 148, 0.8)';
          ctx.fillRect(labelX - 10, labelY - 8, 20, 16);
          ctx.fillStyle = '#8b8b94';
          ctx.fillText(dir.label, labelX, labelY + 4);
        }
      }
    });

    // Draw galactic plane
    ctx.strokeStyle = 'rgba(162, 57, 202, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
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

    // Sort events by depth for proper 3D rendering
    const eventPositions = events
      .filter(event => event.raDeg !== undefined && event.decDeg !== undefined)
      .map(event => ({
        event,
        position: celestialToScreen(event.raDeg!, event.decDeg!, width, height)
      }))
      .filter(({ position }) => {
        const distFromCenter = Math.sqrt((position.x - centerX) ** 2 + (position.y - centerY) ** 2);
        return position.isVisible && distFromCenter <= radius;
      })
      .sort((a, b) => a.position.depth - b.position.depth); // Draw farthest first

    // Draw events with enhanced 3D appearance
    eventPositions.forEach(({ event, position }) => {
      const { x, y, depth } = position;

      // Event color based on alert kind
      let color = '#FFB400';
      switch (event.alertKind?.toLowerCase()) {
        case 'grb':
        case 'gamma-ray burst':
          color = '#FF6B6B';
          break;
        case 'gw':
        case 'gravitational wave':
          color = '#770ff5';
          break;
        case 'neutrino':
          color = '#4ECDC4';
          break;
        case 'supernova':
          color = '#FFB400';
          break;
        case 'flare':
          color = '#FF9F43';
          break;
        default:
          color = '#770ff5';
          break;
      }

      // Apply depth-based effects
      const scale = 0.6 + depth * 0.4;
      const alpha = 0.7 + depth * 0.3;
      
      // Draw glow effect for selected event
      if (selectedEvent?.id === event.id) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 15 * scale, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw event dot with 3D appearance
      ctx.globalAlpha = alpha;
      
      const dotGradient = ctx.createRadialGradient(
        x - 2, y - 2, 0,
        x, y, (selectedEvent?.id === event.id ? 8 : 5) * scale
      );
      dotGradient.addColorStop(0, color);
      dotGradient.addColorStop(0.7, color);
      dotGradient.addColorStop(1, `${color}80`);

      ctx.fillStyle = dotGradient;
      ctx.beginPath();
      const dotSize = selectedEvent?.id === event.id ? 8 * scale : 5 * scale;
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI);
      ctx.fill();

      // Draw selection ring with pulsing effect
      if (selectedEvent?.id === event.id) {
        const time = Date.now() / 1000;
        const pulse = Math.sin(time * 3) * 0.5 + 0.5;
        ctx.globalAlpha = (0.6 + pulse * 0.4) * alpha;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, (12 + pulse * 3) * scale, 0, 2 * Math.PI);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    });

    // Draw drag feedback
    if (dragState.isDragging) {
      ctx.strokeStyle = 'rgba(119, 15, 245, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Enhanced legend
    const legendX = width - 170;
    const legendY = height - 140;
    
    ctx.fillStyle = 'rgba(19, 19, 24, 0.9)';
    ctx.strokeStyle = 'rgba(119, 15, 245, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(legendX - 10, legendY - 10, 160, 120, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e5e5e9';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'left';
    
    const legendItems = [
      { color: '#FF6B6B', label: 'Gamma-Ray Burst' },
      { color: '#4ECDC4', label: 'Neutrino' },
      { color: '#770ff5', label: 'Gravitational Wave' },
      { color: '#FFB400', label: 'Supernova' },
      { color: '#FF9F43', label: 'Stellar Flare' }
    ];

    legendItems.forEach((item, index) => {
      const x = legendX;
      const y = legendY + index * 16;
      
      const legendGradient = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, 4);
      legendGradient.addColorStop(0, item.color);
      legendGradient.addColorStop(1, `${item.color}CC`);
      
      ctx.fillStyle = legendGradient;
      ctx.beginPath();
      ctx.arc(x + 5, y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#e5e5e9';
      ctx.fillText(item.label, x + 15, y + 4);
    });

    // Draw view coordinates
    ctx.fillStyle = '#8b8b94';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'right';
    const azText = `Az: ${viewState.azimuth.toFixed(1)}°`;
    const altText = `Alt: ${viewState.altitude.toFixed(1)}°`;
    ctx.fillText(azText, width - 20, height - 30);
    ctx.fillText(altText, width - 20, height - 15);

  }, [events, selectedEvent, viewState, dragState, celestialToScreen]);

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
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Interaction hint */}
      <div className="absolute top-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2">
        <p className="text-xs text-muted-foreground">
          {dragState.isDragging ? 'Dragging...' : 'Drag to rotate • Click events for details'}
        </p>
      </div>
    </div>
  );
}

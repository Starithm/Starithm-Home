import React, { useEffect, useState } from 'react';

/**
 * The Starithm mark as a loading indicator — three arcs orbiting at non-harmonic
 * rates with an amber scanning band.
 *
 * Styles live in shared/styles/globals.css (`.st-loader`), which every microfrontend
 * already imports, so there is nothing extra to wire up.
 *
 *   <StarithmLoader />                          // 40px, theme-aware
 *   <StarithmLoader size={72} label="Loading events" />
 *   <StarithmLoader tone="dark" />              // force dark-bg colours
 *   <StarithmLoader delay={0} />                // show immediately
 */
export interface StarithmLoaderProps {
  /** Rendered size in px. */
  size?: number;
  /** Arc colour target. 'auto' follows the `.dark` class; override for hardcoded surfaces. */
  tone?: 'auto' | 'light' | 'dark';
  /** Time one full inner-arc rotation takes, in ms. Others derive at x1.55 and x2.35. */
  speed?: number;
  /**
   * Wait this long before appearing, in ms. Stops a spinner flashing on and off for
   * responses that were already fast — which reads as jank, not speed. Pass 0 to disable.
   */
  delay?: number;
  /** Accessible name announced to screen readers. */
  label?: string;
  className?: string;
}

export function StarithmLoader({
  size = 40,
  tone = 'auto',
  speed = 900,
  delay = 300,
  label = 'Loading',
  className = '',
}: StarithmLoaderProps) {
  const [shown, setShown] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!shown) return null;

  return (
    <svg
      className={`st-loader ${className}`}
      data-tone={tone === 'auto' ? undefined : tone}
      style={{ ['--st-base' as string]: `${speed}ms`, width: size, height: size }}
      viewBox="0 0 64 64"
      role="img"
      aria-label={label}
    >
      <circle
        className="st-a1" cx="32" cy="32" r="12" fill="none"
        stroke="var(--st-arc)" strokeWidth="3.4" strokeDasharray="36 100"
        strokeLinecap="round" transform="rotate(148 32 32)"
      />
      <circle
        className="st-a2" cx="32" cy="32" r="20.5" fill="none"
        stroke="var(--st-band)" strokeWidth="3.4" strokeDasharray="61.5 200"
        strokeLinecap="round" transform="rotate(148 32 32)" opacity="0.95"
      />
      <circle
        className="st-a3" cx="32" cy="32" r="29" fill="none"
        stroke="var(--st-arc)" strokeWidth="3.4" strokeDasharray="87 300"
        strokeLinecap="round" transform="rotate(148 32 32)" opacity="0.5"
      />
      <circle cx="32" cy="32" r="5.2" fill="var(--st-band)" />
    </svg>
  );
}

/** Loader plus a caption, centred — the common full-panel case. */
export function StarithmLoaderBlock({
  message,
  size = 56,
  tone = 'auto',
  speed = 900,
  delay = 300,
}: StarithmLoaderProps & { message?: string }) {
  const [shown, setShown] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!shown) return null;

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '1rem', padding: '2rem',
      }}
    >
      <StarithmLoader size={size} tone={tone} speed={speed} delay={0} />
      {message && (
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.6, textAlign: 'center' }}>
          {message}
        </p>
      )}
    </div>
  );
}

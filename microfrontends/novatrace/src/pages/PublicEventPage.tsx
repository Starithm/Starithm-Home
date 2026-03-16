import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Radio, FileText, ExternalLink, AlertTriangle, Copy, Check } from 'lucide-react';
import { API_ENDPOINTS } from '@shared/lib/config';

interface PublicEvent {
  canonicalId: string;
  alertKind: string;
  sourceName: string | null;
  t0: string | null;
  raDeg: number | null;
  decDeg: number | null;
  posErrorDeg: number | null;
  noticeCount: number;
  circularCount: number;
  aiSummary: {
    headline: string;
    significance: string;
    details: string;
    generatedAt: string;
  } | null;
  notices: Array<{
    id: string;
    topic: string;
    phase: string | null;
    t0: string | null;
    producedAt: string | null;
    raDeg: number | null;
    decDeg: number | null;
    posErrorDeg: number | null;
    classification: Record<string, number> | null;
    links: Record<string, any> | null;
    payload: Record<string, any> | null;
  }>;
  circulars: Array<{
    alertKey: string;
    event: string;
    summary: string;
    date: string;
    data?: {
      authors?: { authors?: string[]; affiliations?: string[]; institutions?: string[] };
      measurements?: Record<string, any>;
      urls?: string[];
      [key: string]: any;
    };
    tags?: string[];
  }>;
}

const SIGNIFICANCE_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

function formatCoordinate(value: number | string, type: 'ra' | 'dec'): string {
  const v = Number(value);
  if (type === 'ra') {
    const h = Math.floor(v / 15);
    const m = Math.floor((v % 15) * 4);
    const s = ((v % 15) * 4 - m) * 60;
    return `${h}h ${m}m ${s.toFixed(1)}s`;
  }
  const sign = v >= 0 ? '+' : '-';
  const d = Math.floor(Math.abs(v));
  const m = Math.floor((Math.abs(v) % 1) * 60);
  const s = ((Math.abs(v) % 1) * 60 - m) * 60;
  return `${sign}${d}° ${m}' ${s.toFixed(1)}"`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

function getPayloadMetrics(alertKind: string, payload: Record<string, any>): Array<{ label: string; value: string }> {
  const p = payload || {};
  const metrics: Array<{ label: string; value: string }> = [];
  const add = (label: string, val: any, unit = '') => {
    if (val != null && val !== '') metrics.push({ label, value: `${val}${unit}` });
  };
  switch (alertKind?.toLowerCase()) {
    case 'grb':
      add('Duration', p.trig_dur, 's');
      add('Significance', p.trig_signif, 'σ');
      if (p.lo_chan_energy != null && p.hi_chan_energy != null) add('Energy Range', `${p.lo_chan_energy}–${p.hi_chan_energy} keV`);
      add('Image SNR', p.image_snr);
      add('Rate SNR', p.rate_snr);
      add('Detectors', p.dets);
      break;
    case 'gw':
      if (p.far != null) add('FAR', typeof p.far === 'number' ? p.far.toExponential(2) : p.far, ' /yr');
      if (p.distance_mean_Mpc != null) add('Distance', `${Number(p.distance_mean_Mpc).toFixed(0)} ± ${Number(p.distance_std_Mpc ?? 0).toFixed(0)} Mpc`);
      add('Group', p.group);
      add('Pipeline', p.pipeline);
      break;
    case 'xray':
      add('Net Count Rate', p.net_count_rate);
      add('Image SNR', p.image_snr);
      add('Alert Type', p.alert_type);
      break;
    case 'neutrino':
      add('Signalness', p.signalness);
      add('Energy', p.energy);
      break;
    case 'frb':
      add('DM', p.dm, ' pc/cm³');
      add('SNR', p.snr);
      add('Width', p.width, ' ms');
      break;
  }
  return metrics;
}

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

function CircularMeasurements({ measurements }: { measurements: Record<string, any> }) {
  const entries = Object.entries(measurements).filter(([, v]) => v != null);
  if (entries.length === 0) return null;

  return (
    <div style={{ marginTop: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Measurements</div>
      {entries.map(([key, value]) => {
        if (key === 'tables') return null;
        const label = key.replace(/_/g, ' ');

        // other_measurements: nested object → expand as key-value list
        if (key === 'other_measurements' && typeof value === 'object' && !Array.isArray(value)) {
          const subEntries = Object.entries(value).filter(([, v]) => v != null);
          if (subEntries.length === 0) return null;
          return (
            <div key={key}>
              <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{label}</div>
              <div style={{ paddingLeft: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                {subEntries.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.7rem', color: '#555', minWidth: 100 }}>{k.replace(/_/g, ' ')}:</span>
                    <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                      {typeof v === 'object' ? JSON.stringify(v).replace(/"/g, '') : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Array of objects → table
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          const cols = Object.keys(value[0]);
          return (
            <div key={key} style={{ overflowX: 'auto' }}>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                <thead>
                  <tr>{cols.map(c => <th key={c} style={{ padding: '0.25rem 0.5rem', color: '#555', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid #222' }}>{c.replace(/_/g, ' ')}</th>)}</tr>
                </thead>
                <tbody>
                  {value.map((row, i) => (
                    <tr key={i}>
                      {cols.map(c => <td key={c} style={{ padding: '0.25rem 0.5rem', color: '#999', borderBottom: '1px solid #1a1a1a' }}>{typeof row[c] === 'object' ? JSON.stringify(row[c]).replace(/"/g, '') : String(row[c] ?? '—')}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Array of primitives
        if (Array.isArray(value)) {
          return (
            <div key={key} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>{label}:</span>
              <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{value.join(', ').replace(/"/g, '')}</span>
            </div>
          );
        }

        // Nested object (generic)
        if (typeof value === 'object') {
          return (
            <div key={key} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.7rem', color: '#666' }}>{label}:</span>
              <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{JSON.stringify(value).replace(/"/g, '')}</span>
            </div>
          );
        }

        // Scalar
        return (
          <div key={key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={{ fontSize: '0.7rem', color: '#666', minWidth: 90 }}>{label}:</span>
            <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

function topClassification(cls: Record<string, any> | null): string {
  if (!cls) return '';
  const extract = (v: any): number => {
    if (typeof v === 'number') return v;
    if (typeof v === 'object' && v !== null && 'probability' in v) return Number(v.probability);
    return Number(v);
  };
  return Object.entries(cls)
    .map(([k, v]) => [k, extract(v)] as [string, number])
    .filter(([, v]) => !isNaN(v))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([k, v]) => `${k.replace(/_/g, ' ')} ${(v * 100).toFixed(0)}%`)
    .join(' · ');
}

export default function PublicEventPage({ canonicalId }: { canonicalId?: string }) {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedNotices, setExpandedNotices] = useState<Set<string>>(new Set());
  const [expandedCirculars, setExpandedCirculars] = useState<Set<string>>(new Set());
  const [rawModal, setRawModal] = useState<{ title: string; data: any; type: 'notice' | 'circular' } | null>(null);

  const toggleNotice = (id: string) => setExpandedNotices(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleCircular = (key: string) => setExpandedCirculars(prev => {
    const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next;
  });

  useEffect(() => {
    if (!canonicalId) return;
    fetch(API_ENDPOINTS.publicEvent(canonicalId))
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (data) {
          setEvent(data);
          setExpandedCirculars(new Set((data.circulars as Array<{ alertKey: string }>).map(c => c.alertKey)));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [canonicalId]);

  useEffect(() => {
    if (event?.aiSummary?.headline) {
      document.title = `${event.aiSummary.headline} — Starithm`;
    }
  }, [event]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const s = { background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' };

  if (loading) return (
    <div style={{ ...s, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#888' }}>Loading event...</div>
    </div>
  );

  if (notFound || !event) return (
    <div style={{ ...s, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <AlertTriangle size={40} style={{ color: '#888', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '0.5rem' }}>Event not found</h2>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>No data found for {canonicalId}</p>
        <Link to="/novatrace/events" style={{ color: '#770ff5' }}>← Back to Events</Link>
      </div>
    </div>
  );

  const sigColor = SIGNIFICANCE_COLORS[event.aiSummary?.significance || 'medium'] || '#888';

  return (
    <div style={s}>
      {/* Nav */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '0.75rem 1.5rem 0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/novatrace/events" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>
          ← All Events
        </Link>
        <span style={{ color: '#333' }}>/</span>
        <span style={{ color: '#aaa', fontSize: '0.875rem', fontFamily: 'monospace' }}>{event.canonicalId}</span>
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={handleCopyLink}
            style={{ background: 'none', border: '1px solid #333', color: '#aaa', padding: '0.375rem 0.75rem', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0', padding: '2rem 1.5rem 2rem 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#770ff5', background: 'rgba(119,15,245,0.1)', padding: '0.25rem 0.625rem', borderRadius: 4 }}>
              {event.alertKind.toUpperCase()}
            </span>
            {event.aiSummary?.significance && (
              <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: sigColor, background: `${sigColor}18`, padding: '0.25rem 0.625rem', borderRadius: 4 }}>
                {event.aiSummary.significance}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem', color: '#fff' }}>
            {event.aiSummary?.headline || event.canonicalId}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: '#888', fontSize: '0.8rem' }}>
            {event.t0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Calendar size={14} /> {formatDate(event.t0)}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Radio size={14} /> {event.noticeCount} notices
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <FileText size={14} /> {event.circularCount} circulars
            </span>
            {event.sourceName && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <AlertTriangle size={14} /> {event.sourceName}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
          {/* Main column */}
          <div>
            {/* AI Summary */}
            {event.aiSummary && (
              <Section title="Starithm Summary">
                <p style={{ color: '#f5c518', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>{event.aiSummary.details}</p>
              </Section>
            )}

            {/* Notice timeline */}
            <Section title={`Alert Timeline (${event.notices.length} notices)`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {event.notices.map((n, i) => {
                  const isExpanded = expandedNotices.has(n.id);
                  const metrics = getPayloadMetrics(event.alertKind, n.payload || {});
                  const payload = n.payload || {};
                  const p = payload;
                  const getObs = (key: string) => p.obs_support_info?.[key] ?? p[`obs_support_info_${key}`] ?? null;
                  const classLabel = topClassification(n.classification);
                  const curatedFields: Array<[string, any]> = [
                    ['ID', n.id],
                    ['Instrument', p.instrument],
                    ['RA', n.raDeg != null ? formatCoordinate(n.raDeg, 'ra') : null],
                    ['Dec', n.decDeg != null ? formatCoordinate(n.decDeg!, 'dec') : null],
                    ['Classification', classLabel || null],
                    ['Importance', p.importance],
                    ['Trigger ID', p.trigger_id],
                    ['Moon Dist', getObs('moon_distance')],
                    ['Sun Dist', getObs('sun_distance')],
                    ['Hi Energy', p.hi_energy],
                  ].filter(([, v]) => v != null && v !== '');
                  return (
                    <div key={n.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
                      {/* Always-visible header — click to expand */}
                      <button
                        onClick={() => toggleNotice(n.id)}
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '0.875rem 1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ color: '#770ff5', fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600 }}>#{i + 1}</span>
                          <span style={{ color: '#aaa', fontSize: '0.75rem', fontFamily: 'monospace' }}>{n.id || p.trigger_id || ''}</span>
                          {n.phase && <span style={{ color: '#666', fontSize: '0.72rem', textTransform: 'capitalize' }}>{n.phase.replace(/_/g, ' ')}</span>}
                          <span style={{ color: '#444', fontSize: '0.7rem', marginLeft: 'auto' }}>{isExpanded ? '▲' : '▼'}</span>
                          {n.t0 && <span style={{ color: '#555', fontSize: '0.72rem' }}>{formatDate(n.t0)}</span>}
                        </div>
                        {curatedFields.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                            {curatedFields.map(([label, value]) => (
                              <span key={label as string} style={{ fontSize: '0.7rem', color: '#666' }}>
                                <span style={{ color: '#444' }}>{label}: </span>{String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                        {metrics.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1rem' }}>
                            {metrics.map(m => (
                              <span key={m.label} style={{ fontSize: '0.7rem', color: '#666' }}>
                                <span style={{ color: '#444' }}>{m.label}: </span>{m.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>

                      {/* Expanded: full payload table */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid #1e1e1e', padding: '0.75rem 1rem' }}>
                          {n.raDeg != null && (
                            <div style={{ color: '#666', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                              {formatCoordinate(n.raDeg, 'ra')} {formatCoordinate(n.decDeg!, 'dec')}
                              {n.posErrorDeg != null && ` ± ${Number(n.posErrorDeg).toFixed(2)}°`}
                            </div>
                          )}
                          {n.links && Object.entries(n.links).filter(([, v]) => typeof v === 'string' && (v as string).startsWith('http')).map(([k, v]) => (
                            <a key={k} href={v as string} target="_blank" rel="noopener noreferrer" style={{ color: '#770ff5', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem', marginRight: '0.75rem' }}>
                              <ExternalLink size={11} /> {k}
                            </a>
                          ))}
                          {Object.keys(payload).length > 0 && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem', marginTop: '0.25rem' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '38%', padding: '0.25rem 0.5rem', color: '#555', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid #222' }}>Field</th>
                                  <th style={{ padding: '0.25rem 0.5rem', color: '#555', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid #222' }}>Value</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(payload).map(([k, v]) => (
                                  <tr key={k}>
                                    <td style={{ padding: '0.25rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', verticalAlign: 'top', wordBreak: 'break-all' }}>{k}</td>
                                    <td style={{ padding: '0.25rem 0.5rem', color: '#999', fontFamily: 'monospace', borderBottom: '1px solid #181818', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                      {typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>

            {/* Circulars */}
            {event.circulars.length > 0 && (
              <Section title={`Community Circulars (${event.circulars.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {event.circulars.map((c, i) => {
                    const isExpanded = expandedCirculars.has(c.alertKey);
                    const authors = c.data?.authors?.authors;
                    const institutions = c.data?.authors?.institutions;
                    const measurements = c.data?.measurements;
                    const hasMeasurements = measurements && Object.keys(measurements).length > 0;
                    const allUrls: string[] = c.data?.urls || [];
                    const imageUrls = allUrls.filter((u: string) => IMAGE_EXTS.test(u));
                    const linkUrls = allUrls.filter((u: string) => !IMAGE_EXTS.test(u));
                    const tags = c.tags?.length ? c.tags : null;
                    const redshift = measurements
                      ? (measurements.redshift ?? measurements.z ?? measurements.redshift_z ?? null)
                      : null;
                    const hasExtra = hasMeasurements || imageUrls.length > 0 || linkUrls.length > 0 || (authors && authors.length > 0);
                    return (
                      <div key={c.alertKey} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
                        {/* Always-visible header */}
                        <div style={{ display: 'flex', alignItems: 'stretch' }}>
                        <button
                          onClick={() => hasExtra && toggleCircular(c.alertKey)}
                          style={{ flex: 1, background: 'none', border: 'none', cursor: hasExtra ? 'pointer' : 'default', padding: '0.875rem 1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ color: '#770ff5', fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600 }}>#{i + 1}</span>
                            <span style={{ color: '#444', fontSize: '0.7rem', fontFamily: 'monospace' }}>{c.alertKey}</span>
                            {redshift != null && (
                              <span style={{ fontSize: '0.7rem', color: '#f5c518', fontWeight: 600 }}>z = {typeof redshift === 'number' ? redshift.toFixed(4) : redshift}</span>
                            )}
                            {tags && tags.slice(0, 2).map(t => (
                              <span key={t} style={{ fontSize: '0.62rem', color: '#770ff5', background: 'rgba(119,15,245,0.08)', padding: '0.1rem 0.4rem', borderRadius: 3 }}>{t}</span>
                            ))}
                            {hasExtra && <span style={{ color: '#444', fontSize: '0.7rem', marginLeft: 'auto' }}>{isExpanded ? '▲' : '▼'}</span>}
                            <span style={{ color: '#555', fontSize: '0.72rem', marginLeft: hasExtra ? '0' : 'auto' }}>{c.date ? formatDate(c.date) : ''}</span>
                          </div>
                          {/* Summary always shown */}
                          <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{c.summary}</p>
                        </button>
                        <button
                          onClick={() => setRawModal({ title: `Circular #${i + 1} — ${c.alertKey}`, data: c, type: 'circular' })}
                          style={{ background: 'none', border: 'none', borderLeft: '1px solid #1e1e1e', cursor: 'pointer', padding: '0 0.75rem', color: '#444', fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                        >raw</button>
                        </div>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #1e1e1e', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {/* Authors */}
                            {authors && authors.length > 0 && (
                              <div>
                                <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Authors</div>
                                <div style={{ color: '#777', fontSize: '0.75rem' }}>
                                  {authors.join(', ')}
                                </div>
                                {institutions && institutions.length > 0 && (
                                  <div style={{ color: '#555', fontSize: '0.68rem', fontStyle: 'italic', marginTop: '0.2rem' }}>
                                    {institutions.join('; ')}
                                  </div>
                                )}
                              </div>
                            )}
                            {/* All tags */}
                            {tags && tags.length > 2 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                {tags.map(t => (
                                  <span key={t} style={{ fontSize: '0.65rem', color: '#770ff5', background: 'rgba(119,15,245,0.08)', padding: '0.125rem 0.5rem', borderRadius: 3 }}>{t}</span>
                                ))}
                              </div>
                            )}
                            {/* Measurements */}
                            {hasMeasurements && <CircularMeasurements measurements={measurements} />}
                            {/* Images */}
                            {imageUrls.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {imageUrls.map((url: string, idx: number) => (
                                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                                    <img
                                      src={url}
                                      alt={`Image ${idx + 1}`}
                                      style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 6, border: '1px solid #2a2a2a', cursor: 'pointer' }}
                                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                  </a>
                                ))}
                              </div>
                            )}
                            {/* Links */}
                            {linkUrls.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Links</div>
                                {linkUrls.map((url: string, idx: number) => (
                                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                                    style={{ fontSize: '0.75rem', color: '#f5c518', textDecoration: 'underline', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <ExternalLink size={11} style={{ flexShrink: 0 }} />{url}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Cite block */}
            <Section title="Cite This Event">
              <pre style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '1rem', fontSize: '0.75rem', color: '#a78bfa', overflowX: 'auto', margin: 0 }}>{`@misc{starithm_${event.canonicalId.toLowerCase().replace(/[^a-z0-9]/g, '_')},
  title     = {${event.aiSummary?.headline || event.canonicalId}},
  author    = {{Starithm Platform}},
  year      = {${new Date(event.t0 || Date.now()).getFullYear()}},
  url       = {${window.location.href}},
  note      = {Real-time astronomical event monitoring, Starithm}
}`}</pre>
            </Section>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SideCard title="Position">
              {event.raDeg != null ? (
                <>
                  <SideField label="RA" value={formatCoordinate(event.raDeg, 'ra')} />
                  <SideField label="Dec" value={formatCoordinate(event.decDeg!, 'dec')} />
                  {event.posErrorDeg != null && <SideField label="Error" value={`± ${Number(event.posErrorDeg).toFixed(2)}°`} />}
                </>
              ) : <span style={{ color: '#555', fontSize: '0.8rem' }}>No position data</span>}
            </SideCard>

            <SideCard title="Activity">
              <SideField label="Notices" value={String(event.noticeCount)} />
              <SideField label="Circulars" value={String(event.circularCount)} />
              {event.aiSummary?.generatedAt && (
                <SideField label="Summary generated" value={new Date(event.aiSummary.generatedAt).toLocaleDateString()} />
              )}
            </SideCard>

            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '1rem', fontSize: '0.8rem', color: '#666', lineHeight: 1.6 }}>
              Monitored in real-time by{' '}
              <Link to="/novatrace/events" style={{ color: '#770ff5', textDecoration: 'none' }}>Starithm</Link>
              {' '}— multi-messenger astronomical event tracking.
            </div>
          </div>
        </div>
      </div>

      {/* Raw data modal */}
      {rawModal && (
        <div
          onClick={() => setRawModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, width: '100%', maxWidth: 720, maxHeight: '80vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ color: '#aaa', fontSize: '0.8rem', fontFamily: 'monospace' }}>{rawModal.title}</span>
              <button onClick={() => setRawModal(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {rawModal.type === 'notice' ? (() => {
                const n = rawModal.data;
                const p = n.payload || {};
                const getVal = (a: any, b?: any) => a != null ? a : (b != null ? b : null);
                const fields: Array<[string, any]> = [
                  ['ID', n.id],
                  ['Instrument', p.instrument],
                  ['RA', n.raDeg != null ? formatCoordinate(n.raDeg, 'ra') : null],
                  ['Dec', n.decDeg != null ? formatCoordinate(n.decDeg, 'dec') : null],
                  ['Trigger Time', n.t0 ? formatDate(n.t0) : (p.trigger_time || null)],
                  ['Importance', p.importance],
                  ['Trigger ID', p.trigger_id],
                  ['Moon Distance', getVal(p.obs_support_info?.moon_distance, p.obs_support_info_moon_distance)],
                  ['Sun Distance', getVal(p.obs_support_info?.sun_distance, p.obs_support_info_sun_distance)],
                  ['Hi Energy', p.hi_energy],
                ].filter(([, v]) => v != null && v !== '');
                const imgFields: Array<[string, string]> = [
                  ['Lightcurve', getVal(p.lightcurve_url, n.links?.lightcurve_url)],
                  ['Location Map', getVal(p.locationmap_url, n.links?.locationmap_url)],
                ].filter(([, u]) => u) as Array<[string, string]>;
                return (
                  <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                      <tbody>
                        {fields.map(([label, value]) => (
                          <tr key={label}>
                            <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', width: '38%', verticalAlign: 'top' }}>{label}</td>
                            <td style={{ padding: '0.3rem 0.5rem', color: '#ccc', fontFamily: 'monospace', borderBottom: '1px solid #181818', wordBreak: 'break-word' }}>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {imgFields.map(([label, url]) => (
                      <div key={label} style={{ marginTop: '0.5rem' }}>
                        <div style={{ fontSize: '0.68rem', color: '#555', marginBottom: '0.25rem' }}>{label}</div>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt={label} style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 6, border: '1px solid #2a2a2a' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                        </a>
                      </div>
                    ))}
                  </>
                );
              })() : (() => {
                const raw = rawModal.data.data?.raw;
                if (!raw) return <span style={{ color: '#555', fontSize: '0.8rem' }}>No raw data</span>;
                if (typeof raw === 'string') return <pre style={{ margin: 0, fontSize: '0.72rem', color: '#a78bfa', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{raw}</pre>;
                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <tbody>
                      {Object.entries(raw).map(([key, value]) => {
                        const label = key.replace(/_/g, ' ');
                        // Classification-style: { key: { probability: n } }
                        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                          const entries = Object.entries(value as Record<string, any>);
                          const allHaveProb = entries.length > 0 && entries.every(([, v]) => typeof v === 'object' && v !== null && 'probability' in v);
                          if (allHaveProb) {
                            return entries.map(([k, v]) => (
                              <tr key={`${key}_${k}`}>
                                <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', width: '38%' }}>{label}: {k.replace(/_/g, ' ')}</td>
                                <td style={{ padding: '0.3rem 0.5rem', color: '#ccc', fontFamily: 'monospace', borderBottom: '1px solid #181818' }}>probability: {String((v as any).probability)}</td>
                              </tr>
                            ));
                          }
                          return (
                            <tr key={key}>
                              <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', width: '38%', verticalAlign: 'top' }}>{label}</td>
                              <td style={{ padding: '0.3rem 0.5rem', color: '#ccc', fontFamily: 'monospace', borderBottom: '1px solid #181818', wordBreak: 'break-word' }}>{JSON.stringify(value)}</td>
                            </tr>
                          );
                        }
                        // Image URLs
                        if (typeof value === 'string' && IMAGE_EXTS.test(value)) {
                          return (
                            <tr key={key}>
                              <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', verticalAlign: 'top' }}>{label}</td>
                              <td style={{ padding: '0.3rem 0.5rem', borderBottom: '1px solid #181818' }}>
                                <a href={value} target="_blank" rel="noopener noreferrer">
                                  <img src={value} alt={label} style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4, border: '1px solid #2a2a2a' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                </a>
                              </td>
                            </tr>
                          );
                        }
                        return (
                          <tr key={key}>
                            <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', width: '38%' }}>{label}</td>
                            <td style={{ padding: '0.3rem 0.5rem', color: '#ccc', fontFamily: 'monospace', borderBottom: '1px solid #181818', wordBreak: 'break-word' }}>{String(value ?? '—')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid #1a1a1a' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '1rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '0.75rem' }}>{title}</div>
      {children}
    </div>
  );
}

function SideField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ color: '#ccc', fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}

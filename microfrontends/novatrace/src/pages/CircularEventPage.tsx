import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { FileText, Calendar } from 'lucide-react';
import { MeasurementsDisplay } from '../components/MeasurementsDisplay';
import { API_ENDPOINTS } from '@shared/lib/config';

interface Circular {
  alertKey: string;
  event: string;
  summary: string | null;
  date: string;
  data?: {
    authors?: { authors?: string[]; affiliations?: string[]; institutions?: string[] };
    measurements?: Record<string, any>;
    urls?: string[];
    raw?: string;
    [key: string]: any;
  };
  tags?: string[];
}

interface CircularEvent {
  event: string;
  circularCount: number;
  circulars: Circular[];
}

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

export default function CircularEventPage({ eventName }: { eventName?: string }) {
  const [, navigate] = useLocation();
  const [data, setData] = useState<CircularEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedCirculars, setExpandedCirculars] = useState<Set<string>>(new Set());
  const [rawModal, setRawModal] = useState<{ title: string; content: string } | null>(null);

  const toggleCircular = (key: string) => setExpandedCirculars(prev => {
    const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next;
  });

  useEffect(() => {
    if (!eventName) return;
    fetch(API_ENDPOINTS.publicCirculars(eventName))
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(d => { if (d) setData(d); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [eventName]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.8rem' }}>Loading...</span>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <span style={{ color: '#555', fontFamily: 'monospace', fontSize: '0.8rem' }}>No circulars found for "{eventName}".</span>
        <button onClick={() => navigate('/novatrace/search')} style={{ background: 'none', border: 'none', color: '#770ff5', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem' }}>← Back to search</button>
      </div>
    );
  }

  const sortedCirculars = [...data.circulars].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate('/novatrace/search')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
          ← Search
        </button>
        <span style={{ color: '#333' }}>|</span>
        <span style={{ color: '#770ff5', fontSize: '0.75rem', fontWeight: 600 }}>{data.event}</span>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Event header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '0.5rem' }}>{data.event}</h1>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FileText style={{ width: 11, height: 11 }} />
              {data.circularCount} GCN circular{data.circularCount !== 1 ? 's' : ''}
            </span>
            {sortedCirculars[0] && (
              <span style={{ fontSize: '0.72rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar style={{ width: 11, height: 11 }} />
                {formatDate(sortedCirculars[0].date)}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.72rem', color: '#444', marginTop: '0.5rem' }}>
            Circulars only — no streaming notice available for this event.
          </p>
        </div>

        {/* Circulars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedCirculars.map((c, i) => {
            const isExpanded = expandedCirculars.has(c.alertKey);
            const authors = c.data?.authors?.authors;
            const institutions = c.data?.authors?.institutions;
            const measurements = c.data?.measurements;
            const hasMeasurements = measurements && Object.keys(measurements).length > 0;
            const allUrls: string[] = c.data?.urls || [];
            const imageUrls = allUrls.filter((u: string) => IMAGE_EXTS.test(u));
            const linkUrls = allUrls.filter((u: string) => !IMAGE_EXTS.test(u));
            const tags = c.tags?.length ? c.tags : null;
            const rawRedshift = measurements
              ? (measurements.redshift ?? measurements.z ?? measurements.redshift_z ?? null)
              : null;
            const redshift = rawRedshift == null
              ? null
              : typeof rawRedshift === 'object'
                ? (rawRedshift.value ?? rawRedshift.range ?? null)
                : rawRedshift;
            const hasExtra = hasMeasurements || imageUrls.length > 0 || linkUrls.length > 0 || (authors && authors.length > 0);

            return (
              <div key={c.alertKey} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                  <button
                    onClick={() => hasExtra && toggleCircular(c.alertKey)}
                    style={{ flex: 1, background: 'none', border: 'none', cursor: hasExtra ? 'pointer' : 'default', padding: '0.875rem 1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#770ff5', fontSize: '0.7rem', fontWeight: 600 }}>#{i + 1}</span>
                      <span style={{ color: '#444', fontSize: '0.7rem' }}>{c.alertKey}</span>
                      {redshift != null && (
                        <span style={{ fontSize: '0.7rem', color: '#f5c518', fontWeight: 600 }}>z = {typeof redshift === 'number' ? redshift.toFixed(4) : redshift}</span>
                      )}
                      {tags && tags.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: '0.62rem', color: '#770ff5', background: 'rgba(119,15,245,0.08)', padding: '0.1rem 0.4rem', borderRadius: 3 }}>{t}</span>
                      ))}
                      {hasExtra && <span style={{ color: '#444', fontSize: '0.7rem', marginLeft: 'auto' }}>{isExpanded ? '▲' : '▼'}</span>}
                      <span style={{ color: '#555', fontSize: '0.72rem', marginLeft: hasExtra ? '0' : 'auto' }}>{c.date ? formatDate(c.date) : ''}</span>
                    </div>
                    <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{c.summary}</p>
                  </button>
                  <button
                    onClick={() => setRawModal({ title: `${c.alertKey}`, content: c.data?.raw || JSON.stringify(c.data, null, 2) || '' })}
                    style={{ background: 'none', border: 'none', borderLeft: '1px solid #1e1e1e', cursor: 'pointer', padding: '0 0.75rem', color: '#444', fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                  >raw</button>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid #1e1e1e', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {authors && authors.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Authors</div>
                        <div style={{ color: '#777', fontSize: '0.75rem' }}>{authors.join(', ')}</div>
                        {institutions && institutions.length > 0 && (
                          <div style={{ color: '#555', fontSize: '0.68rem', fontStyle: 'italic', marginTop: '0.2rem' }}>{institutions.join('; ')}</div>
                        )}
                      </div>
                    )}
                    {hasMeasurements && (
                      <div>
                        <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Measurements</div>
                        <MeasurementsDisplay measurements={measurements!} />
                      </div>
                    )}
                    {imageUrls.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {imageUrls.map((u: string) => (
                          <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                            <img src={u} alt="" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 4, border: '1px solid #222' }} />
                          </a>
                        ))}
                      </div>
                    )}
                    {linkUrls.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {linkUrls.map((u: string) => (
                          <a key={u} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#770ff5' }}>{u}</a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Raw modal */}
      {rawModal && (
        <div
          onClick={() => setRawModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: '#111', border: '1px solid #222', borderRadius: 8, maxWidth: 700, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1e1e1e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#770ff5', fontWeight: 600 }}>{rawModal.title}</span>
              <button onClick={() => setRawModal(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
            </div>
            <pre style={{ flex: 1, overflow: 'auto', padding: '1rem', fontSize: '0.7rem', color: '#aaa', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {rawModal.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

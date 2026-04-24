import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { MeasurementsDisplay } from './MeasurementsDisplay';

export interface Circular {
  alertKey: string;
  event: string;
  summary: string | null;
  date: string;
  data?: {
    authors?: { authors?: string[]; affiliations?: string[]; institutions?: string[] };
    measurements?: Record<string, any>;
    urls?: string[];
    raw?: string | Record<string, any>;
    [key: string]: any;
  };
  tags?: string[];
}

const IMAGE_EXTS = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;

function urlLabel(url: string): string {
  try {
    const parts = new URL(url).pathname.split('/').filter(Boolean);
    return parts.slice(-2).join('-') || url;
  } catch {
    return url;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

export function CircularsList({ circulars, allExpandedByDefault = false }: { circulars: Circular[]; allExpandedByDefault?: boolean }) {
  const [expandedCirculars, setExpandedCirculars] = useState<Set<string>>(
    allExpandedByDefault ? new Set(circulars.map(c => c.alertKey)) : new Set()
  );
  const [rawModal, setRawModal] = useState<{ title: string; data: Circular } | null>(null);

  const toggleCircular = (key: string) => setExpandedCirculars(prev => {
    const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next;
  });

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {circulars.map((c, i) => {
          const isExpanded = expandedCirculars.has(c.alertKey);
          const authors = c.data?.authors?.authors;
          const institutions = c.data?.authors?.institutions;
          const measurements = c.data?.measurements;
          const hasMeasurements = measurements && Object.keys(measurements).length > 0;
          const allUrls: string[] = [...new Set(c.data?.urls || [])];
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
                  <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{c.summary}</p>
                </button>
                <button
                  onClick={() => setRawModal({ title: `Circular #${i + 1} — ${c.alertKey}`, data: c })}
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
                  {tags && tags.length > 2 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                      {tags.map(t => (
                        <span key={t} style={{ fontSize: '0.65rem', color: '#770ff5', background: 'rgba(119,15,245,0.08)', padding: '0.125rem 0.5rem', borderRadius: 3 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {hasMeasurements && (
                    <div style={{ marginTop: '0.625rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Measurements</div>
                      <MeasurementsDisplay measurements={measurements} />
                    </div>
                  )}
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
                  {linkUrls.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Links</div>
                      {linkUrls.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: '0.75rem', color: '#f5c518', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ExternalLink size={11} style={{ flexShrink: 0 }} />{urlLabel(url)}
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
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
              {(() => {
                const raw = rawModal.data.data?.raw;
                if (!raw) return <span style={{ color: '#555', fontSize: '0.8rem' }}>No raw data</span>;
                if (typeof raw === 'string') return <pre style={{ margin: 0, fontSize: '0.72rem', color: '#a78bfa', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{raw}</pre>;
                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <tbody>
                      {Object.entries(raw as Record<string, any>).map(([key, value]) => (
                        <tr key={key}>
                          <td style={{ padding: '0.3rem 0.5rem', color: '#555', fontFamily: 'monospace', borderBottom: '1px solid #181818', width: '38%', verticalAlign: 'top' }}>{key.replace(/_/g, ' ')}</td>
                          <td style={{ padding: '0.3rem 0.5rem', color: '#ccc', fontFamily: 'monospace', borderBottom: '1px solid #181818', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '—')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

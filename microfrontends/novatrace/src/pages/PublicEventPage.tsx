import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
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
  }>;
  circulars: Array<{
    alertKey: string;
    event: string;
    summary: string;
    date: string;
  }>;
}

const SIGNIFICANCE_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

function formatCoordinate(value: number, type: 'ra' | 'dec'): string {
  if (type === 'ra') {
    const h = Math.floor(value / 15);
    const m = Math.floor((value % 15) * 4);
    const s = ((value % 15) * 4 - m) * 60;
    return `${h}h ${m}m ${s.toFixed(1)}s`;
  }
  const sign = value >= 0 ? '+' : '-';
  const d = Math.floor(Math.abs(value));
  const m = Math.floor((Math.abs(value) % 1) * 60);
  const s = ((Math.abs(value) % 1) * 60 - m) * 60;
  return `${sign}${d}° ${m}' ${s.toFixed(1)}"`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });
}

function topClassification(cls: Record<string, number> | null): string {
  if (!cls) return '';
  return Object.entries(cls)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`)
    .join(' · ');
}

export default function PublicEventPage({ canonicalId }: { canonicalId?: string }) {
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!canonicalId) return;
    fetch(API_ENDPOINTS.publicEvent(canonicalId))
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => { if (data) setEvent(data); })
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
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
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
                <p style={{ color: '#ccc', lineHeight: 1.8, margin: 0 }}>{event.aiSummary.details}</p>
              </Section>
            )}

            {/* Notice timeline */}
            <Section title={`Alert Timeline (${event.notices.length} notices)`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {event.notices.map((n, i) => (
                  <div key={n.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <span style={{ color: '#770ff5', fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600 }}>#{i + 1}</span>
                      {n.phase && <span style={{ color: '#888', fontSize: '0.75rem', textTransform: 'capitalize' }}>{n.phase.replace('_', ' ')}</span>}
                      {n.t0 && <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: 'auto' }}>{formatDate(n.t0)}</span>}
                    </div>
                    <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{n.topic}</div>
                    {n.classification && (
                      <div style={{ color: '#888', fontSize: '0.75rem' }}>{topClassification(n.classification)}</div>
                    )}
                    {n.raDeg != null && (
                      <div style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {formatCoordinate(n.raDeg, 'ra')} {formatCoordinate(n.decDeg!, 'dec')}
                        {n.posErrorDeg != null && ` ± ${n.posErrorDeg.toFixed(2)}°`}
                      </div>
                    )}
                    {n.links && Object.entries(n.links).filter(([, v]) => typeof v === 'string' && v.startsWith('http')).slice(0, 2).map(([k, v]) => (
                      <a key={k} href={v as string} target="_blank" rel="noopener noreferrer" style={{ color: '#770ff5', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem', marginRight: '0.75rem' }}>
                        <ExternalLink size={11} /> {k}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </Section>

            {/* Circulars */}
            {event.circulars.length > 0 && (
              <Section title={`Community Circulars (${event.circulars.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {event.circulars.map((c, i) => (
                    <div key={c.alertKey} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
                        <span style={{ color: '#770ff5', fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 600 }}>#{i + 1}</span>
                        <span style={{ color: '#555', fontSize: '0.75rem', marginLeft: 'auto' }}>{c.date?.slice(0, 10)}</span>
                      </div>
                      <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{c.summary}</p>
                    </div>
                  ))}
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
                  {event.posErrorDeg != null && <SideField label="Error" value={`± ${event.posErrorDeg.toFixed(2)}°`} />}
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

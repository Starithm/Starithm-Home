import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { FileText, Calendar } from 'lucide-react';
import { Section } from '../components/Section';
import { CircularsList } from '../components/CircularsList';
import type { Circular } from '../components/CircularsList';
import { API_ENDPOINTS } from '@shared/lib/config';

interface CircularEvent {
  event: string;
  circularCount: number;
  circulars: Circular[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

function navigateTo(path: string) {
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'navigate', path }, '*');
  } else {
    window.location.href = path;
  }
}

export default function CircularEventPage({ eventName }: { eventName?: string }) {
  const [, navigate] = useLocation();
  const [data, setData] = useState<CircularEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
        <button onClick={() => navigateTo('/novatrace/search')} style={{ background: 'none', border: 'none', color: '#770ff5', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem' }}>← Back to search</button>
      </div>
    );
  }

  const sortedCirculars = [...data.circulars].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigateTo('/novatrace/search')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>
          ← Search
        </button>
        <span style={{ color: '#333' }}>|</span>
        <span style={{ color: '#770ff5', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace' }}>{data.event}</span>
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

        <Section title={`Community Circulars (${data.circularCount})`}>
          <CircularsList circulars={sortedCirculars} allExpandedByDefault />
        </Section>
      </div>
    </div>
  );
}

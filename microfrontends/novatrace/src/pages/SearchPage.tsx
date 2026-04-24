import React, { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Search, FileText, Calendar } from 'lucide-react';
import { API_ENDPOINTS } from '@shared/lib/config';

interface EventResult {
  event: string;
  circularCount: number;
  latestDate: string;
  earliestDate: string;
  alertKeys: string[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function navigateTo(path: string) {
  if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'navigate', path }, '*');
  } else {
    window.location.href = path;
  }
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EventResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(API_ENDPOINTS.publicSearch(trimmed));
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data);
    } catch {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(query);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigateTo('/novatrace/events')}
          style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
        >
          ← Events
        </button>
        <span style={{ color: '#333' }}>|</span>
        <span style={{ color: '#770ff5', fontSize: '0.75rem', fontWeight: 600 }}>Event Search</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '0.5rem' }}>
          Search Events
        </h1>
        <p style={{ fontSize: '0.75rem', color: '#555', marginBottom: '2rem' }}>
          Search GCN circulars by event name (e.g. "GRB 250328A", "EP260316a", "S230709bi")
        </p>

        {/* Search input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#444', width: 14, height: 14 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="GRB 250328A"
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#111', border: '1px solid #222', borderRadius: 6,
                color: '#e0e0e0', fontSize: '0.85rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                outline: 'none', fontFamily: 'monospace',
              }}
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            style={{
              background: '#770ff5', border: 'none', borderRadius: 6, color: '#fff',
              fontSize: '0.8rem', fontWeight: 600, padding: '0.6rem 1.25rem',
              cursor: loading || !query.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !query.trim() ? 0.5 : 1,
            }}
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {/* Results */}
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.75rem' }}>{error}</p>
        )}

        {searched && !loading && results.length === 0 && !error && (
          <p style={{ color: '#555', fontSize: '0.75rem' }}>No circulars found for "{query}".</p>
        )}

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.7rem', color: '#444', marginBottom: '0.25rem' }}>
              {results.length} event{results.length !== 1 ? 's' : ''} found
            </p>
            {results.map(r => (
              <button
                key={r.event}
                onClick={() => navigateTo(`/novatrace/circulars/${encodeURIComponent(r.event)}`)}
                style={{
                  background: '#111', border: '1px solid #1e1e1e', borderRadius: 8,
                  padding: '0.875rem 1rem', textAlign: 'left', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#770ff5')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e1e')}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e0e0e0', marginBottom: '0.3rem' }}>
                    {r.event}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <FileText style={{ width: 10, height: 10 }} />
                      {r.circularCount} circular{r.circularCount !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#555', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar style={{ width: 10, height: 10 }} />
                      {formatDate(r.latestDate)}
                    </span>
                  </div>
                </div>
                <span style={{ color: '#333', fontSize: '0.75rem' }}>→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

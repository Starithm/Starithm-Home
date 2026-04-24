import React from 'react';

export function Section({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid #1a1a1a' }}>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          {title}
        </h2>
        {subtitle && <span style={{ fontSize: '0.7rem', color: '#555', fontStyle: 'italic' }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

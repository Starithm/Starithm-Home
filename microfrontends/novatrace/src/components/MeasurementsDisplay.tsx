import React from 'react';

interface MeasurementsDisplayProps {
  measurements: Record<string, any>;
}

function renderCell(cell: any): string {
  if (cell == null) return '—';
  if (typeof cell === 'object') return JSON.stringify(cell).replace(/"/g, '');
  return String(cell);
}

function ObjectTable({ label, rows }: { label: string; rows: any[] }) {
  const cols = Object.keys(rows[0]);
  return (
    <div style={{ overflowX: 'auto', marginBottom: '0.5rem' }}>
      <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{label}</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c} style={{ padding: '0.25rem 0.5rem', color: '#555', fontWeight: 500, textAlign: 'left', borderBottom: '1px solid #333' }}>
                {c.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {cols.map(c => (
                <td key={c} style={{ padding: '0.25rem 0.5rem', color: '#aaa', borderBottom: '1px solid #222' }}>
                  {renderCell(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScalarItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.7rem', color: '#666', minWidth: 90 }}>{label}:</span>
      <span style={{ fontSize: '0.72rem', color: '#aaa' }}>{value}</span>
    </div>
  );
}

/** Renders a single measurement entry (key + value). Handles arrays, nested objects, and scalars. */
function MeasurementEntry({ label, value }: { label: string; value: any }) {
  if (value === null || value === undefined) return null;

  // Array of objects → table
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    return <ObjectTable label={label} rows={value} />;
  }

  // Array of primitives → comma list
  if (Array.isArray(value)) {
    return <ScalarItem label={label} value={(value as any[]).join(', ').replace(/"/g, '')} />;
  }

  // Nested object → flatten sub-entries, no wrapper label
  if (typeof value === 'object') {
    const subEntries = Object.entries(value).filter(([, v]) => v !== null && v !== undefined);
    if (subEntries.length === 0) return null;
    return (
      <>
        {subEntries.map(([k, v]) => (
          <MeasurementEntry key={k} label={k.replace(/_/g, ' ')} value={v} />
        ))}
      </>
    );
  }

  // Scalar
  return <ScalarItem label={label} value={String(value)} />;
}

/**
 * Renders a measurements object, skipping null values and flattening nested objects.
 * Handles scalars, arrays of primitives, arrays of objects (tables), and nested objects.
 */
export function MeasurementsDisplay({ measurements }: MeasurementsDisplayProps) {
  const entries = Object.entries(measurements).filter(
    ([key, value]) => key !== 'tables' && key !== 'misc_tables' && value !== null && value !== undefined
  );

  const tables: any[] = measurements.tables ?? [];
  const miscTables: any[] = measurements.misc_tables ?? [];

  if (entries.length === 0 && tables.length === 0 && miscTables.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {entries.map(([key, value]) => (
        <MeasurementEntry key={key} label={key.replace(/_/g, ' ')} value={value} />
      ))}
      {tables.length > 0 && (
        <ObjectTable label="data table" rows={tables} />
      )}
      {miscTables.length > 0 && (
        <ObjectTable label="miscellaneous data table" rows={miscTables} />
      )}
    </div>
  );
}

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Section, SectionTitle, SectionToggleButton } from '../styled_pages/EventRecord.styled';

/* Collapsible sections on the event record. The first child (the SectionHead) always renders;
 * the rest hide while collapsed. Which sections a viewer collapsed is remembered across event
 * pages in their own browser — a per-viewer convenience, so storage failures are ignored and
 * everything starts open. */

const KEY = 'novatrace.eventRecord.collapsed';

function load(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch { return new Set(); }
}
function save(s: Set<string>) {
  try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch { /* private window, blocked storage */ }
}

interface Ctx { collapsed: Set<string>; toggle: (id: string) => void; expand: (id: string) => void }
const SectionsCtx = createContext<Ctx>({ collapsed: new Set(), toggle: () => {}, expand: () => {} });

export function SectionsProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(load);
  const update = useCallback((fn: (s: Set<string>) => void) => setCollapsed(prev => {
    const next = new Set(prev); fn(next); save(next); return next;
  }), []);
  const value = useMemo<Ctx>(() => ({
    collapsed,
    toggle: id => update(s => (s.has(id) ? s.delete(id) : s.add(id))),
    expand: id => update(s => { s.delete(id); }),
  }), [collapsed, update]);
  return <SectionsCtx.Provider value={value}>{children}</SectionsCtx.Provider>;
}

export const useSections = () => useContext(SectionsCtx);

const IdCtx = createContext<string>('');

export function RecordSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { collapsed } = useSections();
  const [head, ...body] = React.Children.toArray(children);
  return (
    <IdCtx.Provider value={id}>
      <Section id={id}>
        {head}
        {!collapsed.has(id) && body}
      </Section>
    </IdCtx.Provider>
  );
}

/* The section title as the collapse control. */
export function SectionToggle({ children }: { children: React.ReactNode }) {
  const id = useContext(IdCtx);
  const { collapsed, toggle } = useSections();
  const open = !collapsed.has(id);
  return (
    <SectionTitle>
      <SectionToggleButton type="button" onClick={() => toggle(id)} aria-expanded={open} aria-controls={id}>
        {open ? <ChevronDown size={12} aria-hidden /> : <ChevronRight size={12} aria-hidden />}
        {children}
      </SectionToggleButton>
    </SectionTitle>
  );
}

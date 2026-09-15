import styled from 'styled-components';
import { DIALOG_MAX_WIDTH } from '@novatrace/lib/circularArchive';

/** Circular detail popup — design_handoff_gcn_archive §2. */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(4, 4, 7, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  z-index: 50;
`;

export const Dialog = styled.div`
  max-width: ${DIALOG_MAX_WIDTH}px;
  width: 100%;
  max-height: 100%;
  background: var(--surface);
  border: 1px solid var(--line-dialog);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
`;

export const TitleBar = styled.div`
  background: var(--surface-raised);
  border-bottom: 1px solid var(--line-subtle);
  padding: 13px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const TitleLeft = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

export const GcnLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
`;

export const MetaLine = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const TitleButtons = styled.div`
  display: flex;
  gap: 6px;
  flex: 0 0 auto;
`;

export const IconButton = styled.button<{ $disabled?: boolean }>`
  background: transparent;
  border: 1px solid var(--line-control);
  border-radius: 4px;
  color: ${p => (p.$disabled ? 'var(--text-disabled)' : 'var(--text-muted)')};
  font-family: inherit;
  font-size: 12px;
  padding: 4px 9px;
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
  &:hover {
    color: ${p => (p.$disabled ? 'var(--text-disabled)' : 'var(--foreground)')};
    border-color: ${p => (p.$disabled ? 'var(--line-control)' : 'var(--line-hover)')};
  }
`;

export const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  min-height: 0;

  /* Without this the OS light scrollbar renders as a bright bar against the dark surface. */
  scrollbar-width: thin;
  scrollbar-color: var(--line-control) transparent;
  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--line-control);
    border-radius: 5px;
    border: 2px solid var(--surface);
  }
  &::-webkit-scrollbar-thumb:hover { background: var(--line-hover); }
`;

export const Main = styled.div`
  flex: 1 1 340px;
  padding: 20px 20px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const Rail = styled.div`
  /* 0 0 — the rail must not grow. At 1 1 240px it expanded with the widened dialog and
     took ~40% of the width for two short columns of text. Main column gets the slack. */
  flex: 0 0 270px;
  border-left: 1px solid var(--line-subtle);
  background: var(--surface-sunken);
  padding: 20px 18px 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const Subject = styled.h2`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: var(--foreground);
  margin: 0;
  text-wrap: pretty;
`;

export const SummaryBlock = styled.div`
  background: var(--surface-raised);
  border-left: 2px solid var(--primary);
  border-radius: 0 4px 4px 0;
  padding: 12px 14px;
`;

export const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  gap: 10px;
`;

export const EyebrowLabel = styled.span`
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const SummaryConfidence = styled.span`
  font-size: 10.5px;
  color: var(--text-faint);
  white-space: nowrap;
`;

export const SummaryBody = styled.p`
  /* Prose face + capped measure — same reasoning as the event record page. */
  font-family: var(--font-prose);
  max-width: var(--measure);
  font-size: 13.5px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
`;

export const ToggleWrap = styled.div`
  align-self: flex-end;
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 5px;
  padding: 3px;
  display: flex;
  gap: 3px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${p => (p.$active ? 'var(--accent-surface)' : 'transparent')};
  border: 1px solid ${p => (p.$active ? 'var(--accent-border)' : 'transparent')};
  border-radius: 4px;
  color: ${p => (p.$active ? 'var(--accent-text)' : 'var(--text-muted)')};
  font-family: inherit;
  font-size: 11.5px;
  padding: 5px 12px;
  cursor: pointer;
`;

export const KvRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid var(--line-hairline);
`;

export const KvKey = styled.span`
  flex: 0 0 104px;
  font-size: 11.5px;
  color: var(--text-muted);
`;

export const KvValue = styled.span`
  flex: 1;
  font-size: 12.5px;
  color: var(--text-body);
  word-break: break-word;
  min-width: 0;
`;

export const RawPre = styled.pre`
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-raw);
  white-space: pre-wrap;
  margin: 0;
  word-break: break-word;
`;

export const PlotPlaceholder = styled.div`
  height: 132px;
  border: 1px dashed var(--line-control);
  border-radius: 5px;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  color: var(--text-faint);
`;

export const LinksSection = styled.div`
  border-top: 1px solid var(--line-subtle);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LinkAnchor = styled.a`
  font-size: 12px;
  color: var(--primary);
  text-decoration: none;
  word-break: break-all;
  &:hover { color: var(--accent-text); }
`;

// ── Timeline rail ─────────────────────────────────────────────────────────────
export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`;

export const TimelineRow = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 6px;
  border-radius: 4px;
  cursor: pointer;
  background: ${p => (p.$active ? 'var(--timeline-active)' : 'transparent')};
  &:hover { background: var(--timeline-active); }
`;

export const TimelineTime = styled.span`
  flex: 0 0 38px;
  font-size: 11.5px;
  color: var(--text-muted);
`;

export const TimelineDot = styled.span<{ $active: boolean }>`
  flex: 0 0 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${p => (p.$active ? 'var(--primary)' : 'var(--dot)')};
`;

export const TimelineGcn = styled.span<{ $active: boolean }>`
  font-size: 11.5px;
  color: ${p => (p.$active ? 'var(--accent-text)' : 'var(--text-muted)')};
  white-space: nowrap;
`;

export const TimelineInstrument = styled.span`
  font-size: 11.5px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

/** Identity line inside a timeline row: time · dot · GCN · instrument. */
export const TimelineTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

/**
 * The circular's subject, clamped to two lines. Without this the rail showed only a GCN
 * number and an instrument — and 8 of 40 circulars carry no telescope list at all, so those
 * rows read "GCN-45538 —" and told the reader nothing.
 */
export const TimelineSubject = styled.span`
  font-size: 11.5px;
  line-height: 1.4;
  color: var(--text-muted);
  padding-left: 46px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ── Preserved sections (not in the handoff; kept from AlertDetails) ────────────
export const PreservedSection = styled.details`
  border-top: 1px solid var(--line-subtle);
  padding-top: 12px;
  > summary {
    cursor: pointer;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    list-style: none;
    &::-webkit-details-marker { display: none; }
    &:hover { color: var(--foreground); }
    &::before { content: '▸ '; }
  }
  &[open] > summary::before { content: '▾ '; }
`;

export const PreservedBody = styled.div`
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 8px;
`;

export const Thumb = styled.img`
  width: 100%;
  border-radius: 4px;
  border: 1px solid var(--line-subtle);
  cursor: pointer;
  display: block;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const MiniTable = styled.table`
  border-collapse: collapse;
  font-size: 11.5px;
  width: 100%;
  th, td {
    border: 1px solid var(--line-hairline);
    padding: 5px 8px;
    text-align: left;
    color: var(--text-body);
    white-space: nowrap;
  }
  th { color: var(--text-muted); font-weight: 500; }
`;

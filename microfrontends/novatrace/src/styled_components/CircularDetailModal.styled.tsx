import styled from 'styled-components';
import { T, DIALOG_MAX_WIDTH } from '@novatrace/lib/circularArchive';

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
  background: ${T.surface};
  border: 1px solid ${T.dialog};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
`;

export const TitleBar = styled.div`
  background: ${T.raised};
  border-bottom: 1px solid ${T.subtle};
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
  color: ${T.accent};
  white-space: nowrap;
`;

export const MetaLine = styled.span`
  font-size: 12px;
  color: ${T.muted};
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
  border: 1px solid ${T.control};
  border-radius: 4px;
  color: ${p => (p.$disabled ? T.disabled : T.muted)};
  font-family: inherit;
  font-size: 12px;
  padding: 4px 9px;
  cursor: ${p => (p.$disabled ? 'default' : 'pointer')};
  &:hover {
    color: ${p => (p.$disabled ? T.disabled : T.text)};
    border-color: ${p => (p.$disabled ? T.control : T.hover)};
  }
`;

export const Body = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  min-height: 0;

  /* Without this the OS light scrollbar renders as a bright white bar against #0d0d13. */
  scrollbar-width: thin;
  scrollbar-color: ${T.control} transparent;
  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: ${T.control};
    border-radius: 5px;
    border: 2px solid ${T.surface};
  }
  &::-webkit-scrollbar-thumb:hover { background: ${T.hover}; }
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
  border-left: 1px solid ${T.subtle};
  background: ${T.sunken};
  padding: 20px 18px 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const Subject = styled.h2`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
  color: ${T.text};
  margin: 0;
  text-wrap: pretty;
`;

export const SummaryBlock = styled.div`
  background: ${T.raised};
  border-left: 2px solid ${T.accent};
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
  color: ${T.muted};
`;

export const SummaryConfidence = styled.span`
  font-size: 10.5px;
  color: ${T.faint};
  white-space: nowrap;
`;

export const SummaryBody = styled.p`
  font-size: 12.5px;
  color: ${T.secondary};
  line-height: 1.6;
  margin: 0;
`;

export const ToggleWrap = styled.div`
  align-self: flex-end;
  background: ${T.raised};
  border: 1px solid ${T.subtle};
  border-radius: 5px;
  padding: 3px;
  display: flex;
  gap: 3px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  background: ${p => (p.$active ? T.accentSurface : 'transparent')};
  border: 1px solid ${p => (p.$active ? T.accentBorder : 'transparent')};
  border-radius: 4px;
  color: ${p => (p.$active ? T.accentText : T.muted)};
  font-family: inherit;
  font-size: 11.5px;
  padding: 5px 12px;
  cursor: pointer;
`;

export const KvRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${T.hairline};
`;

export const KvKey = styled.span`
  flex: 0 0 104px;
  font-size: 11.5px;
  color: ${T.muted};
`;

export const KvValue = styled.span`
  flex: 1;
  font-size: 12.5px;
  color: ${T.body};
  word-break: break-word;
  min-width: 0;
`;

export const RawPre = styled.pre`
  font-family: inherit;
  font-size: 12.5px;
  line-height: 1.65;
  color: ${T.raw};
  white-space: pre-wrap;
  margin: 0;
  word-break: break-word;
`;

export const PlotPlaceholder = styled.div`
  height: 132px;
  border: 1px dashed ${T.dashed};
  border-radius: 5px;
  background: ${T.sunken};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  color: ${T.faint};
`;

export const LinksSection = styled.div`
  border-top: 1px solid ${T.subtle};
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LinkAnchor = styled.a`
  font-size: 12px;
  color: ${T.accent};
  text-decoration: none;
  word-break: break-all;
  &:hover { color: ${T.accentText}; }
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
  background: ${p => (p.$active ? T.timelineActive : 'transparent')};
  &:hover { background: ${T.timelineActive}; }
`;

export const TimelineTime = styled.span`
  flex: 0 0 38px;
  font-size: 11.5px;
  color: ${T.muted};
`;

export const TimelineDot = styled.span<{ $active: boolean }>`
  flex: 0 0 5px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${p => (p.$active ? T.accent : T.dot)};
`;

export const TimelineGcn = styled.span<{ $active: boolean }>`
  font-size: 11.5px;
  color: ${p => (p.$active ? T.accentText : T.muted)};
  white-space: nowrap;
`;

export const TimelineInstrument = styled.span`
  font-size: 11.5px;
  color: ${T.secondary};
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
  color: ${T.muted};
  padding-left: 46px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// ── Preserved sections (not in the handoff; kept from AlertDetails) ────────────
export const PreservedSection = styled.details`
  border-top: 1px solid ${T.subtle};
  padding-top: 12px;
  > summary {
    cursor: pointer;
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${T.muted};
    list-style: none;
    &::-webkit-details-marker { display: none; }
    &:hover { color: ${T.text}; }
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
  border: 1px solid ${T.subtle};
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
    border: 1px solid ${T.hairline};
    padding: 5px 8px;
    text-align: left;
    color: ${T.body};
    white-space: nowrap;
  }
  th { color: ${T.muted}; font-weight: 500; }
`;

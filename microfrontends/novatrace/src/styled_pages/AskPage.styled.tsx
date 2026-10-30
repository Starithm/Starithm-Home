import styled, { css, keyframes } from 'styled-components';
import { Page } from '@shared/components/ui/primitives';

/* Ask Cosmos answer page — Claude Design direction 1a ("answer + source rail").
 * Tokens only (CLAUDE.md): the design's hexes map 1:1 onto globals.css.
 * Type: Google Sans Code throughout, by the user's choice (2026-10-29). The summary and card
 * prose use TEXT_FONT, so moving them to var(--font-prose) is a one-line change. */

const TEXT_FONT = 'var(--font-mono)';

export const AskPageRoot = styled(Page)`
  font-family: var(--font-mono);
`;

/* ── Question header ───────────────────────────────────────────────────────── */

export const QuestionHeader = styled.div`
  padding: 20px 32px 16px;
  border-bottom: 1px solid var(--line-hairline);
  display: flex;
  flex-direction: column;
  gap: 10px;
  @media (max-width: 720px) { padding: 16px; }
`;

/* The page's name above the bar once a question is asked (the idle view has its own IdleTitle). */
export const PageTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-body);
`;

export const AskForm = styled.form<{ $large?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  height: ${(p) => (p.$large ? 56 : 50)}px;
  padding: 0 8px 0 16px;
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  &:focus-within { border-color: var(--primary); }
`;

export const AskInput = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: none;
  font-family: ${TEXT_FONT};
  font-size: 16px;
  color: var(--text-body);
  &::placeholder { color: var(--text-placeholder); }
`;

export const AskButton = styled.button`
  height: 34px;
  padding: 0 16px;
  border: 0;
  border-radius: 6px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-family: var(--font-mono);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: default; }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 28px;
  font-size: 12.5px;
  color: var(--text-muted);
  flex-wrap: wrap;
`;

export const Badge = styled.span`
  padding: 3px 8px;
  border-radius: 5px;
  background: var(--accent-surface);
  color: var(--accent-text);
  font-weight: 500;
`;

/* ── Body: answer column + source rail ────────────────────────────────────── */

export const Body = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 36px;
  padding: 24px 32px 40px;
  align-items: start;
  @media (max-width: 1080px) { grid-template-columns: minmax(0, 1fr) 340px; gap: 24px; }
  @media (max-width: 860px) { grid-template-columns: minmax(0, 1fr); padding: 16px; }
`;

export const AnswerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
`;

export const Rail = styled.aside<{ $hiddenOnMobile?: boolean }>`
  position: sticky;
  top: 16px;
  min-width: 0;
  @media (max-width: 860px) {
    position: static;
    ${(p) => p.$hiddenOnMobile && css`display: none;`}
  }
`;

export const MobileTabs = styled.div`
  display: none;
  @media (max-width: 860px) {
    display: flex;
    gap: 4px;
    padding: 0 16px;
    border-bottom: 1px solid var(--line-hairline);
  }
`;

export const MobileTab = styled.button<{ $active: boolean }>`
  height: 40px;
  padding: 0 12px;
  background: transparent;
  border: 0;
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--primary)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--text-body)' : 'var(--text-muted)')};
  font-family: var(--font-mono);
  font-size: 13px;
  cursor: pointer;
`;

/* A block of the answer column that belongs to one mobile tab. Layout lives here, not in an
   inline style: an inline display would override the media query and break the tabs. */
export const MobileOnly = styled.div<{ $show: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 860px) { display: ${(p) => (p.$show ? 'flex' : 'none')}; }
`;

/* ── Sections ──────────────────────────────────────────────────────────────── */

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
`;

export const SectionLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
`;

export const SectionNote = styled.span`
  font-size: 12.5px;
  color: var(--text-muted);
`;

/* The "AI-generated" disclosure: always shown with a summary, quiet but not hidden. */
export const AiNote = styled.p`
  margin: 0;
  padding: 8px 12px;
  border-left: 2px solid var(--accent-border);
  background: var(--surface-sunken);
  border-radius: 0 6px 6px 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--text-secondary);
  max-width: 78ch;
`;

export const CheckedLine = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--text-muted);
`;

export const Card = styled.div`
  background: var(--surface-raised);
  border: 1px solid var(--line-hairline);
  border-radius: 8px;
  overflow: hidden;
`;

/* ── Working steps ─────────────────────────────────────────────────────────── */

const pulse = keyframes`0%, 100% { opacity: 1; } 50% { opacity: 0.35; }`;

export const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Step = styled.li<{ $state: 'done' | 'active' | 'pending' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: ${(p) => (p.$state === 'pending' ? 'var(--text-faint)' : p.$state === 'active' ? 'var(--text-body)' : 'var(--text-muted)')};
`;

export const StepDot = styled.span<{ $state: 'done' | 'active' | 'pending' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(p) => (p.$state === 'pending' ? 'var(--line-control)' : 'var(--primary)')};
  ${(p) => p.$state === 'active' && css`animation: ${pulse} 1.2s ease-in-out infinite;`}
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

/* ── Summary text + citations ──────────────────────────────────────────────── */

export const SummaryText = styled.div`
  font-family: ${TEXT_FONT};
  font-size: 15px;
  line-height: 1.75;
  color: var(--text-body);
  text-wrap: pretty;
  max-width: 78ch;
`;

export const Sentence = styled.span<{ $highlight: boolean; $absence?: boolean }>`
  background: ${(p) => (p.$highlight ? 'var(--accent-surface)' : 'transparent')};
  border-radius: 3px;
  transition: background 0.15s;
  ${(p) => p.$absence && css`color: var(--text-secondary);`}
`;

export const CiteWrap = styled.span`
  position: relative;
  display: inline-block;
  margin-left: 4px;
`;

export const CiteChip = styled.a<{ $active: boolean }>`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 5px;
  vertical-align: 2px;
  text-decoration: none;
  cursor: pointer;
  background: ${(p) => (p.$active ? 'var(--primary)' : 'var(--accent-surface)')};
  color: ${(p) => (p.$active ? 'var(--primary-foreground)' : 'var(--accent-text)')};
`;

export const CiteCard = styled.span`
  position: absolute;
  left: -4px;
  top: calc(100% + 6px);
  z-index: 20;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
  white-space: normal;
  font-size: 12px;
`;

export const Mono = styled.span`
  font-family: var(--font-mono);
`;

export const Link = styled.a`
  color: var(--starithm-link);
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

/* ── Notices ───────────────────────────────────────────────────────────────── */

export const Notice = styled.div<{ $tone?: 'warn' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$tone === 'warn' ? 'var(--starithm-selective-yellow)' : 'var(--line-subtle)')};
  background: var(--surface-sunken);
  font-size: 13px;
  color: var(--text-secondary);
`;

export const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ExampleChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--surface-raised);
  border: 1px solid var(--line-subtle);
  border-radius: 6px;
  color: var(--text-body);
  font-family: ${TEXT_FONT};
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  &:hover { border-color: var(--line-hover); }
`;

export const KindTag = styled.span`
  font-size: 11px;
  color: var(--text-muted);
  border: 1px solid var(--line-subtle);
  border-radius: 4px;
  padding: 1px 6px;
`;

/* ── Idle ──────────────────────────────────────────────────────────────────── */

export const Idle = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  @media (max-width: 720px) { padding: 40px 16px; }
`;

export const IdleTitle = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-body);
`;

export const IdleNote = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
`;

/* ── Feedback ──────────────────────────────────────────────────────────────── */

export const FeedbackRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--line-hairline);
  font-size: 12.5px;
  color: var(--text-muted);
  flex-wrap: wrap;
`;

export const ThumbButton = styled.button<{ $on?: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(p) => (p.$on ? 'var(--primary)' : 'var(--line-subtle)')};
  border-radius: 6px;
  background: ${(p) => (p.$on ? 'var(--accent-surface)' : 'transparent')};
  color: var(--text-secondary);
  cursor: pointer;
`;

export const NoteBox = styled.textarea`
  width: 100%;
  min-height: 72px;
  padding: 10px 12px;
  background: var(--surface-sunken);
  border: 1px solid var(--line-subtle);
  border-radius: 6px;
  color: var(--text-body);
  font-family: ${TEXT_FONT};
  font-size: 13px;
  resize: vertical;
`;

export const SmallButton = styled.button<{ $primary?: boolean }>`
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$primary ? 'var(--primary)' : 'var(--line-subtle)')};
  background: ${(p) => (p.$primary ? 'var(--primary)' : 'transparent')};
  color: ${(p) => (p.$primary ? 'var(--primary-foreground)' : 'var(--text-secondary)')};
  font-family: var(--font-mono);
  font-size: 12.5px;
  cursor: pointer;
`;

/* ── Sign-in gate ──────────────────────────────────────────────────────────── */

export const GateBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
`;

export const GateCard = styled.div`
  width: 420px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  background: var(--surface-raised);
  border: 1px solid var(--line-dialog);
  border-radius: 10px;
`;

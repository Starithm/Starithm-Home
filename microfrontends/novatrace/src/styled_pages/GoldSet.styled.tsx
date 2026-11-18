import styled from 'styled-components';
import { Page, thinScrollbar } from '@shared/components/ui/primitives';

/* Gold set checking page (/novatrace/gold-set). Tokens only (CLAUDE.md). Google Sans Code
 * throughout, as on Ask Evren: globals.css sets it on every element. */

export const Root = styled(Page)`
  font-family: var(--font-mono);
`;

export const Main = styled.main`
  max-width: 1320px;
  margin: 0 auto;
  padding: 32px 24px 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (max-width: 720px) { padding: 20px 16px 72px; }
`;

export const Head = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const H1 = styled.h1`
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  color: var(--text-body);
`;

export const Lead = styled.p`
  margin: 0;
  max-width: var(--measure);
  color: var(--text-secondary);
  line-height: 1.55;
`;

export const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Stat = styled.div`
  padding: 10px 14px;
  border: 1px solid var(--line-hairline);
  border-radius: 8px;
  background: var(--surface);
  & > span { display: block; font-size: 12px; color: var(--text-muted); }
  & > strong { font-family: var(--font-mono); font-size: 18px; font-weight: 500; color: var(--text-body); }
  & > strong small { font-size: 13px; color: var(--text-muted); }
`;

export const Split = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
`;

export const CircularCard = styled.section`
  flex: 1 1 480px;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--line-hairline);
  border-radius: 10px;
  overflow: hidden;
  @media (min-width: 1100px) { position: sticky; top: 16px; }
`;

export const CircularHead = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--line-hairline);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
`;

export const CircularId = styled.div`
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent-text);
`;

export const CircularSubject = styled.div`
  margin-top: 2px;
  color: var(--text-body);
`;

export const CircularBody = styled.pre`
  margin: 0;
  padding: 20px;
  max-height: 75vh;
  overflow: auto;
  ${thinScrollbar}
  font-family: var(--font-mono);
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--text-body);
  white-space: pre-wrap;
`;

export const Form = styled.form`
  flex: 1 1 560px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldBox = styled.fieldset<{ $open?: boolean }>`
  margin: 0;
  padding: 16px 20px;
  border: 1px solid ${(p) => (p.$open ? 'var(--accent-border)' : 'var(--line-hairline)')};
  border-radius: 10px;
  background: ${(p) => (p.$open ? 'var(--surface-raised)' : 'var(--surface)')};
  min-width: 0;
`;

export const Legend = styled.legend`
  padding: 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: var(--text-body);
`;

export const FieldHint = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-muted);
`;

export const Choices = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Choice = styled.button<{ $on?: boolean }>`
  min-height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$on ? 'var(--primary)' : 'var(--line-control)')};
  background: ${(p) => (p.$on ? 'var(--accent-surface)' : 'transparent')};
  color: ${(p) => (p.$on ? 'var(--text-body)' : 'var(--text-secondary)')};
  font: inherit;
  cursor: pointer;
  &:hover { border-color: var(--line-hover); }
  &:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
`;

export const ValueCard = styled.div`
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--line-control);
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  @media (max-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const Label = styled.label<{ $span?: number }>`
  grid-column: span ${(p) => p.$span ?? 1};
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  min-width: 0;
  @media (max-width: 640px) { grid-column: span ${(p) => Math.min(p.$span ?? 1, 2)}; }
`;

const control = `
  min-height: 38px;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--line-control);
  background: var(--surface-sunken);
  color: var(--text-body);
  font-family: var(--font-mono);
  font-size: 13px;
  min-width: 0;
  &:focus { outline: none; border-color: var(--primary); }
  &::placeholder { color: var(--text-placeholder); }
`;

export const Input = styled.input`${control}`;
export const Select = styled.select`${control} padding: 0 6px;`;
export const TextArea = styled.textarea`
  ${control}
  padding: 10px;
  min-height: 72px;
  resize: vertical;
`;

export const RowActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
`;

export const LinkButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border-radius: 6px;
  border: 1px dashed var(--accent-border);
  background: transparent;
  color: var(--accent-text);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  &:hover { border-color: var(--primary); }
`;

export const QuietButton = styled.button`
  min-height: 36px;
  padding: 0 10px;
  border: 0;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  &:hover { color: var(--text-body); }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Primary = styled.button`
  min-height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 8px;
  background: var(--primary);
  color: var(--primary-foreground);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: default; }
  &:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
`;

export const Secondary = styled.button`
  min-height: 44px;
  padding: 0 18px;
  border-radius: 8px;
  border: 1px solid var(--line-control);
  background: transparent;
  color: var(--text-secondary);
  font: inherit;
  cursor: pointer;
  &:hover { border-color: var(--line-hover); }
`;

export const Error = styled.p`
  margin: 0;
  color: var(--starithm-selective-yellow);
  font-size: 14px;
`;

export const Rules = styled.details`
  border: 1px solid var(--line-hairline);
  border-radius: 10px;
  background: var(--surface);
  padding: 12px 18px;
  & > summary { cursor: pointer; color: var(--text-secondary); }
  & ul { margin: 12px 0 4px; padding-left: 20px; color: var(--text-secondary); line-height: 1.6; max-width: var(--measure); }
  & li { margin-bottom: 6px; }
`;

export const Panel = styled.section`
  padding: 24px;
  border: 1px solid var(--line-hairline);
  border-radius: 10px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 720px;
`;

export const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  & input { margin-top: 3px; width: 18px; height: 18px; accent-color: var(--primary); }
`;

/* ── After submitting: the comparison ─────────────────────────────────────── */

export const CompareWrap = styled.div`
  overflow-x: auto;
  ${thinScrollbar}
  border: 1px solid var(--line-hairline);
  border-radius: 10px;
  background: var(--surface);
`;

export const Table = styled.table`
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  font-size: 14px;
  & th { padding: 12px 16px; text-align: left; font-weight: 400; font-size: 13px; color: var(--text-muted); border-bottom: 1px solid var(--line-hairline); }
  & td { padding: 14px 16px; vertical-align: top; border-bottom: 1px solid var(--line-hairline); color: var(--text-body); }
  & tr:last-child td { border-bottom: 0; }
`;

export const FieldCell = styled.td`
  font-weight: 700;
  white-space: nowrap;
`;

export const Vals = styled.div`
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-body);
`;

export const Muted = styled.span`
  color: var(--text-muted);
`;

export const Verdict = styled.span<{ $tone: 'match' | 'miss' | 'extra' | 'none' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  border: 1px solid ${(p) => (p.$tone === 'match' ? 'var(--starithm-nebula-teal)' : p.$tone === 'none' ? 'var(--line-control)' : 'var(--starithm-selective-yellow)')};
  color: ${(p) => (p.$tone === 'match' ? 'var(--starithm-nebula-teal)' : p.$tone === 'none' ? 'var(--text-muted)' : 'var(--starithm-golden-yellow)')};
`;

import styled from 'styled-components';
import { getThemeValue } from '@shared/utils/themeUtils';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background-color: rgba(0,0,0,0.5);
`;

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  width: 100%;
  max-width: 56rem; /* max-w-4xl */
  max-height: 80vh;
  background-color: ${({ theme }) => getThemeValue(theme, 'background', '#ffffff')};
  color: ${({ theme }) => getThemeValue(theme, 'primaryForeground', '#0E0B16')};
  border: 2px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  padding: var(--space-6);
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

export const Meta = styled.div``;

export const MetaTitle = styled.h3`
  font-weight: var(--font-weight-semibold);
`;

export const MetaText = styled.p`
  font-size: var(--font-size-sm);
`;

export const CodeWrapper = styled.div`
  border: 1px solid ${({ theme }) => getThemeValue(theme, 'border', '#686868')};
  border-radius: 0.5rem;
  height: 24rem; /* h-96 */
  overflow: auto;
  background: #ffffff;
  color: #000000;
`;

export const Pre = styled.pre`
  padding: var(--space-4);
  font-size: var(--font-size-sm);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
`;


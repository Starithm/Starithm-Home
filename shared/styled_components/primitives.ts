import styled from 'styled-components';
import { mq } from '../lib/breakpoints';

export const Stack = styled.div<{ gap?: string; align?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap ?? 'var(--space-4)'};
  align-items: ${({ align }) => align ?? 'stretch'};
`;

export const Row = styled.div<{ gap?: string; wrap?: boolean; align?: string; justify?: string }>`
  display: flex;
  flex-direction: row;
  gap: ${({ gap }) => gap ?? 'var(--space-4)'};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);

  ${mq.md} {
    padding: 0 var(--space-6);
  }

  ${mq.lg} {
    padding: 0 var(--space-8);
  }
`;

export const Grid = styled.div<{ cols?: number; gap?: string }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ gap }) => gap ?? 'var(--space-4)'};

  ${mq.md} {
    grid-template-columns: repeat(${({ cols }) => Math.min(cols ?? 2, 2)}, 1fr);
  }

  ${mq.lg} {
    grid-template-columns: repeat(${({ cols }) => cols ?? 3}, 1fr);
  }
`;

export const Screen = styled.div`
  min-height: calc(100dvh - var(--nav-height));
  width: 100%;
`;

export const Panel = styled.div`
  background: color-mix(in srgb, var(--starithm-electric-violet) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--starithm-electric-violet) 20%, transparent);
  border-radius: var(--radius);
  padding: var(--space-4);

  ${mq.md} {
    padding: var(--space-6);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(0, 0, 0, 0.6);
`;

export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

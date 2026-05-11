import styled from 'styled-components';

export const H1 = styled.h1`
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.05em;
`;

export const H2 = styled.h2`
  font-size: clamp(1.375rem, 4vw, 2.25rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.05em;
`;

export const H3 = styled.h3`
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0.05em;
`;

export const H4 = styled.h4`
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
  line-height: 1.4;
`;

export const Body = styled.p`
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
`;

export const Caption = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  color: var(--muted-foreground);
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
`;

export const Code = styled.code`
  font-family: 'Google Sans Code', monospace;
  font-size: 0.875em;
  background: color-mix(in srgb, var(--starithm-electric-violet) 12%, transparent);
  padding: 0.15em 0.4em;
  border-radius: calc(var(--radius) - 2px);
`;

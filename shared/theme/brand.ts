import { css } from 'styled-components';

/* Brand colours and type roles for styled-components, as CSS variables (values live in
 * shared/styles/globals.css). Several style files declared their own copies of these, some
 * as raw hex; import from here instead. */

export const PLATINUM = 'var(--starithm-platinum)';
export const GOLD = 'var(--starithm-golden-yellow)';
export const SELECTIVE_YELLOW = 'var(--starithm-selective-yellow)';
export const VIOLET = 'var(--starithm-electric-violet)';
export const VIOLET_D = 'var(--starithm-electric-violet-dark)';

/** --starithm-platinum (231, 223, 221) at alpha `a`, for rules and muted text on the dark ground.
 *  Stays rgba: CSS can't add alpha to a var(). */
export const platinumA = (a: number) => `rgba(231, 223, 221, ${a})`;

/** Font stacks as values (`font-family: ${MONO};`) and as mixins (`${mono};`). */
export const MONO = 'var(--font-mono)';
export const mono = css`font-family: var(--font-mono);`;
export const prose = css`font-family: var(--font-prose);`;

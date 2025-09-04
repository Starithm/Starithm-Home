import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import styled, { css } from "styled-components";
import { cn } from "../../utils/cn";

// Keep Tailwind variant helper for legacy consumers (e.g., AlertDialog, Pagination)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
      variants: {
        variant: {
          default: "hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20",
          // outline border should be bg-primary color
            outline:
            "border rounded-lg bg-background hover:bg-accent hover:text-accent-foreground",
          secondary:
            "hover:bg-secondary/90",
          ghost:
            "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-2",
        lg: "h-12 px-6 py-3",
        icon: "size-9",
      },
      // New boolean variant to check for an icon
      hasIcon: {
        true: "" // No base styles, just used for the compound variant
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hasIcon: false // Default value
    },
    // Compound variants to explicitly ensure left/right padding when an icon is present
    compoundVariants: [
      {
        size: "default",
        hasIcon: true,
        class: "pl-4 pr-4" // Explicit horizontal padding
      },
      {
        size: "sm",
        hasIcon: true,
        class: "pl-3 pr-3" // Explicit horizontal padding
      },
      {
        size: "lg",
        hasIcon: true,
        class: "pl-6 pr-6" // Explicit horizontal padding
      }
    ]
  },
);

type Variant = NonNullable<Parameters<typeof buttonVariants>[0]> extends { variant: infer V } ? V : never;
type Size = NonNullable<Parameters<typeof buttonVariants>[0]> extends { size: infer S } ? S : never;

const sizeStyles = {
  default: css`
    height: 2.5rem; /* h-10 */
    padding: 0.5rem 1rem; /* py-2 px-4 */
  `,
  sm: css`
    height: 2.25rem; /* h-9 */
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
  `,
  lg: css`
    height: 3rem; /* h-12 */
    padding: 0.75rem 1.5rem; /* py-3 px-6 */
  `,
  icon: css`
    width: 2.25rem; /* size-9 */
    height: 2.25rem;
    padding: 0;
  `,
} as const;

const variantStyles = {
  default: css`
    background-color: var(--primary);
    color: var(--primary-foreground);
    &:hover { filter: brightness(0.95); }
  `,
  destructive: css`
    background-color: var(--destructive);
    color: var(--destructive-foreground);
    &:hover { filter: brightness(0.95); }
  `,
  outline: css`
    border: 1px solid var(--border);
    background-color: var(--background);
    color: var(--foreground);
    &:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
  secondary: css`
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    &:hover { filter: brightness(0.95); }
  `,
  ghost: css`
    background-color: transparent;
    color: inherit;
    &:hover { background-color: var(--accent); color: var(--accent-foreground); }
  `,
  link: css`
    background: transparent;
    color: var(--primary);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  `,
} as const;

const StyledButton = styled.button<{
  $variant?: keyof typeof variantStyles;
  $size?: keyof typeof sizeStyles;
  $hasIcon?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: var(--radius);
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* medium */
  transition: color 0.2s, background-color 0.2s, box-shadow 0.2s;
  outline: none;
  cursor: pointer;
  
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--ring);
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  /* SVG defaults */
  & svg { width: 1rem; height: 1rem; pointer-events: none; flex-shrink: 0; }

  ${({ $size = 'default' }) => sizeStyles[$size]}
  ${({ $variant = 'default' }) => variantStyles[$variant]}

  ${({ $hasIcon, $size }) => $hasIcon && $size !== 'icon' && css`
    padding-left: ${$size === 'lg' ? '1.5rem' : $size === 'sm' ? '0.75rem' : '1rem'};
    padding-right: ${$size === 'lg' ? '1.5rem' : $size === 'sm' ? '0.75rem' : '1rem'};
  `}
`;

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : undefined;
  return (
    <StyledButton
      as={Comp as any}
      data-slot="button"
      className={className}
      $variant={(variant as Variant) || 'default'}
      $size={(size as Size) || 'default'}
      $hasIcon={(props as any).hasIcon as boolean}
      {...props}
    />
  );
}

export { Button, buttonVariants };

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../utils/cn";

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
  const Comp = asChild ? Slot : "button";

  // Apply background colors, text colors, and border colors using inline styles
  const getButtonStyle = () => {
    if (variant === 'default') {
      return { 
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)'
      };
    }
    if (variant === 'secondary') {
      return { 
        backgroundColor: 'var(--secondary)',
        color: 'var(--secondary-foreground)'
      };
    }
    if (variant === 'outline') {
      return { 
        borderColor: 'var(--border)',
        color: 'var(--foreground)'
      };
    }
    return {};
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      style={getButtonStyle()}
      {...props}
    />
  );
}

export { Button, buttonVariants };

import * as React from 'react';

import { cn } from '../lib/cn';

const buttonBaseClassName =
  'hf-shift inline-flex items-center justify-center gap-2 whitespace-nowrap border-[3px] border-foreground text-[11px] font-black uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50';

const buttonVariantClassNames = {
  default:
    'bg-primary text-primary-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
  secondary:
    'bg-secondary text-secondary-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
  outline:
    'bg-accent text-accent-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
  ghost:
    'bg-card text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:bg-muted hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
  soft:
    'bg-muted text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:bg-accent hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
  dark:
    'bg-foreground text-background shadow-[6px_6px_0_hsl(var(--accent))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--accent))]',
  destructive:
    'bg-destructive text-destructive-foreground shadow-[6px_6px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]',
} as const;

const buttonSizeClassNames = {
  default: 'min-h-11 px-4 py-2',
  sm: 'min-h-9 px-3 py-2 text-[10px]',
  lg: 'min-h-12 px-5 py-3 text-[12px]',
  icon: 'h-11 w-11',
} as const;

export type ButtonVariant = keyof typeof buttonVariantClassNames;
export type ButtonSize = keyof typeof buttonSizeClassNames;

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    buttonBaseClassName,
    buttonVariantClassNames[variant],
    buttonSizeClassNames[size],
    className,
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'default', size = 'default', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
});

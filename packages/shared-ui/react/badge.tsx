import * as React from 'react';

import { cn } from '../lib/cn';

const badgeBaseClassName =
  'inline-flex items-center border-[3px] border-foreground px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] shadow-[4px_4px_0_hsl(var(--foreground))]';

const badgeVariantClassNames = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'bg-card text-foreground',
  info: 'bg-accent text-accent-foreground',
  dark: 'bg-foreground text-background shadow-[4px_4px_0_hsl(var(--accent))]',
  subtle: 'bg-muted text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
} as const;

export type BadgeVariant = keyof typeof badgeVariantClassNames;

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function badgeVariants({
  variant = 'default',
  className,
}: {
  variant?: BadgeVariant;
  className?: string;
} = {}) {
  return cn(badgeBaseClassName, badgeVariantClassNames[variant], className);
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <div className={badgeVariants({ variant, className })} {...props} />;
}

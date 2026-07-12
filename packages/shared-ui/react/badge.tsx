import * as React from 'react';

import { cn } from '../lib/cn';

const badgeBaseClassName =
  'inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] transition-colors';

const badgeVariantClassNames = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'border-border bg-background text-foreground',
  info: 'border-sky-500/20 bg-sky-500/10 text-sky-700',
  dark: 'border-white/10 bg-foreground text-background',
  subtle: 'border-border/80 bg-muted text-muted-foreground',
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

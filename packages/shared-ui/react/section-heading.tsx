import * as React from 'react';

import { cn } from '../lib/cn';

export interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {eyebrow ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">{eyebrow}</p>
      ) : null}
      <h2 className={cn('text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl', titleClassName)}>
        {title}
      </h2>
      {description ? (
        <p className={cn('max-w-[65ch] text-sm leading-7 text-muted-foreground sm:text-base', descriptionClassName)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

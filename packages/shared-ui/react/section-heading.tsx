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
    <div className={cn('space-y-4', className)}>
      {eyebrow ? <p className="hf-kicker">{eyebrow}</p> : null}
      <h2
        className={cn(
          'font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.88] tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn('max-w-[70ch] text-sm leading-7 text-muted-foreground sm:text-base', descriptionClassName)}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

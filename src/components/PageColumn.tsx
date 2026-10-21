import type { ReactNode } from 'react';

interface PageColumnProps {
  /** Top and bottom padding only; replaces the subpage default. */
  className?: string;
  children: ReactNode;
}

/**
 * The tan content column. It covers the body's paper grain, runs down to the footer,
 * and reaches 48px up behind the hero or page band so its edges meet the curve.
 */
export default function PageColumn({ className = 'pt-8 pb-20', children }: PageColumnProps) {
  return (
    <div
      className={`relative mx-auto w-full max-w-4xl flex-1 px-4 bg-base-200 [box-shadow:-1px_0_0_rgba(166,134,54,.25),1px_0_0_rgba(166,134,54,.25)] before:absolute before:inset-x-0 before:bottom-full before:h-12 before:bg-inherit before:[box-shadow:inherit] ${className}`}
    >
      {children}
    </div>
  );
}

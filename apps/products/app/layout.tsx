import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

export const metadata: Metadata = {
  title: 'HF Sneaker Grid',
  description: 'Independent catalog domain for HF sneaker drops, bold category blocks, and non-uniform product layouts.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-foreground">{children}</body>
    </html>
  );
}

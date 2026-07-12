import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

export const metadata: Metadata = {
  title: 'Relay Supply Cloud Cart',
  description: 'Independent cart domain for the Relay Supply Cloud storefront.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-[100dvh] bg-[radial-gradient(circle_at_16%_0%,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(16,185,129,0.08),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#f0f9ff_100%)] text-slate-950"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

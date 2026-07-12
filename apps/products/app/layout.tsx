import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

export const metadata: Metadata = {
  title: 'Relay Supply Cloud Catalog',
  description: 'Independent products domain for the Relay Supply Cloud storefront.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(37,99,235,0.08),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef7ff_100%)] text-slate-950">
        {children}
      </body>
    </html>
  );
}

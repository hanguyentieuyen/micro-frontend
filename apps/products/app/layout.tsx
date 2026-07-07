import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

import './globals.css';

export const metadata: Metadata = {
  title: 'Products Remote',
  description: 'Independent products domain app for the commerce portal.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
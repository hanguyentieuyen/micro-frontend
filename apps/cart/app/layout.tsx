import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

export const metadata: Metadata = {
  title: 'HF Bag Board',
  description: 'Independent bag domain for HF sneaker drops, synchronized cart state, and brutalist checkout framing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

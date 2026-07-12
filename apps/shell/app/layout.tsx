import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

import { ShellEventBridge } from '../components/shell-event-bridge';
import { TopNav } from '../components/top-nav';

export const metadata: Metadata = {
  title: 'HF Sneaker Riot',
  description: 'A bold neo-brutalist sneaker storefront for HF, composed as a micro frontend shell with loud product drops and synchronized bag state.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-foreground">
        <ShellEventBridge />
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1540px] flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
          <TopNav />
          <main className="mt-8 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

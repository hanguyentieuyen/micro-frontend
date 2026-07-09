import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

import { ShellEventBridge } from '../components/shell-event-bridge';
import { TopNav } from '../components/top-nav';

import './globals.css';

export const metadata: Metadata = {
  title: 'Commerce Portal Shell',
  description: 'Host shell for the micro frontend learning project.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShellEventBridge />
        <div className="ui-container shell-page">
          <TopNav />
          <main className="shell-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
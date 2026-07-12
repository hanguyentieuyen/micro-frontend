import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@commerce/shared-ui/styles.css';

import { ShellEventBridge } from '../components/shell-event-bridge';
import { TopNav } from '../components/top-nav';

export const metadata: Metadata = {
  title: 'Relay Supply Cloud',
  description: 'Procurement-grade commerce shell for technical buying teams.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-[100dvh] bg-[radial-gradient(circle_at_16%_0%,rgba(37,99,235,0.18),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(14,165,233,0.08),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eef3f8_100%)] text-slate-950">
        <ShellEventBridge />
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col px-4 pb-12 pt-5 sm:px-6 lg:px-8">
          <TopNav />
          <main className="mt-8 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

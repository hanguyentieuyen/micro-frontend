'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NAV_ITEMS } from '../lib/navigation';

function isActiveLink(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(href);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="shell-header">
      <div>
        <p className="shell-eyebrow">Commerce Portal</p>
        <h1 className="shell-title">Shell App</h1>
      </div>

      <nav aria-label="Primary" className="shell-nav">
        {NAV_ITEMS.map((item) => {
          const active = isActiveLink(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'shell-nav-link shell-nav-link--active' : 'shell-nav-link'}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

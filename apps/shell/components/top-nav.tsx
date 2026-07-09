'use client';

import type { CartStateSnapshot } from '@commerce/shared-types';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NAV_ITEMS } from '../lib/navigation';
import { readCartState, SHELL_CART_STATE_CHANGED_EVENT } from '../lib/runtime-bridge';

function isActiveLink(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(href);
}

export function TopNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(readCartState().totalQuantity);

    function handleCartStateChanged(event: Event) {
      const customEvent = event as CustomEvent<CartStateSnapshot>;
      setCartCount(customEvent.detail?.totalQuantity ?? readCartState().totalQuantity);
    }

    window.addEventListener(
      SHELL_CART_STATE_CHANGED_EVENT,
      handleCartStateChanged as EventListener,
    );

    return () => {
      window.removeEventListener(
        SHELL_CART_STATE_CHANGED_EVENT,
        handleCartStateChanged as EventListener,
      );
    };
  }, []);

  return (
    <header className="shell-header">
      <div>
        <p className="shell-eyebrow ui-eyebrow">Commerce Portal</p>
        <h1 className="shell-title">Shell App</h1>
      </div>

      <nav aria-label="Primary" className="shell-nav">
        {NAV_ITEMS.map((item) => {
          const active = isActiveLink(pathname, item.href);
          const showCartBadge = item.href === '/cart' && cartCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'shell-nav-link shell-nav-link--active' : 'shell-nav-link'}
            >
              <span className="shell-nav-link__content">
                <span>{item.label}</span>
                {showCartBadge ? (
                  <span className="shell-nav-link__badge" aria-label={`Cart count ${cartCount}`}>
                    {cartCount}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
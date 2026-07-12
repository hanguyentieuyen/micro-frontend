'use client';

import { Badge, buttonVariants, cn } from '@commerce/shared-ui';
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
    <header className="rounded-2xl border border-border/80 bg-card/90 px-5 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            RS
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
              Relay Supply Cloud
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold tracking-[-0.03em] text-foreground sm:text-xl">
                Procurement-grade ecommerce for technical teams
              </h1>
              <Badge variant="info">Shell host</Badge>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              One buyer shell coordinates catalog discovery, batch purchasing, and account context
              across independently runnable frontend domains.
            </p>
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isActiveLink(pathname, item.href);
            const showCartBadge = item.href === '/cart' && cartCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={buttonVariants({
                  variant: active ? 'dark' : 'outline',
                  size: 'sm',
                  className: 'relative',
                })}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {showCartBadge ? (
                    <span
                      className={cn(
                        'inline-flex min-w-6 items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
                        active
                          ? 'bg-background/10 text-background'
                          : 'bg-accent/10 text-accent',
                      )}
                      aria-label={`Cart count ${cartCount}`}
                    >
                      {cartCount}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}


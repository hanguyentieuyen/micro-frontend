'use client';

import { buttonVariants, cn } from '@commerce/shared-ui';
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
    <header className="hf-panel hf-terminal-border px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center border-[3px] border-foreground bg-primary font-[family:var(--font-display)] text-lg font-black uppercase tracking-[-0.06em] text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
              HF
            </div>

            <div className="space-y-2">
              <p className="hf-kicker">HF sneaker riot</p>
              <h1 className="font-[family:var(--font-display)] text-2xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-3xl">
                Sneaker drops staged like posters, not polite ecommerce.
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-foreground lg:ml-4">
            <span className="border-[3px] border-foreground bg-accent px-3 py-2 shadow-[4px_4px_0_hsl(var(--foreground))]">drop live</span>
            <span className="border-[3px] border-foreground bg-secondary px-3 py-2 text-secondary-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">size locked</span>
            <span className="border-[3px] border-foreground bg-card px-3 py-2 shadow-[4px_4px_0_hsl(var(--foreground))]">bag sync</span>
          </div>
        </div>

        <nav aria-label="Primary" className="flex flex-wrap gap-3 xl:justify-end">
          {NAV_ITEMS.map((item) => {
            const active = isActiveLink(pathname, item.href);
            const showCartBadge = item.href === '/cart' && cartCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={buttonVariants({
                  variant: active ? 'default' : 'ghost',
                  size: 'sm',
                  className: 'relative min-w-[104px] justify-center',
                })}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{item.label}</span>
                  {showCartBadge ? (
                    <span
                      className={cn(
                        'inline-flex min-w-6 items-center justify-center border-[3px] px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] shadow-[3px_3px_0_hsl(var(--foreground))]',
                        active
                          ? 'border-primary-foreground bg-card text-foreground'
                          : 'border-foreground bg-accent text-foreground',
                      )}
                      aria-label={`Bag count ${cartCount}`}
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

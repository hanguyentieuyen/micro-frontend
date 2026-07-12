'use client';

import { Badge, Button, Card, CardHeader, CardTitle, SectionHeading } from '@commerce/shared-ui';
import {
  SHELL_MESSAGES,
  isShellMessageEnvelope,
  type CartItem,
  type CartStateSnapshot,
  type Product,
} from '@commerce/shared-types';
import { useEffect, useState } from 'react';

import {
  cartItemAddedEventName,
  shellCartStateSyncMessageName,
  sampleIncomingCartItemAddedPayload,
} from '../lib/cart-event-contract';
import { mockCartItems, mockCartProducts } from '../lib/mock-cart';

const productMap = new Map(mockCartProducts.map((product) => [product.id, product]));

const sizeMap: Record<string, string> = {
  'p-hf-rift-runner-01': 'US 9',
  'p-hf-bricklane-high': 'US 10',
  'p-hf-noise-trail': 'US 8.5',
  'p-hf-gridshock-90': 'US 9.5',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Waiting for shell sync';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));
}

function resolveProduct(item: CartItem): Product {
  return productMap.get(item.productId) ?? {
    id: item.productId,
    name: 'Unknown synced pair',
    price: 0,
    category: 'Runtime sync',
    rating: 0,
  };
}

function resolveLineItem(item: CartItem) {
  const product = resolveProduct(item);

  return {
    product,
    quantity: item.quantity,
    lineTotal: product.price * item.quantity,
  };
}

function CartLine({ product, quantity, lineTotal, index }: { product: Product; quantity: number; lineTotal: number; index: number }) {
  const sizeLabel = sizeMap[product.id] ?? 'US ?';
  const cardTone = index % 2 === 0 ? 'bg-card' : 'bg-accent';

  return (
    <Card className={cardTone}>
      <CardHeader className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={index % 2 === 0 ? 'secondary' : 'outline'} className="w-fit">
              {product.category}
            </Badge>
            <span className="border-[3px] border-foreground bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
              {sizeLabel}
            </span>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-[family:var(--font-display)] text-2xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-foreground">
              {product.name}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Synced from the shell-owned bag state and pinned here as one loud poster line item.
            </p>
          </div>
        </div>

        <div className="space-y-2 text-left sm:text-right">
          <span className="inline-flex border-[3px] border-foreground bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            Qty {quantity}
          </span>
          <strong className="block font-[family:var(--font-display)] text-3xl font-black uppercase leading-none tracking-[-0.06em] text-foreground">
            {formatPrice(lineTotal)}
          </strong>
        </div>
      </CardHeader>
    </Card>
  );
}

export function CartRuntimeView() {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const [integrationMode, setIntegrationMode] = useState<'standalone' | 'shell-runtime'>('standalone');
  const [lastSync, setLastSync] = useState<CartStateSnapshot | null>(null);

  useEffect(() => {
    const embedded = typeof window !== 'undefined' && window.parent !== window;

    if (embedded) {
      setIntegrationMode('shell-runtime');
      setItems([]);
    }

    function handleMessage(event: MessageEvent) {
      if (embedded && event.source !== window.parent) {
        return;
      }

      if (!isShellMessageEnvelope(event.data)) {
        return;
      }

      if (event.data.messageName !== SHELL_MESSAGES['shell:cart-state-sync']) {
        return;
      }

      setItems(event.data.payload.items);
      setLastSync(event.data.payload);
    }

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const resolvedItems = items.map(resolveLineItem);
  const itemCount = resolvedItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = resolvedItems.reduce((total, item) => total + item.lineTotal, 0);
  const modeLabel = integrationMode === 'shell-runtime' ? 'Shell-synced bag' : 'Standalone bag';

  return (
    <main className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_320px]">
        <Card className="hf-terminal-border rounded-[0.25rem]">
          <CardHeader className="space-y-6">
            <SectionHeading
              eyebrow="Bag module"
              title="Your bag looks like a wall of stamps, not a muted checkout table."
              description={
                <>
                  This remote listens for <code>{shellCartStateSyncMessageName}</code> and renders the
                  exact shared bag state without guessing upstream changes.
                </>
              }
            />

            <div className="flex flex-wrap gap-3">
              <Badge variant="default">{modeLabel}</Badge>
              <Badge variant="outline">listens for shell sync</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="hf-panel-dark rounded-[0.25rem] text-background">
          <CardHeader className="space-y-3">
            <span className="hf-kicker bg-accent text-foreground">Bag count</span>
            <strong className="font-[family:var(--font-display)] text-7xl font-black uppercase leading-none tracking-[-0.08em] text-white">
              {itemCount}
            </strong>
            <p className="text-sm leading-7 text-white/80">
              total pairs currently locked inside the active HF bag.
            </p>
            <span className="inline-flex w-fit border-[3px] border-white bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-[4px_4px_0_hsl(var(--accent))]">
              Updated {formatTimestamp(lastSync?.updatedAt ?? null)}
            </span>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="hf-terminal-border rounded-[0.25rem]">
          <CardHeader className="space-y-6">
            <div className="space-y-3">
              <CardTitle className="text-2xl sm:text-3xl">
                {integrationMode === 'shell-runtime' ? 'Shell-synced sneaker bag' : 'Standalone starter bag'}
              </CardTitle>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                The bag remote owns the visible layout, total blocks, and checkout framing while the
                shell continues to own the shared state beneath it.
              </p>
            </div>

            {resolvedItems.length > 0 ? (
              <div className="grid gap-4">
                {resolvedItems.map((item, index) => (
                  <CartLine key={`${item.product.id}-${index}`} {...item} index={index} />
                ))}
              </div>
            ) : (
              <div className="border-[4px] border-dashed border-foreground bg-muted p-6 shadow-[6px_6px_0_hsl(var(--foreground))]">
                <p className="text-sm leading-7 text-muted-foreground">
                  No pairs synced yet. Add sneakers from the shell-hosted shop, then return here to
                  watch the bag board fill up.
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        <Card className="rounded-[0.25rem]">
          <CardHeader className="space-y-6">
            <div className="space-y-2">
              <p className="hf-kicker">Bag summary</p>
              <h2 className="font-[family:var(--font-display)] text-5xl font-black uppercase leading-none tracking-[-0.07em] text-foreground">
                {formatPrice(subtotal)}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Loud total, direct labels, and one clear move toward checkout.
              </p>
            </div>

            <ul className="grid gap-3">
              <li className="border-[4px] border-foreground bg-card px-4 py-3 text-sm text-muted-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
                <div className="flex items-center justify-between gap-3">
                  <span>Unique pairs</span>
                  <strong className="text-foreground">{resolvedItems.length}</strong>
                </div>
              </li>
              <li className="border-[4px] border-foreground bg-accent px-4 py-3 text-sm text-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
                <div className="flex items-center justify-between gap-3">
                  <span>Total quantity</span>
                  <strong>{itemCount}</strong>
                </div>
              </li>
              <li className="border-[4px] border-foreground bg-card px-4 py-3 text-sm text-muted-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
                <div className="flex items-center justify-between gap-3">
                  <span>Last shell sync</span>
                  <strong className="text-foreground">{formatTimestamp(lastSync?.updatedAt ?? null)}</strong>
                </div>
              </li>
            </ul>

            <Button variant="default">Secure the pair</Button>
          </CardHeader>
        </Card>
      </section>

      <Card className="hf-terminal-border rounded-[0.25rem]">
        <CardHeader className="space-y-6">
          <SectionHeading
            eyebrow="Contract proof"
            title="The bag stays loud without hiding the runtime contract."
            description="Visual attitude changed. Event boundaries did not. The proof remains explicit for debugging, learning, and interviews."
            titleClassName="text-3xl sm:text-4xl"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="border-[4px] border-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Original event</span>
              <strong className="mt-2 block text-base uppercase tracking-[0.14em] text-foreground">
                {cartItemAddedEventName}
              </strong>
            </article>
            <article className="border-[4px] border-foreground bg-accent p-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70">Expected product id</span>
              <strong className="mt-2 block text-base uppercase tracking-[0.14em] text-foreground">
                {sampleIncomingCartItemAddedPayload.productId}
              </strong>
            </article>
            <article className="border-[4px] border-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Expected quantity</span>
              <strong className="mt-2 block text-base uppercase tracking-[0.14em] text-foreground">
                {sampleIncomingCartItemAddedPayload.quantity}
              </strong>
            </article>
            <article className="border-[4px] border-foreground bg-secondary p-5 text-secondary-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">Sync message</span>
              <strong className="mt-2 block text-base uppercase tracking-[0.14em]">
                {shellCartStateSyncMessageName}
              </strong>
            </article>
          </div>
        </CardHeader>
      </Card>
    </main>
  );
}

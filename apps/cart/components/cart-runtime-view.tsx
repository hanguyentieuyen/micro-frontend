'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, SectionHeading } from '@commerce/shared-ui';
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
    name: 'Unknown synced product',
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

function CartLine({ product, quantity, lineTotal }: { product: Product; quantity: number; lineTotal: number }) {
  return (
    <Card className="bg-card/95">
      <CardHeader className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Badge variant="info" className="w-fit">{product.category}</Badge>
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">{product.name}</h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Synced from the shell-owned procurement batch and rendered inside the cart domain.
            </p>
          </div>
        </div>

        <div className="space-y-1 text-left sm:text-right">
          <span className="block text-sm text-muted-foreground">Qty {quantity}</span>
          <strong className="block text-xl font-semibold tracking-[-0.03em] text-foreground">
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
  const modeLabel = integrationMode === 'shell-runtime' ? 'Shell-synced batch' : 'Standalone batch';

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_300px]">
        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-6">
            <SectionHeading
              eyebrow="Cart domain"
              title="Build the procurement batch before checkout moves forward."
              description={
                <>
                  Cart is a presentation surface for the batch the shell owns. It listens for{' '}
                  <code>{shellCartStateSyncMessageName}</code> and renders the latest synchronized
                  snapshot instead of guessing what happened upstream.
                </>
              }
            />

            <div className="flex flex-wrap gap-2.5">
              <Badge variant="info">{modeLabel}</Badge>
              <Badge variant="subtle">Listens for shell sync</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-foreground/10 bg-foreground text-background shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <CardHeader className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-300">
              Batch snapshot
            </span>
            <strong className="block text-5xl font-semibold tracking-[-0.08em]">{itemCount}</strong>
            <p className="text-sm leading-7 text-slate-300">
              items currently visible in the active procurement batch.
            </p>
            <span className="inline-flex w-fit rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              Updated {formatTimestamp(lastSync?.updatedAt ?? null)}
            </span>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-6">
            <div className="space-y-3">
              <CardTitle>
                {integrationMode === 'shell-runtime' ? 'Shell-synced procurement batch' : 'Standalone seed batch'}
              </CardTitle>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Cart remains responsible for batch presentation, summary, and checkout framing.
                The shell remains responsible for the upstream shared state.
              </p>
            </div>

            {resolvedItems.length > 0 ? (
              <div className="grid gap-4">
                {resolvedItems.map((item) => (
                  <CartLine key={item.product.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/60 p-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  No synced items yet. Trigger add-to-cart from the shell-hosted products route and
                  return here to review the batch.
                </p>
              </div>
            )}
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-6">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
                Summary
              </p>
              <h2 className="text-4xl font-semibold tracking-[-0.06em] text-foreground">
                {formatPrice(subtotal)}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                The cart owns the purchasing summary, but the state behind it still comes from the shared shell.
              </p>
            </div>

            <ul className="grid gap-3">
              <li className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <span>Line items</span>
                <strong className="text-foreground">{resolvedItems.length}</strong>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <span>Total quantity</span>
                <strong className="text-foreground">{itemCount}</strong>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                <span>Last shell sync</span>
                <strong className="text-foreground">{formatTimestamp(lastSync?.updatedAt ?? null)}</strong>
              </li>
            </ul>

            <Button variant="dark">Continue to approval</Button>
          </CardHeader>
        </Card>
      </section>

      <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-6">
          <SectionHeading
            eyebrow="Platform sync"
            title="Cart understands the buying flow because the contract stays stable."
            description="This panel keeps the portfolio-ready technical proof visible without taking over the buyer experience on the main batch surface."
            titleClassName="text-2xl"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-border/70 bg-muted/60 p-5">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Original event</span>
              <strong className="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
                {cartItemAddedEventName}
              </strong>
            </article>
            <article className="rounded-xl border border-border/70 bg-muted/60 p-5">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Expected product id</span>
              <strong className="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
                {sampleIncomingCartItemAddedPayload.productId}
              </strong>
            </article>
            <article className="rounded-xl border border-border/70 bg-muted/60 p-5">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Expected quantity</span>
              <strong className="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
                {sampleIncomingCartItemAddedPayload.quantity}
              </strong>
            </article>
            <article className="rounded-xl border border-border/70 bg-muted/60 p-5">
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sync message</span>
              <strong className="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
                {shellCartStateSyncMessageName}
              </strong>
            </article>
          </div>
        </CardHeader>
      </Card>
    </main>
  );
}


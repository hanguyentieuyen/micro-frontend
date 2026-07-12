'use client';

import { Button, buttonVariants, cn } from '@commerce/shared-ui';
import { useState } from 'react';

import type { MicroAppEventEnvelope, Product } from '@commerce/shared-types';

import {
  buildCartItemAddedPayload,
  cartItemAddedEventName,
} from '../lib/cart-event-contract';
import { emitCartItemAddedToShell, isEmbeddedInShell } from '../lib/runtime-bridge';

type SentCartEvent = MicroAppEventEnvelope<typeof cartItemAddedEventName>;

const productSpecs: Record<string, { label: string; fit: string; sole: string; note: string; drop: string }> = {
  'p-hf-rift-runner-01': {
    label: 'city cut',
    fit: 'narrow heel / fast collar',
    sole: 'split foam sole',
    note: 'best for fast streets and loud color blocking',
    drop: 'drop 01',
  },
  'p-hf-bricklane-high': {
    label: 'boxed high',
    fit: 'padded ankle / stiff stance',
    sole: 'stacked rubber brick',
    note: 'made to feel blunt, tall, and graphic',
    drop: 'drop 02',
  },
  'p-hf-noise-trail': {
    label: 'trail unit',
    fit: 'roomy forefoot / pull tab back',
    sole: 'toothed off-road tread',
    note: 'rough shape for daily city + trail abuse',
    drop: 'drop 03',
  },
  'p-hf-gridshock-90': {
    label: 'street core',
    fit: 'classic width / stable tongue',
    sole: 'waffle plate shock base',
    note: 'smallest pair on the wall but still loud',
    drop: 'drop 04',
  },
};

const layoutClassNames = [
  'md:col-span-4 md:row-span-3 bg-primary text-primary-foreground',
  'md:col-span-2 md:row-span-2 bg-accent text-foreground md:translate-y-4',
  'md:col-span-2 md:row-span-3 bg-card text-foreground md:-translate-y-3',
  'md:col-span-4 md:row-span-2 bg-secondary text-secondary-foreground',
] as const;

const stageToneClassNames = [
  'bg-card',
  'bg-primary text-primary-foreground',
  'bg-secondary text-secondary-foreground',
  'bg-accent',
] as const;

const filterStamps = ['new drop', 'low cut', 'high cut', 'trail unit', 'size 37-45'];

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductPoster({
  product,
  index,
  onAdd,
}: {
  product: Product;
  index: number;
  onAdd: (product: Product) => void;
}) {
  const specs = productSpecs[product.id];
  const layoutClassName = layoutClassNames[index % layoutClassNames.length];
  const stageToneClassName = stageToneClassNames[index % stageToneClassNames.length];
  const largeNumber = String(index + 1).padStart(2, '0');

  return (
    <article className={cn('hf-panel hf-shift group p-5 hover:-translate-x-1 hover:-translate-y-1', layoutClassName)}>
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <span className={cn('hf-price-burst px-3 py-2 font-[family:var(--font-display)] text-sm font-black uppercase tracking-[0.08em] text-foreground', stageToneClassName)}>
            {formatPrice(product.price)}
          </span>
          <span className="-rotate-3 border-[3px] border-foreground bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            {specs.drop}
          </span>
        </div>

        <div className="space-y-3">
          <div className="hf-number text-[4.4rem] opacity-20 sm:text-[5.6rem]">{largeNumber}</div>
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-80">{product.category}</p>
            <h3 className="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.05em]">
              {product.name}
            </h3>
            <p className="max-w-[28rem] text-sm leading-6 opacity-80">{specs.note}</p>
          </div>
        </div>

        <div className="hf-sneaker-stage h-[138px] bg-card">
          <div className="absolute left-4 top-4 border-[3px] border-foreground bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            {specs.label}
          </div>
          <div className="absolute right-4 top-4 border-[3px] border-foreground bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))] opacity-0 transition duration-150 group-hover:opacity-100">
            rating {product.rating.toFixed(1)}
          </div>
          <div className="absolute bottom-4 left-4 max-w-[14rem] text-[10px] uppercase tracking-[0.18em] text-foreground/80">
            {specs.fit}
          </div>
          <div className="absolute bottom-4 right-4 max-w-[12rem] text-right text-[10px] uppercase tracking-[0.18em] text-foreground/80 opacity-0 transition duration-150 group-hover:opacity-100">
            {specs.sole}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-80">hover reveals fit + sole</span>
          <Button variant="dark" onClick={() => onAdd(product)}>
            Add to bag
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductsCatalog({ products }: { products: Product[] }) {
  const [lastSentEvent, setLastSentEvent] = useState<SentCartEvent | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Pick any pair to emit a bag event and watch the shell translate that intent into shared cart state.',
  );

  function handleAdd(product: Product) {
    const payload = buildCartItemAddedPayload(product);
    const envelope = emitCartItemAddedToShell(payload);

    setLastSentEvent(envelope);
    setStatusMessage(
      isEmbeddedInShell()
        ? 'Bag event sent to the shell. The nav badge and bag remote should now show the same pair count.'
        : 'Bag event prepared locally. Open this catalog inside the shell to see the full cross-app sync.'
    );
  }

  return (
    <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.14fr)_360px]">
      <div className="hf-panel hf-terminal-border p-6 sm:p-8">
        <div className="space-y-5">
          <div className="space-y-4">
            <p className="hf-kicker">Filters / labels</p>
            <div className="flex flex-wrap gap-3">
              {filterStamps.map((item, index) => (
                <span
                  key={item}
                  className={cn(
                    'hf-stamp',
                    index % 3 === 0
                      ? 'bg-accent text-foreground'
                      : index % 3 === 1
                        ? 'bg-card text-foreground'
                        : 'bg-secondary text-secondary-foreground',
                    index % 2 === 0 ? '-rotate-[2deg]' : 'rotate-[2deg]',
                  )}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-5xl">
              Products don&apos;t line up. They fight for wall space.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Bigger pairs take over the grid, smaller pairs slip between them, and the whole thing
              stays readable through labels, numbers, and hard contrast.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-6 md:auto-rows-[118px]">
            {products.map((product, index) => (
              <ProductPoster key={product.id} product={product} index={index} onAdd={handleAdd} />
            ))}
          </div>
        </div>
      </div>

      <aside className="hf-panel p-6 sm:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="hf-kicker">Runtime receipt</p>
            <h2 className="font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground">
              Bag handoff status
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">{statusMessage}</p>
          </div>

          <div className="grid gap-3">
            {lastSentEvent ? (
              <>
                <div className="border-[4px] border-foreground bg-card px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">event name</p>
                  <strong className="mt-2 block text-sm uppercase tracking-[0.14em] text-foreground">{lastSentEvent.eventName}</strong>
                </div>
                <div className="border-[4px] border-foreground bg-accent px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70">source app</p>
                  <strong className="mt-2 block text-sm uppercase tracking-[0.14em] text-foreground">{lastSentEvent.sourceApp}</strong>
                </div>
                <div className="border-[4px] border-foreground bg-card px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">product id</p>
                  <strong className="mt-2 block text-sm uppercase tracking-[0.14em] text-foreground">{lastSentEvent.payload.productId}</strong>
                </div>
                <div className="border-[4px] border-foreground bg-secondary px-4 py-3 text-secondary-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">quantity</p>
                  <strong className="mt-2 block text-sm uppercase tracking-[0.14em]">{lastSentEvent.payload.quantity}</strong>
                </div>
              </>
            ) : (
              <div className="border-[4px] border-dashed border-foreground bg-muted px-4 py-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
                <p className="text-sm leading-7 text-muted-foreground">
                  No bag intent yet. Slam one pair into the bag to generate the first runtime receipt.
                </p>
              </div>
            )}
          </div>

          <a href="/cart" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'w-full justify-center' })}>
            Inspect bag remote
          </a>
        </div>
      </aside>
    </section>
  );
}

'use client';

import { Badge, Button, Card, CardContent, CardHeader, SectionHeading } from '@commerce/shared-ui';
import { useState } from 'react';

import type { MicroAppEventEnvelope, Product } from '@commerce/shared-types';

import {
  buildCartItemAddedPayload,
  cartItemAddedEventName,
} from '../lib/cart-event-contract';
import { emitCartItemAddedToShell, isEmbeddedInShell } from '../lib/runtime-bridge';

type SentCartEvent = MicroAppEventEnvelope<typeof cartItemAddedEventName>;

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (product: Product) => void;
}) {
  return (
    <Card className="group bg-card/95 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
      <CardHeader className="flex h-full flex-col justify-between gap-6 p-5">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <Badge variant="info">{product.category}</Badge>
            <Badge variant="subtle">Readiness {product.rating.toFixed(1)} / 5</Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              {product.name}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">
              Structured for technical buyers who need a clean handoff from catalog review into a
              procurement batch.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3 border-t border-border/80 pt-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Unit price</p>
              <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>
            <Button variant="dark" onClick={() => onAdd(product)}>
              Add to batch
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

export function ProductsCatalog({ products }: { products: Product[] }) {
  const [lastSentEvent, setLastSentEvent] = useState<SentCartEvent | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Pick any product to emit procurement intent and let the shell translate it into shared cart state.',
  );

  function handleAdd(product: Product) {
    const payload = buildCartItemAddedPayload(product);
    const envelope = emitCartItemAddedToShell(payload);

    setLastSentEvent(envelope);
    setStatusMessage(
      isEmbeddedInShell()
        ? 'Intent sent to the shell. The shared cart badge and the cart remote should reflect the same update.'
        : 'Intent prepared locally. Open this catalog inside the shell to see the cross-app batch sync.'
    );
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>

      <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-6">
          <SectionHeading
            eyebrow="Runtime receipt"
            title="Procurement handoff status"
            description={statusMessage}
            titleClassName="text-2xl"
          />

          <div className="flex flex-wrap gap-2.5">
            <Badge variant="info">event producer</Badge>
            <Badge variant="subtle">shared contract</Badge>
          </div>

          {lastSentEvent ? (
            <div className="grid gap-3 rounded-2xl border border-border/80 bg-muted/70 p-5">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Event name</span>
                <strong className="text-sm font-semibold text-foreground">{lastSentEvent.eventName}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Source app</span>
                <strong className="text-sm font-semibold text-foreground">{lastSentEvent.sourceApp}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Product id</span>
                <strong className="text-sm font-semibold text-foreground">{lastSentEvent.payload.productId}</strong>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Quantity</span>
                <strong className="text-sm font-semibold text-foreground">{lastSentEvent.payload.quantity}</strong>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/60 p-5">
              <p className="text-sm leading-7 text-muted-foreground">
                No event has been emitted yet. Add one of the approved SKUs to create the first
                batch intent receipt.
              </p>
            </div>
          )}
        </CardHeader>
      </Card>
    </section>
  );
}


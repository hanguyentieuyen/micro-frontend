'use client';

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
    <article className="ui-card product-card">
      <div className="product-card__meta">
        <span>{product.category}</span>
        <span>{product.rating.toFixed(1)} / 5</span>
      </div>
      <h3>{product.name}</h3>
      <p className="product-card__price">{formatPrice(product.price)}</p>
      <button
        type="button"
        className="ui-button ui-button--primary product-card__button"
        onClick={() => onAdd(product)}
      >
        Add to cart
      </button>
    </article>
  );
}

export function ProductsCatalog({ products }: { products: Product[] }) {
  const [lastSentEvent, setLastSentEvent] = useState<SentCartEvent | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    'Choose any product to emit the typed contract that the shell will translate into cart state.',
  );

  function handleAdd(product: Product) {
    const payload = buildCartItemAddedPayload(product);
    const envelope = emitCartItemAddedToShell(payload);

    setLastSentEvent(envelope);
    setStatusMessage(
      isEmbeddedInShell()
        ? 'Event sent to the shell. The host cart badge should increase immediately.'
        : 'Event prepared locally. Open this remote inside the shell to see cross-app cart sync.',
    );
  }

  return (
    <div className="ui-stack-md">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>

      <aside className="ui-section ui-stack-md">
        <div>
          <p className="ui-eyebrow">Day 16 / Event producer</p>
          <h3>Products emits a typed event instead of mutating cart directly.</h3>
        </div>

        <p className="ui-copy">{statusMessage}</p>

        {lastSentEvent ? (
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">
              Event name: <code>{lastSentEvent.eventName}</code>
            </p>
            <p className="ui-copy">sourceApp: {lastSentEvent.sourceApp}</p>
            <p className="ui-copy">productId: {lastSentEvent.payload.productId}</p>
            <p className="ui-copy">quantity: {lastSentEvent.payload.quantity}</p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
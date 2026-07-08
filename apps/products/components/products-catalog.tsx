'use client';

import { useState } from 'react';

import type { Product } from '@commerce/shared-types';

import {
  buildCartItemAddedPayload,
  cartItemAddedEventName,
  type PreparedCartItemAddedPayload,
} from '../lib/cart-event-contract';

type PreparedCartEvent = {
  name: typeof cartItemAddedEventName;
  payload: PreparedCartItemAddedPayload;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({
  product,
  onPrepare,
}: {
  product: Product;
  onPrepare: (product: Product) => void;
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
        onClick={() => onPrepare(product)}
      >
        Preview add event
      </button>
    </article>
  );
}

export function ProductsCatalog({ products }: { products: Product[] }) {
  const [preparedEvent, setPreparedEvent] = useState<PreparedCartEvent | null>(null);

  function prepareCartEvent(product: Product) {
    setPreparedEvent({
      name: cartItemAddedEventName,
      payload: buildCartItemAddedPayload(product),
    });
  }

  return (
    <div className="ui-stack-md">
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onPrepare={prepareCartEvent} />
        ))}
      </div>

      <aside className="ui-section ui-stack-md">
        <div>
          <p className="ui-eyebrow">Day 15 / Shared contract preview</p>
          <h3>Products now prepares a typed cart event contract.</h3>
        </div>

        {preparedEvent ? (
          <div className="ui-card ui-stack-sm">
            <p className="ui-copy">
              Event name: <code>{preparedEvent.name}</code>
            </p>
            <p className="ui-copy">productId: {preparedEvent.payload.productId}</p>
            <p className="ui-copy">quantity: {preparedEvent.payload.quantity}</p>
          </div>
        ) : (
          <p className="ui-copy">
            Click any product CTA to preview the exact payload shape that this remote will emit on Day 16.
          </p>
        )}
      </aside>
    </div>
  );
}
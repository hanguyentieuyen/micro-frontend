'use client';

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
    <article className="cart-line">
      <div>
        <p className="cart-line__category">{product.category}</p>
        <h3>{product.name}</h3>
      </div>
      <div className="cart-line__meta">
        <span>Qty {quantity}</span>
        <strong>{formatPrice(lineTotal)}</strong>
      </div>
    </article>
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

  return (
    <main className="ui-container cart-page">
      <section className="ui-section cart-hero">
        <div className="ui-stack-md">
          <p className="ui-eyebrow">Week 3 / Day 16</p>
          <h1>Cart now consumes shell-synced state instead of guessing product actions.</h1>
          <p className="ui-copy">
            This remote stays focused on cart data, line items, and totals. In shell mode it listens for <code>{shellCartStateSyncMessageName}</code> and renders state produced from the typed <code>{cartItemAddedEventName}</code> flow.
          </p>
        </div>

        <div className="badge-panel">
          <span className="badge-panel__count">{itemCount}</span>
          <span className="badge-panel__label">items currently in cart</span>
        </div>
      </section>

      <section className="cart-grid">
        <section className="ui-section ui-stack-md">
          <div>
            <p className="ui-eyebrow">Cart items</p>
            <h2>{integrationMode === 'shell-runtime' ? 'Shell-synced basket' : 'Standalone mock basket'}</h2>
          </div>

          {resolvedItems.length > 0 ? (
            <div className="cart-lines">
              {resolvedItems.map((item) => (
                <CartLine key={item.product.id} {...item} />
              ))}
            </div>
          ) : (
            <div className="ui-card ui-stack-sm">
              <p className="ui-copy">
                No synced items yet. Add a product from the shell-hosted products route, then come back here.
              </p>
            </div>
          )}
        </section>

        <aside className="ui-section ui-stack-md summary-panel">
          <div>
            <p className="ui-eyebrow">Summary</p>
            <h2>{formatPrice(subtotal)}</h2>
          </div>
          <ul className="summary-list">
            <li>
              <span>Line items</span>
              <strong>{resolvedItems.length}</strong>
            </li>
            <li>
              <span>Total quantity</span>
              <strong>{itemCount}</strong>
            </li>
            <li>
              <span>Last shell sync</span>
              <strong>{formatTimestamp(lastSync?.updatedAt ?? null)}</strong>
            </li>
          </ul>
          <button type="button" className="ui-button ui-button--primary summary-button">Proceed to checkout</button>
        </aside>
      </section>

      <section className="ui-section ui-stack-md">
        <div>
          <p className="ui-eyebrow">Day 16 / Consumer contract</p>
          <h2>Cart knows both the event language and the shell sync message.</h2>
        </div>
        <div className="ui-card ui-stack-sm">
          <p className="ui-copy">
            Original event: <code>{cartItemAddedEventName}</code>
          </p>
          <p className="ui-copy">Expected payload productId: {sampleIncomingCartItemAddedPayload.productId}</p>
          <p className="ui-copy">Expected payload quantity: {sampleIncomingCartItemAddedPayload.quantity}</p>
          <p className="ui-copy">
            Shell sync message: <code>{shellCartStateSyncMessageName}</code>
          </p>
          <p className="ui-copy">Current mode: {integrationMode}</p>
        </div>
      </section>
    </main>
  );
}
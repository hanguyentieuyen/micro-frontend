import type { CartItem, Product } from '@commerce/shared-types';

import { mockCartItems, mockCartProducts } from '../lib/mock-cart';

const productMap = new Map(mockCartProducts.map((product) => [product.id, product]));

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function resolveLineItem(item: CartItem) {
  const product = productMap.get(item.productId);

  if (!product) {
    throw new Error('Missing product for cart item: ' + item.productId);
  }

  return {
    product,
    quantity: item.quantity,
    lineTotal: product.price * item.quantity,
  };
}

const resolvedItems = mockCartItems.map(resolveLineItem);
const itemCount = resolvedItems.reduce((total, item) => total + item.quantity, 0);
const subtotal = resolvedItems.reduce((total, item) => total + item.lineTotal, 0);

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

export default function CartHomePage() {
  return (
    <main className="ui-container cart-page">
      <section className="ui-section cart-hero">
        <div className="ui-stack-md">
          <p className="ui-eyebrow">Day 11 / Cart Domain</p>
          <h1>Cart app owns badge state and basket summary.</h1>
          <p className="ui-copy">
            This Next.js domain is intentionally focused on cart data, line items, and totals.
            It is a clean place to later consume events like <code>cart:item-added</code>.
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
            <h2>Mock basket list</h2>
          </div>
          <div className="cart-lines">
            {resolvedItems.map((item) => (
              <CartLine key={item.product.id} {...item} />
            ))}
          </div>
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
              <span>Shipping</span>
              <strong>Calculated later</strong>
            </li>
          </ul>
          <button type="button" className="ui-button ui-button--primary summary-button">Proceed to checkout</button>
        </aside>
      </section>
    </main>
  );
}
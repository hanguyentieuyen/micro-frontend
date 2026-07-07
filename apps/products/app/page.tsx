import type { Product } from '@commerce/shared-types';

import { mockProducts } from '../lib/mock-products';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="ui-card product-card">
      <div className="product-card__meta">
        <span>{product.category}</span>
        <span>{product.rating.toFixed(1)} / 5</span>
      </div>
      <h3>{product.name}</h3>
      <p className="product-card__price">{formatPrice(product.price)}</p>
      <button type="button" className="ui-button ui-button--primary product-card__button">
        Add to cart
      </button>
    </article>
  );
}

export default function ProductsHomePage() {
  return (
    <main className="ui-container products-page">
      <section className="ui-section products-hero">
        <div className="ui-stack-md">
          <p className="ui-eyebrow">Day 10 / Products Domain</p>
          <h1>Products app runs independently and owns catalog UI.</h1>
          <p className="ui-copy">
            This Next.js domain focuses on one job: rendering product discovery.
            It should not know cart totals, shell layout rules, or profile concerns.
          </p>
        </div>

        <div className="hero-stat">
          <span className="hero-stat__value">{mockProducts.length}</span>
          <span className="hero-stat__label">mock items ready for remote exposure</span>
        </div>
      </section>

      <section className="ui-section ui-stack-md products-section">
        <div className="section-head">
          <div>
            <p className="ui-eyebrow">Catalog preview</p>
            <h2>Mock product list</h2>
          </div>
          <p className="ui-copy section-copy">This is the minimum viable products route for the learning roadmap.</p>
        </div>

        <div className="product-grid">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
import { ProductsCatalog } from '../components/products-catalog';
import { cartItemAddedEventName } from '../lib/cart-event-contract';
import { mockProducts } from '../lib/mock-products';

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
          <p className="ui-copy section-copy">
            Day 15 checkpoint: this remote now prepares <code>{cartItemAddedEventName}</code> payloads from shared contracts instead of repeating ad-hoc string literals.
          </p>
        </div>

        <ProductsCatalog products={mockProducts} />
      </section>
    </main>
  );
}
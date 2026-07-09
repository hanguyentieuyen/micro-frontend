import { ProductsCatalog } from '../components/products-catalog';
import { cartItemAddedEventName } from '../lib/cart-event-contract';
import { mockProducts } from '../lib/mock-products';

export default function ProductsHomePage() {
  return (
    <main className="ui-container products-page">
      <section className="ui-section products-hero">
        <div className="ui-stack-md">
          <p className="ui-eyebrow">Week 3 / Day 16</p>
          <h1>Products now acts as a clean event producer.</h1>
          <p className="ui-copy">
            This remote still owns product discovery only. When a user adds an item, it emits the typed <code>{cartItemAddedEventName}</code> contract and leaves orchestration to the shell.
          </p>
        </div>

        <div className="hero-stat">
          <span className="hero-stat__value">{mockProducts.length}</span>
          <span className="hero-stat__label">typed product cards ready to emit events</span>
        </div>
      </section>

      <section className="ui-section ui-stack-md products-section">
        <div className="section-head">
          <div>
            <p className="ui-eyebrow">Catalog preview</p>
            <h2>Event-driven product list</h2>
          </div>
          <p className="ui-copy section-copy">
            The products domain stays decoupled from cart internals. It only knows the shared contract and lets the host coordinate the next step.
          </p>
        </div>

        <ProductsCatalog products={mockProducts} />
      </section>
    </main>
  );
}
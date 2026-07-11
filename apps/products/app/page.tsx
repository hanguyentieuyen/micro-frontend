import { ProductsCatalog } from '../components/products-catalog';
import { cartItemAddedEventName } from '../lib/cart-event-contract';
import { mockProducts } from '../lib/mock-products';

import styles from './page.module.css';

export default function ProductsHomePage() {
  return (
    <main className={`ui-container ${styles.productsPage}`}>
      <section className={`ui-section ${styles.productsHero}`}>
        <div className="ui-stack-md">
          <p className="ui-eyebrow">Week 3 / Days 20-21</p>
          <h1>Products now acts as a clean event producer with module-scoped domain styling.</h1>
          <p className="ui-copy">
            This remote still owns product discovery only. When a user adds an item, it emits the typed <code>{cartItemAddedEventName}</code> contract and leaves orchestration to the shell.
          </p>
        </div>

        <div className={styles.heroStat}>
          <span className={styles.heroStatValue}>{mockProducts.length}</span>
          <span className={styles.heroStatLabel}>typed product cards ready to emit events</span>
        </div>
      </section>

      <section className={`ui-section ui-stack-md ${styles.productsSection}`}>
        <div className={styles.sectionHead}>
          <div>
            <p className="ui-eyebrow">Catalog preview</p>
            <h2>Event-driven product list</h2>
          </div>
          <p className={`ui-copy ${styles.sectionCopy}`}>
            The products domain stays decoupled from cart internals. It only knows the shared contract and lets the host coordinate the next step.
          </p>
        </div>

        <ProductsCatalog products={mockProducts} />
      </section>
    </main>
  );
}
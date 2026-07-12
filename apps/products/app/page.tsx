import { Badge } from '@commerce/shared-ui';

import { ProductsCatalog } from '../components/products-catalog';
import { mockProducts } from '../lib/mock-products';

const boundaryNotes = [
  {
    title: 'Broken grid, not product wallpaper',
    copy: 'The catalog refuses a uniform card matrix. Some pairs dominate the wall and others sit back like side posters.',
  },
  {
    title: 'Bag-ready handoff',
    copy: 'Every loud card still emits one typed cart event so the shell and bag remote stay synchronized under the styling.',
  },
  {
    title: 'Filters feel physical',
    copy: 'The controls read like labels and switches instead of a quiet toolbar, which keeps the interaction aligned with the overall mood.',
  },
];

export default function ProductsHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_340px]">
        <div className="hf-panel hf-terminal-border p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="hf-kicker">Shop wall</p>
              <h1 className="font-[family:var(--font-display)] text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-6xl">
                HF sneaker grid is loud on purpose.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Explore low-profile pairs, boxed high-tops, and trail-heavy silhouettes inside a
                catalog that behaves more like an experimental poster system than a polite store shelf.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Next.js remote</Badge>
              <Badge variant="outline">non-uniform product cards</Badge>
              <Badge variant="secondary">bag event contract</Badge>
            </div>
          </div>
        </div>

        <div className="hf-panel hf-panel-dark p-6 sm:p-8">
          <div className="space-y-3">
            <p className="hf-kicker bg-accent text-foreground">Pairs live</p>
            <strong className="block font-[family:var(--font-display)] text-7xl font-black uppercase leading-none tracking-[-0.08em] text-white">
              {String(mockProducts.length).padStart(2, '0')}
            </strong>
            <p className="text-sm leading-7 text-white/78">
              aggressive silhouettes currently pinned to the wall with oversized numbers, loud price tags, and odd spacing.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {boundaryNotes.map((note, index) => (
          <div
            key={note.title}
            className={index === 1 ? 'hf-panel bg-accent p-6' : 'hf-panel p-6'}
          >
            <div className="space-y-3">
              <p className="hf-kicker">Catalog note</p>
              <h2 className="font-[family:var(--font-display)] text-2xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-foreground">
                {note.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">{note.copy}</p>
            </div>
          </div>
        ))}
      </section>

      <ProductsCatalog products={mockProducts} />
    </main>
  );
}

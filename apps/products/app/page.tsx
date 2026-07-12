import { Badge, Card, CardHeader, SectionHeading } from '@commerce/shared-ui';

import { ProductsCatalog } from '../components/products-catalog';
import { mockProducts } from '../lib/mock-products';

const boundaryNotes = [
  {
    title: 'Approved inventory',
    copy: 'Products focuses on buyer-facing catalog quality so teams can evaluate technical SKUs without pulling cart concerns into the domain.',
  },
  {
    title: 'Intent handoff',
    copy: 'This remote stops at procurement intent and lets the shell decide how shared cart state should evolve across the broader storefront.',
  },
  {
    title: 'Controlled contract',
    copy: 'The add-to-cart flow still uses one shared contract, so the catalog can stay independent without drifting from the rest of the platform.',
  },
];

export default function ProductsHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_260px]">
        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-6">
            <SectionHeading
              eyebrow="Products domain"
              title="A technical catalog built for deployment-ready purchasing."
              description="Buyers can review approved infrastructure SKUs, compare readiness signals, and emit add-to-cart intent without pulling cart presentation or shell state management into the catalog surface."
            />

            <div className="flex flex-wrap gap-2.5">
              <Badge variant="info">Next.js remote</Badge>
              <Badge variant="subtle">Event-driven procurement intent</Badge>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-foreground/10 bg-foreground text-background shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <CardHeader className="space-y-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-300">
              Seed catalog
            </span>
            <strong className="block text-5xl font-semibold tracking-[-0.08em]">
              {mockProducts.length}
            </strong>
            <p className="text-sm leading-7 text-slate-300">
              launch-ready SKUs seeded across edge infrastructure, sensing, and developer enablement.
            </p>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {boundaryNotes.map((note) => (
          <Card
            key={note.title}
            className="bg-card/90"
          >
            <CardHeader className="space-y-3 p-6">
              <Badge variant="info" className="w-fit uppercase tracking-[0.24em]">
                Catalog guardrail
              </Badge>
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                {note.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">{note.copy}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <ProductsCatalog products={mockProducts} />
    </main>
  );
}


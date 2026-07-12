import { Badge, Card, CardContent, CardHeader, CardTitle, SectionHeading, buttonVariants, cn } from '@commerce/shared-ui';

import Link from 'next/link';

const routeManifest = [
  {
    href: '/products',
    label: 'Catalog domain',
    note: 'Approved SKUs, deployment-ready bundles, and procurement intent start here.',
  },
  {
    href: '/cart',
    label: 'Batch cart',
    note: 'Buyer batches, quantity review, and shell-synced summaries stay isolated here.',
  },
  {
    href: '/profile',
    label: 'Buyer workspace',
    note: 'Account identity, approval posture, and profile-level controls run in a separate remote.',
  },
  {
    href: '/profile/security',
    label: 'Security deep link',
    note: 'The shell can land directly inside a Nuxt-owned route without breaking domain ownership.',
  },
];

const metrics = [
  {
    value: '3',
    label: 'independent domains',
    note: 'Catalog, cart, and buyer workspace release on their own timelines.',
  },
  {
    value: '1',
    label: 'shared buyer shell',
    note: 'Navigation, auth context, and cart replay stay consistent across remotes.',
  },
  {
    value: 'Lazy',
    label: 'runtime loading',
    note: 'Remote surfaces are deferred until the route actually needs them.',
  },
  {
    value: 'Safe',
    label: 'failure fallback',
    note: 'One remote outage should not take down the storefront shell.',
  },
];

const buyerOutcomes = [
  {
    title: 'Approved catalog first',
    copy: 'Technical buyers see deployment-ready products with clear category framing and controlled add-to-cart intent.',
  },
  {
    title: 'Batch purchasing flow',
    copy: 'The cart behaves like a procurement batch, making quantity review and shared shell sync feel deliberate.',
  },
  {
    title: 'Account control center',
    copy: 'Profile keeps buyer identity, policy signals, and security routes separate from the rest of the storefront.',
  },
];

const platformSignals = [
  'Products can emit cart intent without importing cart business code.',
  'The host shell owns the shared cart snapshot and replays it back into the cart remote.',
  'Nuxt profile routes remain independent while still receiving typed auth context from the shell.',
];

const platformProof = [
  'Each domain app still runs on its own local port and can be opened directly.',
  'Route-level composition keeps host navigation stable while remotes evolve independently.',
  'Lazy load and fallback handling make the runtime composition story defendable in a real review.',
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-8">
            <div className="space-y-5">
              <Badge variant="info" className="w-fit uppercase tracking-[0.28em]">
                Buyer shell
              </Badge>
              <div className="space-y-4">
                <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
                  Source deployment-ready hardware without spreadsheet handoffs.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Relay Supply Cloud brings catalog decisions, batch purchasing, and buyer identity
                  into one technical procurement experience while still letting each domain ship on
                  its own cadence.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className={buttonVariants({ variant: 'dark', size: 'lg' })}>
                Browse the catalog
              </Link>
              <Link href="/profile" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Open buyer workspace
              </Link>
            </div>

            <ul className="grid gap-3 text-sm leading-7 text-muted-foreground">
              {platformSignals.map((signal) => (
                <li key={signal} className="flex gap-3 rounded-xl border border-border/70 bg-muted/50 px-4 py-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-accent" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-foreground/10 bg-foreground text-background shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <CardHeader className="space-y-6">
            <SectionHeading
              eyebrow="Operating domains"
              title="Built like a buyer platform, not a stitched demo."
              description="Each surface feels like part of one product, but still keeps its own runtime, release path, and business boundary."
              titleClassName="text-2xl text-background"
              descriptionClassName="text-sm leading-7 text-slate-300"
            />

            <div className="space-y-3">
              {routeManifest.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/10"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-base font-medium tracking-[-0.02em]">{item.label}</span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-slate-300">
                        {item.href}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">{item.note}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-card/90">
            <CardContent className="space-y-2 p-5">
              <strong className="block text-3xl font-semibold tracking-[-0.05em] text-foreground">
                {metric.value}
              </strong>
              <span className="block text-sm font-medium text-foreground">{metric.label}</span>
              <p className="text-sm leading-6 text-muted-foreground">{metric.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {buyerOutcomes.map((item) => (
          <Card key={item.title} className="bg-card/90">
            <CardHeader className="space-y-3 p-6">
              <Badge variant="info" className="w-fit uppercase tracking-[0.24em]">
                Product layer
              </Badge>
              <CardTitle className="text-xl">{item.title}</CardTitle>
              <p className="text-sm leading-7 text-muted-foreground">{item.copy}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] bg-card/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-5">
            <SectionHeading
              eyebrow="Why it scales"
              title="Domain ownership stays visible in the product experience."
              description="The storefront feels unified to buyers, but the underlying teams can still ship catalog, batch purchasing, and profile capabilities independently."
              titleClassName="text-2xl"
            />

            <ul className="grid gap-3 text-sm leading-7 text-muted-foreground">
              {platformProof.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border border-border/70 bg-muted/60 px-4 py-3">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardHeader>
        </Card>

        <Card className="rounded-[2rem] border-foreground/10 bg-foreground text-background shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
          <CardHeader className="space-y-5">
            <SectionHeading
              eyebrow="Runtime proof"
              title="The architecture still shows up when someone reviews the codebase."
              description="This project is now closer to a real ecommerce foundation while still preserving the micro frontend signals that matter for interviews and production discussions."
              titleClassName="text-2xl text-background"
              descriptionClassName="text-sm leading-7 text-slate-300"
            />

            <div className="grid gap-3">
              {['npm run test', 'npm run check:boundaries', 'npm run validate'].map((command) => (
                <div
                  key={command}
                  className={cn(
                    'rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-slate-200',
                  )}
                >
                  {command}
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}


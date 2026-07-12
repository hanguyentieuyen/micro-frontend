'use client';

import { buttonVariants, cn } from '@commerce/shared-ui';
import Link from 'next/link';

const routeNodes = [
  {
    href: '/products',
    code: 'SHOP',
    label: 'All drops',
    note: 'Jump into the broken grid of loud HF sneaker releases.',
    tone: 'bg-accent',
  },
  {
    href: '/cart',
    code: 'BAG',
    label: 'Bag board',
    note: 'See live bag sync, loud totals, and checkout pressure in one place.',
    tone: 'bg-secondary text-secondary-foreground',
  },
  {
    href: '/profile',
    code: 'ID',
    label: 'Profile riot',
    note: 'Sizes, addresses, and drop alerts stay inside one equally loud remote.',
    tone: 'bg-card',
  },
];

const teaserDrops = [
  {
    number: '01',
    title: 'Rift Runner',
    note: 'light sole, loud upper, built for fast city friction',
    price: '$220',
    href: '/products',
    className: 'md:col-span-4 md:row-span-3 bg-primary text-primary-foreground',
    stageTone: 'bg-card',
  },
  {
    number: '02',
    title: 'Bricklane High',
    note: 'boxed ankle, hard paneling, blunt street energy',
    price: '$265',
    href: '/products',
    className: 'md:col-span-2 md:row-span-2 bg-accent text-foreground md:-mt-4',
    stageTone: 'bg-card',
  },
  {
    number: '03',
    title: 'Noise Trail',
    note: 'jagged tread and trail geometry for loud daily wear',
    price: '$248',
    href: '/products',
    className: 'md:col-span-2 md:row-span-3 bg-card text-foreground md:mt-5',
    stageTone: 'bg-secondary text-secondary-foreground',
  },
  {
    number: '04',
    title: 'Gridshock 90',
    note: 'compact, bright, and deliberately hard-edged',
    price: '$195',
    href: '/products',
    className: 'md:col-span-4 md:row-span-2 bg-secondary text-secondary-foreground',
    stageTone: 'bg-accent',
  },
];

const tickerItems = [
  'DROP 07 // FIRST 40 PAIRS INCLUDE LACE PACK',
  'BAG STATE IS LIVE ACROSS SHELL + CART REMOTE',
  'SIZES 37-45 // LIMIT 1 PER COLORWAY',
  'NO SOFT GRIDS // NO QUIET PRODUCT CARDS',
];

const categoryBlocks = [
  { label: 'LOW', copy: 'fast city pairs with graphic soles' },
  { label: 'HIGH', copy: 'boxed uppers for sharper silhouettes' },
  { label: 'TRAIL', copy: 'loud tread built for concrete + dust' },
  { label: 'CORE', copy: 'easier pairs that still punch hard' },
];

const manifesto = [
  {
    title: 'Broken grid by design',
    copy: 'Some products take over the wall. Others stay small and aggressive. The layout behaves more like a poster collage than a standard store.',
  },
  {
    title: 'Every block earns attention',
    copy: 'Buttons act like stamps, labels tilt on purpose, and the grid lines stay visible so the page never slips into polished template mode.',
  },
  {
    title: 'Still functional under the noise',
    copy: 'Navigation, bag state, route ownership, and remote boundaries remain clear even while the styling gets rowdy.',
  },
];

const systemStats = [
  { label: 'pairs live', value: '04' },
  { label: 'heat level', value: 'LOUD' },
  { label: 'bag sync', value: 'ON' },
];

function updatePointerPosition(event: React.PointerEvent<HTMLElement>) {
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
}

export function HfTerminalHome() {
  const marquee = [...tickerItems, ...tickerItems];

  return (
    <div className="space-y-6">
      <section className="grid min-h-[calc(100dvh-9rem)] gap-6 xl:grid-cols-[minmax(0,1.08fr)_360px]">
        <div
          className="hf-panel hf-cursor-panel hf-terminal-border flex min-h-[620px] flex-col justify-between px-6 py-7 sm:px-8 sm:py-8"
          onPointerMove={updatePointerPosition}
        >
          <div className="space-y-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="hf-kicker">Drop poster 07</p>
                <span className="hf-stamp -rotate-3 bg-card text-foreground">SNKR SYSTEM / HF</span>
              </div>
              <span className="hf-stamp rotate-3 bg-accent text-foreground">NO POLITE LAYOUTS</span>
            </div>

            <div className="relative max-w-5xl space-y-5">
              <span className="absolute -left-1 top-0 hidden -rotate-6 border-[3px] border-foreground bg-secondary px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-secondary-foreground shadow-[4px_4px_0_hsl(var(--foreground))] sm:inline-flex">
                experimental store
              </span>
              <h1 className="hf-display max-w-5xl pt-8 text-[3.7rem] text-foreground sm:text-[5.2rem] xl:text-[7rem]">
                HF sells sneakers like a ripped poster wall that suddenly learned checkout.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Loud pairs. Hard shadows. Awkward spacing. Flat colors. Broken grids. Everything
                here is built to feel direct, rebellious, and still usable when the drop gets busy.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/products" className={buttonVariants({ variant: 'default', size: 'lg' })}>
                Shop the drop
              </Link>
              <Link href="/cart" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
                Open bag board
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {systemStats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'border-[4px] border-foreground px-4 py-4 shadow-[6px_6px_0_hsl(var(--foreground))]',
                  index === 0 ? 'bg-card' : index === 1 ? 'bg-accent' : 'bg-secondary text-secondary-foreground',
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em]">{stat.label}</p>
                <strong className="mt-3 block font-[family:var(--font-display)] text-4xl font-black uppercase leading-none tracking-[-0.06em]">
                  {stat.value}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid gap-6">
          <div className="hf-panel hf-panel-dark hf-terminal-border p-6 sm:p-7">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="hf-kicker bg-accent text-foreground">Featured pair</p>
                <h2 className="font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
                  Bricklane High hits like a flyer stapled to wet concrete.
                </h2>
                <p className="text-sm leading-7 text-white/78">
                  Thick collar. Direct color blocking. No soft edges. This is the pair that sets the
                  tone for the rest of the storefront.
                </p>
              </div>

              <div className="hf-sneaker-stage h-[250px] bg-card">
                <div className="absolute left-4 top-4 border-[3px] border-foreground bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
                  high-top drop
                </div>
                <div className="absolute bottom-4 left-4 font-[family:var(--font-display)] text-6xl font-black uppercase leading-none tracking-[-0.08em] text-foreground">
                  02
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {routeNodes.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn('hf-panel hf-shift p-4 hover:-translate-x-1 hover:-translate-y-1', index % 2 === 0 ? '-rotate-[1deg]' : 'rotate-[1deg]')}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <span className={cn('hf-stamp', item.tone)}>{item.code}</span>
                    <h3 className="font-[family:var(--font-display)] text-2xl font-black uppercase leading-[0.9] tracking-[-0.05em] text-foreground">
                      {item.label}
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    go
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.note}</p>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="hf-marquee">
        <div className="hf-marquee-track gap-8 px-5 py-3 font-[family:var(--font-display)] text-lg font-black uppercase tracking-[0.08em] sm:text-xl">
          {marquee.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-8">
              <span>{item}</span>
              <span className="text-accent">///</span>
            </span>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_360px]">
        <div className="grid gap-4 md:grid-cols-6 md:auto-rows-[118px]">
          {teaserDrops.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn('hf-panel hf-shift group p-5 hover:-translate-x-1 hover:-translate-y-1', item.className)}
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('hf-price-burst px-3 py-2 font-[family:var(--font-display)] text-sm font-black uppercase tracking-[0.08em]', item.stageTone)}>
                    {item.price}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">HF-{item.number}</span>
                </div>

                <div className="space-y-3">
                  <div className="hf-number text-[4rem] opacity-18 sm:text-[5rem]">{item.number}</div>
                  <div className="space-y-2">
                    <h2 className="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.92] tracking-[-0.05em]">
                      {item.title}
                    </h2>
                    <p className="max-w-[26rem] text-sm leading-6 opacity-80">{item.note}</p>
                  </div>
                </div>

                <div className="hf-sneaker-stage h-[120px] bg-card">
                  <div className="absolute left-4 top-4 border-[3px] border-foreground bg-primary px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground shadow-[4px_4px_0_hsl(var(--foreground))] transition duration-150 group-hover:-translate-y-1">
                    see specs
                  </div>
                  <div className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/75 opacity-0 transition duration-150 group-hover:opacity-100">
                    hover shift engaged
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6">
          <div className="hf-panel hf-terminal-border p-6">
            <div className="space-y-4">
              <p className="hf-kicker">Category wall</p>
              <div className="grid gap-3">
                {categoryBlocks.map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      'border-[4px] border-foreground px-4 py-4 shadow-[6px_6px_0_hsl(var(--foreground))]',
                      index % 2 === 0 ? 'bg-accent' : 'bg-card',
                    )}
                  >
                    <strong className="font-[family:var(--font-display)] text-2xl font-black uppercase tracking-[-0.04em] text-foreground">
                      {item.label}
                    </strong>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hf-panel p-6">
            <div className="space-y-4">
              <p className="hf-kicker">Why it works</p>
              <ul className="grid gap-3">
                {manifesto.map((item, index) => (
                  <li
                    key={item.title}
                    className={cn(
                      'border-[4px] border-foreground px-4 py-4 shadow-[6px_6px_0_hsl(var(--foreground))]',
                      index === 1 ? 'bg-secondary text-secondary-foreground' : 'bg-card',
                    )}
                  >
                    <h3 className="font-[family:var(--font-display)] text-2xl font-black uppercase leading-[0.92] tracking-[-0.05em]">
                      {item.title}
                    </h3>
                    <p className={cn('mt-2 text-sm leading-6', index === 1 ? 'text-white/80' : 'text-muted-foreground')}>
                      {item.copy}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

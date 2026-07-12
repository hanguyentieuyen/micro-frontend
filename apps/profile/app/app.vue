<template>
  <div class="mx-auto flex min-h-[100dvh] w-full max-w-[1540px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header class="hf-panel hf-terminal-border p-6 sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-4">
          <p class="hf-kicker">
            Profile remote
          </p>
          <div class="space-y-3">
            <h1 class="font-[family:var(--font-display)] text-5xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-6xl">
              Size profile, address book, and drop alerts live in the same loud system.
            </h1>
            <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              This remote owns account-facing sneaker flows while the host shell only hands off typed
              user context and keeps runtime composition outside the buying journey.
            </p>
          </div>
        </div>

        <nav class="flex flex-wrap gap-3" aria-label="Profile navigation">
          <NuxtLink
            to="/"
            class="inline-flex min-h-11 items-center justify-center border-[3px] border-foreground bg-card px-4 py-2 font-black uppercase tracking-[0.16em] text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] transition duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]"
            active-class="!bg-primary !text-primary-foreground"
            exact-active-class="!bg-primary !text-primary-foreground"
          >
            Overview
          </NuxtLink>
          <NuxtLink
            to="/security"
            class="inline-flex min-h-11 items-center justify-center border-[3px] border-foreground bg-accent px-4 py-2 font-black uppercase tracking-[0.16em] text-foreground shadow-[6px_6px_0_hsl(var(--foreground))] transition duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[9px_9px_0_hsl(var(--foreground))]"
            active-class="!bg-secondary !text-secondary-foreground"
            exact-active-class="!bg-secondary !text-secondary-foreground"
          >
            Security
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

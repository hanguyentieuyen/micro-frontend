<template>
  <div class="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col gap-6 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(59,130,246,0.08),transparent_24%),linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
    <header class="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div class="space-y-3">
          <p class="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
            Profile domain
          </p>
          <div class="space-y-3">
            <h1 class="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl">
              Buyer identity stays independent while the shell shares the runtime context.
            </h1>
            <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Profile owns account-facing journeys, approval posture, and security routes, while the
              host shell only hands off typed user context at runtime.
            </p>
          </div>
        </div>

        <nav class="flex flex-wrap gap-2" aria-label="Profile navigation">
          <NuxtLink
            to="/"
            class="inline-flex items-center rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-secondary"
            active-class="!bg-primary !text-primary-foreground !border-primary"
            exact-active-class="!bg-primary !text-primary-foreground !border-primary"
          >
            Overview
          </NuxtLink>
          <NuxtLink
            to="/security"
            class="inline-flex items-center rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-secondary"
            active-class="!bg-primary !text-primary-foreground !border-primary"
            exact-active-class="!bg-primary !text-primary-foreground !border-primary"
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


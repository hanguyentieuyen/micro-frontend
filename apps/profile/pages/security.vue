<script setup lang="ts">
const checks = [
  'MFA required before limited-drop checkout',
  'Saved address locks before raffle confirmation',
  'Purchase audit stays visible for every reserved pair',
]
</script>

<template>
  <section class="hf-panel hf-terminal-border p-6 sm:p-8">
    <div class="space-y-6">
      <div class="space-y-3">
        <p class="hf-kicker">
          Security route
        </p>
        <h2 class="font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground sm:text-5xl">
          Security stays loud without leaving the profile boundary.
        </h2>
        <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          This route proves the shell can deep link into a Nuxt-owned security scene while the remote
          keeps full control of account protection and sneaker purchase safeguards.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="item in checks"
          :key="item"
          class="border-[4px] border-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground))]"
        >
          <strong class="inline-flex border-[3px] border-foreground bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
            locked
          </strong>
          <span class="mt-3 block text-base leading-7 text-foreground">{{ item }}</span>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const checks = [
  'SAML SSO enforced for buyer admins',
  'MFA required before approval changes',
  'Session and device audit visible to the account owner',
]
</script>

<template>
  <section class="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
    <div class="space-y-6">
      <div class="space-y-3">
        <p class="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
          Security route
        </p>
        <h2 class="text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
          Security stays inside the buyer workspace boundary.
        </h2>
        <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          This screen proves the shell can deep link into a second Nuxt-owned route without taking
          responsibility away from the remote that owns the account journey.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="item in checks"
          :key="item"
          class="rounded-xl border border-border/70 bg-card p-5 shadow-sm"
        >
          <strong class="block text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
            Ready
          </strong>
          <span class="mt-3 block text-base leading-7 text-foreground">{{ item }}</span>
        </article>
      </div>
    </div>
  </section>
</template>


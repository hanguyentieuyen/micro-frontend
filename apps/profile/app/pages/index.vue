<script setup lang="ts">
import {
  MICRO_APP_EVENTS,
  isMicroAppEventEnvelope,
  type MicroAppEventMap,
  type User,
} from '@commerce/shared-types'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const user: User = {
  id: 'u-hf-drop-09',
  name: 'Mina Corvin',
  email: 'mina@hf-run.club',
  role: 'admin',
}

const roleLabel = user.role === 'admin' ? 'Drop captain' : 'HF member'

const accountStats = [
  { label: 'Saved size', value: 'US 9.5' },
  { label: 'Live raffles', value: '02' },
  { label: 'Pairs in bag', value: '03' },
]

const activity = [
  { label: 'HF Rift Runner 01', value: 'Bag reserved before launch close' },
  { label: 'HF Bricklane High', value: 'Back-in-stock alert enabled' },
  { label: 'HF Noise Trail', value: 'Shipping address confirmed' },
]

const boundaryNotes = [
  { label: 'Host handoff', value: 'typed user context only' },
  { label: 'Framework boundary', value: 'Nuxt remote inside Next shell' },
  { label: 'Deep link', value: '/profile/security stays local' },
]

const authUserChangedEventName = MICRO_APP_EVENTS['auth:user-changed']

const expectedAuthPayload: MicroAppEventMap[typeof authUserChangedEventName] = {
  userId: user.id,
}

const receivedAuthUserId = ref<string | null>(null)

function handleMessage(event: MessageEvent) {
  if (typeof window !== 'undefined' && event.source !== window.parent) {
    return
  }

  if (!isMicroAppEventEnvelope(event.data)) {
    return
  }

  if (event.data.eventName !== authUserChangedEventName) {
    return
  }

  const authPayload = event.data.payload as MicroAppEventMap[typeof authUserChangedEventName]
  receivedAuthUserId.value = authPayload.userId
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
    <section class="hf-panel hf-terminal-border p-6 sm:p-8">
      <div class="space-y-6">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div class="flex h-20 w-20 items-center justify-center border-[4px] border-foreground bg-primary font-[family:var(--font-display)] text-xl font-black uppercase tracking-[-0.06em] text-primary-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
            HF
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <h2 class="font-[family:var(--font-display)] text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground">
                {{ user.name }}
              </h2>
              <p class="max-w-2xl text-sm leading-7 text-muted-foreground">
                Profile keeps size preferences, alerts, addresses, and account-facing sneaker flows
                inside one remote while the shell only shares runtime identity context.
              </p>
            </div>

            <div class="flex flex-wrap gap-3">
              <span class="border-[3px] border-foreground bg-accent px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
                {{ roleLabel }}
              </span>
              <span class="border-[3px] border-foreground bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
                typed auth handoff
              </span>
            </div>
          </div>
        </div>

        <ul class="grid gap-3">
          <li class="border-[4px] border-foreground bg-card px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]">
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span class="text-sm text-muted-foreground">Email</span>
              <strong class="text-sm font-semibold text-foreground">{{ user.email }}</strong>
            </div>
          </li>
          <li
            v-for="item in accountStats"
            :key="item.label"
            class="border-[4px] border-foreground bg-card px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]"
          >
            <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span class="text-sm text-muted-foreground">{{ item.label }}</span>
              <strong class="text-sm font-semibold text-foreground">{{ item.value }}</strong>
            </div>
          </li>
        </ul>

        <div class="grid gap-4 md:grid-cols-3">
          <article class="border-[4px] border-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Expected event</span>
            <strong class="mt-2 block text-base uppercase tracking-[0.14em] text-foreground">
              {{ authUserChangedEventName }}
            </strong>
          </article>
          <article class="border-[4px] border-foreground bg-accent p-5 shadow-[6px_6px_0_hsl(var(--foreground))]">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70">Expected userId</span>
            <strong class="mt-2 block text-base uppercase tracking-[0.14em] text-foreground">
              {{ expectedAuthPayload.userId }}
            </strong>
          </article>
          <article class="border-[4px] border-foreground bg-secondary p-5 text-secondary-foreground shadow-[6px_6px_0_hsl(var(--foreground))]">
            <span class="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">Latest shell sync</span>
            <strong class="mt-2 block text-base uppercase tracking-[0.14em]">
              {{ receivedAuthUserId ?? 'Waiting for shell auth context' }}
            </strong>
          </article>
        </div>
      </div>
    </section>

    <aside class="grid gap-6">
      <section class="hf-panel p-6 sm:p-8">
        <div class="space-y-5">
          <div class="space-y-3">
            <p class="hf-kicker">
              Activity feed
            </p>
            <h2 class="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-foreground">
              Recent drop activity
            </h2>
            <p class="text-sm leading-7 text-muted-foreground">
              Purchase-adjacent signals stay inside the profile boundary even when the shell owns the runtime composition.
            </p>
          </div>
          <ul class="grid gap-3">
            <li
              v-for="item in activity"
              :key="item.label"
              class="border-[4px] border-foreground bg-card px-4 py-3 shadow-[6px_6px_0_hsl(var(--foreground))]"
            >
              <div class="flex flex-col gap-1">
                <span class="text-sm text-muted-foreground">{{ item.label }}</span>
                <strong class="text-sm font-semibold text-foreground">{{ item.value }}</strong>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section class="hf-panel hf-panel-dark p-6 text-background sm:p-8">
        <div class="space-y-5">
          <div class="space-y-3">
            <p class="hf-kicker bg-accent text-foreground">
              Boundary notes
            </p>
            <h2 class="font-[family:var(--font-display)] text-3xl font-black uppercase leading-[0.9] tracking-[-0.06em] text-white">
              A second framework still belongs to the same storefront.
            </h2>
            <p class="text-sm leading-7 text-white/80">
              This remote proves the sneaker store can compose another frontend stack without breaking the host contract.
            </p>
          </div>
          <ul class="grid gap-3">
            <li
              v-for="item in boundaryNotes"
              :key="item.label"
              class="border-[4px] border-white bg-black/10 px-4 py-3 shadow-[6px_6px_0_hsl(var(--accent))]"
            >
              <div class="flex flex-col gap-1">
                <span class="text-sm text-white/70">{{ item.label }}</span>
                <strong class="text-sm font-semibold text-white">{{ item.value }}</strong>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </aside>
  </div>
</template>

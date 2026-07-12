<script setup lang="ts">
import {
  MICRO_APP_EVENTS,
  isMicroAppEventEnvelope,
  type MicroAppEventMap,
  type User,
} from '@commerce/shared-types'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const user: User = {
  id: 'u-buyer-01',
  name: 'Avery Nguyen',
  email: 'avery@northgrid.io',
  role: 'admin',
}

const roleLabel = user.role === 'admin' ? 'Procurement admin' : 'Buying team'

const accountStats = [
  { label: 'Approval chain', value: 'Finance + operations' },
  { label: 'Saved ship-to sites', value: '4' },
  { label: 'Open quote requests', value: '2' },
]

const activity = [
  { label: 'Batch RG-2041', value: 'Awaiting manager approval' },
  { label: 'Vendor compliance', value: 'NorthGrid certified' },
  { label: 'Saved project', value: 'Edge rollout phase 2' },
]

const boundaryNotes = [
  { label: 'Host handoff', value: 'typed auth context only' },
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
    <section class="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
      <div class="space-y-6">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div class="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm">
            AN
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <h2 class="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                {{ user.name }}
              </h2>
              <p class="max-w-2xl text-sm leading-7 text-muted-foreground">
                Profile keeps buyer identity and account-facing UX in one place while the shell only
                shares the runtime context needed to personalize the remote.
              </p>
            </div>

            <div class="flex flex-wrap gap-2.5">
              <span class="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-700">
                {{ roleLabel }}
              </span>
              <span class="inline-flex items-center rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                typed auth handoff
              </span>
            </div>
          </div>
        </div>

        <ul class="grid gap-3">
          <li class="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span class="text-sm text-muted-foreground">Email</span>
            <strong class="text-sm font-semibold text-foreground">{{ user.email }}</strong>
          </li>
          <li
            v-for="item in accountStats"
            :key="item.label"
            class="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <span class="text-sm text-muted-foreground">{{ item.label }}</span>
            <strong class="text-sm font-semibold text-foreground">{{ item.value }}</strong>
          </li>
        </ul>

        <div class="grid gap-4 md:grid-cols-3">
          <article class="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <span class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Expected event</span>
            <strong class="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
              {{ authUserChangedEventName }}
            </strong>
          </article>
          <article class="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <span class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Expected userId</span>
            <strong class="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
              {{ expectedAuthPayload.userId }}
            </strong>
          </article>
          <article class="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
            <span class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Latest shell sync</span>
            <strong class="mt-2 block text-base font-semibold tracking-[-0.02em] text-foreground">
              {{ receivedAuthUserId ?? 'Waiting for shell auth context' }}
            </strong>
          </article>
        </div>
      </div>
    </section>

    <aside class="grid gap-6">
      <section class="rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
        <div class="space-y-5">
          <div class="space-y-3">
            <p class="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-600">
              Account snapshot
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              Recent buyer activity
            </h2>
            <p class="text-sm leading-7 text-muted-foreground">
              Operational signals stay within the profile boundary even when the shell is the runtime host.
            </p>
          </div>
          <ul class="grid gap-3">
            <li
              v-for="item in activity"
              :key="item.label"
              class="flex flex-col gap-1 rounded-xl border border-border/70 bg-muted/60 px-4 py-3"
            >
              <span class="text-sm text-muted-foreground">{{ item.label }}</span>
              <strong class="text-sm font-semibold text-foreground">{{ item.value }}</strong>
            </li>
          </ul>
        </div>
      </section>

      <section class="rounded-[2rem] border border-foreground/10 bg-foreground p-6 text-background shadow-[0_28px_90px_rgba(15,23,42,0.18)] sm:p-8">
        <div class="space-y-5">
          <div class="space-y-3">
            <p class="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-300">
              Boundary notes
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.04em]">
              A second framework still fits the same buyer platform.
            </h2>
            <p class="text-sm leading-7 text-slate-300">
              This remote proves the storefront can compose another frontend stack without bypassing host contracts.
            </p>
          </div>
          <ul class="grid gap-3">
            <li
              v-for="item in boundaryNotes"
              :key="item.label"
              class="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span class="text-sm text-slate-400">{{ item.label }}</span>
              <strong class="text-sm font-semibold text-white">{{ item.value }}</strong>
            </li>
          </ul>
        </div>
      </section>
    </aside>
  </div>
</template>


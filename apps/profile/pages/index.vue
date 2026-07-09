<script setup lang="ts">
import {
  MICRO_APP_EVENTS,
  isMicroAppEventEnvelope,
  type MicroAppEventMap,
  type User,
} from '@commerce/shared-types'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const user: User = {
  id: 'u-01',
  name: 'Mina Carter',
  email: 'mina@commerce-portal.dev',
  role: 'customer',
}

const accountStats = [
  { label: 'Saved addresses', value: '3' },
  { label: 'Active memberships', value: '1' },
  { label: 'Last sign-in', value: '2 hours ago' },
]

const activity = [
  { label: 'Order CP-2213', value: 'Packed and ready' },
  { label: 'Wishlist update', value: '2 new items saved' },
  { label: 'Preference sync', value: 'Marketing email enabled' },
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

  receivedAuthUserId.value = event.data.payload.userId
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="profile-grid">
    <section class="ui-section ui-stack-lg">
      <div class="user-card">
        <div class="avatar">MC</div>
        <div class="ui-stack-md">
          <div>
            <p class="ui-eyebrow">Profile overview</p>
            <h2>{{ user.name }}</h2>
          </div>
          <p class="ui-copy">
            This Nuxt domain keeps account-facing experiences separate from the shell, products,
            and cart domains.
          </p>
        </div>
      </div>

      <ul class="key-value-list">
        <li>
          <span>Email</span>
          <strong>{{ user.email }}</strong>
        </li>
        <li>
          <span>Role</span>
          <strong>{{ user.role }}</strong>
        </li>
        <li v-for="item in accountStats" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </li>
      </ul>

      <div class="ui-card ui-stack-sm">
        <p class="ui-eyebrow">Day 16 / Host auth event</p>
        <h3>Profile is ready for a typed shell handoff.</h3>
        <p class="ui-copy">
          Expected event: <code>{{ authUserChangedEventName }}</code>
        </p>
        <p class="ui-copy">Expected userId shape: {{ expectedAuthPayload.userId }}</p>
        <p class="ui-copy">
          Latest shell sync: <strong>{{ receivedAuthUserId ?? 'Waiting for shell auth context' }}</strong>
        </p>
      </div>
    </section>

    <aside class="ui-section ui-stack-md">
      <div>
        <p class="ui-eyebrow">Recent activity</p>
        <h2>Account snapshot</h2>
      </div>
      <ul class="activity-list">
        <li v-for="item in activity" :key="item.label">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </li>
      </ul>
    </aside>
  </div>
</template>
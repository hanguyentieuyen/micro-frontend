<script setup lang="ts">
const checks = [
  'Password rotation scheduled every 90 days',
  'Multi-factor authentication enabled',
  'Device history visible to the user',
]
</script>

<template>
  <section class="ui-section ui-stack-lg">
    <div class="ui-stack-md">
      <p class="ui-eyebrow">Security route</p>
      <h2>Security preferences placeholder</h2>
      <p class="ui-copy">
        This route proves the profile app owns more than a single screen and can evolve independently.
      </p>
    </div>

    <ul class="activity-list">
      <li v-for="item in checks" :key="item">
        <span>{{ item }}</span>
        <strong>Ready</strong>
      </li>
    </ul>
  </section>
</template>
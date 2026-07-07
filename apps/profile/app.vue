<template>
  <div class="ui-container profile-app-shell">
    <header class="profile-header">
      <div>
        <p class="ui-eyebrow">Day 12 / Profile Domain</p>
        <h1>Profile app keeps account experiences separate.</h1>
      </div>
      <nav class="profile-nav" aria-label="Profile navigation">
        <NuxtLink to="/">Overview</NuxtLink>
        <NuxtLink to="/security">Security</NuxtLink>
      </nav>
    </header>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>
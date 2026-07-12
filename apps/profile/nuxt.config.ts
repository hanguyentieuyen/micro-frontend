import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-07-05',
  devtools: { enabled: false },
  telemetry: false,
  css: ['@commerce/shared-ui/styles.css'],
  vite: {
    plugins: [tailwindcss()],
  },
});

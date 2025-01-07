// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-11-27",
  srcDir: ".",
  dir: {
    app: "app"
  },
  css: [
    "@/assets/tailwind.scss",
  ],
  hub: {
    database: true,
    blob: true,
  },
  nitro: {
    experimental: {
      tasks: true
    },
    preset: "cloudflare-module"
  },
  modules: [
    "@nuxtjs/turnstile",
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-csurf",
    "nuxt-auth-utils",
    "@vesp/nuxt-fontawesome"
  ]
})
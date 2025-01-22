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
  build: {
    transpile: ["@pinia/nuxt", "Dayjs"]
  },
  hub: {
    database: true,
    blob: true,
  },
  runtimeConfig: {
    chzzk: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      apiCallUri: process.env.API_CALLURI
    }
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
  ],
  fontawesome: {
    icons: {
      solid: ['table', 'ranking-star', 'angle-down', 'check' ]
    }
  }
})
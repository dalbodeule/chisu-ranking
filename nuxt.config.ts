// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-05-17",
  srcDir: ".",
  dir: {
    app: "app",
  },
  css: ["@/assets/tailwind.scss"],
  build: {
    transpile: ["@pinia/nuxt", "Dayjs"],
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
      apiCallUri: process.env.API_CALLURI,
    },
    blob: {
      uri: process.env.BLOB_URI
    }
  },
  nitro: {
    preset: "cloudflare_module",
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  modules: [
    "@nuxtjs/turnstile",
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "@vesp/nuxt-fontawesome",
    "@nuxt/image",
    "nuxt-lodash"
  ],
  fontawesome: {
    icons: {
      solid: ["table", "ranking-star", "angle-down", "check"],
    },
  },
});

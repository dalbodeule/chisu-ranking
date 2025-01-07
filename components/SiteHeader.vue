<script setup lang="ts">
import type { Ref } from "vue";

const show: Ref<boolean> = ref(false)
const _user = useUserSession()

const config = useRuntimeConfig()

const menus: { text: string, to: string, blank: boolean }[] = [
    { text: '소개', to: "/intro" , blank: false },
    { text: '서비스', to: "/service" , blank: false },
]
</script>

<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- 왼쪽 요소 -->
      <div class="text-lg font-bold">
        치수 랭킹
      </div>

      <!-- 모바일 뷰 햄버거 버튼 -->
      <div class="block md:hidden">
        <button id="hamburger" class="focus:outline-none" type="button" @click="show = !show">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
        </button>
      </div>

      <!-- 오른쪽 요소 -->
      <div class="hidden md:flex space-x-4">
        <template v-for="(menu, idx) in menus" :key="`navpc-${idx}`">
          <NuxtLink v-if="!menu.blank" :to="menu.to" class="text-gray-700 hover:text-blue-500">{{ menu.text }}</NuxtLink>
          <a v-else :href="menu.to" class="text-sm font-bold text-gray-500 dark:text-gray-400" target="_blank">{{ menu.text }}</a>
        </template>
      </div>
    </div>

    <!-- 모바일 메뉴 -->
    <div v-if="show" class="md:hidden bg-white overflow-hidden" style="max-height: 600px;">
      <div class="flex flex-col space-y-2 py-4 px-4">
        <template v-for="(menu, idx) in menus" :key="`navmov-${idx}`">
          <NuxtLink v-if="!menu.blank" :to="menu.to" class="text-gray-700 hover:text-blue-500">{{ menu.text }}</NuxtLink>
          <a v-else :href="menu.to" class="text-sm font-bold text-gray-500 dark:text-gray-400" target="_blank">{{ menu.text }}</a>
        </template>
      </div>
    </div>
  </nav>
</template>

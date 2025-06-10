<script setup lang="ts">
import type { Ref } from "vue";
import { getUser } from "assets/tools";

const show: Ref<boolean> = ref(false);
const { loggedIn } = useUserSession();
const logged = getUser();
</script>

<template>
  <nav class="bg-white shadow">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <!-- 왼쪽 요소 -->
      <NuxtLink to="/" class="text-lg font-bold"> 치수 랭킹 </NuxtLink>

      <!-- 모바일 뷰 햄버거 버튼 -->
      <div class="block md:hidden">
        <button
          id="hamburger"
          class="focus:outline-none"
          type="button"
          @click="show = !show"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      <!-- 오른쪽 요소 -->
      <div v-if="!loggedIn" class="hidden md:flex space-x-4 items-center">
        <!-- <NuxtLink to="/intro" class="text-gray-700 hover:text-blue-500">소개</NuxtLink>
        <NuxtLink to="/service" class="text-gray-700 hover:text-blue-500">서비스</NuxtLink> -->
        <NuxtLink
          to="/login"
          class="text-gray-700 hover:text-blue-500 flex flex-row gap-[10px]"
        >
          <NuxtImg src="/chzzk.png" class="w-[24px] h-[24px] rounded-md" alt="chzzk" />
          로그인
        </NuxtLink>
      </div>
      <div v-else class="hidden md:flex space-x-4 items-center">
        <!-- <NuxtLink to="/intro" class="text-gray-700 hover:text-blue-500">소개</NuxtLink>
        <NuxtLink to="/service" class="text-gray-700 hover:text-blue-500">서비스</NuxtLink> -->
        <NuxtLink to="/logout" class="text-gray-700 hover:text-blue-500"
          >로그아웃</NuxtLink
        >
        <div class="text-gray-700 flex flex-row gap-[20px] items-center">
          <NuxtLink v-if="logged?.channelId"
            :to="`/${logged?.channelId}`"
            class="text-gray-700 hover:text-blue-500"
            >{{ logged?.channelName }}</NuxtLink
          >
          <NuxtImg v-if="!!logged?.channelImageUrl"
             :src="logged.channelImageUrl"
             alt="User Profile Image"
             class="w-[36px] h-[36px] rounded-full border-2 border-gray-300"
          />
          <NuxtImg v-else
             src="/undefined.png"
             alt="User Profile Image"
             class="w-[36px] h-[36px] rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- 모바일 메뉴 -->
    <div v-if="show" class="md:hidden bg-white overflow-hidden" style="max-height: 600px">
      <!-- 오른쪽 요소 -->
      <div v-if="!loggedIn" class="flex flex-col space-y-2 py-4 px-4">
        <!-- <NuxtLink to="/intro" class="text-gray-700 hover:text-blue-500">소개</NuxtLink>
        <NuxtLink to="/service" class="text-gray-700 hover:text-blue-500">서비스</NuxtLink> -->
        <NuxtLink
          to="/login"
          class="text-gray-700 hover:text-blue-500 flex flex-row gap-[10px]"
        >
          <NuxtImg src="/chzzk.png" class="w-[24px] h-[24px] rounded-md" alt="chzzk" />
          로그인
        </NuxtLink>
      </div>
      <div v-else class="flex flex-col space-y-2 py-4 px-4">
        <!-- <NuxtLink to="/intro" class="text-gray-700 hover:text-blue-500">소개</NuxtLink>
        <NuxtLink to="/service" class="text-gray-700 hover:text-blue-500">서비스</NuxtLink> -->
        <NuxtLink to="/logout" class="text-gray-700 hover:text-blue-500"
          >로그아웃</NuxtLink
        >
        <div class="text-gray-700 flex flex-row gap-[20px] items-center">
          <NuxtLink
            :to="`/${logged?.channelId}`"
            class="text-gray-700 hover:text-blue-500"
            >{{ logged?.channelName }}</NuxtLink
          >
          <NuxtImg
            v-if="logged?.channelImageUrl"
            class="w-[36px] h-[36px]"
            :src="logged?.channelImageUrl"
            :alt="`${logged?.channelName} 프로필 이미지`"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

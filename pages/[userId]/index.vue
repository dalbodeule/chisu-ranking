<script setup lang="ts">

import type {GetPageList} from "~/server/routes/api/[userId]/index.get";
import {computedAsync} from "@vueuse/core";
import type {IChzzkChannel} from "~/server/utils/chzzkApi";
import dayjs from "dayjs";
import type {GetPage} from "~/server/routes/api/[userId]/[pageName].get";
import ModalElement from "~/components/ModalElement.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";

const { $csrfFetch } = useNuxtApp()

const route = useRoute()

const userId = route.params.userId as string

const userPages: Ref<GetPageList | undefined> = ref(undefined)
const newPageName: Ref<string> = ref('')

const loading: Ref<boolean> = ref(false)

const loadPage = async () => {
  try {
    const data = await $csrfFetch(`/api/${userId}`, {
      method: 'GET'
    }) as GetPageList | undefined

    if (data) {
      useSeoMeta({
        title: `${data.author.name} :: 치수랭킹`,
        description: `${data.author.name}의 페이지 목록입니다.`,
        ogType: 'website',
        ogUrl: `https://ranking.mori.space/${userId}`
      })
      userPages.value = data
    } else {
      throw Error("Could not load document")
    }
  } catch (e) {
    useSeoMeta({
      title: '치수랭킹',
      description: '페이지를 불러오지 못했습니다.',
      ogType: 'website',
    })
    console.error(e)
  }
}

const chzzkProfile = computedAsync(async () => {
  if(userPages.value?.author)
    return await $csrfFetch("/api/chzzk/user", {
      method: "POST",
      body: JSON.stringify({
        userId: userPages.value.author.userId
      })
    }) as IChzzkChannel
  else return null
})

const submitModal: Ref<InstanceType<typeof ModalElement> | null> = ref(null)
const submitPage = async() => {
  try {
    const submit = await submitModal.value?.open()
    if(!submit) return

    loading.value = true

    const result = await $csrfFetch(`/api/${userId}/${encodeURIComponent(newPageName.value)}`, {
      method: 'POST',
      body: JSON.stringify({ content: "" }),
      headers: {
        'Content-Type': 'application/json'
      }
    }) as GetPage | undefined

    if (result) {
      console.log("complete")
    } else {
      throw Error('Failed to save document')
    }
  } catch(e) {
    console.error(e)
  } finally {
    await loadPage()

    loading.value = false
  }
}

onMounted(async () => await loadPage())

</script>

<template>
  <div class="container mx-auto p-4">
    <div class="user-profile flex items-center space-x-4 mb-4">
      <img
          v-if="chzzkProfile"
          :src="chzzkProfile.channelImageUrl"
          alt="User Profile Image"
          class="w-16 h-16 rounded-full border-2 border-gray-300"
      >
      <p v-else class="text-gray-500">Loading profile image...</p>
    </div>

    <div class="user-pages">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">{{ chzzkProfile?.channelName ?? "UNDEFINED" }} 님의 페이지 목록</h2>
      <div v-if="userPages?.content.length" class="space-y-3">
        <div
            v-for="page in userPages?.content"
            :key="page.id"
            class="flex items-center justify-between bg-gray-50 border rounded-lg p-4 hover:shadow transition"
        >
          <NuxtLink
              :to="`${userPages?.author.userId}/${page.pagename}`"
              class="text-blue-600 font-medium hover:text-blue-700"
          >
            {{ page.pagename }}
          </NuxtLink>
          <span class="text-gray-500 text-sm">
            {{ dayjs(page.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </span>
        </div>
      </div>
      <p v-if="!userPages?.content.length" class="text-gray-500 mt-2">No pages created yet.</p>
    </div>

    <div class="create-page mt-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">새 페이지 만들기</h2>
      <form @submit.prevent="submitPage" class="flex items-center space-x-4">
        <input
            v-model="newPageName"
            type="text"
            placeholder="새 페이지 이름 입력"
            class="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            required
        />
        <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          페이지 생성
        </button>
      </form>
    </div>

    <ModalElement ref="submitModal" title="새 페이지 확인">
      <p class="mb-4">새로운 페이지를 만드시겠습니까?</p>
    </ModalElement>
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<style scoped>

</style>
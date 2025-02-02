<script setup lang="ts">
import {useDocumentStore} from "~/stores/documentStore";
import type {Section} from "~/components/SectionElement.vue";
import ModalElement from "~/components/ModalElement.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import {computedAsync} from "@vueuse/core";
import type {IChzzkChannel} from "~/server/utils/chzzkApi";
import type {GetPage} from "~/server/routes/api/[userId]/[pageName].get";
const { $csrfFetch } = useNuxtApp()

const { loggedIn, user } = useUserSession()

const props = defineProps<{
  userId: string,
  pageName: string,
  showHeader: boolean
}>()

const store = useDocumentStore()
const sections = computed(() => store.getSections)

const updateSection = (index: number, updatedSection: Section) => {
  store.updateSection(index, updatedSection)
}

const removeSection = (index: number) => {
  store.removeSection(index)
}

const loading: Ref<boolean> = ref(false)

const loadModal: Ref<InstanceType<typeof ModalElement> | null> = ref(null)
const loadPage = async (isFirstLoad: boolean = false) => {
  try {
    if(!isFirstLoad) {
      const load = await loadModal.value?.open()

      if (!load) return
    }

    loading.value = true
    const data = await $csrfFetch(`/api/${props.userId}/${props.pageName}`, {
      method: 'GET'
    }) as GetPage | undefined

    if (data) {
      store.loadDocument(data.content)

      useSeoMeta({
        title: `${data.author.name} - ${props.pageName} :: 치수랭킹`,
        description: data.content.substring(0, 150),
        ogType: 'website',
        ogUrl: `https://ranking.mori.space/${props.userId}/${props.pageName}`
      })
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
  } finally {
    loading.value = false
  }
}

const chzzkProfile = computedAsync(async () => {
  if(props.userId)
    return await $csrfFetch("/api/chzzk/user", {
      method: "POST",
      body: JSON.stringify({
        userId: props.userId
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

    const result = await $csrfFetch(`/api/${props.userId}/${encodeURIComponent(props.pageName)}`, {
      method: 'POST',
      body: JSON.stringify({ content: store.saveDocument() }),
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
    loading.value = false
  }
}

const isEditor = computed(() => {
  if(loggedIn.value)
    return user.value.channelId === props.userId
  else return false
})

useSeoMeta({
  title: '로딩중... :: 치수랭킹',
  description: '페이지를 불러오는 중입니다.',
  ogType: 'website',
})

onMounted(async () => await loadPage(true))

onBeforeUnmount(() => {
  const confirmationMessage = "저장되지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?";
  window.addEventListener("beforeunload", (event) => {
    if(!isEditor.value) return
    event.preventDefault();
    event.returnValue = confirmationMessage; // 표준에 맞지 않지만 대부분의 브라우저가 표시
    return confirmationMessage;
  });
});

</script>

<template>
  <div class="container mx-auto p-4">
    <div class="text-gray-700 flex flex-row gap-[10px] items-center" v-if="props.showHeader">
      <NuxtImg class="w-[48px] h-[48px] rounded-[48px] border border-gray-500 mr-[10px]"
           :src="chzzkProfile?.channelImageUrl" :alt="`${chzzkProfile?.channelName} 프로필 이미지`" />
      <NuxtLink :to="`/${chzzkProfile?.channelId}`" class="text-gray-700 hover:text-blue-500 text-2xl">
        {{ chzzkProfile?.channelName }}
      </NuxtLink>
      <h1 class="text-2xl font-bold">{{ props.pageName }}</h1>
    </div>
    <ToolbarElement v-if="isEditor" />
    <div class="mt-6 space-y-6">
      <SectionElement
          v-for="(section, index) in sections"
          :key="`${section.id}`"
          :section="section"
          :is-editor="isEditor"
          @update="updateSection(index, $event)"
          @remove="removeSection(index)"
      />
    </div>
    <SaveLoadButtons v-if="isEditor" :user-id="props.userId"
       :page-name="props.pageName" @submit="submitPage" @load="loadPage"/>
    <ModalElement ref="submitModal" title="저장 확인">
      <p class="mb-4">정말 저장하시겠습니까?</p>
    </ModalElement>
    <ModalElement ref="loadModal" title="불러오기 확인">
      <p class="mb-4">기존 내용을 버리시겠습니까?</p>
    </ModalElement>
    <LoadingSpinner :loading="loading" />
  </div>
</template>

<style scoped>

</style>
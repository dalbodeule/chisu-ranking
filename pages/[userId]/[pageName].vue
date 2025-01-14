<script setup lang="ts">
import {useDocumentStore} from "~/stores/documentStore";
import type {Section} from "~/components/Section.vue";
import type {GetPage} from "~/server/routes/api/[userId]/[pageName].get";
const { $csrfFetch } = useNuxtApp()

const route = useRoute()

const userId = route.params.userId
const pageName = route.params.pageName

const { loggedIn, user } = useUserSession()

const store = useDocumentStore()
const sections = computed(() => store.getSections)

const updateSection = (index: number, updatedSection: Section) => {
  store.updateSection(index, updatedSection)
}

const removeSection = (index: number) => {
  store.removeSection(index)
}
const loadPage = async () => {
  try {
    const data = await $csrfFetch(`/api/${userId}/${pageName}`, {
      method: 'GET'
    }) as GetPage | undefined

    if (data) {
      store.loadDocument(data.content)
    } else {
      throw Error("Could not load document")
    }
  } catch (e) {
    console.error(e)
  }
}

const submitPage = async() => {
  try {
    const result = await $csrfFetch(`/api/${userId}/${pageName}`, {
      method: 'POST',
      body: JSON.stringify({ content: store.saveDocument() }),
      headers: {
        'Content-Type': 'application/json'
      }
    }) as GetPage | undefined

    if (result) {

    } else {
      throw Error('Failed to save document')
    }
  } catch(e) {
    console.error(e)
  }
}

const isEditor = computed(() => {
  if(loggedIn.value)
    return user.value.channelId === userId
  else return false
})

onMounted(async () => await loadPage())

</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ pageName }} 편집</h1>
    <Toolbar v-if="isEditor" />
    <div class="mt-6 space-y-6">
      <Section
          v-for="(section, index) in sections"
          :key="`${section.id}`"
          :section="section"
          :isEditor="isEditor"
          @update="updateSection(index, $event)"
          @remove="removeSection(index)"
      />
    </div>
    <SaveLoadButtons :userId="userId" :pageName="pageName" v-if="isEditor" @submit="submitPage" @load="loadPage"/>
  </div>
</template>

<style scoped>

</style>
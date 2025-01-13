<script setup lang="ts">
import {useDocumentStore} from "~/stores/documentStore";
import type {Section} from "~/components/Section.vue";

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

const isEditor = computed(() => {
  console.log(user.value, loggedIn.value)
  if(loggedIn.value)
    return user.value.channelId === userId
  else return false
})

</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ pageName }} 편집</h1>
    <Toolbar v-if="isEditor" />
    <div class="mt-6 space-y-6">
      <Section
          v-for="(section, index) in sections"
          :key="section.id"
          :section="section"
          :isEditor="isEditor"
          @update="updateSection(index, $event)"
          @remove="removeSection(index)"
      />
    </div>
    <SaveLoadButtons :userId="userId" :pageName="pageName" v-if="isEditor" />
  </div>
</template>

<style scoped>

</style>
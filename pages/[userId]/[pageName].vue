<script setup lang="ts">
import {useDocumentStore} from "~/stores/documentStore";
import type {Section} from "~/components/Section.vue";

const route = useRoute()

const userId = route.params.userId
const pageName = route.params.pageName

const { user, loggedIn } = useUserSession()

const store = useDocumentStore()
const sections = computed(() => store.getSections)

const updateSection = (index: number, updatedSection: Section) => {
  store.updateSection(index, updatedSection)
}

const removeSection = (index: number) => {
  store.removeSection(index)
}

</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ pageName }} 편집</h1>
    <Toolbar />
    <div class="mt-6 space-y-6">
      <Section
          v-for="(section, index) in sections"
          :key="section.id"
          :section="section"
          @update="updateSection(index, $event)"
          @remove="removeSection(index)"
      />
    </div>
    <SaveLoadButtons :userId="userId" :pageName="pageName" />
  </div>
</template>

<style scoped>

</style>
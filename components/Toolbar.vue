<script setup lang="ts">
import {useDocumentStore} from "@/stores/documentStore"
import type {Section} from "~/components/Section.vue";

const store = useDocumentStore()

const addTextSection = () => {
  const newSection: Section = {
    id: Date.now(),
    type: 'text',
    content: ''
  }

  store.addSection(newSection)
}

const addTableSection = () => {
  const newSection: Section = {
    id: Date.now(),
    type: 'table',
    table: {
      columns: [],
      rows: []
    },
    form: []
  }

  store.addSection(newSection)
}
</script>

<template>
  <div class="flex space-x-2">
    <button @click="addTextSection" type="button" class="px-4 py-2 bg-gray-200 rounded">텍스트 추가</button>
    <button @click="addTableSection" type="button" class="px-4 py-2 bg-gray-200 rounded">테이블 추가</button>
  </div>
</template>
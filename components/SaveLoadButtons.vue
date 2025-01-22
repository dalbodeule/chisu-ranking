<script setup lang="ts">
import { useDocumentStore } from "~/stores/documentStore";

const store = useDocumentStore()

const emit = defineEmits<{
  'submit': [string],
  'load': []
}>()

const save = () => {
  const json = store.saveDocument()
  emit('submit', json)
}

const load = () => {
  emit('load')
}

</script>

<template>
  <div class="flex space-x-2 mt-6">
    <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded" @click="save">저장</button>
    <button type="button" class="px-4 py-2 bg-green-500 text-white rounded" @click="load">불러오기</button>
  </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { useDocumentStore } from "~/stores/documentStore";

const store = useDocumentStore()

const save = () => {
  const json = store.saveDocument()
  console.log(json)
}

const load = () => {
  const json = ''

  if(json) {
    store.loadDocument(json)
  } else {

  }
}

</script>

<template>
  <div class="flex space-x-2 mt-6">
    <button @click="save" type="button" class="px-4 py-2 bg-blue-500 text-white rounded">저장</button>
    <button @click="load" type="button" class="px-4 py-2 bg-green-500 text-white rounded">불러오기</button>
  </div>
</template>

<style scoped>

</style>
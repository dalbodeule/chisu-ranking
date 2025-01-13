<script setup lang="ts">
import ToastViewer from "~/components/ToastViewer.vue";

const props = defineProps<{
  modelValue: string,
  id: string,
  isEditor: boolean,
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const markdown = ref(props.modelValue ?? "")

watch(() => props.modelValue, (newVal) => {
  if (newVal !== markdown.value) {
    markdown.value = newVal
    emit('update:modelValue', markdown.value)
  }
})
</script>

<template>
  <div>
    <ClientOnly>
      <ToastEditor :modelValue="markdown" :id="id" @update:modelValue="markdown = $event" v-if="isEditor"/>
      <ToastViewer :modelValue="markdown" :id="id" v-else />
    </ClientOnly>
  </div>
</template>

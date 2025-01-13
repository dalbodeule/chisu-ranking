<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [string]
}>()

const markdown = ref(props.modelValue ?? "")
const md = new MarkdownIt()
const htmlContent = ref(md.render(markdown.value))

const updateContent = () => {
  htmlContent.value = md.render(markdown.value)
  emit('update:modelValue', markdown.value)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== markdown.value) {
    markdown.value = newVal
    htmlContent.value = md.render(newVal)
  }
})
</script>

<template>
  <div>
    <textarea v-model="markdown" @input="updateContent" class="w-full p-2 border rounded-md"></textarea>
    <div class="prose mt-4" v-html="htmlContent"></div>
  </div>
</template>

<style scoped>
  textarea {
    min-height: 200px;
  }
</style>
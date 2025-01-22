<script setup lang="ts">
import Editor from '@toast-ui/editor'
import '@toast-ui/editor/toastui-editor.css'
import '@toast-ui/editor/dist/i18n/ko-kr';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'

const props = defineProps<{
  modelValue: string,
  id: string,
}>()
const emit = defineEmits<{
  'update:modelValue': [string],
  'insert:image': []
}>()

const editor = ref(`${props.id}`)

onMounted(() => {
  const e = new Editor({
    el: editor.value,
    height: '500px',
    initialEditType: 'wysiwyg',
    initialValue: props.modelValue,
    previewStyle: 'tab',
    language: 'ko-KR',
    events: {
      change: () => emit('update:modelValue', e.getMarkdown()),
    },
    hooks: {
      addImageBlobHook: async (_blob: Blob, _callback: (url: string, text: string) => void) => {
        console.log()
        alert("아직 이미지 업로드는 제공되지 않습니다.")
        return false;
      }
    },
    plugins: [
        colorSyntax
    ]
  })
})
</script>

<template>
  <div ref="editor" />
</template>
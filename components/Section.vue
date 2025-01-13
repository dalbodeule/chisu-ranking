<script setup lang="ts">
import type { Field } from "~/components/FormEditor.vue";
import RichTextEditor from "~/components/RichTextEditor.vue";
import TableWithFormEditor from "~/components/TableWithFormEditor.vue";
import type {Column, Row} from "~/components/TableEditor.vue";

export type ISectionType = 'text' | 'table'

export interface Section {
  id: number,
  type: ISectionType,
  content?: string,
  table?: {
    rows: Row[],
    columns: Column[]
  },
  form?: Field[]
}

const props = defineProps<{
  section: Section,
  isEditor: boolean,
}>()
const emit = defineEmits<{
  'update': [Section]
  'remove': []
}>()

const getSectionComponent = (type: ISectionType) => {
  switch(type) {
    case 'text':
      return RichTextEditor
    case 'table':
      return TableWithFormEditor
    default:
      return 'div'
  }
}

const updateSection = (updatedContent: Section) => {
  emit('update', updatedContent)
}

const removeSection = () => {
  emit('remove')
}
</script>

<template>
  <div class="p-4 border rounded">
    <component
      :is="getSectionComponent(section.type)"
      :section="section"
      :modelValue="section.content"
      :table="section.table"
      :form="section.form"
      :id="section.id"
      :isEditor="isEditor"
      @update="updateSection"
      @remove="removeSection"
    />
    <button @click="$emit('remove')" type="button" class="mt-2 px-3 py-1 bg-red-500 text-white rounded">섹션 삭제</button>
  </div>
</template>
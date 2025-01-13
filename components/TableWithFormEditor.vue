<script setup lang="ts">
import type {Section} from "~/components/Section.vue";
import type {Column, Row} from "~/components/TableEditor.vue";
import type {Field} from "~/components/FormEditor.vue";


const props = defineProps<{section: Section}>()
const emit = defineEmits<{
  'update': [Section]
}>()

const updateTableRows = (newRows: Row[]) => {
  const newSection = { ...props.section }

  newSection.table = {
    ...newSection.table,
    rows: newRows
  } as { rows: Row[], columns: Column[]}
  newSection.form = props.section.form

  emit('update', newSection)
}

const updateFormFields = (fields: Field[]) => {
  console.log(fields)
  const newSection = { ...props.section }
  // section이 존재하고 table이 정의되어 있는지 확인합니다.
  if (newSection && newSection.table) {
    newSection.table.columns = fields.map((value) => {
      return {
        id: value.id,
        key: value.columnKey,
        name: value.label,
        type: value.type,
        default: value.value,
        options: value.options
      }
    })

    newSection.table.columns = newSection.table.columns
        .map((column, index) => ({
          ...column,
          order: index // 각 컬럼의 order를 필드의 인덱스로 설정
        }))
        .sort((a, b) => a.order - b.order);
  }
  newSection.form = fields

  // 변경된 섹션을 부모 컴포넌트로 Emit
  emit('update', newSection)
}
</script>

<template>
  <div>
    <TableEditor
      :columns="section.table!!.columns"
      :modelValue="section.table!!.rows"
      @update:modelValue="updateTableRows"
    />
    <FormEditor
      :columns="section.table!!.columns"
      :fields="section.form!!"
      @update:fields="updateFormFields"
    />
  </div>
</template>
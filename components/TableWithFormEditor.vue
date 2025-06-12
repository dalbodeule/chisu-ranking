<script setup lang="ts">
import type { Section } from "~/components/SectionElement.vue";
import type { Field } from "~/components/FormEditor.vue";
import type {Row} from "~/components/TableEditor.vue";

const props = defineProps<{
  section: Section,
  isEditor: boolean,
}>()
const emit = defineEmits<{
  'update:section': [Section],
}>()

const section = ref<Section>(props.section)
const isEditor = ref<boolean>(props.isEditor)

const updateFormFields = (fields: Field[]) => {
  const newSection = useCloneDeep(section.value)

  if (!fields?.length && section.value?.form) {
    fields = section.value?.form;
  }
  if (newSection && newSection.table) {
    const newFields = fields.map((field) => ({
      id: field.id,
      columnKey: field.columnKey,
      label: field.label,
      type: field.type,
      value: field.value,
      options: field.options,
      format: field.format,
      image: field.image,
      gridRow: field.gridRow,
      gridColumn: field.gridColumn,
      gridRowSpan: field.gridRowSpan,
      gridColumnSpan: field.gridColumnSpan
    }));

    newSection.table.columns = newFields.map((field) => ({
      id: field.id,
      key: field.columnKey,
      name: field.label,
      type: field.type,
      default: field.value,
      options: field.options,
      format: field.format,
      image: field.image,
      gridRow: field.gridRow,
      gridColumn: field.gridColumn,
      gridRowSpan: field.gridRowSpan,
      gridColumnSpan: field.gridColumnSpan
    }));

    newSection.table.columns = newSection.table.columns
        .map((column, index) => ({
          ...column,
          order: index,
        }))
        .sort((a, b) => a.order - b.order);
  
    newSection.form = newFields;

    section.value = newSection;
  }
};

const updateRows = (rows: Row[]) => {
  if(!section.value?.table?.rows) return;

  const copiedSection = useCloneDeep(section.value)
  copiedSection.table!!.rows = rows;

  section.value = copiedSection;
}

watch(() => props.section, () => emit('update:section', section.value), { deep: true });
</script>

<template>
  <div>
    <TableEditor
      :columns="section?.table?.columns ?? []"
      :rows="section?.table?.rows ?? []"
      :is-editor="isEditor ?? false"
      @update:rows="updateRows"
    />
    <FormEditor
      v-if="isEditor"
      :columns="section?.table?.columns ?? []"
      :fields="section?.form ?? []"
      @update:fields="updateFormFields"
    />
  </div>
</template>

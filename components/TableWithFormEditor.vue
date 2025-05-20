<script setup lang="ts">
import type { Section } from "~/components/SectionElement.vue";
import type { Column, Row } from "~/components/TableEditor.vue";
import type { Field } from "~/components/FormEditor.vue";

const props = defineProps<{
  section: Section;
  isEditor: boolean;
}>();
const emit = defineEmits<{
  update: [Section];
}>();

const updateTableRows = (newRows: Row[]) => {
  const newSection = { ...props.section };

  newSection.table = {
    ...newSection.table,
    rows: newRows,
  } as { rows: Row[]; columns: Column[] };
  newSection.form = props.section.form;

  emit("update", newSection);
};

const updateFormFields = (fields: Field[]) => {
  console.log(fields);
  const newSection = {...props.section};
  if (!fields?.length && props.section?.form) {
    fields = props.section.form;
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
  }
  
  emit("update", newSection);
};

onMounted(() => {
  if (props.section?.form) {
    updateFormFields(props.section.form);
  }
});
</script>

<template>
  <div>
    <TableEditor
      :columns="section.table!!.columns"
      :model-value="section.table!!.rows"
      :is-editor="isEditor"
      @update:model-value="updateTableRows"
    />
    <FormEditor
      v-if="isEditor"
      :columns="section.table!!.columns"
      :fields="section.form!!"
      @update:fields="updateFormFields"
    />
  </div>
</template>

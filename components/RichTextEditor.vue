<script setup lang="ts">
import ToastViewer from "~/components/ToastViewer.vue";
import type { Section } from "~/components/SectionElement.vue";

const props = defineProps<{
  section: Section;
  id: string;
  isEditor: boolean;
}>();

const emit = defineEmits<{
  update: [Section];
}>();

const section = ref(props.section);
const isUpdating: Ref<boolean> = ref(false);

const updateValue = (value: string) => {
  const newSection = { ...section.value } as Section;
  newSection.content = value;

  emit("update", newSection);
};

watch(
  () => section.value.content,
  (newVal) => {
    isUpdating.value = true;
    updateValue(newVal ?? "");
    isUpdating.value = false;
  },
  { deep: true },
);
</script>

<template>
  <div>
    <ClientOnly>
      <ToastEditor
        v-if="isEditor"
        :id="id"
        :model-value="section.content!!"
        @update:model-value="updateValue"
      />
      <ToastViewer v-else :id="id" :model-value="section.content!!" />
    </ClientOnly>
  </div>
</template>

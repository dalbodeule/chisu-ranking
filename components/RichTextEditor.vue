<script setup lang="ts">
import ToastViewer from "~/components/ToastViewer.vue";
import type { Section } from "~/components/SectionElement.vue";

const props = defineProps<{
  id: string;
  isEditor: boolean;
}>();
const section = defineModel<Section>("section")

const updateValue = (value: string) => {
  const newSection = { ...section.value } as Section;
  newSection.content = value;
};
</script>

<template>
  <div>
    <ClientOnly>
      <ToastEditor
        v-if="isEditor"
        :id="id"
        :content="section?.content!!"
        @update:content="updateValue"
      />
      <ToastViewer v-else :id="id" :model-value="section?.content!!" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import ToastViewer from "~/components/ToastViewer.vue";
import type {Section} from "~/components/Section.vue";

const props = defineProps<{
  section: Section
  id: string,
  isEditor: boolean,
}>()

const emit = defineEmits<{
  'update': [Section]
}>()

const section = ref(props.section)
const isUpdating: Ref<boolean> = ref(false)

const updateValue = (value: string) => {
  const newSection = { ...section.value } as Section
  newSection.content = value


  emit('update', newSection)
}

watch(() => section.value.content,
  (newVal) => {
    isUpdating.value = true
    updateValue(newVal ?? "")
    isUpdating.value = false
  }, { deep: true }
)
</script>

<template>
  <div>
    <ClientOnly>
      <ToastEditor :modelValue="section.content!!" :id="id" @update:modelValue="updateValue" v-if="isEditor" />
      <ToastViewer :modelValue="section.content!!" :id="id" v-else />
    </ClientOnly>
  </div>
</template>

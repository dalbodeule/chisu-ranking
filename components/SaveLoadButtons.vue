<script setup lang="ts">
import { useDocumentStore } from "~/stores/documentStore";

const store = useDocumentStore();

const emit = defineEmits<{
  submit: [string];
  load: [];
}>();

const save = () => {
  const json = store.saveDocument();
  emit("submit", json);
};

const load = () => {
  emit("load");
};

const undo = () => {
  store.undo();
};

const redo = () => {
  store.redo();
};

const keyEventHandler = (e: KeyboardEvent) => {
  if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    undo();
  }
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
    e.preventDefault();
    redo();
  }
  if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    save();
  }
};

onMounted(() => {
  window.addEventListener("keydown", (e) => keyEventHandler(e));
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", (e) => keyEventHandler(e));
});
</script>

<template>
  <div class="flex space-x-2 mt-6">
    <button type="button" class="px-4 py-2 bg-blue-500 text-white rounded" @click="save">
      저장
    </button>
    <button type="button" class="px-4 py-2 bg-green-500 text-white rounded" @click="load">
      불러오기
    </button>
    <button type="button" class="px-4 py-2 bg-gray-500 text-white rounded" @click="undo">
      실행취소
    </button>
    <button type="button" class="px-4 py-2 bg-gray-500 text-white rounded" @click="redo">
      다시실행
    </button>
  </div>
</template>

<style scoped></style>

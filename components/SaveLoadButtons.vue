<script setup lang="ts">
import { useDocumentStore } from "~/stores/documentStore";
import { useMagicKeys } from "@vueuse/core"
import {UAParser} from "ua-parser-js";

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

const { Ctrl_Z, Ctrl_Shift_Z, Meta_Z, Meta_Shift_Z } = useMagicKeys();

const uap = new UAParser();

const isMacFamily = computed(() => {
  const os = uap.getOS()
  switch(os.name) {
    case 'macOS':
    case 'ios':
      return true
    default:
      return false
  }
})
watch(Ctrl_Z, (ev) => {
  if(ev && !isMacFamily) {
    console.log("undo checked.")
    undo()
  }
})
watch(Meta_Z, (ev) => {
  if(ev && isMacFamily) {
    console.log("undo checked.")
    undo()
  }
})
watch(Ctrl_Shift_Z, (ev) => {
  if(ev && isMacFamily) {
    console.log("redo checked.")
    redo()
  }
})
watch(Meta_Shift_Z, (ev) => {
  if(ev && isMacFamily) {
    console.log("redo checked.")
    redo()
  }
})
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

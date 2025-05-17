<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg px-6 py-4 relative">
      <!-- 닫기 버튼 -->
      <button
        class="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        aria-label="Close modal"
        @click="handleClose(false)"
      >
        ✕
      </button>
      <!-- 모달 콘텐츠 -->
      <h2 id="modal-title" class="text-xl font-bold mb-4">{{ props.title }}</h2>
      <slot />
      <div class="flex justify-end mt-4">
        <button
          class="px-4 py-2 bg-green-500 text-white rounded mr-2"
          @click="handleClose(true)"
        >
          확인
        </button>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded"
          @click="handleClose(false)"
        >
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineProps } from "vue";

// Props 정의 (필요에 따라 확장 가능)
const props = defineProps({
  title: {
    type: String,
    default: "모달 제목",
  },
});

// 모달 상태 관리
const isOpen = ref(false);
// eslint-disable-next-line
const resolvePromise = ref<(value: boolean) => void>();

// 모달 열기 함수 정의 및 노출
const open = (): Promise<boolean> => {
  return new Promise((resolve) => {
    isOpen.value = true;
    resolvePromise.value = resolve;
  });
};

// 모달 닫기 함수
const handleClose = (result: boolean) => {
  isOpen.value = false;
  if (resolvePromise.value) {
    resolvePromise.value(result);
    resolvePromise.value = undefined;
  }
};

// 부모 컴포넌트에 기능 노출
defineExpose({
  open,
});
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>

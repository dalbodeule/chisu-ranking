<template>
  <div
    v-if="loading"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="flex flex-col items-center">
      <!-- TailwindCSS를 활용한 로딩 스피너 -->
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"/>
      <p class="mt-4 text-white text-lg font-semibold">로딩 중...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false, // 로딩 상태를 조정하는 prop
    },
  },
};
</script>

<style scoped>
/* 필요시 추가 스타일 작성 가능 */
</style>
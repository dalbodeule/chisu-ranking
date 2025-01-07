<script setup lang="ts">
const route = useRoute()

const userId = route.params.userId
const pageName = route.params.pageName

</script>

<template>
  <div class="prose">
    <p> userId: {{ userId }}</p>
    <p> pageName: {{ pageName }}</p>
  </div>
</template>

<style scoped>

</style>
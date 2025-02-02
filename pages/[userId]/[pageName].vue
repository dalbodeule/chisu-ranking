<script setup lang="ts">
import ArticleComponent from "~/components/ArticleComponent.vue";

const route = useRoute()

const userId = route.params.userId as string
const pageName = route.params.pageName as string

</script>

<template>
  <ArticleComponent :userId="userId" :pageName="pageName" :show-header="true"/>
</template>
<script setup lang="ts">
import type { IChzzkChannelUser } from "~/server/utils/chzzkApi";

const logged = ref<IChzzkChannelUser | undefined>(undefined);
const { user, loggedIn } = useUserSession();

provide("USER", logged);

onMounted(async () => {
  if (loggedIn && user.value?.channelId) {
    const { data } = await useFetch<IChzzkChannelUser>("/api/chzzk/user", {
      method: "POST",
      body: JSON.stringify({
        userId: user.value.channelId,
      }),
      key: "profile",
    });

    logged.value = data.value ?? undefined;
  }
});
</script>

<template>
  <div>
    <SiteHeader />
    <div class="container mx-auto px-4 min-h-[80vh] my-[3em]">
      <NuxtPage />
    </div>
    <SiteFooter />
  </div>
</template>

<style scoped></style>

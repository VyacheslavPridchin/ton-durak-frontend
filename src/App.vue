<template>
  <div class="screen">
    <PopupLayout/>
    <NotificationLayout/>
    <div class="container">
      <FullscreenLayout :excludePaths="roots"/>
      <SliderLayout :sliderPaths="roots" />
    </div>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
import SliderLayout from '@/layouts/slider/SliderLayout.vue'
import Footer from "@/layouts/FooterLayout.vue";
import { onMounted, ref } from "vue";
import PopupLayout from "@/layouts/PopupLayout.vue";
import FullscreenLayout from "@/layouts/FullscreenLayout.vue";
import { useRoute, useRouter } from 'vue-router'
import NotificationLayout from "@/layouts/NotificationLayout.vue";

const router = useRouter()
const route = useRoute()
const roots = ref<string[]>(['/referrals', '/main', '/profile']);

import apiService from "@/services/ApiService.ts";
import type { AuthRequest, AuthResponse } from "@/services/ApiService.ts";

const authData = ref<AuthResponse | null>(null);

const auth = async (init_data: string) => {
  const payload: AuthRequest = { initData: init_data };
  try {
    authData.value = await apiService.auth(payload);
    console.log("Auth Response:", authData.value);
  } catch (error) {
    console.error("Authorization error:", error);
  }
  return { authData };
}

onMounted(async () => {
  // @ts-ignore
  window.Telegram.WebApp.disableVerticalSwipes();

  // @ts-ignore
  window.Telegram.WebApp.enableClosingConfirmation();

  // @ts-ignore
  window.Telegram.WebApp.expand();

  // @ts-ignore
  window.Telegram.WebApp.requestFullscreen();

  // @ts-ignore
  window.Telegram.WebApp.lockOrientation();

  // @ts-ignore
  await auth(window.Telegram.WebApp.initData);

  router.afterEach(() => {

    const idx = window.history.state ? window.history.state.position : 0;
    if (idx > 0 && !roots.value.includes(route.path)) {
      // @ts-ignore
      window.Telegram.WebApp.BackButton.show();
    } else {
      // @ts-ignore
      window.Telegram.WebApp.BackButton.hide();
    }
  });

  // @ts-ignore
  window.Telegram.WebApp.BackButton.onClick(() => {
    router.back();
  });
})

</script>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  opacity: 0;
  animation: fadeIn 0.75s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>


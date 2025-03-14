<template>
  <div class="screen">
    <PopupLayout />
    <NotificationLayout />
    <div class="container">
      <FullscreenLayout :excludePaths="roots" />
      <SliderLayout :sliderPaths="roots" />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PopupLayout from "@/layouts/PopupLayout.vue";
import FullscreenLayout from "@/layouts/FullscreenLayout.vue";
import SliderLayout from "@/layouts/slider/SliderLayout.vue";
import Footer from "@/layouts/FooterLayout.vue";
import NotificationLayout from "@/layouts/NotificationLayout.vue";
import apiService from "@/services/ApiService.ts";
import type { AuthRequest, ApiResponse, AuthResponseData } from "@/services/ApiService.ts";

const router = useRouter();
const route = useRoute();
const roots = ref<string[]>(["/referrals", "/main", "/profile"]);

const authData = ref<ApiResponse<AuthResponseData> | null>(null);

// Функция авторизации
const auth = async (init_data: string) => {
  const payload: AuthRequest = { initData: init_data };
  try {
    authData.value = await apiService.auth(payload);
    console.log("Auth Response:", authData.value);
  } catch (error) {
    console.error("Authorization error:", error);
  }
  return { authData };
};

// Функция кэширования initData и данных пользователя
const cacheUserData = (rawInitData: string) => {
  if (rawInitData) {
    // Сохраняем полную строку initData для будущих обращений
    localStorage.setItem("initData", rawInitData);
  }
  const params = new URLSearchParams(rawInitData);
  const userEncoded = params.get("user");
  if (userEncoded) {
    try {
      const userJson = decodeURIComponent(userEncoded);
      const userObj = JSON.parse(userJson);
      // Сохраняем данные пользователя в кэше
      localStorage.setItem("userData", JSON.stringify(userObj));
      // Также можно положить их в глобальную переменную для быстрого доступа
      // @ts-ignore
      window.userData = userObj;
      console.log("Cached user data:", userObj);
    } catch (err) {
      console.error("Error parsing user data", err);
    }
  } else {
    console.warn("User data not found in initData");
  }
};

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

  // Пытаемся получить initData из Telegram.WebApp или из кэша
  // @ts-ignore
  const telegramInitData = window.Telegram.WebApp.initData || localStorage.getItem("initData");
  if (telegramInitData) {
    cacheUserData(telegramInitData);
    await auth(telegramInitData);
  } else {
    console.error("initData не найден ни в Telegram.WebApp, ни в кэше");
  }

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
});
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

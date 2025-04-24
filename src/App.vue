<template>
  <div class="screen">
    <PopupLayout />
    <NotificationLayout />
    <div class="container">
      <FullscreenLayout :excludePaths="roots" />
      <SliderLayout :sliderPaths="roots" />
    </div>
    <Footer :excludePaths="['/game']"/>
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
import {EventService, EventType} from "@/game/network/EventService.ts";
import NetworkManager from "@/game/network/NetworkManager.ts";
import {events} from "@/events.ts";

const router = useRouter();
const route = useRoute();
const roots = ref<string[]>(["/referrals", "/main", "/profile"]);

onMounted(async () => {
  if(window.onBoardingRequired)
    events.emit("showPopup", { name: "onBoarding", canClose: false });
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

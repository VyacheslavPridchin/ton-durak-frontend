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
import {nextTick, onMounted, ref} from "vue";
import { useRoute, useRouter } from "vue-router";
import PopupLayout from "@/layouts/PopupLayout.vue";
import FullscreenLayout from "@/layouts/FullscreenLayout.vue";
import SliderLayout from "@/layouts/slider/SliderLayout.vue";
import Footer from "@/layouts/FooterLayout.vue";
import NotificationLayout from "@/layouts/NotificationLayout.vue";
import {EventService, EventType} from "@/game/network/EventService.ts";
import NetworkManager from "@/game/network/NetworkManager.ts";
import {events} from "@/events.ts";
import apiService from "@/services/ApiService.ts";
import PlayerSettingsStorage from "@/game/network/PlayerSettingsStorage.ts";

const router = useRouter();
const route = useRoute();
const roots = ref<string[]>(["/referrals", "/wallet", "/main", "/free", "/profile"]);

onMounted(async () => {
  // @ts-ignore
  window.Telegram.WebApp.disableVerticalSwipes();
  // @ts-ignore
  window.Telegram.WebApp.enableClosingConfirmation();


  // @ts-ignore
  if(window.Telegram.WebApp.platform !== "tdesktop" && window.Telegram.WebApp.platform !== "macos") {
    // @ts-ignore
    window.Telegram.WebApp.expand();

    // @ts-ignore
    window.Telegram.WebApp.requestFullscreen();
  }

  // @ts-ignore
  console.log("Telegram platform: ", window.Telegram.WebApp.platform)

  // @ts-ignore
  window.Telegram.WebApp.lockOrientation();

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
    if(route.path === "/game"){
      if (window.gameInProgress) {
        EventService.Instance.emit(EventType.ShowTryLeavePopup, undefined);
      } else {
        NetworkManager.CloseGame(router);
      }
      return;
    }

    router.back();
  });

  if(window.onBoardingRequired)
    events.emit("showPopup", { name: "onBoarding", canClose: false });

  checkTournamentWin();
});

function checkTournamentWin() {
  apiService.postCheckTournamentWin().then((response) => {
    if(response.success){
      window.tournamentWinData = response.data;
      events.emit('showPopup', { name: 'tournamentWin' });
    }
  });
}
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

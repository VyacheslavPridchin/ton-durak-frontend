<template>
  <GameScene />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted } from "vue";
import GameScene from "./components/Game.vue";
import NetworkManager from "./network/NetworkManager";
import { EventService, EventType } from "./network/EventService";
import { ImageCache } from "./utils/ImageCache";
import { CardUtils } from "./utils/CardUtils";

const router = useRouter();
const route = useRoute();

function refreshStates() {
  EventService.Instance.emit(EventType.RefreshStates, false);
}

function parseUrlParams() {
  const lobbyId = Array.isArray(route.query.lobbyId)
      ? route.query.lobbyId[0]
      : route.query.lobbyId;
  console.log("Lobby ID: ", lobbyId);
  const playerId = Array.isArray(route.query.playerId)
      ? route.query.playerId[0]
      : route.query.playerId;
  console.log("Player ID: ", playerId);
  const language = Array.isArray(route.query.language)
      ? route.query.language[0]
      : route.query.language;
  console.log("Language: ", language);
  const host = Array.isArray(route.query.host)
      ? route.query.host[0]
      : route.query.host;
  console.log("Host: ", host);

  NetworkManager.setUrl(host);

  if (lobbyId) {
    EventService.Instance.emit(EventType.LobbyIdSet, lobbyId);
  }
  if (playerId) {
    EventService.Instance.emit(EventType.MyPlayerIdSet, playerId);
  }
  if (language) {
    EventService.Instance.emit(EventType.LanguageSet, language);
  }
}

function preloadImages() {
  ImageCache.preloadImages(
      CardUtils.getEveryCardImagePaths("ton_default", true)
  );
  ImageCache.preloadImage("/assets/icons/durak-icon.svg");
  ImageCache.preloadImage("/assets/icons/balance-icon.svg");
  ImageCache.preloadImage("/assets/icons/timer-icon.svg");
  ImageCache.preloadImage("/assets/icons/reconnect-icon.svg");
  ImageCache.preloadImage("/assets/icons/trophy-icon.svg");
}

// Новый обработчик события Transfer
function handleTransfer(eventData: { lobbyId: string; host: string }) {
  console.log("Handle transfer: ", eventData);

  NetworkManager.reconnectionRequired = false;
  NetworkManager.close();

  // Обновляем строку запроса с новым lobbyId и переходим по новому маршруту
  router.push({
    query: {
      ...route.query,
      lobbyId: eventData.lobbyId,
      host: eventData.host,
    },
  });

  NetworkManager.setUrl(eventData.host);
  EventService.Instance.emit(EventType.LobbyIdSet, eventData.lobbyId);

  NetworkManager.connect();
}

onMounted(() => {
  console.log("App.vue: onMounted");

  // Инициализируем кэш изображений
  ImageCache.initCache();

  // Считываем параметры из URL
  parseUrlParams();

  preloadImages();

  // Подключение к серверу
  NetworkManager.connect();

  // Добавляем слушатели событий
  window.addEventListener("resize", refreshStates);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshStates();
    }
  });

  // Отслеживание события Transfer
  EventService.Instance.on(EventType.Transfer, handleTransfer);
});

onUnmounted(() => {
  console.log("App.vue: onUnmounted");

  window.removeEventListener("resize", refreshStates);
  // Для корректного удаления слушателя visibilitychange рекомендуется вынести функцию в отдельную переменную
  document.removeEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshStates();
    }
  });

  // Удаляем слушатель события Transfer
  EventService.Instance.off(EventType.Transfer, handleTransfer);

  NetworkManager.CloseGame(router);
});
</script>

<style>
/* Глобальные стили */
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100); /* Исправленная высота */
  overflow: hidden; /* Убираем скролл */
  user-select: none;
  box-sizing: border-box;
}
</style>

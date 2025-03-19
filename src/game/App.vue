<template>
  <GameScene />
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import { onMounted, onUnmounted } from 'vue';
import GameScene from './components/game/elements/Game.vue';
import NetworkManager from './network/NetworkManager';
// import PlayerSettingsStorage from './network/PlayerSettingsStorage';
import { EventService, EventType } from './network/EventService';
import { ImageCache } from "./utils/ImageCache";
import { CardUtils } from "./utils/CardUtils";
// import LogInterceptor from "./utils/LogInterceptor";
// import TokenService from "../services/token.service"

const router = useRouter();
// let logger: LogInterceptor;

function refreshStates() {
  EventService.Instance.emit(EventType.RefreshStates, false);
}

function parseUrlParams() {
  const params = useRoute()
  const lobbyId = Array.isArray(params.query.lobbyId) ? params.query.lobbyId[0] : params.query.lobbyId;
  console.log("Lobby ID: ", lobbyId);
  const playerId = Array.isArray(params.query.playerId) ? params.query.playerId[0] : params.query.playerId;
  console.log("Player ID: ", playerId);
  const language = Array.isArray(params.query.language) ? params.query.language[0] : params.query.language;
  console.log("Language: ", language);
  const host = Array.isArray(params.query.host) ? params.query.host[0] : params.query.host;
  console.log("Host: ", host);

  // logger = LogInterceptor
  //     .getInstance('https://tondurakgame.com/error', ['Telegram']);
  //
  // logger.setPlayerContext(playerId, lobbyId, TokenService.getLocalAccessToken());

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

function preloadImages(){
  ImageCache.preloadImages(CardUtils.getEveryCardImagePaths("ton_default", true));
  ImageCache.preloadImage("/assets/icons/durak-icon.svg");
  ImageCache.preloadImage("/assets/icons/balance-icon.svg");
  ImageCache.preloadImage("/assets/icons/timer-icon.svg");
  ImageCache.preloadImage("/assets/icons/reconnect-icon.svg");
  ImageCache.preloadImage("/assets/icons/trophy-icon.svg");
}

onMounted(() => {
  console.log("App.vue: onMounted");

  // Инициализируем кэш изображений
  ImageCache.initCache();

  // Считываем параметры из URL
  parseUrlParams();

  // Получаем jwt токен
  //const jwt_access_token = TokenService.getLocalAccessToken();

  preloadImages();

  // Устанавливаем WebSocket URL
  //NetworkManager.setUrl(import.meta.env.VITE_GAME_SERVER_URL);

  // Подключение к серверу
  NetworkManager.connect();

  // Добавляем слушатели событий
  window.addEventListener('resize', refreshStates);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshStates();
    }
  });
});

onUnmounted(() => {
  console.log("App.vue: onUnmounted");

  window.removeEventListener('resize', refreshStates);
  document.removeEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshStates();
    }
  });

  NetworkManager.CloseGame(router);
});
</script>

<style>
/* Глобальные стили */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100); /* Исправленная высота */
  overflow: hidden; /* Убираем скролл */
  user-select: none;
  box-sizing: border-box;
}
</style>

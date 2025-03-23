<template>
  <header class="header">
    <!-- Кнопка слева -->
<!--    <button class="circle-button" @click="handleButtonClick">-->
<!--      <img :src="gameInProgress ? '/assets/icons/flag-icon.svg' : '/assets/icons/exit-icon.svg'" alt="Action Icon" class="icon" />-->
<!--    </button>-->

    <!-- Баланс справа -->
    <div v-if="balanceVisible" class="balance-panel">
      <span class="balance-value">{{ balance }}</span>
    </div>

    <!-- PlayersController по центру -->
    <PlayersController ref="playersCtrl" />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import PlayersController from './PlayersController.vue';
import { EventService, EventType } from '../../../network/EventService';
import NetworkManager from "../../../network/NetworkManager";
import { useRouter } from "vue-router";

// Ссылка на контроллер, чтобы при желании менять кол-во игроков
const playersCtrl = ref<InstanceType<typeof PlayersController> | null>(null);

const balance = ref('');
const balanceVisible = ref(false);  // Переменная для отображения панели
// const gameInProgress = ref(false); // Состояние игры

const router = useRouter();

const balanceClickCount = ref(0); // Счетчик кликов

const setGameStarted = () => window.gameInProgress = true;
const setGameEnded = () => window.gameInProgress = false;

onMounted(() => {
  EventService.Instance.on(EventType.BalanceSet, setBalance);
  EventService.Instance.on(EventType.GameStarted, setGameStarted);
  EventService.Instance.on(EventType.GameEnded, setGameEnded);
  EventService.Instance.on(EventType.WinnerDeclared, setGameEnded);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.BalanceSet, setBalance);
  EventService.Instance.off(EventType.GameStarted, setGameStarted);
  EventService.Instance.off(EventType.GameEnded, setGameEnded);
  EventService.Instance.off(EventType.WinnerDeclared, setGameEnded);
});


function setBalance(extra: string) {
  if (extra === '') {
    balanceVisible.value = false;  // Если текст пустой, скрыть панель
  } else {
    balance.value = extra;  // Устанавливаем новый баланс
    balanceVisible.value = true;  // Показываем панель, если текст не пустой
  }
}

function handleButtonClick() {
  // if (gameInProgress.value) {
  //   EventService.Instance.emit(EventType.ShowTryLeavePopup, undefined);
  // } else {
  //   NetworkManager.CloseGame(router);
  // }
}
//
// function handleBalanceClick() {
//   balanceClickCount.value++;
//
//   if (balanceClickCount.value >= 10) {
//     EventService.Instance.emit(EventType.ShowDebug, undefined);
//     balanceClickCount.value = 0; // Сброс счетчика
//   }
// }
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 60px;
  background: transparent;
  box-sizing: border-box;
}

.circle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(249, 251, 250, 0.3);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.circle-button:hover {
  background-color: rgba(249, 251, 250, 0.4);
  transition: background-color 0.1s ease-in-out;
}

.circle-button:active {
  background-color: rgba(249, 251, 250, 0.5);
  transition: background-color 0.1s ease-in-out;
}

.circle-button .icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
}

.balance-panel {
  position: absolute;
  top: 150%;
  right: 16px;
  transform: translateY(-50%);
  display: flex;
  align-items: baseline;
  background-color: rgba(249, 251, 250, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
  cursor: default;
  z-index: 100;
}

.balance-value {
  font-size: 1vh;
  font-weight: 700;
  color: #ffffff;
  pointer-events: none;
}
</style>

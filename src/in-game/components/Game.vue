<template>
  <div class="game-scene">
    <GameEndPopup />
    <DurakPopup />
    <WinnerPopup />
    <KickPopup />
    <TryLeavePopup />
    <ReconnectPopup />
    <OfferToChangeBetPopup />

    <EmotionPopup />
    <ChangeBetPopup />
    <Header />
<!--    <GameEventDebugger v-if="showDebugger" />-->
    <CardsManager ref="cardsManagerRef" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import CardsManager from './CardsManager.vue';
import HandController from '@/in-game/controllers/HandController.ts';
import TableController from '@/in-game/controllers/TableController.ts';
import DeckController from '@/in-game/controllers/DeckController.ts';
import DraftController from '@/in-game/controllers/DraftController.ts';
import { CardsManagerRef } from './CardsManagerRef.ts';
import GameEndPopup from '@/in-game/components/popups/GameEndPopup.vue';
import DurakPopup from '@/in-game/components/popups/DurakPopup.vue';
import WinnerPopup from '@/in-game/components/popups/WinnerPopup.vue';
import KickPopup from '@/in-game/components/popups/KickPopup.vue';
import TryLeavePopup from '@/in-game/components/popups/TryLeavePopup.vue';
import ReconnectPopup from '@/in-game/components/popups/ReconnectPopup.vue';
import EmotionPopup from '@/in-game/components/popups/EmotionPopup.vue';
import ChangeBetPopup from '@/in-game/components/popups/ChangeBetPopup.vue';
import OfferToChangeBetPopup from "@/in-game/components/popups/OfferToChangeBetPopup.vue";

// import GameEventDebugger from '../../debug/GameEventDebugger.vue';
import { EventService, EventType } from "../network/EventService.ts";

const cardsManagerRef = ref<InstanceType<typeof CardsManager> | null>(null);
// const showDebugger = ref(false);

let handController: HandController | null = null;
let tableController: TableController | null = null;
let deckController: DeckController | null = null;
let draftController: DraftController | null = null;

onMounted(() => {

  console.log("Game.vue: onMounted");

  handController = new HandController();
  tableController = new TableController();
  deckController = new DeckController();
  draftController = new DraftController();

  CardsManagerRef.set(cardsManagerRef);

  //EventService.Instance.on(EventType.ShowDebug, onShowDebug);
});

onUnmounted(() => {
  console.log("Game.vue: onUnmounted");
  handController?.destroy();
  handController = null;

  tableController?.destroy();
  tableController = null;

  deckController?.destroy();
  deckController = null;

  draftController?.destroy();
  draftController = null;

  CardsManagerRef.clear();

  // EventService.Instance.off(EventType.ShowDebug, onShowDebug);

  EventService.Instance.clearAllListeners();
});

// function onShowDebug(): void {
//   showDebugger.value = true;
// }
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}
#app {
  height: 100%;
  width: 100%;
}
.game-scene {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, #2D83EC, #1AC9FF);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  position: relative;
}
</style>

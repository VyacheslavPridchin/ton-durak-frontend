<template>
  <div v-if="isVisible" ref="popupRef" class="popup">
    <h3 class="popup-title">Изменение ставки</h3>
    <div class="bet-grid">
      <button
          v-for="bet in bets"
          :key="bet"
          class="bet-button"
          :class="{
          'selected': bet === selectedBet,
          'old-bet': bet === oldBet && bet !== selectedBet
        }"
          @click="selectBet(bet)"
      >
        {{ bet }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, onUnmounted } from "vue";
import { gsap } from 'gsap';
import { EventService, EventType } from "@/game/network/EventService.ts";
import NetworkManager from "@/game/network/NetworkManager.ts";
import { GetBetsRequest } from "@/game/network/RequestPackets.ts";

export default defineComponent({
  name: "StickerPopup",
  setup() {
    const isVisible = ref(false);
    const popupRef = ref<HTMLElement | null>(null);
    let animationTween: gsap.core.Tween | null = null;

    const bets = ref<number[]>([]);
    const selectedBet = ref<number | null>(null);
    const oldBet = ref<number | null>(null);

    const showPopup = () => {
      isVisible.value = true;
      nextTick(() => {
        if (animationTween) animationTween.kill();
        animationTween = gsap.to(popupRef.value, {
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      });
    };

    const hidePopup = () => {
      if (animationTween) animationTween.kill();
      animationTween = gsap.to(popupRef.value, {
        y: "90%",
        duration: 0.5,
        ease: "back.in(1.7)",
        onComplete: () => {
          isVisible.value = false;
        }
      });
    };

    const selectBet = (bet: number) => {
      if (selectedBet.value !== null) {
        oldBet.value = selectedBet.value;
      }
      selectedBet.value = bet;
      EventService.Instance.emit(EventType.BetSelected, bet);
    };

    const onBetsReceived = (newBets: number[]) => {
      bets.value = newBets;
    };

    const onBidSet = (bet: number) => {
      oldBet.value = bet;
      // установить текущий, если ещё не выбран
      if (selectedBet.value == null) {
        selectedBet.value = bet;
      }
    };

    onMounted(() => {
      EventService.Instance.on(EventType.GameEnded, showPopup);
      EventService.Instance.on(EventType.GameStarted, hidePopup);

      EventService.Instance.on(EventType.BetsReceived, onBetsReceived);
      EventService.Instance.on(EventType.BidSet, onBidSet);
      NetworkManager.send(new GetBetsRequest());

      nextTick(() => {
        if (popupRef.value) {
          gsap.set(popupRef.value, { y: "90%" });
        }
      });
    });

    onUnmounted(() => {
      EventService.Instance.off(EventType.GameEnded, showPopup);
      EventService.Instance.off(EventType.GameStarted, hidePopup);
      EventService.Instance.off(EventType.BetsReceived, onBetsReceived);
      EventService.Instance.off(EventType.BidSet, onBidSet);
    });

    return {
      isVisible,
      popupRef,
      bets,
      selectedBet,
      oldBet,
      selectBet
    };
  }
});
</script>

<style scoped>
.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 5000;
  transform: translateY(100%);
  will-change: transform;
}

.popup-title {
  margin: 0 0 10px;
  text-align: center;
  font-size: 1.2rem;
}

.bet-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.bet-button {
  padding: 12px 0;
  font-size: 1rem;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #f5f5f5;
  cursor: pointer;
  transition: transform 0.1s;
}

.bet-button:hover {
  transform: scale(1.05);
}

.bet-button.selected {
  border-color: #2D83EC;
  background: #e6f0ff;
}

.bet-button.old-bet {
  border-color: #999;
}
</style>
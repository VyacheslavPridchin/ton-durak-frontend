<template>
  <div class="footer">
    <MyPlayerController />
    <button
        v-if="availableAction"
        @click="handleAction"
        class="action-button"
    >
      {{ availableActionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { EventService, EventType } from '../../../network/EventService';
import NetworkManager from '../../../network/NetworkManager';
import {ChangeBetRequest, ChangeStateRequest} from '../../../network/RequestPackets';
import MyPlayerController from './MyPlayerController.vue';
import { Localizator } from "../../../utils/Localizator.ts";

const availableActionText = ref<string>('');
const availableAction = ref<string>('');
const isAnimating = ref<boolean>(false);
let animationTween: gsap.core.Tween | null = null;
let lastEndGame: number = 0;
let lastBid: number;
let newBid: number | null = null;

function handleUpdateAvailableState(action: string) {
  availableAction.value = action;
  availableActionText.value = capitalizeFirstLetter(Localizator.GetLocalization(`${action}_button`));
}

function handleSetTimeoutPercent(percent: number) {
  if (percent < 0.5 && percent > 0 || availableAction.value == "ready") {
    if (!isAnimating.value) {

      if(isAnimating.value == false) {
        startButtonAnimation();
        isAnimating.value = true;
      }
    }
  } else {
    stopButtonAnimation();
  }
}

function startButtonAnimation() {
  if (animationTween) return;
  const button = document.querySelector('.action-button');
  if (button) {
    animationTween = gsap.fromTo(button,
        { background: 'linear-gradient(90deg, #0056b3, #338bff))' }, // Исходный градиент
        {
          background: 'linear-gradient(90deg, #77B9FF, #A5D9FF)',
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        }
    );
  }
}

function stopButtonAnimation() {
  isAnimating.value = false;

  if (animationTween) {
    animationTween.kill();
    animationTween = null;

    const button = document.querySelector('.action-button');
    if (button) {
      gsap.to(button, {
        duration: 0.5,
        background: 'linear-gradient(90deg, #007bff, #66bfff)',
        ease: 'power1.out'
      });
    }
  }
}

function handleGameEnded() {
  lastEndGame = Date.now();
  newBid = null;
}

function handleBidSet(value: number) {
  lastBid = value;
}

function handleNewBidSet(value: number) {
  newBid = value;
}

onMounted(() => {
  EventService.Instance.on(EventType.UpdateAvailableState, handleUpdateAvailableState);
  EventService.Instance.on(EventType.SetTimeoutPercent, handleSetTimeoutPercent);
  EventService.Instance.on(EventType.GameEnded, handleGameEnded);
  EventService.Instance.on(EventType.BidSet, handleBidSet);
  EventService.Instance.on(EventType.BetSelected, handleNewBidSet);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.UpdateAvailableState, handleUpdateAvailableState);
  EventService.Instance.off(EventType.SetTimeoutPercent, handleSetTimeoutPercent);
  EventService.Instance.off(EventType.GameEnded, handleGameEnded);
  EventService.Instance.off(EventType.BidSet, handleBidSet);
  EventService.Instance.off(EventType.BetSelected, handleNewBidSet);

  stopButtonAnimation();
});

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const handleAction = () => {
  if (!availableAction.value) return;

  EventService.Instance.emit(EventType.SetMyState, availableAction.value);
  EventService.Instance.emit(EventType.HideMyTimer, undefined);

  const timeSinceLastEnd = Date.now() - lastEndGame;
  const delay = Math.max(600 - timeSinceLastEnd, 0);

  const sendRequest = () => {
    const request = new ChangeStateRequest(availableAction.value);
    NetworkManager.send(request);
  };

  if (availableAction.value === "ready") {

    if(newBid != null && newBid != lastBid) {
      NetworkManager.send(new ChangeBetRequest(newBid));
    }

    if (delay > 0) {
      const sendReadyRequest = () => {
        const request = new ChangeStateRequest("ready");
        NetworkManager.send(request);
      };
      setTimeout(sendReadyRequest, delay);
    } else {
      sendRequest();
    }
  } else
  {
    sendRequest();
  }

  availableAction.value = '';
};

</script>

<style scoped>
.footer {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 9vh;
  background: #ffffff;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px 20px 0 0;
  z-index: 5001;
}

.action-button {
  position: absolute;
  left: 20px;
  width: calc(50% - 70px); /* Половина ширины с учетом отступа */
  padding: 8px 20px;
  background: linear-gradient(90deg, #007bff, #66bfff);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 5002;
}

.action-button:hover {
  background: linear-gradient(90deg, #0056b3, #338bff);
  transition: background 0.1s ease-in-out;
}

.action-button:active {
  background: linear-gradient(to right, #1A5FA0, #1392CC);
  transition: background 0.1s ease-in-out;
}
</style>

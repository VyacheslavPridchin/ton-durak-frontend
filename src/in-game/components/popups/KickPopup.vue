<template>
    <div v-if="isVisible" class="popup-overlay" ref="popupContainer">
      <div class="popup">
        <div class="popup-header">
          <img :src="reason === 'balance' ? cachedBalanceIcon : cachedTimerIcon" :alt="iconAlt" class="popup-icon" />
          <h2 class="popup-title">Больше нельзя играть!</h2>
        </div>
        <p class="popup-subtitle">{{ subtitle }}</p>
        <button class="continue-button" @click="exit">Выйти</button>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { gsap } from 'gsap';
import { EventService, EventType } from '../../network/EventService.ts';
import NetworkManager from '../../network/NetworkManager.ts';
import { ImageCache } from '../../utils/ImageCache.ts';
import {useRouter} from "vue-router";

const isVisible = ref(false);
const popupContainer = ref<HTMLElement | null>(null);
const subtitle = ref('');
const reason = ref('');
const router = useRouter();

const iconAlt = computed(() => reason.value === 'balance' ? 'Balance Icon' : 'Timer Icon');

const cachedBalanceIcon = ref<string | null>(null);
const cachedTimerIcon = ref<string | null>(null);

async function loadIcons() {
  try {
    const imageBalancePath = "/assets/icons/balance-icon.svg";
    const imageTimerPath = "/assets/icons/timer-icon.svg";

    const imgBalance = await ImageCache.getImage(imageBalancePath);
    const imgTimer = await ImageCache.getImage(imageTimerPath);
    if (imgBalance && imgTimer) {
      cachedBalanceIcon.value = imgBalance.src;
      cachedTimerIcon.value = imgTimer.src;
    }
    else {
      console.error(`Не удалось загрузить изображение: ${imgBalance}, ${imgTimer}`);
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
  }
}

async function showPopup(eventReason: string) {
    reason.value = eventReason;
    subtitle.value = eventReason === 'balance' ? 'Баланс на нуле' : 'Время вышло';
    isVisible.value = true;
    await nextTick();
    if (popupContainer.value) {
        gsap.fromTo(
            popupContainer.value,
            { opacity: 0, backdropFilter: 'blur(0px)' },
            { opacity: 1, backdropFilter: 'blur(8px)', duration: 0.4, ease: 'power2.out' }
        );
    }
}

function hidePopup() {
    if (popupContainer.value) {
        gsap.to(popupContainer.value, {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                isVisible.value = false;
            },
        });
    } else {
        isVisible.value = false;
    }
}

function exit() {
    console.log("Exit");
    NetworkManager.CloseGame(router);
}

function onKickEvent(eventReason: string) {
    NetworkManager.reconnectionRequired = false;

    if(!NetworkManager.surrendered)
      showPopup(eventReason);
}

onMounted(() => {
    loadIcons();
    EventService.Instance.on(EventType.Kick, onKickEvent);
});

onUnmounted(() => {
    EventService.Instance.off(EventType.Kick, onKickEvent);
});
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    z-index: 99999;
}

.popup {
    background: white;
    padding: 24px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 340px;
}

.popup-header {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.popup-icon {
    width: 44px;
    height: 44px;
    margin-bottom: 12px;
}

.popup-title {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    color: #000;
}

.popup-subtitle {
    color: #000;
    font-size: 16px;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0px 0px 16px;
}

.continue-button {
    background: linear-gradient(to right, #2D83EC, #1AC9FF);
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 10px;
    font-size: 18px;
    font-weight: 200;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
}

.continue-button:hover {
  background: linear-gradient(90deg, #0056b3, #338bff);
  transition: background 0.1s ease-in-out;
}

.continue-button:active {
  background: linear-gradient(to right, #1A5FA0, #1392CC);
  transition: background 0.1s ease-in-out;
}
</style>

<template>
  <div v-if="isVisible" class="popup-overlay" ref="popupContainer">
    <div class="popup">
      <div class="popup-header">
        <img :src="cachedDurakIcon" alt="Exit Icon" class="popup-icon" />
        <h2 class="popup-title">Изменить ставку?</h2>
      </div>
      <p class="popup-subtitle">Оппонент предложил изменить ставку на {{bid}}</p>
      <button class="continue-button" @click="acceptBetRequest">Играть на {{bid}}</button>
      <button class="leave-button" @click="declineBetRequest">Не менять ставку</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { EventService, EventType } from '@/game/network/EventService.ts';
import { AcceptBetRequest, DeclineBetRequest } from "@/game/network/RequestPackets.ts";
import NetworkManager from '@/game/network/NetworkManager';
import {ImageCache} from "@/game/utils/ImageCache.ts";

const isVisible = ref(false);
const popupContainer = ref<HTMLElement | null>(null);
const bid = ref<number>(0);
const cachedDurakIcon = ref<string | null>(null);

async function loadIcon() {
  try {
    const imagePath = "/assets/icons/durak-icon.svg";
    const img = await ImageCache.getImage(imagePath);
    if (img) {
      cachedDurakIcon.value = img.src;
    } else {
      console.error(`Не удалось загрузить изображение: ${imagePath}`);
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
  }
}
async function showPopup() {
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

function acceptBetRequest() {
  NetworkManager.send(new AcceptBetRequest(bid.value))
  hidePopup();
}

function declineBetRequest() {
  NetworkManager.send(new DeclineBetRequest(bid.value))
  hidePopup();
}

function showOffer(value: number) {
  bid.value = value;
  showPopup();
}

onMounted(() => {
  loadIcon();
  EventService.Instance.on(EventType.ShowOfferToChangeBetPopup, showOffer);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.ShowOfferToChangeBetPopup, showOffer);
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
  z-index: 999999;
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
  margin-bottom: 12px;
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

.leave-button {
  background: #E3E0E0;
  color: #818181;
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

.leave-button:hover {
  background: #818181;
  color: #656565;
}

.leave-button:active {
  background: #6A6A6A;
  color: #4F4F4F;
  transition: background 0.1s ease-in-out, color 0.1s ease-in-out;
}

</style>

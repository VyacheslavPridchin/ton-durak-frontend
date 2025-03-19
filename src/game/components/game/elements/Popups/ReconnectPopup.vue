<template>
  <div v-if="isVisible" class="popup-overlay" ref="popupContainer">
    <header class="header">
      <button class="circle-button" @click="handleButtonClick">
        <img src='/assets/icons/exit-icon.svg' alt="Action Icon" class="icon" />
      </button>
    </header>
    <div class="popup-header">
      <img :src="cachedReconnectionIcon" alt="Reconnect Icon" class="popup-icon" />
      <h2 class="popup-title">Переподключение</h2>
    </div>
    <p class="popup-subtitle">Пожалуйста, подождите...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { EventService, EventType } from '../../../../network/EventService';
import NetworkManager from '../../../../network/NetworkManager';
import { useRouter } from 'vue-router';
import { ImageCache } from '../../../../utils/ImageCache.ts';

const isVisible = ref(false);
const popupContainer = ref<HTMLElement | null>(null);
const router = useRouter();
const cachedReconnectionIcon = ref<string | null>(null);

// Таймер ожидания открытия
let showTimeout: ReturnType<typeof setTimeout> | null = null;

function handleButtonClick() {
  NetworkManager.CloseGame(router, true);
}

async function loadIcon() {
  try {
    const imagePath = '/assets/icons/reconnect-animated-icon.svg';
    const img = await ImageCache.getImage(imagePath);
    if (img) {
      cachedReconnectionIcon.value = img.src;
    } else {
      console.error(`Не удалось загрузить изображение: ${imagePath}`);
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
  }
}

async function showPopup() {
  if (isVisible.value) return;
  isVisible.value = true;
  await nextTick();
  if (popupContainer.value) {
    gsap.to(popupContainer.value, {
      opacity: 1,
      backdropFilter: 'blur(8px)',
      duration: 0.4,
      ease: 'power2.out'
    });
  }
}

function hidePopup() {
  if (!isVisible.value) return;
  if (popupContainer.value) {
    gsap.to(popupContainer.value, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        isVisible.value = false;
      }
    });
  } else {
    isVisible.value = false;
  }
}

function handleReconnectEvent(show: boolean) {
  if (show) {
    // Если уже видим или таймер уже запущен, ничего не делаем
    if (isVisible.value || showTimeout !== null) return;
    showTimeout = setTimeout(() => {
      showPopup();
      showTimeout = null;
    }, 3000);
  } else {
    // Если получаем событие закрытия — отменяем таймер (если есть) и скрываем попап
    if (showTimeout !== null) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }
    hidePopup();
  }
}

onMounted(() => {
  loadIcon();
  EventService.Instance.on(EventType.Reconnect, handleReconnectEvent);
});

onUnmounted(() => {
  if (showTimeout !== null) {
    clearTimeout(showTimeout);
  }
  EventService.Instance.off(EventType.Reconnect, handleReconnectEvent);
});
</script>


<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  z-index: 99999;
  opacity: 0; /* начальное значение для анимации */
}

.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
}

.popup-icon {
  width: 160px;
  height: 160px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.popup-title {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.popup-subtitle {
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 0;
  margin-top: 4px;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  background-color: #68B1F3;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.circle-button:hover {
  background-color: #81C3FF;
  transition: background-color 0.1s ease-in-out;
}

.circle-button:active {
  background-color: #94CCFF;
  transition: background-color 0.1s ease-in-out;
}

.circle-button .icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  background: transparent;
  box-sizing: border-box;
}
</style>

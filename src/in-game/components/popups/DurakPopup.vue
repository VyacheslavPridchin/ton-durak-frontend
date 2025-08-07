<template>
  <div v-if="isVisible" class="popup-overlay" ref="popupContainer" @click="hidePopup">
    <div class="popup-content">
      <img :src="cachedDurakIcon" alt="Durak Icon" class="popup-icon" />
      <h2 class="popup-title">Дурак!</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { EventService, EventType } from '../../network/EventService.ts';
import { ImageCache } from '../../utils/ImageCache.ts';

const isVisible = ref(false);
const popupContainer = ref<HTMLElement | null>(null);
const cachedDurakIcon = ref<string | null>(null);

async function loadIcon() {
  try {
    const imagePath = '/assets/icons/durak-icon.svg';
    const img = await ImageCache.getImage(imagePath);
    if (img) cachedDurakIcon.value = img.src;
    else console.error(`Не удалось загрузить изображение: ${imagePath}`);
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
  }
}

async function showPopup() {
  isVisible.value = true;
  await nextTick();
  if (popupContainer.value) {
    gsap.fromTo(
        popupContainer.value.querySelector('.popup-icon'),
        { scale: 0.4, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
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
      onComplete: () => { isVisible.value = false; }
    });
  } else {
    isVisible.value = false;
  }
}

onMounted(() => {
  loadIcon();
  EventService.Instance.on(EventType.DurakDeclared, showPopup);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.DurakDeclared, showPopup);
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
  z-index: 99999;
  opacity: 0;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
</style>

<template>
  <div v-if="isVisible" class="popup-overlay" @click="hidePopup">
    <div class="popup-content" ref="popupContainer">
      <div class="fire-container" v-if="streak > 3">
        <img :src="cachedFireIcon" alt="Fire Icon" class="fire-icon" />
        <span class="fire-count">x{{ streak }}</span>
      </div>
      <div class="trophy-container">
        <img :src="cachedTrophyIcon" alt="Trophy Icon" class="popup-icon" />
        <span class="win-amount">
          ${{ amount }}
        </span>
      </div>
      <h2 class="popup-title">ТЫ ПОБЕДИЛ</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { EventService, EventType } from '../../network/EventService.ts';
import { ImageCache } from '../../utils/ImageCache.ts';

const isVisible = ref(false);
const amount = ref(0);
const streak = ref(0);
const popupContainer = ref<HTMLElement | null>(null);
const cachedTrophyIcon = ref<string | null>(null);
const cachedFireIcon = ref<string | null>(null);

async function loadIcons() {
  try {
    const trophyImg = await ImageCache.getImage('/assets/icons/throphy-icon.svg');
    if (trophyImg) cachedTrophyIcon.value = trophyImg.src;
    const fireImg = await ImageCache.getImage('/assets/icons/fire-icon.svg');
    if (fireImg) cachedFireIcon.value = fireImg.src;
  } catch (err) {
    console.error('Ошибка загрузки иконок:', err);
  }
}

async function showPopup(
    // data: { amount: number; streak: number }
) {
  // amount.value = data.amount;
  // streak.value = data.streak;
  isVisible.value = true;
  await nextTick();
  if (popupContainer.value) {
    // animate trophy
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
  loadIcons();
  EventService.Instance.on(EventType.WinnerDeclared, showPopup);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.WinnerDeclared, showPopup);
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
  position: relative;
}

.fire-container {
  position: absolute;
  top: -40px;
  display: flex;
  align-items: center;
}

.fire-icon {
  width: 48px;
  height: 48px;
}

.fire-count {
  font-size: 20px;
  font-weight: 700;
  color: #1776AC;
  margin-left: 4px;
}

.trophy-container {
  position: relative;
}

.popup-icon {
  width: 160px;
  height: 160px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
}

.win-amount {
  position: absolute;
  bottom: 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1776AC;
}

.popup-title {
  margin-top: 24px;
  font-size: 34px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>

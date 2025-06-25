<template>
  <div class="panel referral-panel">
    <div class="content">
      <!-- Info button -->
      <button class="top-right-button" @click.stop="openInformationPopup">
        <img class="icon" src="@/assets/icons/info-icon.svg" alt="Info" />
      </button>

      <!-- Title -->
      <h2 class="referral-title">Бесплатные игры</h2>

      <!-- Games left / total -->
      <div
          class="referral-balance placeholder-container"
          :class="{ isLoading: isLoadingData }"
      >
        {{ gamesLeft }}/{{ gamesTotal }}
        <img class="icon" src="@/assets/icons/energy-icon.svg" alt="Info" />
      </div>

      <!-- Timer for current restore -->
      <div v-if="gamesLeft < gamesTotal" class="bonus-balance-container">
        <div
            class="bonus-amount placeholder-container"
            :class="{ isLoading: isLoadingData }"
        >
          <span class="bonus-label">+1</span>
          <img class="icon" style="margin-right: 0.4vh" src="@/assets/icons/energy-icon.svg" alt="Energy" />
          <span class="bonus-timer">через {{ timerText }}</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="progress-bar-container">
        <div
            v-for="(pct, idx) in segments"
            :key="idx"
            class="progress-bar-wrapper"
        >
          <div
              class="progress-bar"
              :style="{
              width: pct + '%',
              transitionDelay: (idx * 0.3) + 's'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { events } from '@/events.ts';

const props = defineProps<{
  gamesLeft: number;
  gamesTotal: number;
  restoreEnd: number;
}>();

const isLoadingData = ref(false);
function hideData() {
  isLoadingData.value = true;
}
function showData() {
  isLoadingData.value = false;
}

const now = ref(Date.now());
let timerId: number;
onMounted(() => {
  timerId = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
onUnmounted(() => {
  clearInterval(timerId);
});

const SEGMENT_MS = 15 * 60 * 1000;
const totalRemainingMs = computed(() => props.restoreEnd - now.value);
const currentSegmentRemainingMs = computed(() => {
  if (props.gamesLeft >= props.gamesTotal) return 0;
  const rem = totalRemainingMs.value % SEGMENT_MS;
  return rem > 0 ? rem : 0;
});

const timerText = computed(() => {
  if (props.gamesLeft >= props.gamesTotal) {
    return '0:00';
  }
  const s = Math.ceil(currentSegmentRemainingMs.value / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
});

const segments = computed<number[]>(() => {
  const out: number[] = [];
  for (let i = 0; i < props.gamesTotal; i++) {
    if (i < props.gamesLeft) {
      out.push(100);
    } else if (i === props.gamesLeft) {
      const filled = ((SEGMENT_MS - currentSegmentRemainingMs.value) / SEGMENT_MS) * 100;
      out.push(Math.max(0, Math.min(100, filled)));
    } else {
      out.push(0);
    }
  }
  return out;
});

function openInformationPopup() {
  events.emit('showPopup', { name: 'freeGame' });
}

defineExpose({ showData, hideData });
</script>

<style scoped>
.referral-panel {
  margin-top: auto;
  position: relative;
  overflow: clip;
}

.content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.top-right-button {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: auto;
  border: none;
}
.top-right-button .icon {
  height: 65%;
  display: block;
}

.referral-title {
  text-align: left;
  padding-bottom: 0.5vh;
}

.referral-balance {
  font-size: 3.5vh;
  font-weight: 600;
  text-align: left;
  display: inline-flex;
  align-items: center;
}

.referral-balance .icon {
  margin-left: 0.5vh;
  width: 3vh;
  height: 3vh;
}

.bonus-balance-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 2vh;
}

.bonus-amount {
  display: flex;
  align-items: center;
  font-size: 1.75vh;
}

.bonus-label {
  color: var(--secondary-text-color);
}

.bonus-amount .icon {
  width: 1.75vh;
  height: 1.75vh;
}

.bonus-timer {
  color: var(--secondary-text-color);
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  gap: 0.5vh;
  margin-top: 1.2vh;
}
.progress-bar-wrapper {
  flex: 1;
  height: 0.8vh;
  border-radius: 0.4vh;
  background-color: var(--gray-color);
  overflow: hidden;
  position: relative;
}
.progress-bar {
  height: 100%;
  border-radius: 0.4vh;
  background-color: #2D83EC;
  transition: width 0.3s ease-in-out;
}
</style>
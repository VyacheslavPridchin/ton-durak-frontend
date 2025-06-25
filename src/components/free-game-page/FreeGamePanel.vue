<template>
  <div class="panel referral-panel">
    <div class="block-background animate-press"></div>
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
        <h2 class="bonus-title">
          +1
          <img class="icon" src="@/assets/icons/energy-icon.svg" alt="Energy" />
        </h2>
        <div
            class="bonus-amount placeholder-container"
            :class="{ isLoading: isLoadingData }"
        >
          {{ timerText }}
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

// --- props ---
const props = defineProps<{
  gamesLeft: number;
  gamesTotal: number;
  /** Unix‐ms timestamp when *all* games will be fully restored */
  restoreEnd: number;
}>();

// --- placeholder state & API ---
const isLoadingData = ref(false);
function hideData() {
  isLoadingData.value = true;
}
function showData() {
  isLoadingData.value = false;
}

// --- live clock ---
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

// --- constants & helpers ---
const SEGMENT_MS = 15 * 60 * 1000; // 15 minutes

/** ms remaining until *all* restored */
const totalRemainingMs = computed(() => props.restoreEnd - now.value);

/** ms remaining in the *current* segment */
const currentSegmentRemainingMs = computed(() => {
  if (props.gamesLeft >= props.gamesTotal) return 0;
  const rem = totalRemainingMs.value % SEGMENT_MS;
  return rem > 0 ? rem : 0;
});

/** formatted "MM:SS" for the current segment */
const timerText = computed(() => {
  if (props.gamesLeft >= props.gamesTotal) {
    return '0:00';
  }
  const s = Math.ceil(currentSegmentRemainingMs.value / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
});

/** array of fill‐percentages for each of the `gamesTotal` segments */
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
  console.log(out)
  return out;
});

// --- popup emitter ---
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

/* Background block (for click animation) */
.block-background {
  position: absolute;
  inset: -1vh -2vh;
  background: var(--panel-color);
  z-index: 0;
}

/* Foreground content */
.content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

/* Info icon button */
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

/* Titles and balances */
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
  margin-left: 0.5vh;     /* отступ между текстом и иконкой */
  width: 3vh;             /* размер иконки совпадает с высотой текста */
  height: 3vh;
}

.bonus-balance-container {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  margin-top: 2vh;
}
.bonus-title {
  display: inline-flex;
  align-items: center;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.bonus-title .icon {
  margin-left: 0.5vh;
  width: 1.75vh;
  height: 1.75vh;
}

.bonus-amount {
  margin-left: auto;
  font-size: 1.75vh;
}

/* Progress bar styling */
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

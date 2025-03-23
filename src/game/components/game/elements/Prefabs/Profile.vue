<template>
  <div class="profile">
    <!-- Таймерный круг -->
    <div class="timer">
      <div class="timer-fill" ref="timerFill"></div>
    </div>

    <!-- Белая прослойка -->
    <div class="profile-overlay"></div>

    <!-- Изображение профиля с заглушкой -->
    <img
        :class="{ hidden: isImageLoaded }"
        :src="placeholder"
        alt="Default Profile"
        class="placeholder-image"
    />
    <img
        :class="{ loaded: isImageLoaded }"
        :src="profileImage"
        alt="Profile"
        class="profile-image"
        @load="onImageLoad"
    />

    <!-- Родительский контейнер для статуса -->
    <div class="status-container">
      <div class="status" v-if="status" :style="statusStyle">{{ visibleStatus }}</div>
    </div>

    <!-- Иконка дурака -->
    <img
        v-if="isDurak"
        ref="durakIconRef"
        :src="durakIcon"
        alt="Durak Icon"
        class="durak-icon"
    />

    <div v-if="showSticker" ref="stickerRef" class="sticker-container">
      <lottie-player
          ref="stickerRef"
          :src="stickerSrc"
          background="transparent"
          speed="1"
          class="sticker"
          direction="1"
          mode="normal"
          loop
          autoplay
      ></lottie-player>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, watch, computed, nextTick, onUnmounted, shallowRef} from 'vue';
import { ImageCache } from '../../../../utils/ImageCache.ts';
import { EventService, EventType } from '../../../../network/EventService';
import { Localizator } from "../../../../utils/Localizator.ts";
import { gsap } from 'gsap';
import '@/lottie-player';

const props = defineProps<{
  id: string;
  profileImage: string;
  status: string;
  endTime: number;
  isDurak: boolean;
  isMe: boolean;
}>();

const stickerOffsets: Record<string, string> = {
  "hah_out": "-1px",
  "loving": "-8px",
  "thinking": "0px",
  "crying": "-3px",
  "exploding": "0px",
  "waving": "-5px"
};

const remainingTime = ref(0);
const timerFill = ref<HTMLElement | null>(null);
const isImageLoaded = ref(false);
const placeholder = ref('/assets/icons/default-profile-picture.svg');
const durakIcon = ref<string>("");
const durakIconRef = ref<HTMLElement | null>(null);
const stickerRef = ref<HTMLElement | null>(null);
const visibleStatus = ref<string | null>(null);
const showSticker = ref(false);
const stickerLeftOffset = ref("0px");
const stickerSrc = ref<string>();
let interval: number | null = null;

watch(() => props.isDurak, async (newVal) => {
  await nextTick();
  if (newVal && durakIconRef.value) {
    gsap.fromTo(durakIconRef.value, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
  } else if (!newVal && durakIconRef.value) {
    gsap.to(durakIconRef.value, { opacity: 0, scale: 0.5, duration: 0.2, ease: 'power2.in' });
  }
});

watch(() => props.profileImage, () => {
  isImageLoaded.value = false;
  loadImage();
});

watch(() => props.status, (status) => {
  visibleStatus.value = Localizator.GetLocalization(status);
});

watch(() => props.endTime, (newEndTime) => {
  const now = Date.now() / 1000;
  remainingTime.value = Math.max(0, newEndTime - now);
  updateTimerFill();
});

const onImageLoad = () => {
  isImageLoaded.value = true;
};

const loadPlaceholder = async () => {
  const cachedImg = await ImageCache.getImage('/assets/icons/default-profile-picture.svg');
  if (cachedImg) {
    placeholder.value = cachedImg.src;
  }
};

const loadDurakIcon = async () => {
  const cachedImg = await ImageCache.getImage('/assets/icons/durak-player-icon.svg');
  if (cachedImg) {
    durakIcon.value = cachedImg.src;
  }
};

const loadImage = () => {
  const img = new Image();
  img.src = props.profileImage;
  img.onload = () => {
    isImageLoaded.value = true;
  };
};

const statusColors: Record<string, string> = {
  attack: '#CB0D07',
  defend: '#009D10',
  default: '#0098EA'
};

const timerColors: Record<string, string> = {
  attack: '#EE3434',
  defend: '#97EE34',
  default: '#97EE34'
};

const statusStyle = computed(() => ({
  color: statusColors[props.status] || statusColors.default,
  borderColor: statusColors[props.status] || statusColors.default
}));

const updateTimerFill = () => {
  if (timerFill.value) {
    const timerColor = timerColors[props.status] || timerColors.default;
    if (props.endTime > 0 && remainingTime.value > 0) {
      const now = Date.now() / 1000;
      const elapsedTime = props.endTime - now;
      const normalizedTime = Math.min(1, Math.max(0, elapsedTime / remainingTime.value));
      if(props.isMe) EventService.Instance.emit(EventType.SetTimeoutPercent, normalizedTime);
      const angle = (1 - normalizedTime) * 360;
      timerFill.value.style.background = `conic-gradient(#e6e6e6 ${angle}deg, ${timerColor} ${angle}deg)`;
    } else {
      timerFill.value.style.background = `conic-gradient(#e6e6e6 360deg, ${timerColor} 360deg)`;
    }
  }
};

const startTimer = () => {
  interval = setInterval(updateTimerFill, 100);
};

onBeforeUnmount(() => {
  if (interval !== null) {
    clearInterval(interval);
  }
});

onMounted(async () => {
  EventService.Instance.on(EventType.ShowEmote, onShowEmote);

  startTimer();
  await loadPlaceholder();
  await loadDurakIcon();
  loadImage();
});

onUnmounted(() => {
  EventService.Instance.off(EventType.ShowEmote, onShowEmote);
});

const onShowEmote = async ({ playerId, emote }: { playerId: string, emote: string }) => {
  if (playerId !== props.id) return;
  try {

    stickerSrc.value = `/assets/emotions/${emote}.json`;
    showSticker.value = true;
    stickerLeftOffset.value = `calc(50% + ${stickerOffsets[emote] || "0px"})`;

    await nextTick();
    const stickerEl = stickerRef.value;
    if (stickerEl) {
      gsap.fromTo(stickerEl,
          { scale: 0, opacity: 1 },
          { scale: 1, duration: 1, ease: "elastic.out" }
      );
    }

    setTimeout(() => {
      if (stickerEl) {
        gsap.to(stickerEl, { opacity: 0, scale: 0, duration: 0.4, ease: "power2.inOut", onComplete: () => showSticker.value = false });
      }
    }, 3000);
  } catch (error) {
    console.error(`Sticker ${emote} not found`, error);
  }
};

</script>

<style scoped>
.profile {
  width: 9vh; /* Пропорционально высоте экрана */
  height: 9vh;
  border-radius: 50%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: visible;
}

.profile-overlay {
  position: absolute;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: white;
  z-index: 2; /* Прослойка выше таймера, но ниже изображений */
  transform-origin: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.placeholder-image,
.profile-image {
  position: absolute;
  width: 90%;
  height: 90%;
  transform-origin: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  object-fit: cover;
  transition: opacity 0.5s ease;
  z-index: 3;
  opacity: v-bind("props.status === 'winner' ? 0.5 : 1");
}

.placeholder-image {
  opacity: 1;
  visibility: visible;
}

.placeholder-image.hidden {
  opacity: 0;
  visibility: hidden;
}

.profile-image {
  opacity: 0;
  visibility: hidden;
}

.profile-image.loaded {
  opacity: 1;
  visibility: visible;
}

.timer {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
  background: #e6e6e6;
}

.timer-fill {
  position: absolute;
  width: 101%;
  height: 101%;
  border-radius: 50%;
  background: conic-gradient(#97EE34 0deg, #e6e6e6 0deg);
  transform-origin: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.status-container {
  position: absolute;
  top: -0.2vh;
  left: 5vh;
  z-index: 3;
  display: flex;
}

.status {
  background: white;
  border: 0.2vh solid;
  font-size: 1.2vh;
  font-weight: 600;
  border-radius: 5vh;
  padding: 0.2vh 0.8vh;
  white-space: nowrap;
  box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.1);
  text-align: left;
  display: inline-block;
}

.durak-icon {
  position: absolute;
  bottom: -0.4vh;
  right: -0.7vh;
  width: 4.5vh;
  height: 4.5vh;
  transform: rotate(17deg);
  filter: drop-shadow(0 0 0.5vh rgba(0, 0, 0, 0.75));
  z-index: 4;
}

.sticker-container {
  position: absolute;
  top: -2vh;
  left: v-bind(stickerLeftOffset);
  transform: translateX(-50%);
  width: 13vh;
  height: 13vh;
  z-index: 15;
}
</style>
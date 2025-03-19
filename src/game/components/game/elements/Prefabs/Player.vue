<template>
  <div ref="playerRef" class="player">
    <template v-if="status === 'Empty'">
      <div class="empty-interface" :class="{ visible: status === 'Empty' }">
        <img src="/assets/icons/empty-player.svg" alt="Empty Player" class="empty-image" />
      </div>
    </template>
    <template v-else>
      <div class="profile-container" @click="openMuteOverlay">
        <Profile
            :profileImage="profileImage"
            :status="status"
            :endTime="endTime"
            :isDurak="isDurak"
            :id="id"
            :isMe="false"
        />
        <div v-if="showMuteOverlay" class="mute-overlay" @click.stop="toggleMute">
          <img :src="isMuted ? mutePicture : unmutePicture"
               alt="Mute Icon" class="mute-icon" />
        </div>
      </div>
      <div class="player-nickname">
        <div class="nickname-text">{{ nickname }}</div>
      </div>
      <div class="cards-pill">{{ cardsCount }} cards</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, watch, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import Profile from './Profile.vue';
import { MuteRequest, UnmuteRequest } from "../../../../network/RequestPackets.ts";
import NetworkManager from "../../../../network/NetworkManager.ts";
import { ImageCache } from "../../../../utils/ImageCache.ts";

const props = defineProps<{
  id: string;
  nickname: string;
  profileImage: string;
  cardsCount: number;
  status: string;
  endTime: number;
  isDurak: boolean;
}>();

const playerRef = ref<HTMLElement | null>(null);
const isMuted = ref(false);
const showMuteOverlay = ref(false);
let hideOverlayTimeout: number | null = null;
const mutePicture = ref<string>();
const unmutePicture = ref<string>();

const loadImages = async () => {
  const cachedMuteImg = await ImageCache.getImage('/assets/icons/mute-picture.svg');
  if (cachedMuteImg) {
    mutePicture.value = cachedMuteImg.src;
  }

  const cachedUnmuteImg = await ImageCache.getImage('/assets/icons/unmute-picture.svg');
  if (cachedUnmuteImg) {
    unmutePicture.value = cachedUnmuteImg.src;
  }
};

function resetHideOverlayTimer() {
  if (hideOverlayTimeout) {
    clearTimeout(hideOverlayTimeout);
  }
  hideOverlayTimeout = setTimeout(() => {
    showMuteOverlay.value = false;
  }, 3000);
}

function openMuteOverlay() {
  showMuteOverlay.value = true;
  resetHideOverlayTimer();
}

function toggleMute() {
  isMuted.value = !isMuted.value;
  const request = isMuted.value ? new MuteRequest(props.id) : new UnmuteRequest(props.id);
  NetworkManager.send(request);
  resetHideOverlayTimer();
}

function animateScale(newScale: number, duration = 0.5) {
  if (!playerRef.value) return;
  gsap.to(playerRef.value, { scale: newScale, duration, ease: 'power2.out' });
}

const statusScales: Record<string, number> = {
  defend: 1.0,
  take: 1.0,
  winner: 0.825,
  "": 0.825,
  attack: 0.9,
  ready: 0.9,
  default: 0.9,
};

watch(() => props.status, (newStatus) => {
  const scale = statusScales[newStatus] ?? statusScales.default;
  animateScale(scale);
});

onMounted(() => {
  loadImages();
  const scale = statusScales[props.status] ?? statusScales.default;
  animateScale(scale);
});

onUnmounted(() => {
  playerRef.value = null;
  mutePicture.value = null;
  unmutePicture.value = null;
});

defineExpose({
  animateScale
});
</script>

<style scoped>
.player {
  position: relative;
  display: inline-block;
}

.profile-container {
  position: relative;
  cursor: pointer;
}

/* Размер мут-оверлея адаптивен относительно высоты экрана */
.mute-overlay {
  position: absolute;
  left: 0;
  top: 0;
  width: 11vh; /* Пропорционально высоте экрана */
  height: 11vh;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
}

/* Иконка мьюта адаптивна */
.mute-icon {
  width: 2.5vh;
  height: 2.5vh;
}

/* Адаптивная пустая область */
.empty-interface {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.empty-interface.visible {
  opacity: 1;
  visibility: visible;
}

/* Адаптивное изображение в пустом интерфейсе */
.empty-image {
  width: 11vh;
  height: 11vh;
}

/* Никнейм теперь масштабируется */
.player-nickname {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  width: 10vh;
  height: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* Текст никнейма адаптивен */
.nickname-text {
  font-size: 2vh;
  font-weight: 400;
  text-align: center;
  color: #fff;
  white-space: normal;
  word-wrap: break-word;
  line-height: 95%;
}

/* Карточка количества карт теперь адаптивная */
.cards-pill {
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2vh;
  padding: 0.3vh 1.4vh;
  font-size: 1.5vh;
  max-width: 10vh;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>

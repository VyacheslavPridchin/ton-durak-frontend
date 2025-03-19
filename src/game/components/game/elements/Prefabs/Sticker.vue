<template>
  <div class="sticker-container" ref="stickerContainerRef" :style="{ width: `${size}px`, height: `${size}px` }">
    <div ref="loaderRef" class="loader-container">
      <div class="loader"></div>
    </div>
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
</template>

<script setup lang="ts">
import { ref, defineProps, computed, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
import gsap from 'gsap';
import '../../../../../services/lottie-player';

const props = defineProps<{ emote: string; size: number }>();

const activeSticker = shallowRef<boolean>(false);
const stickerRef = shallowRef<InstanceType<any> | null>(null);
const stickerContainerRef = ref<HTMLElement | null>(null);
const loaderRef = ref<HTMLElement | null>(null);

const stickerSrc = computed(  () => `/assets/emotions/${props.emote}.json`);

// const loadAnimation = async () => {
//   console.log(stickerSrc, `/assets/emotions/${props.emote}.json`);
//
//   try {
//     activeSticker.value = false;
//     gsap.to(loaderRef.value, {
//       opacity: 0,
//       duration: 0.5,
//       onComplete: () => {
//         activeSticker.value = true;
//         nextTick(() => {
//           if (stickerContainerRef.value) {
//             gsap.fromTo(stickerContainerRef.value, { opacity: 0 }, { opacity: 1, duration: 0.5 });
//           }
//           play();
//         });
//       }
//     });
//   } catch (error) {
//     console.error(`Failed to load sticker: ${props.emote}`, error);
//   }
// };

const play = () => {
  stickerRef.value?.play();
};
const stop = () => {
  stickerRef.value?.stop();
};
const pause = () => {
  stickerRef.value?.pause();
};

onMounted(() => {
  console.log("Sticker.vue");
  gsap.set(loaderRef.value, { opacity: 1, duration: 0.5 });
  // loadAnimation();
});

onUnmounted(() => {
  console.log("onUnmounted Sticker.vue");
  activeSticker.value = false;
  stickerRef.value?.destroy?.();
  stickerRef.value = null;
  stickerContainerRef.value = null;
  loaderRef.value = null;
  gsap.killTweensOf(loaderRef.value);
  gsap.killTweensOf(stickerContainerRef.value);
});

defineExpose({ play, stop, pause });
</script>

<style scoped>
.sticker-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Loader ниже */
}

.loader {
  width: 50%;
  height: 50%;
  border: 5px solid #ddd;
  border-top-color: #4F4F4F;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.sticker {
  cursor: pointer;
  width: v-bind("props.size");
  height: v-bind("props.size");
  position: relative;
  z-index: 1; /* Sticker выше */
}
</style>
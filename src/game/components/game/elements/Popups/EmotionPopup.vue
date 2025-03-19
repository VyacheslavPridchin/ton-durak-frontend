<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, onUnmounted } from "vue";
import { gsap } from 'gsap';
import { Vue3Lottie } from "vue3-lottie";
import { EventService, EventType } from "../../../../network/EventService.ts";
import { EmoteRequest } from "../../../../network/RequestPackets.ts";
import NetworkManager from "../../../../network/NetworkManager.ts";
import PlayerSettingsStorage from "../../../../network/PlayerSettingsStorage.ts";
import Sticker from "../Prefabs/Sticker.vue";

export default defineComponent({
  name: "StickerPopup",
  components: {Sticker, Vue3Lottie },
  setup() {
    const isVisible = ref<boolean>(false);
    const popupRef = ref<HTMLElement | null>(null);
    const lastEmoteTime = ref<number>(0);
    const cooldownDuration = 5000; // 5 секунд
    let animationTween: gsap.core.Tween | null = null;

    const stickers = [
      'hah_out',
      'loving',
      'thinking',
      'crying',
      'exploding',
      'waving',
    ];

    const stickerRefs = ref<Record<string, any>>({});

    const showPopup = () => {
      const now = Date.now();
      if (now - lastEmoteTime.value < cooldownDuration) return;
      isVisible.value = true;

      nextTick(() => {
        if(animationTween) animationTween.kill();
        animationTween = gsap.to(popupRef.value, {
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            playAnimations(true);

          }
        });
      });
    };


    const hidePopup = () => {
      playAnimations(false);

      if(animationTween) animationTween.kill();
      animationTween = gsap.to(popupRef.value, {
        y: "90%",
        duration: 0.5,
        ease: "back.in(1.7)",
        onComplete: () => {
          isVisible.value = false;
        }
      });
    };

    function playAnimations(play: boolean) {
      Object.values(stickerRefs.value).forEach((sticker) => {
        if (sticker) {
          play ? sticker.play() : sticker.pause();
        }
      });
    }

    function handleEnablePopup(enable: boolean) {
      if (enable)
        showPopup();
      else
        hidePopup();
    }

    function sendEmote(emote: string) {
      const now = Date.now();
      if (now - lastEmoteTime.value < cooldownDuration) return;
      lastEmoteTime.value = now;

      EventService.Instance.emit(EventType.EmotionsCooldown, undefined);
      EventService.Instance.emit(EventType.ShowEmotionsPopup, false);
      EventService.Instance.emit(EventType.ShowEmote, {playerId: PlayerSettingsStorage.playerId, emote: emote});

      const request = new EmoteRequest(emote);
      NetworkManager.send(request);
    }

    onUnmounted(() => {
      EventService.Instance.off(EventType.ShowEmotionsPopup, handleEnablePopup);
    });

    onMounted(() => {
      EventService.Instance.on(EventType.ShowEmotionsPopup, handleEnablePopup);
      playAnimations(false);
      nextTick(() => {
        if (popupRef.value) {
          gsap.set(popupRef.value, { y: "90%" });
        }
      });
    });

    return { isVisible, popupRef, stickers, stickerRefs, sendEmote };
  },
});
</script>

<template>
  <div v-if="isVisible" ref="popupRef" class="popup">
    <div class="sticker-grid">
      <Sticker
          v-for="(emote, index) in stickers"
          :key="index"
          ref="stickerRefs"
          :emote="emote"
          :size="100"
          @click="sendEmote(emote)"
      />
    </div>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 340px;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 5000;
  transform: translateY(100%);
  will-change: transform;
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  place-items: center;
}

.sticker {
  cursor: pointer;
  transition: filter 0.2s;
}

.sticker.active {
  filter: brightness(0.5);
}
</style>

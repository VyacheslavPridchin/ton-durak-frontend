<template>
  <div class="swipe-wrapper"
       :class="{ closing: isClosing }"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd"
       @click="handleClick"
       :style="{ transform: `translate(${swipeOffsetX}px, ${swipeOffsetY}px)` }">
    <div class="panel item">
      <div class="icon-container">
        <img class="icon-img" :src="icon" alt="icon" />
      </div>
      <div class="text-container">
        <h2 class="title">{{ title }}</h2>
        <a class="subtitle">{{ subtitle }}</a>
      </div>
      <div v-if="sticker" class="sticker-container">
        <lottie-player
            :src="stickerSrc"
            speed="1"
            class="sticker"
            direction="1"
            mode="normal"
            loop
            autoplay
        ></lottie-player>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, nextTick } from 'vue'
import DepositIcon from "@/assets/icons/transactions/deposit-icon.svg"
import LossIcon from "@/assets/icons/transactions/loss-icon.svg"
import ReferralIcon from "@/assets/icons/transactions/referral-icon.svg"
import TournamentIcon from "@/assets/icons/transactions/tournament-icon.svg"
import WinIcon from "@/assets/icons/transactions/win-icon.svg"
import WithdrawIcon from "@/assets/icons/transactions/withdraw-icon.svg"
import CopyIcon from "@/assets/icons/copy-icon.svg"
import ProfileIcon from "@/assets/icons/profile-menu-icon.svg"
import "@/lottie-player"

export default defineComponent({
  name: "NotificationItem",
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    sticker: { type: String, required: false, default: "" },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const iconComputed = computed(() => {
      switch (props.icon) {
        case 'withdraw':    return WithdrawIcon
        case 'loss':        return LossIcon
        case 'tournament':  return TournamentIcon
        case 'win':         return WinIcon
        case 'deposit':     return DepositIcon
        case 'referral':    return ReferralIcon
        case 'copy':        return  CopyIcon
        case 'profile':     return ProfileIcon
        default:            return ''
      }
    })

    const swipeOffsetX = ref(0)
    const swipeOffsetY = ref(0)
    const isClosing = ref(false)
    let startX = 0, startY = 0
    let startTime = 0
    const threshold = 50 // минимальное расстояние для свайпа

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startTime = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX
      const currentY = e.touches[0].clientY
      swipeOffsetX.value = currentX - startX
      swipeOffsetY.value = currentY - startY
    }

    const handleTouchEnd = () => {
      const distance = Math.sqrt(swipeOffsetX.value ** 2 + swipeOffsetY.value ** 2)
      if (distance > threshold) {
        const deltaTime = Date.now() - startTime
        const velocityX = swipeOffsetX.value / deltaTime // px/ms
        const velocityY = swipeOffsetY.value / deltaTime // px/ms
        const inertiaDuration = 150 // длительность инерции (мс)
        swipeOffsetX.value += velocityX * inertiaDuration
        swipeOffsetY.value += velocityY * inertiaDuration
        isClosing.value = true
        nextTick(() => {
          emit('close')
        })
      } else {
        swipeOffsetX.value = 0
        swipeOffsetY.value = 0
      }
    }

    const handleClick = () => {
      emit('close')
    }

    const stickerSrc = computed(() => `/assets/stickers/${props.sticker}.json`);

    return {
      icon: iconComputed,
      swipeOffsetX,
      swipeOffsetY,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
      handleClick,
      isClosing,
      stickerSrc,
    }
  }
})
</script>

<style scoped>
.swipe-wrapper {
  transition: transform 0.5s ease-out;
  pointer-events: auto;
}

.swipe-wrapper.closing {
  pointer-events: none;
}

/* Левитация уведомления */
.item {
  display: flex;
  align-items: center;
  padding: 1vh 2vh;
  margin: 0;
  box-shadow: 0 0 0.6vh rgba(0, 0, 0, 0.2);
  animation: levitate 2s ease-in-out infinite;
}

@keyframes levitate {
  0% { transform: translateY(0); }
  50% { transform: translateY(-0.5vh); }
  100% { transform: translateY(0); }
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5vh;
  height: 4.5vh;
  border-radius: 50%;
  background: var(--blue-gradient);
  margin-right: 1vh;
}

.icon-img {
  width: 2vh;
  height: 2vh;
}

.text-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  font-size: 2vh;
  margin: 0;
  width: 65%;
}

.subtitle {
  font-size: 1.5vh;
  color: #8B8B8B;
  margin: 0;
  width: 65%;
}

.sticker-container {
  position: absolute;
  right: -1vh;
  top: -4.5vh;
  width: 13vh;
  height: 13vh;
}

.sticker {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

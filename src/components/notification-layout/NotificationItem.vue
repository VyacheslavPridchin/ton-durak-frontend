<template>
  <div class="popup-container">
    <div class="slide">
      <div class="slide-header">
        <div class="icon-container">
          <img :src="currentSlide.icon" alt="Slide Icon" />
        </div>
        <h2>{{ currentSlide.title }}</h2>
      </div>
      <p class="slide-text">{{ currentSlide.text }}</p>
    </div>
    <button class="main-button animate-press" @click="nextSlide">
      {{ currentSlideIndex === slides.length - 1 ? 'Играть' : 'Продолжить' }}
    </button>
    <div class="indicators">
      <span
          v-for="(slide, index) in slides"
          :key="index"
          class="indicator-dot"
          :class="{ active: index === currentSlideIndex }"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { events } from "@/events.ts";
import ReferralIcon from "@/assets/icons/transactions/referral-icon.svg";
import WinIcon from "@/assets/icons/transactions/win-icon.svg";

export default defineComponent({
  setup() {
    const slides = [
      {
        icon: WinIcon,
        title: "Зарабатывай USDT",
        text: "за каждую победу."
      },
      {
        icon: WinIcon,
        title: "Зарабатывай до $100 каждую неделю",
        text: "за победы в еженедельном турнире"
      },
      {
        icon: ReferralIcon,
        title: "Приглашай друзей",
        text: "и зарабатывай USDT за каждую их игру"
      }
    ];

    const currentSlideIndex = ref(0);
    const currentSlide = computed(() => slides[currentSlideIndex.value]);

    const nextSlide = () => {
      if (currentSlideIndex.value < slides.length - 1) {
        currentSlideIndex.value++;
      } else {
        events.emit("hidePopup");
      }
    };

    return {
      slides,
      currentSlideIndex,
      currentSlide,
      nextSlide
    };
  }
});
</script>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  padding: 0 2vh;
  margin: 0 auto;
  text-align: center;
}

.slide {
  margin-bottom: 2vh;
}

.slide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1vh;
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

.main-button {
  margin: 2vh auto;
  padding: 1vh 2vh;
  cursor: pointer;
}

.indicators {
  display: flex;
  justify-content: center;
  gap: 0.5vh;
}

.indicator-dot {
  width: 1vh;
  height: 1vh;
  border-radius: 50%;
  background: var(--gray-color);
}

.indicator-dot.active {
  background: var(--blue-gradient);
}
</style>

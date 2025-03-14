<template>
  <div class="panel tournament-panel animate-press" @click="onTournamentButtonClick">
    <button class="top-right-button">
      <img class="icon" src="@/assets/icons/next-icon.svg" alt="Button Icon" />
    </button>
    <!-- Заголовок турнира с плейсхолдером -->
    <h2 class="tournament-title placeholder-container" :class="{ isLoading: isLoadingTitle }">
      {{ tournamentTitle }}
    </h2>
    <!-- Место турнира с плейсхолдером -->
    <a class="tournament-place placeholder-container" :class="{ isLoading: isLoadingPlace }">
      {{ tournamentPlace }}
    </a>
    <!-- Таймер с плейсхолдером -->
    <div class="timer-container placeholder-container" :class="{ isLoading: isLoadingTimer }">
      <img class="icon" src="@/assets/icons/timer-icon.svg" alt="Timer Icon" />
      <a class="timer-text">00:00:00</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import router from "@/router";

export default defineComponent({
  name: 'tournamentPanel',
  props: {
    prize: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
    place: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
    timer: {
      type: Number,
      required: true,
    }
  },
  setup(props) {
    const tournamentTitle = computed(() => `Турнир на $${props.prize}`);
    const tournamentPlace = computed(() => `#${props.place}`);

    const onTournamentButtonClick = () => {
      router.push('/tournament');
    };

    // Состояния плейсхолдера для каждого значения – изначально true
    const isLoadingTitle = ref(true);
    const isLoadingPlace = ref(true);
    const isLoadingTimer = ref(true);

    // При монтировании компонента они остаются true (по умолчанию)
    onMounted(() => {
      isLoadingTitle.value = true;
      isLoadingPlace.value = true;
      isLoadingTimer.value = true;
    });

    // Когда данные приходят, обновляем соответствующие состояния
    watch(
        () => props.prize,
        (newVal) => {
          if (newVal) {
            isLoadingTitle.value = false;
          }
        },
        { immediate: true }
    );

    watch(
        () => props.place,
        (newVal) => {
          if (newVal) {
            isLoadingPlace.value = false;
          }
        },
        { immediate: true }
    );

    watch(
        () => props.timer,
        (newVal) => {
          if (newVal) {
            isLoadingTimer.value = false;
          }
        },
        { immediate: true }
    );

    return {
      tournamentTitle,
      tournamentPlace,
      onTournamentButtonClick,
      isLoadingTitle,
      isLoadingPlace,
      isLoadingTimer,
    };
  }
});
</script>

<style scoped>
/* Универсальный плейсхолдер через псевдоэлемент ::after */
.placeholder-container {
  position: relative;
  border-radius: inherit;
}
.placeholder-container.isLoading::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--gray-color, #e0e0e0) 25%, var(--secondary-text-color, #f0f0f0) 50%, var(--gray-color, #e0e0e0) 75%);
  background-size: 200% 100%;
  animation: gradientFlow 1.5s ease-in-out infinite;
  z-index: 1;
}

.tournament-panel {
  position: relative;
}

.tournament-title {
  text-align: left;
  padding-bottom: 0.5vh;
}

.tournament-place {
  font-size: 3.5vh;
  font-weight: 600;
  text-align: left;
}

.timer-text {
  font-size: 1.5vh;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 0.5vh;
  position: absolute;
  bottom: 1.6vh;
  right: 1vh;
  background: var(--gray-color);
  border-radius: 2vh;
  padding: 0.5vh 1vh;
  margin: 0.5vh 1vh;
}

.timer-container img {
  width: 1.5vh;
  height: 1.5vh;
  object-fit: contain;
}

@keyframes gradientFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

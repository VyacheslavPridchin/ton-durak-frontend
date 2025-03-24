<template>
  <div class="panel tournament-panel animate-press" @click="onTournamentButtonClick">
    <button class="top-right-button">
      <img class="icon" src="@/assets/icons/next-icon.svg" alt="Button Icon" />
    </button>
    <!-- Заголовок турнира с плейсхолдером -->
    <h2 class="tournament-title placeholder-container" :class="{ isLoading: isLoadingData }">
      {{ tournamentTitle }}
    </h2>
    <!-- Место турнира с плейсхолдером -->
    <a class="tournament-place placeholder-container" :class="{ isLoading: isLoadingData }">
      {{ tournamentPlace }}
    </a>
    <!-- Таймер с плейсхолдером -->
    <div class="timer-container placeholder-container" :class="{ isLoading: isLoadingData }">
      <img class="icon" src="@/assets/icons/timer-icon.svg" alt="Timer Icon" />
      <a class="timer-text">{{ formattedTime }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted, nextTick } from 'vue';
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
    deadline: {
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

    // Переменная для плейсхолдера текстовых данных – изначально true
    const isLoadingData = ref(false);
    const formattedTime = ref('00:00:00');
    let timerInterval: number | null = null;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = props.deadline - now;
      if (timeLeft <= 0) {
        formattedTime.value = '00:00:00';
        if (timerInterval) clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(timeLeft / 86400);
      const remainder = timeLeft % 86400;
      const hours = Math.floor(remainder / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((remainder % 3600) / 60).toString().padStart(2, '0');
      const seconds = (remainder % 60).toString().padStart(2, '0');
      formattedTime.value = days > 0
          ? `${days}д ${hours}:${minutes}:${seconds}`
          : `${hours}:${minutes}:${seconds}`;
    };

    onMounted(() => {
      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    });

    onUnmounted(() => {
      if (timerInterval) clearInterval(timerInterval);
    });

    const showData = () => {
      nextTick(() => {
        isLoadingData.value = false;
        updateTimer();
      });
    };

    const hideData = () => {
      isLoadingData.value = true;
    };

    return {
      tournamentTitle,
      tournamentPlace,
      formattedTime,
      onTournamentButtonClick,
      isLoadingData,
      showData,
      hideData
    };
  },
});
</script>

<style scoped>
.tournament-panel {
  position: relative;
}

.tournament-title {
  text-align: left;
  padding-bottom: 0.5vh;
  max-width: 30vh;
}

.tournament-place {
  font-size: 3.5vh;
  font-weight: 600;
  text-align: left;
  max-width: 15vh;
  margin-top: 1vh;
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
</style>

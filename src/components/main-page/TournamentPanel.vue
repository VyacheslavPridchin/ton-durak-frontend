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
      <a class="timer-text">00:00:00</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
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

    // Единственная переменная для плейсхолдера текстовых данных – изначально true
    const isLoadingData = ref(true);

    // В onMounted оставляем значение isLoadingData=true;
    // Плейсхолдеры будут скрыты только при вызове showData из другого скрипта.
    onMounted(() => {
      isLoadingData.value = true;
    });

    // Функция, которую можно вызвать извне, чтобы скрыть плейсхолдеры
    const showData = () => {
      isLoadingData.value = false;
    };

    return {
      tournamentTitle,
      tournamentPlace,
      onTournamentButtonClick,
      isLoadingData,
      showData,
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

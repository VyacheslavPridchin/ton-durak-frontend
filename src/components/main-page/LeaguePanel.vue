<template>
  <div class="panel league-panel animate-press" @click="openLeagueInformation">
    <button class="top-right-button">
      <img class="icon" src="@/assets/icons/info-icon.svg" alt="Button Icon" />
    </button>
    <div class="league-header">
      <!-- Иконка лиги без плейсхолдера -->
      <img v-if="rank" class="league-badge" :src="`/assets/leagues/${rank}-league.svg`" :alt="`${rank} league`" />
      <a class="league-badge-text">{{ divisionRoman }}</a>
    </div>
    <div style="display: flex; justify-content: center;">
      <h2 class="league-title placeholder-container" :class="{ isLoading: isLoadingData }">
        {{ leagueTitle }}
      </h2>
    </div>
    <!-- Прогресс-бар (без плейсхолдера, т.к. здесь отображается визуальная инфа) -->
    <div class="progress-bar-container">
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: segment1 + '%' }"></div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: segment2 + '%' }"></div>
      </div>
      <div class="progress-bar-wrapper">
        <div class="progress-bar" :style="{ width: segment3 + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { events } from "@/events.ts";

export default defineComponent({
  name: 'LeaguePanel',
  props: {
    rank: {
      type: String,
      required: true,
    },
    division: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const divisionRoman = computed(() => {
      const romans = ['I', 'II', 'III'];
      return romans[props.division - 1];
    });

    const leagueTitle = computed(() => {
      const ranks: Record<string, string> = {
        bronze: 'Бронзовая',
        silver: 'Серебряная',
        gold: 'Золотая',
        platinum: 'Платиновая',
        diamond: 'Алмазная',
      };
      const rankTitle = ranks[props.rank] || props.rank;
      return `${rankTitle} лига ${divisionRoman.value}`;
    });

    const segment1 = computed(() =>
        props.progress > 33.33 ? 100 : (props.progress / 33.33) * 100
    );
    const segment2 = computed(() =>
        props.progress > 66.66 ? 100 : props.progress > 33.33 ? ((props.progress - 33.33) / 33.33) * 100 : 0
    );
    const segment3 = computed(() =>
        props.progress > 66.66 ? ((props.progress - 66.66) / 33.34) * 100 : 0
    );

    const openLeagueInformation = () => {
      events.emit('showPopup', 'leagueInformation');
    };

    // Одна переменная для управления плейсхолдерами текстовых данных
    const isLoadingData = ref(true);

    // Функция, которую можно вызывать извне, чтобы скрыть плейсхолдеры
    const showData = () => {
      isLoadingData.value = false;
    };

    return {
      divisionRoman,
      leagueTitle,
      segment1,
      segment2,
      segment3,
      openLeagueInformation,
      isLoadingData,
      showData,
    };
  },
});
</script>

<style scoped>
.top-right-button img {
  height: 65%;
}

.league-panel {
  position: relative;
  margin-top: 12vh;
}

.league-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8vh;
}

.league-badge {
  width: 9vh;
  height: auto;
  transform: translateY(-4vh);
  filter: drop-shadow(0 0.2vh 0.4vh rgba(0, 0, 0, 0.3));
}

.league-badge-text {
  position: absolute;
  color: #FEE7DC;
  font-size: 2vh;
  font-weight: bolder;
  text-shadow: -0.1vh 0.1vh 0 rgba(144, 96, 87, 0.3);
  transform: translateY(-1vh);
}

.league-title {
  text-align: center;
  max-width: 30vh;
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  padding: 0.5vh 0;
  gap: 0.5vh;
  margin-top: 1.2vh;
}

.progress-bar-wrapper {
  width: 33.33%;
  height: 0.8vh;
  background-color: var(--bronze-secondary-color);
  border-radius: 0.4vh;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 0.4vh;
  background-color: var(--bronze-color);
  transition: width 0.3s ease-in-out;
}

.progress-bar-wrapper:nth-child(2) .progress-bar {
  transition-delay: 0s;
}

.progress-bar-wrapper:nth-child(2) .progress-bar {
  transition-delay: 0.3s;
}

.progress-bar-wrapper:nth-child(3) .progress-bar {
  transition-delay: 0.6s;
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

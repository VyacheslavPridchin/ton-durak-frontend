<template>
  <div class="panel league-panel animate-press">
    <div class="league-header">
      <img v-if="rank" class="league-badge" :src="`/assets/leagues/${rank}-league.svg`" :alt="`${rank} league`" />
      <a v-if="rank" class="league-badge-text">
        {{ divisionRoman }}
      </a>
    </div>
    <div style="display: flex; justify-content: center;">
      <h2 class="league-title placeholder-container" :class="{ isLoading: isLoadingData }">
        {{ leagueTitle }}
      </h2>
    </div>
    <div class="timer-container placeholder-container" :class="{ isLoading: isLoadingData }">
      <img class="icon" src="@/assets/icons/timer-icon.svg" alt="Timer Icon">
      <a class="timer-text">00:00:00</a>
    </div>
    <div class="prize-container placeholder-container" :class="{ isLoading: isLoadingData }">
      <a class="timer-text">$100</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'LeaguePanel',
  props: {
    rank: {
      type: String,
      required: true,
      validator: (value: string) =>
          ['bronze', 'silver', 'gold', 'platinum', 'diamond'].includes(value),
    },
    division: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1 && value <= 3,
    },
  },
  setup(props) {
    const divisionRoman = computed(() => {
      const romans = ['I', 'II', 'III'];
      return romans[props.division - 1];
    });

    const leagueTitle = computed(() => {
      const ranks: Record<string, string> = {
        bronze: 'Бронзовый',
        silver: 'Серебряный',
        gold: 'Золотой',
        platinum: 'Платиновый',
        diamond: 'Алмазный'
      };
      const rankTitle = ranks[props.rank] || props.rank;
      return `${rankTitle} турнир`;
    });

    // Единственная переменная для управления плейсхолдерами текстовых данных
    const isLoadingData = ref(true);

    // При монтировании компонента устанавливаем значение по умолчанию
    onMounted(() => {
      isLoadingData.value = true;
    });

    // Метод, который можно вызвать извне для скрытия плейсхолдера данных
    const showData = () => {
      isLoadingData.value = false;
    };

    return {
      divisionRoman,
      leagueTitle,
      isLoadingData,
      showData,
    };
  },
});
</script>

+<style scoped>
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

.timer-text {
  font-size: 1.5vh;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 0.5vh;
  position: absolute;
  top: 1.6vh;
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

.prize-container {
  display: flex;
  align-items: center;
  gap: 0.5vh;
  position: absolute;
  top: 1.6vh;
  left: 1vh;
  background: var(--gray-color);
  border-radius: 2vh;
  padding: 0.5vh 1vh;
  margin: 0.5vh 1vh;
}
</style>

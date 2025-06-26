<template>
  <div class="popup-container">
    <img v-if="leagueBadgeSrc" :src="leagueBadgeSrc" class="badge" />
    <h1 style="margin-bottom: 0.5vh;">Победа в турнире</h1>
    <a class="secondary-text" style="margin-bottom: 1.5vh; text-align: center;">
      Вы заняли {{ place }} место!
    </a>

    <h2 style="margin-bottom: 0.5vh;">Результаты</h2>
    <div class="details-row">
      <h2 class="details-title">Кол-во побед за турнир:</h2>
      <a class="details-value">{{ wins }}</a>
    </div>
    <div class="details-row">
      <h2 class="details-title">Отрыв от предыдущего места:</h2>
      <a class="details-value">{{ gap }}</a>
    </div>
    <div class="details-row" style="margin-bottom: 1.5vh;">
      <h2 class="details-title">Ваша награда:</h2>
      <a class="details-value">{{ reward }}</a>
    </div>

    <button class="main-button animate-press" @click="$emit('close')">
      Ура!
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted} from 'vue';
import { ImageCache } from '@/game/utils/ImageCache.ts';
import { EventService, EventType } from '@/game/network/EventService.ts';

export default defineComponent({
  name: 'TournamentWinPopup',
  emits: ['close'],
  setup() {
    const rank = ref('bronze');
    const place = ref(1);
    const wins = ref(0);
    const gap = ref(0);
    const reward = ref(0);
    const leagueBadgeSrc = ref('');

    onMounted(async () => {
      const img = await ImageCache.getImage(`/assets/leagues/${rank.value}-league.svg`);
      leagueBadgeSrc.value = img.src;

      EventService.Instance.on(EventType.SetTournamentWinData, onSetData);
    });

    function onSetData(data: { league: string; place: number; wins: number; difference: number; amount: number }) {
      rank.value = data.league;
      place.value = data.place;
      wins.value = data.wins;
      gap.value = data.difference;
      reward.value = data.amount;
    }

    onUnmounted(() => {
      EventService.Instance.off(EventType.SetTournamentWinData, onSetData);
    });

    return {
      rank,
      place,
      wins,
      gap,
      reward,
      leagueBadgeSrc,
    };
  },
});
</script>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  padding: 0 2vh;
  margin: 0 auto;
  background: white;
  border-radius: 1vh;
  width: 280px;
}

.secondary-text {
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.badge {
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5vh;
}

.details-row {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  margin-top: 0.25vh;
}

.details-title {
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.details-value {
  margin-left: auto;
  font-size: 1.75vh;
  font-weight: bold;
}

.main-button {
  margin-top: 1vh;
  padding: 1.5vh 0;
  font-size: 1.75vh;
  background: linear-gradient(90deg,#3FA9F5 0%,#2979FF 100%);
  color: white;
  border: none;
  border-radius: 1vh;
  cursor: pointer;
}
</style>

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
      <a class="details-value">${{ reward }}</a>
    </div>

    <button class="main-button animate-press" @click="closePopup">
      Ура!
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted} from 'vue';
import { ImageCache } from '@/in-game/utils/ImageCache.ts';
import { EventService, EventType } from '@/in-game/network/EventService.ts';
import {events} from "@/events.ts";

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
      setData(window.tournamentWinData);
      const img = await ImageCache.getImage(`/assets/leagues/${rank.value}-league.svg`);
      leagueBadgeSrc.value = img.src;
    });

    function setData(data: { league: string; place: number; wins: number; difference: number; amount: number }) {
      rank.value = data.league;
      place.value = data.place;
      wins.value = data.wins;
      gap.value = data.difference;
      reward.value = data.amount;
    }

    const closePopup = () => {
      events.emit("hidePopup");
    }

    return {
      rank,
      place,
      wins,
      gap,
      reward,
      leagueBadgeSrc,
      closePopup,
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
}

.badge {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5vh;
}

.details-row {
  margin-top: 0.25vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
}

.details-title {
  text-align: left;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.details-value {
  margin-left: auto;
  font-size: 1.75vh;
}
</style>

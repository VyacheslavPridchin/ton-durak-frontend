<template>
  <div class="popup-container">
    <h1 style="margin-bottom: 0.5vh">Лиги</h1>
    <a class="secondary-text" style="margin-bottom: 3vh; text-align: center">
      Достигай новых лиг и соревнуйся с сильнейшими!
    </a>
    <!-- Лиги -->
    <div class="leagues-list">
      <div
          v-for="(rank, index) in leagues"
          :key="rank"
          class="league-icon"
          :class="{ blur: index > currentIndex }"
          :style="{
          zIndex: -index
        }"
      >
        <img :src="`/assets/leagues/${rank}-league.svg`" :alt="`${rank} league`" />
      </div>
    </div>
    <h2 style="margin-bottom: 0.5vh">Как перейти в следующую лигу?</h2>
    <a class="secondary-text" style="margin-bottom: 1.5vh">
      Чтобы перейти в следующую лигу достаточно выигрывать игры, тем самым поднимая свой рейтинг.
    </a>
    <h2 style="margin-bottom: 0.5vh">Зачем переходить в следующую лигу?</h2>
    <a class="secondary-text" style="margin-bottom: 1.5vh">
      В более высоких лигах игроки получают больше призовых в турнирах, а также могут делать более высокие ставки.
    </a>
    <button class="main-button animate-press" @click="closePopup">
      Окей!
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue';
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

export default defineComponent({
  setup() {
    const closePopup = () => {
      events.emit("hidePopup");
    };
    const leagues = ['bronze', 'silver', 'gold', 'platinum', 'predator'];
    const currentLeague = ref('predator'); // указываем текущую лигу
    const currentIndex = computed(() => leagues.indexOf(currentLeague.value));

    onMounted(async () => {
      await apiService.postVisit('league_information_popup');
    })

    return {
      closePopup,
      leagues,
      currentLeague,
      currentIndex
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
}

/* Стили для иконок лиг */
.leagues-list {
  display: flex;
  margin-bottom: 3vh;
  justify-content: center;
  position: relative;
}

.league-icon {
  position: relative;
  margin-left: -2vh; /* иконки накладываются друг на друга */
}

.league-icon:first-child {
  margin-left: 0;
}

.league-icon img {
  height: 13vh;
}

.blur img {
  filter: blur(10px);
}
</style>

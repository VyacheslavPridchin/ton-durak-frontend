<template>
  <transition name="fade">
    <div :class="['panel', 'player-item', { selected: select }]">
      <div class="player-avatar placeholder-container" :class="{ isLoading: isLoadingImage }">
        <img class="player-avatar" :src="avatar" @load="onImageLoad" alt="avatar" />
      </div>
      <h1 class="tournament-place">#{{ place }}</h1>
      <h2 class="player-name">{{ name.replace('87**1!a', ' ') }}</h2>
      <div v-if="prize > 0" class="prize-container">
        <a class="prize-text">$ {{ prize }}</a>
      </div>
      <h2 class="wins-text">
        {{ wins }} {{ winsSuffix }}
      </h2>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'TournamentPanel',
  props: {
    avatar: { type: String, required: true },
    name: { type: String, required: true },
    place: { type: Number, required: true },
    prize: { type: Number, required: true },
    wins: { type: Number, required: true },
    select: { type: Boolean, default: false }
  },
  computed: {
    winsSuffix(): string {
      const wins = this.wins;
      if (wins % 100 >= 11 && wins % 100 <= 14) {
        return 'побед';
      }
      switch (wins % 10) {
        case 1:
          return 'победа';
        case 2:
        case 3:
        case 4:
          return 'победы';
        default:
          return 'побед';
      }
    },
  },
  setup() {
    const isLoadingImage = ref(true);
    const onImageLoad = () => {
      isLoadingImage.value = false;
    };

    return { isLoadingImage, onImageLoad };
  }
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

.player-item {
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 2vh;
  margin: 0;
}

.player-avatar {
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
  object-fit: cover;
}

.tournament-place {
  font-size: 2vh;
  font-weight: 600;
  margin: 0 1vh;
}

.player-name {
  font-size: 2vh;
  margin-right: 1vh;
}

.prize-container {
  display: flex;
  align-items: center;
  background: var(--gray-color);
  border-radius: 2vh;
  padding: 0.5vh 1vh;
}

.prize-text {
  font-size: 1.5vh;
}

.wins-text {
  font-size: 2vh;
  margin-left: auto;
}

.selected {
  outline: 0.22vh solid #2D83EC;
}
</style>

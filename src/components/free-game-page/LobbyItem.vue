<template>
  <transition name="fade">
    <div class="panel lobby-item animate-press">
      <div class="icon-container">
        <img class="lobby-icon" :src="icon" alt="icon" />
      </div>
      <div class="lobby-text-container">
        <h2 class="lobby-title">Лобби «{{ nickname }}»</h2>
        <a class="lobby-type">{{ typeText }}</a>
      </div>
      <div class="lobby-right">
        <a class="players-count">
          {{ currentPlayers }}/{{ maxPlayers }}
        </a>
        <div class="right-button">
          <img class="icon" src="@/assets/icons/next-icon.svg" alt="Settings Icon" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import TransferIcon from '@/assets/icons/lobby/transfer-icon.svg'
import ClassicIcon  from '@/assets/icons/lobby/classic-icon.svg'

type LobbyType = 'transfer' | 'classic';

export default defineComponent({
  name: 'LobbyItem',
  props: {
    type: { type: String as () => LobbyType, required: true },
    nickname: { type: String, required: true },
    currentPlayers: { type: Number, required: true },
    maxPlayers: { type: Number, required: true },
  },
  setup(props) {
    const icon = computed(() => {
      switch (props.type) {
        case 'transfer': return TransferIcon;
        case 'classic':  return ClassicIcon;
      }
    });

    const typeText = computed(() => {
      switch (props.type) {
        case 'transfer': return 'Переводной';
        case 'classic':  return 'Классический';
      }
    });

    return {
      icon,
      typeText,
    }
  }
})
</script>

<style scoped>
.right-button {
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 50%;
  background: var(--gray-color);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
  margin-left: 1vh;
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

.lobby-item {
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 2vh;
  margin: 0;
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

.lobby-icon {
  width: 2vh;
  height: 2vh;
}

.lobby-text-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.lobby-title {
  font-size: 2vh;
  margin: 0;
}

.lobby-type {
  font-size: 1.5vh;
  color: #8B8B8B;
  margin: 0;
}

.lobby-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.players-count {
  font-size: 2vh;
}
</style>

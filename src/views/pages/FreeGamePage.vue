<template>
  <div class="container">
    <div class="page">
      <!-- передаём вычисленное restoreEnd -->
      <FreeGamePanel
          ref="freeGamePanelRef"
          style="margin-top: 12vh"
          :games-left="3"
          :games-total="5"
          :restore-end="initialRestoreEnd"
      />

      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">Лобби</h2>
      <div class="list">
        <LobbyItem
            v-for="(lobby, i) in lobbys"
            :key="i"
            :type="lobby.type"
            :nickname="lobby.nickname"
            :currentPlayers="lobby.currentPlayers"
            :maxPlayers="lobby.maxPlayers"
        />
      </div>
      <FreePlayButton/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FreeGamePanel from '@/components/free-game-page/FreeGamePanel.vue'
import LobbyItem from '@/components/free-game-page/LobbyItem.vue'
import FreePlayButton from "@/components/free-game-page/FreePlayButton.vue";

// 15 минут в мс
const SEGMENT_MS = 15 * 60 * 1000

// Чтобы осталось заполнить 2.5 сегмента:
// 2.5 * 15мин = 37.5 мин
const initialRestoreEnd = Date.now() + 1.75 * SEGMENT_MS

const freeGamePanelRef = ref<InstanceType<typeof FreeGamePanel> | null>(null)

onMounted(() => {
  freeGamePanelRef.value?.showData()
})

type Lobby = {
  type: 'transfer' | 'classic'
  nickname: string
  currentPlayers: number
  maxPlayers: number
}

const lobbys = ref<Lobby[]>([
  { type: 'transfer', nickname: 'Игрок1', currentPlayers: 1, maxPlayers: 4 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
  { type: 'classic',  nickname: 'Игрок2', currentPlayers: 2, maxPlayers: 2 },
])
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 95%;
  max-width: 75vh;
  height: 100%;
}
</style>

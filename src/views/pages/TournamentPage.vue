<template>
  <div class="container">
    <div class="page">
      <LeaguePanel ref="leaguePanelRef" :rank="rank" :division="division" @click="openTournamentInformation"/>
      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">Топ-10 игроков</h2>
      <div class="list" ref="playerList">
        <PlayerItem
            v-for="player in topTenPlayers"
            :key="player.id"
            :place="player.place"
            :prize="player.prize"
            :avatar="player.avatar"
            :name="player.name"
            :wins="player.wins"
            :select="player.isMe"
            :ref="player.isMe ? 'myPlayerItem' : undefined"
        />
        <div v-if="myPlayerOutsideTop">
          <div class="dot-divider">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <PlayerItem
              v-if="myPlayer"
              ref="myPlayerItem"
              :place="myPlayer.place"
              :prize="myPlayer.prize"
              :avatar="myPlayer.avatar"
              :name="myPlayer.name"
              :wins="myPlayer.wins"
              :select="true"
          />
        </div>
      </div>
      <PlayButton :amount="3.14" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch, nextTick } from 'vue';
import LeaguePanel from '@/components/tournament-page/LeaguePanel.vue';
import PlayerItem from '@/components/tournament-page/PlayerItem.vue';
import PlayButton from "@/components/main-page/PlayButton.vue";
import apiService from '@/services/ApiService.ts';
import { events } from "@/events.ts";

interface Player {
  id: number;
  place: number;
  prize: number;
  avatar: string;
  name: string;
  wins: number;
  isMe?: boolean;
}

export default defineComponent({
  components: { LeaguePanel, PlayerItem, PlayButton },
  setup() {
    const rank = ref('bronze');
    const division = ref(2);
    const progress = ref(0);
    const players = ref<Player[]>([]);
    const playerList = ref<HTMLElement | null>(null);
    const myPlayerItem = ref<any>(null);
    const leaguePanelRef = ref();

    const fetchTournamentData = async () => {
      const response = await apiService.getScreenTournament();
      if (response.success && response.data) {
        // Обновляем данные LeaguePanel
        rank.value = response.data.league.rank;
        division.value = response.data.league.division;
        progress.value = response.data.league.progress * 100;
        // Обновляем список игроков и определяем isMe через сравнение id
        players.value = response.data.players.map((p) => ({
          id: p.user_id,
          place: p.place,
          prize: p.prize,
          avatar: `https://tondurakgame.com/users/photo?user_id=${p.user_id}`,
          name: p.name,
          wins: p.wins,
          isMe: window.userData ? window.userData.id === p.user_id : false
        }));

        setTimeout(() => {
          leaguePanelRef.value.showData();
        }, 300)
      }
    };

    onMounted(() => {
      fetchTournamentData();
    });

    const topTenPlayers = computed(() =>
        players.value.filter(player => player.place <= 10)
    );

    const myPlayer = computed(() =>
        players.value.find(p => p.isMe)
    );

    const myPlayerOutsideTop = computed(() =>
        myPlayer.value ? myPlayer.value.place > 10 : false
    );

    watch(myPlayer, async () => {
      if (myPlayer.value && playerList.value) {
        await nextTick();
        setTimeout(() => {
          const comp = Array.isArray(myPlayerItem.value)
              ? myPlayerItem.value[0]
              : myPlayerItem.value;
          const targetEl = comp?.$el || comp;
          if (playerList.value && targetEl) {
            const container = playerList.value;
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();
            const offsetTop = targetRect.top + targetRect.height - containerRect.top - container.clientHeight + 5;
            container.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 200);
      }
    }, { immediate: true });

    const openTournamentInformation = () => {
      events.emit("showPopup", "tournamentInformation");
    };

    return {
      rank,
      division,
      progress,
      players,
      topTenPlayers,
      myPlayer,
      myPlayerOutsideTop,
      playerList,
      myPlayerItem,
      openTournamentInformation
    };
  }
});
</script>

<style scoped>
.list {
  will-change: transform;
  scroll-behavior: smooth;
}

.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 95%;
  max-width: 75vh;
  height: 100%;
}

.dot-divider {
  display: flex;
  justify-content: center;
  margin: 1.5vh 0 2.5vh 0;
}

.dot {
  display: inline-block;
  width: 0.8vh;
  height: 0.8vh;
  margin: 0 0.4vh;
  border-radius: 50%;
  background-color: #D9D9D9;
}
</style>

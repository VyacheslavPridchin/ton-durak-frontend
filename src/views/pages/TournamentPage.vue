<template>
  <div class="container">
    <div class="page">
      <LeaguePanel :rank="rank" :division="division" :progress="progress" @click="openTournamentInformation"/>
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
import gsap from 'gsap';
import LeaguePanel from '@/components/tournament-page/LeaguePanel.vue';
import PlayerItem from '@/components/tournament-page/PlayerItem.vue';
import PlayButton from "@/components/main-page/PlayButton.vue";
import {events} from "@/events.ts";

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
    const progress = ref(40);
    const players = ref<Player[]>([]);
    const playerList = ref<HTMLElement | null>(null);
    const myPlayerItem = ref<any>(null); // Может быть массивом или одиночным элементом

    const swipeDuration = 1;

    onMounted(() => {
      // Эмуляция запроса к серверу
      setTimeout(() => {
        players.value = [
          { id: 1, place: 1, prize: 100, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg', name: 'Первый', wins: 102 },
          { id: 2, place: 2, prize: 80,  avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', name: 'Второй', wins: 95 },
          { id: 3, place: 3, prize: 60,  avatar: 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg', name: 'Третий', wins: 81 },
          { id: 4, place: 4, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/male/4.jpg', name: 'Четвертый', wins: 74 },
          { id: 5, place: 5, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/female/5.jpg', name: 'Пятый', wins: 60 },
          { id: 6, place: 6, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg', name: 'Шестой', wins: 58 },
          { id: 7, place: 7, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg', name: 'Седьмой', wins: 46 },
          { id: 8, place: 8, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/female/8.jpg', name: 'Восьмой', wins: 31 },
          { id: 9, place: 9, prize: 0,   avatar: 'https://xsgames.co/randomusers/assets/avatars/male/9.jpg', name: 'Девятый', wins: 21 },
          { id: 10, place: 10, prize: 0, avatar: 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg', name: 'Десятый', wins: 11 },
          { id: 11, place: 34, prize: 0, avatar: 'https://xsgames.co/randomusers/assets/avatars/male/11.jpg', name: 'Ты', wins: 1, isMe: true },
        ];
      }, 10);
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

    watch(myPlayer, async (newVal) => {
      if (newVal && playerList.value) {
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

            // Используем твои же расчеты
            const offsetTop = targetRect.top + targetRect.height - containerRect.top - container.clientHeight + 5;

            // Везде используем scrollTo
            container.scrollTo({ top: offsetTop, behavior: 'smooth' });
          }
        }, 200);
      }
    }, { immediate: true });


    const openTournamentInformation = () => {
      events.emit("showPopup", "tournamentInformation");
    }

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
  scroll-behavior: smooth; /* На случай, если браузер поддерживает */
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

<template>
  <div class="container">
    <div class="page">
      <LeaguePanel ref="leaguePanelRef" :rank="rank" :division="division" :progress="progress" />
      <TournamentPanel ref="tournamentPanelRef" :prize="tournamentPrize" :place="tournamentPlace" :timer="tournamentTimer" />
      <WalletPanel ref="walletPanelRef" :balance="walletBalance" :bonus="walletBonus" :showTopButton="true"/>
      <PlayButton :amount="playAmount" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import LeaguePanel from '@/components/main-page/LeaguePanel.vue';
import TournamentPanel from '@/components/main-page/TournamentPanel.vue';
import WalletPanel from "@/components/main-page/WalletPanel.vue";
import PlayButton from "@/components/main-page/PlayButton.vue";
import apiService from '@/services/ApiService.ts';

export default defineComponent({
  components: { LeaguePanel, TournamentPanel, WalletPanel, PlayButton },
  setup() {
    // Инициализация рефов для данных
    const rank = ref();
    const division = ref();
    const progress = ref(0);

    const tournamentPrize = ref(0);
    const tournamentPlace = ref(0);
    const tournamentTimer = ref(0);

    const walletBalance = ref(0);
    const walletBonus = ref(0);

    const playAmount = ref(0);

    // ---

    const leaguePanelRef = ref();
    const tournamentPanelRef = ref();
    const walletPanelRef = ref();

    const fetchScreenMain = async () => {
      const response = await apiService.getScreenMain();
      if (response.success && response.data) {
        // Обновляем данные для LeaguePanel
        rank.value = response.data.league.rank;
        division.value = response.data.league.division;
        // Если progress приходит в виде доли (например, 0.445), переводим в проценты
        progress.value = response.data.league.progress * 100;

        // Обновляем данные для TournamentPanel
        tournamentPrize.value = response.data.tournament.prize_pool;
        tournamentPlace.value = response.data.tournament.place;
        // Расчет оставшегося времени (deadline - текущее время в секундах)
        const currentTime = Math.floor(Date.now() / 1000);
        tournamentTimer.value = Math.max(0, response.data.tournament.deadline - currentTime);

        // Обновляем данные для WalletPanel
        walletBalance.value = response.data.finance.balance;
        walletBonus.value = response.data.finance.bonus_balance;

        // Пример playAmount (можно заменить на актуальное значение)
        playAmount.value = 3.14;
        setTimeout(() => {
          leaguePanelRef.value.showData();
          tournamentPanelRef.value.showData();
          walletPanelRef.value.showData();
        }, 300);
      }
    };

    onMounted(() => {
      fetchScreenMain();
    });

    return {
      rank,
      division,
      progress,
      tournamentPrize,
      tournamentPlace,
      tournamentTimer,
      walletBalance,
      walletBonus,
      playAmount,
      leaguePanelRef,
      walletPanelRef,
      tournamentPanelRef,
    };
  }
});
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 95%;
  max-width: 75vh;
}
</style>

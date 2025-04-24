<template>
  <div class="container">
    <div class="page">
      <LeaguePanel ref="leaguePanelRef" :rank="rank" :division="division" :progress="progress" />
      <TournamentPanel ref="tournamentPanelRef" :prize="tournamentPrize" :place="tournamentPlace" :deadline="tournamentDeadline" />
      <WalletPanel ref="walletPanelRef" :balance="walletBalance" :bonus="walletBonus" :showTopButton="true"/>
      <PlayButton :bids="bids"/>
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

const CACHE_KEY = 'screenMainData';

export default defineComponent({
  components: { LeaguePanel, TournamentPanel, WalletPanel, PlayButton },
  setup() {
    // Рефы для данных
    const rank = ref();
    const division = ref();
    const progress = ref(0);

    const tournamentPrize = ref(0);
    const tournamentPlace = ref(0);
    const tournamentDeadline = ref(0);

    const walletBalance = ref(0);
    const walletBonus = ref(0);

    const bids = ref<number[]>([]);

    // Рефы для компонентов
    const leaguePanelRef = ref();
    const tournamentPanelRef = ref();
    const walletPanelRef = ref();

    // Функция обновления данных в реактивных переменных
    const updateData = (data: any) => {
      // LeaguePanel
      rank.value = data.league.rank;
      division.value = data.league.division;
      progress.value = data.league.progress * 100; // переводим в проценты

      // TournamentPanel
      tournamentPrize.value = data.tournament.prize_pool;
      tournamentPlace.value = data.tournament.place;
      tournamentDeadline.value = data.tournament.deadline;

      // WalletPanel
      walletBalance.value = data.finance.balance;
      walletBonus.value = data.finance.bonus_balance;

      // PlayButton
      bids.value = data.bids;

      leaguePanelRef.value.showData();
      tournamentPanelRef.value.showData();
      walletPanelRef.value.showData();
    };

    // Функции работы с кэшем
    const loadCachedData = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Ошибка парсинга кэша', e);
        }
      }
      return null;
    };

    const saveCachedData = (data: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    };

    // Запрос данных с сервера
    const fetchScreenMain = async () => {
      const response = await apiService.getScreenMain();
      if (response.success && response.data) {
        updateData(response.data);
        saveCachedData(response); // кэшируем полный ответ
        setTimeout(() => {
          leaguePanelRef.value.showData();
          tournamentPanelRef.value.showData();
          walletPanelRef.value.showData();
        }, 23);
      }
    };

    onMounted(async () => {
      await apiService.postVisit('main_page');
    })

    onMounted(() => {
      try
      {
        // Сначала пытаемся загрузить данные из кэша
        const cachedResponse = loadCachedData();
        if (cachedResponse && cachedResponse.data) {
          updateData(cachedResponse.data);
        }
        else
        {
          leaguePanelRef.value.hideData();
          tournamentPanelRef.value.hideData();
          walletPanelRef.value.hideData();
        }
      } catch (error) {
        console.log(error);
      }
      // Запрос обновления данных с сервера (параллельно)
      fetchScreenMain();
    });

    return {
      rank,
      division,
      progress,
      tournamentPrize,
      tournamentPlace,
      tournamentDeadline,
      walletBalance,
      walletBonus,
      leaguePanelRef,
      tournamentPanelRef,
      walletPanelRef,
      bids
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

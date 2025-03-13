<template>
  <div class="container">
    <div class="page">
      <LeaguePanel :rank="rank" :division="division" :progress="progress" />
      <TournamentPanel :prize="1568" :place="12" :timer="0" />
      <WalletPanel :balance="1568" :bonus="12" :showTopButton="true"/>
      <PlayButton :amount="3.14" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LeaguePanel from '@/components/main-page/LeaguePanel.vue';
import TournamentPanel from "@/components/main-page/TournamentPanel.vue";
import WalletPanel from "@/components/main-page/WalletPanel.vue";
import PlayButton from "@/components/main-page/PlayButton.vue";

export default defineComponent({
  components: {PlayButton, WalletPanel, TournamentPanel, LeaguePanel },
  setup() {
    const rank = ref('bronze');
    const division = ref(2);
    const progress = ref(40);

    return { rank, division, progress };
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
<template>
  <div class="container">
    <div class="page">
      <ReferralsDetailsPanel style="margin-top: 12vh" :data="graphData" />

      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">История зачислений</h2>
      <div class="list">
        <TransactionItem
            v-for="(tx, index) in transactions"
            :key="index"
            :type="tx.type as TransactionType"
            :amount="tx.amount"
            :dateTime="tx.dateTime"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import router from "@/router";
import TransactionItem from "@/components/wallet-page/TransactionItem.vue";
import ReferralsDetailsPanel from "@/components/referrals-details-page/ReferralsDetailsPanel.vue";
import apiService from '@/services/ApiService.ts';

type TransactionType = 'withdraw' | 'loss' | 'tournament' | 'earn' | 'deposit' | 'referral';

interface Transaction {
  type: string;
  dateTime: number;
  amount: number;
}

export default defineComponent({
  components: { ReferralsDetailsPanel, TransactionItem },
  setup() {
    const transactions = ref<Transaction[]>([]);
    const graphData = ref<{ day: string; value: number }[]>([]);

    onMounted(async () => {
      try {
        const [graphResponse, transactionsResponse] = await Promise.all([
          apiService.getScreenReferralGraph(),
          apiService.getScreenReferralTransactions()
        ]);

        graphData.value = graphResponse.data.graph.map(item => ({
          day: item.day,
          value: item.amount
        }));

        transactions.value = transactionsResponse.data.transactions.map(tx => ({
          type: tx.tx_type,
          dateTime: tx.ts,
          amount: tx.amount
        }));
      } catch (error) {
        console.error(error);
      }
    });

    return {
      graphData,
      transactions,
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
  height: 100%;
}
</style>

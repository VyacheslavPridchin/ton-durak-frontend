<template>
  <div class="container">
    <div class="page">
      <WalletPanel style="margin-top: 12vh" :bonus="10" :balance="10"/>

      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">История транзакций</h2>
      <div class="list">
        <TransactionItem
            v-for="(tx, index) in transactions"
            :key="index"
            :type="tx.type"
            :amount="tx.amount"
            :dateTime="tx.dateTime"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import WalletPanel from '@/components/main-page/WalletPanel.vue';
import router from "@/router";
import PlayerItem from "@/components/tournament-page/PlayerItem.vue";
import TransactionItem from "@/components/wallet-page/TransactionItem.vue";

type TransactionType = 'withdraw' | 'loss' | 'tournament' | 'win' | 'deposit' | 'referral';

interface Transaction {
  type: TransactionType;
  dateTime: number; // изменён на число
  amount: number;
}

export default defineComponent({
  components: { TransactionItem, PlayerItem, WalletPanel },
  setup() {
    const transactions = ref<Transaction[]>([]);

    onMounted(() => {
      // Используем текущий год для формирования дат
      const year = new Date().getFullYear();
      transactions.value = [
        { type: 'withdraw',   dateTime: new Date(year, 2, 4, 17, 31).getTime(), amount: 10 },
        { type: 'loss',       dateTime: new Date(year, 2, 3, 11, 44).getTime(), amount: 0.5 },
        { type: 'tournament', dateTime: new Date(year, 2, 2, 13, 59).getTime(), amount: 50 },
        { type: 'win',        dateTime: new Date(year, 2, 2, 22, 27).getTime(), amount: 0.5 },
        { type: 'deposit',    dateTime: new Date(year, 2, 1, 19, 33).getTime(), amount: 20 },
        { type: 'referral',   dateTime: new Date(year, 1, 12, 17, 42).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 1, 2, 4, 44).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 26, 9, 52).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 14, 11, 16).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 10, 116, 42).getTime(), amount: 1 },
      ];
    });

    const onWalletButtonClick = () => {
      router.push('/wallet');
    };

    return {
      onWalletButtonClick,
      transactions
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

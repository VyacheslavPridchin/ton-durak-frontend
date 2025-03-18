<template>
  <div class="container">
    <div class="page">
      <ReferralsDetailsPanel style="margin-top: 12vh" :data="[
  { day: new Date('2022-05-16').getTime(), value: 11 }, // пн
  { day: new Date('2022-05-17').getTime(), value: 6 }, // вт
  { day: new Date('2022-05-18').getTime(), value: 15 }, // ср
  { day: new Date('2022-05-19').getTime(), value: 32 }, // чт
  { day: new Date('2022-05-20').getTime(), value: 24 }, // пт
  { day: new Date('2022-05-21').getTime(), value: 54 }, // сб
  { day: new Date('2022-05-22').getTime(), value: 9 }  // вс
]
"/>

      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">История зачислений</h2>
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
import router from "@/router";
import TransactionItem from "@/components/wallet-page/TransactionItem.vue";
import ReferralsDetailsPanel from "@/components/referrals-details-page/ReferralsDetailsPanel.vue";

type TransactionType = 'withdraw' | 'loss' | 'tournament' | 'earn' | 'deposit' | 'referral';

interface Transaction {
  type: TransactionType;
  dateTime: number; // изменён на число
  amount: number;
}

export default defineComponent({
  components: {ReferralsDetailsPanel, TransactionItem },
  setup() {
    const transactions = ref<Transaction[]>([]);

    onMounted(() => {
      // Используем текущий год для формирования дат
      const year = new Date().getFullYear();
      transactions.value = [
        { type: 'referral',   dateTime: new Date(year, 1, 12, 17, 42).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 1, 2, 4, 44).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 26, 9, 52).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 14, 11, 16).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 14, 15, 16).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 14, 13, 16).getTime(), amount: 1 },
        { type: 'referral',   dateTime: new Date(year, 0, 10, 16, 42).getTime(), amount: 1 },
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

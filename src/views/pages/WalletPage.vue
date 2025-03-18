<template>
  <div class="container">
    <div class="page">
      <WalletPanel ref="walletPanelRef" style="margin-top: 12vh" :bonus="bonus" :balance="balance" />

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
import TransactionItem from '@/components/wallet-page/TransactionItem.vue';
import apiService from '@/services/ApiService';

// Указываем все возможные значения для поля type
type TransactionType = 'withdraw' | 'loss' | 'tournament' | 'earn' | 'deposit' | 'referral';

interface Transaction {
  type: TransactionType;
  dateTime: number;
  amount: number;
}

export default defineComponent({
  name: 'WalletPage',
  components: { WalletPanel, TransactionItem },
  setup() {
    const balance = ref(0);
    const bonus  = ref(0);
    const transactions = ref<Transaction[]>([]);
    const walletPanelRef = ref<InstanceType<typeof WalletPanel> | null>(null);

    const loadFinanceData = async () => {
      const financeResponse = await apiService.getScreenFinance();
      if (financeResponse.success && financeResponse.data) {
        balance.value = financeResponse.data.balance;
        bonus.value = financeResponse.data.bonus_balance;
        walletPanelRef.value?.showData();
      }
    };

    const loadTransactions = async () => {
      const txResponse = await apiService.getScreenFinanceTransactions();
      if (txResponse.success && txResponse.data) {
        transactions.value = txResponse.data.transactions.map(tx => ({
          // Приводим строку из API к нашему типу TransactionType
          type: tx.tx_type as TransactionType,
          amount: tx.amount,
          dateTime: tx.ts
        }));
      }
    };

    onMounted(async () => {
      walletPanelRef.value?.hideData();
      await loadFinanceData();
      await loadTransactions();
      // Вызов метода showData из WalletPanel для отключения плейсхолдера текстовых данных
      if (walletPanelRef.value && typeof walletPanelRef.value.showData === 'function') {
        walletPanelRef.value.showData();
      }
    });

    return { balance, bonus, transactions, walletPanelRef };
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

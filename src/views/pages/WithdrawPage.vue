<template>
  <div class="container">
    <div class="page">
      <h2 style="margin-bottom: 0.5vh; margin-top: 12vh">
        Вывод в {{ cryptoNetwork }}
      </h2>
      <a class="secondary-text">
        1. Укажите кошелек в сети
        <span style="font-weight: 500;">{{ cryptoNetwork }}</span>
      </a>
      <a class="secondary-text">2. Укажите сумму выше минимальной</a>
      <a class="secondary-text" style="margin-bottom: 1vh">
        3. Подтвердите и ожидайте выплаты (5-10 минут)
      </a>
      <div class="panel">
        <h2 style="margin-bottom: 0.5vh">Кошелек</h2>
        <input
            type="text"
            class="input-box"
            placeholder="Введите адрес кошелька"
            v-model="walletAddress"
            @keyup.enter="hideKeyboard"
        />
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Указывайте только
          <span style="font-weight: 500;">{{ cryptoNetwork }}</span> адрес.
        </a>
        <h2 style="margin-bottom: 1vh">Сумма вывода</h2>
        <input
            type="number"
            class="input-box"
            placeholder="Введите сумму"
            v-model.number="withdrawAmount"
            style="margin-bottom: 1vh"
            @keyup.enter="hideKeyboard"
        />
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Укажите сумму больше {{ minAmount }} {{ cryptoName }}
        </a>
        <h2 style="margin-bottom: 1vh">Детали</h2>
        <div class="details-row">
          <h2 class="details-title">Минимальная сумма:</h2>
          <a class="details-value">{{ minAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row" style="margin-bottom: 1.5vh">
          <h2 class="details-title">Комиссия сети:</h2>
          <a class="details-value">{{ networkFee }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2>Итого</h2>
          <a class="details-value">{{ result }}</a>
        </div>
      </div>
      <button
          :class="['main-button', { 'animate-press': !isButtonDisabled }]"
          :disabled="isButtonDisabled"
          @click="withdraw"
      >
        Вывести
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { events } from "@/events.ts";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const cryptoNetwork = ref((route.query.network as string) || 'TON');

    const cryptoMapping: Record<string, string> = {
      "USDT TON": "USDT",
      "TON": "TON",
    };
    const cryptoName = ref(cryptoMapping[cryptoNetwork.value] || cryptoNetwork.value);

    const minAmount = ref(10);
    const networkFee = ref(0.5);
    const walletAddress = ref('');
    const withdrawAmount = ref(0);

    const result = computed(() => {
      const amount = Number(withdrawAmount.value);
      if (amount < minAmount.value) {
        return '-';
      }
      const total = amount - networkFee.value;
      return total > 0 ? `${total.toFixed(2)} ${cryptoName.value}` : '-';
    });

    const isButtonDisabled = computed(() => {
      return walletAddress.value.trim() === '' || withdrawAmount.value < minAmount.value;
    });

    const hideKeyboard = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    };


    const withdraw = () => {
      if (!walletAddress.value.trim()) return;
      if (withdrawAmount.value < minAmount.value) return;

      const queryParams = new URLSearchParams({
        amount: withdrawAmount.value.toString(),
        fee: networkFee.value.toString(),
        network: cryptoNetwork.value,
        wallet: walletAddress.value,
      });
      router.push(`/withdraw?${queryParams.toString()}`);

      setTimeout(() => {
        events.emit('showPopup', 'withdrawConfirmation');
      }, 200);
    };

    return {
      cryptoNetwork,
      cryptoName,
      minAmount,
      networkFee,
      walletAddress,
      withdrawAmount,
      result,
      isButtonDisabled,
      hideKeyboard,
      withdraw,
    };
  },
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

.right-button img {
  height: 50%;
  display: block;
}

.input-box {
  width: 100%;
  display: flex;
  align-items: center;
  background: var(--gray-color);
  color: var(--text-color);
  border-radius: 1vh;
  padding: 1.5vh 1vh;
  margin: 0 0 0.25vh 0;
  font-size: 1.75vh;
  box-sizing: border-box;
  border-color: transparent;
}

.details-row {
  margin-top: 0.25vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
}

.details-title {
  text-align: left;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.details-value {
  margin-left: auto;
  font-size: 1.75vh;
}

/* Стили для кнопки */
.main-button {
  background: #1e90ff;
  transition: background 0.3s ease, filter 0.1s, transform 0.1s;
}

/* Стили для отключенной кнопки */
.main-button:disabled {
  background: var(--gray-color);
  color: var(--text-color);
  cursor: not-allowed;
  opacity: 0.6;
}
</style>

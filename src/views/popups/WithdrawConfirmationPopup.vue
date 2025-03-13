<template>
  <div class="popup-container">
    <h1 style="margin-bottom: 0.5vh">Подтверждение</h1>
    <a class="secondary-text" style="margin-bottom: 1.5vh; text-align: center;">
      Проверьте все данные и подтвердите платеж
    </a>
    <h2 style="margin-bottom: 0.5vh">Кошелек {{cryptoNetwork}}</h2>
    <div class="address-box" style="margin-bottom: 1.5vh">
      <a class="address-text">{{ walletAddress }}</a>
    </div>
    <h2 style="margin-bottom: 0.5vh">Детали</h2>
    <div class="details-row">
      <h2 class="details-title">Сумма вывода:</h2>
      <a class="details-value">{{ withdrawAmount }} {{ cryptoName }}</a>
    </div>
    <div class="details-row">
      <h2 class="details-title">Комиссия сети:</h2>
      <a class="details-value">{{ networkFee }} {{ cryptoName }}</a>
    </div>
    <div class="details-row" style="margin-bottom: 1.5vh">
      <h2 class="details-title">Итого:</h2>
      <a class="details-value">{{ result }} {{ cryptoName }}</a>
    </div>
    <button class="main-button animate-press" @click="confirm">
      Подтвердить
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { events } from "@/events.ts";
import router from "@/router";

export default defineComponent({
  setup() {
    const route = useRoute();

    // Получаем данные из строки запроса
    const withdrawAmount = ref((route.query.amount as string) || "0");
    const networkFee = ref((route.query.fee as string) || "0");
    const walletAddress = ref((route.query.wallet as string) || "");
    const cryptoNetwork = ref((route.query.network as string) || 'TON');

    // Преобразование сети к читаемому имени
    const cryptoMapping: Record<string, string> = {
      "USDT TON": "USDT",
      "TON": "TON",
    };
    const cryptoName = ref(cryptoMapping[cryptoNetwork.value] || cryptoNetwork.value);

    // Вычисляем итоговую сумму как сумму вывода и комиссии
    const result = computed(() => {
      const amountNum = parseFloat(withdrawAmount.value);
      const feeNum = parseFloat(networkFee.value);
      return (amountNum - feeNum).toString();
    });

    const confirm = () => {
      events.emit('hidePopup');

      setTimeout(() => {
        events.emit('showNotification', {title: "Запрос принят!", subtitle: `Запрос на вывод ${ withdrawAmount.value } ${ cryptoName.value } принят.`, icon: "withdraw",  sticker: 'like_duck'});
      }, 750)
    };

    return {
      withdrawAmount,
      networkFee,
      walletAddress,
      cryptoName,
      cryptoNetwork,
      result,
      confirm,
    };
  }
});
</script>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  padding: 0 2vh;
  margin: 0 auto;
}

.address-box {
  display: flex;
  align-items: center;
  background: var(--gray-color);
  border-radius: 1vh;
  padding: 1vh;
  margin: 0 0 0.25vh 0;
  height: 3vh;
}

.address-text {
  font-size: 1.75vh;
  color: var(--text-color);
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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
</style>

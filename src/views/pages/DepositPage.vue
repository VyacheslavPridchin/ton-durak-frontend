<template>
  <div class="container">
    <div class="page">
      <h2 style="margin-bottom: 1vh; margin-top: 12vh">Депозит в {{ cryptoNetwork }}</h2>
      <a class="secondary-text">1. Пополните сумму выше минимальной</a>
      <a class="secondary-text" style="margin-bottom: 1vh">2. Ожидайте пополнение (5-10 минут)</a>
      <div class="panel">
        <h2 style="margin-bottom: 1vh">Кошелек</h2>
        <div class="address-box animate-press" @click="copyAddress">
          <a class="address-text">{{ walletAddress }}</a>
          <button class="copy-button">
            <img src="@/assets/icons/copy-icon.svg" style="filter: brightness(0) saturate(100%) invert(40%)" alt="Copy" />
          </button>
        </div>
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Отправляйте только <span style="font-weight: 500;">{{ cryptoNetwork }}</span> на этот адрес.
          Любые другие активы будут безвозвратно утеряны.
        </a>
        <h2 style="margin-bottom: 1vh">Детали</h2>
<!--        <div class="details-row">-->
<!--          <h2 class="details-title">Примерный курс (1 {{ cryptoName }}):</h2>-->
<!--          <a class="details-value">${{ approximateRate }}</a>-->
<!--        </div>-->
        <div class="details-row">
          <h2 class="details-title">Минимальная сумма:</h2>
          <a class="details-value">{{ minAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Рекомендованная сумма:</h2>
          <a class="details-value">{{ recommendedAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Комиссия сети:</h2>
          <a class="details-value">{{ networkFee }} {{ cryptoName }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import ExpandableItem from "@/components/deposit-page/ExpandableItem.vue";
import TonIcon from "@/assets/icons/ton-icon.svg";
import USDTTonIcon from "@/assets/icons/usdt-ton-icon.svg";
import {events} from "@/events.ts";

export default defineComponent({
  components: { ExpandableItem },
  setup() {
    const route = useRoute();
    const cryptoNetwork = ref((route.query.network as string) || 'TON');

    const cryptoMapping: Record<string, string> = {
      "USDT TON": "USDT",
      "TON": "TON",
    };
    const cryptoName = ref(cryptoMapping[cryptoNetwork.value] || cryptoNetwork.value);

    // Пример адреса для депозита, его можно заменить на реальное значение
    const walletAddress = ref('0x1234...ABCD');

    // Детали депозита
    const approximateRate = ref(1.23);
    const minAmount = ref(10);
    const recommendedAmount = ref(50);
    const networkFee = ref(0.5);

    // Метод копирования адреса
    const copyAddress = () => {
      navigator.clipboard.writeText(walletAddress.value)
          .then(() => {
            events.emit('showNotification', { title: "Скопировано!", subtitle: "Адрес успешно скопирован.", icon: 'copy', sticker: 'like_duck'});

            console.log('Адрес скопирован');
          })
          .catch(err => {
            events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Не получилось скопировать.", icon: 'copy', sticker: 'block_duck'});
            console.error('Ошибка копирования адреса:', err);
          });

    };

    // Пример работы с ExpandableItem (если потребуется в дальнейшем)
    const activeItem = ref<string | null>(null);
    const handleToggle = (id: string) => {
      activeItem.value = activeItem.value === id ? null : id;
    };

    return {
      cryptoNetwork,
      cryptoName,
      walletAddress,
      approximateRate,
      minAmount,
      recommendedAmount,
      networkFee,
      copyAddress,
      activeItem,
      handleToggle,
      TonIcon,
      USDTTonIcon,
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

/* Стили для адресного блока */
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
  max-width: 90%;
}
.copy-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.copy-button img {
  width: 2vh;
  height: 2vh;
}

/* Стили для деталей */
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

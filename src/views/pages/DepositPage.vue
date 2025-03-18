<template>
  <div class="container">
    <div class="page">
      <h2 style="margin-bottom: 1vh; margin-top: 12vh">Депозит в {{ cryptoNetwork }}</h2>
      <a class="secondary-text">1. Пополните сумму выше минимальной</a>
      <a class="secondary-text" style="margin-bottom: 1vh">2. Ожидайте пополнение (5-10 минут)</a>
      <div class="panel">
        <h2 style="margin-bottom: 1vh">Кошелек</h2>
        <div class="address-box animate-press placeholder-container" :class="{ isLoading: isLoadingData }" @click="copyAddress">
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
        <div class="details-row">
          <h2 class="details-title">Минимальная сумма:</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">{{ minAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Рекомендованная сумма:</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">{{ recommendedAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Комиссия сети:</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">{{ networkFee }} {{ cryptoName }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ExpandableItem from "@/components/deposit-page/ExpandableItem.vue";
import TonIcon from "@/assets/icons/ton-icon.svg";
import USDTTonIcon from "@/assets/icons/usdt-ton-icon.svg";
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

export default defineComponent({
  components: { ExpandableItem },
  setup() {
    const route = useRoute();
    const cryptoNetwork = ref((route.query.network as string) || 'TON');

    const cryptoMapping: Record<string, string> = {
      "USDT TON": "USDT",
      "TON": "TON",
    };

    const cryptoTypeMapping: Record<string, string> = {
      "USDT TON": "usdtton",
      "TON": "ton",
    };

    const cryptoName = ref(cryptoMapping[cryptoNetwork.value] || cryptoNetwork.value);

    // Изначально включаем плейсхолдеры
    const isLoadingData = ref(true);

    // Пример адреса для депозита, будет обновлен запросом
    const walletAddress = ref('');

    // Детали депозита
    const approximateRate = ref(0);
    const minAmount = ref(0);
    const recommendedAmount = ref(0);
    const networkFee = ref(0);

    // Метод копирования адреса
    const copyAddress = () => {
      navigator.clipboard.writeText(walletAddress.value)
          .then(() => {
            events.emit('showNotification', { title: "Скопировано!", subtitle: "Адрес успешно скопирован.", icon: 'copy', sticker: 'like_duck' });
            console.log('Адрес скопирован');
          })
          .catch(err => {
            events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Не получилось скопировать.", icon: 'copy', sticker: 'block_duck' });
            console.error('Ошибка копирования адреса:', err);
          });
    };

    const activeItem = ref<string | null>(null);
    const handleToggle = (id: string) => {
      activeItem.value = activeItem.value === id ? null : id;
    };

    onMounted(async () => {
      try {
        let response = await apiService.getDepositInfo(cryptoTypeMapping[cryptoNetwork.value]);
        // Устанавливаем данные из ответа
        walletAddress.value = response.data.address;
        minAmount.value = response.data.minAmount;
        recommendedAmount.value = response.data.minAmount * 6;
        networkFee.value = response.data.fee;
        approximateRate.value = response.data.price;
      } catch (error) {
        events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Ошибка получения данных депозита.", icon: 'deposit', sticker: 'block_duck' });
        console.error('Ошибка получения данных депозита:', error);
      } finally {

        if(walletAddress.value == undefined) {
          events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Ошибка получения данных депозита.", icon: 'deposit', sticker: 'block_duck' });
        } else
        {
          isLoadingData.value = false; // Отключаем плейсхолдеры
        }
      }
    });

    return {
      cryptoNetwork,
      cryptoName,
      walletAddress,
      approximateRate,
      minAmount,
      recommendedAmount,
      networkFee,
      isLoadingData,
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

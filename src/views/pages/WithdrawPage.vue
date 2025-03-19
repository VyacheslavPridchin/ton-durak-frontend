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
        <!-- Меняем input на textarea и добавляем событие blur -->
        <textarea
            class="input-box"
            placeholder="Введите адрес кошелька"
            v-model="walletAddress"
            @blur="updateAddress"
        ></textarea>
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Указывайте только
          <span style="font-weight: 500;">{{ cryptoNetwork }}</span> адрес.
        </a>
        <h2 style="margin-bottom: 1vh">Сумма вывода</h2>
        <!-- Поле ввода суммы с деактивацией, если кошелек не установлен -->
        <div class="input-wrapper">
          <input
              type="number"
              class="input-box"
              placeholder="Введите сумму"
              v-model.number="withdrawAmount"
              @keyup.enter="hideKeyboard"
              :disabled="!hasWalletAddress"
          />
          <button
              type="button"
              class="max-button"
              @click="setMaxAmount"
              :disabled="!hasWalletAddress"
          >
            Max
          </button>
        </div>
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Укажите сумму больше <span style="font-weight: 500;">{{ displayedMinAmount }}</span>
        </a>
        <h2 style="margin-bottom: 1vh">Детали</h2>
        <div class="details-row">
          <h2 class="details-title">Минимальная сумма:</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">
            {{ displayedMinAmount }}
          </a>
        </div>
        <div class="details-row" style="margin-bottom: 1.5vh">
          <h2 class="details-title">Комиссия сети:</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">
            {{ displayedNetworkFee }}
          </a>
        </div>
        <div class="details-row">
          <h2>Итого</h2>
          <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">
            {{ result }}
          </a>
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
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
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

    // Начальные числовые значения
    const minAmount = ref(10);
    const networkFee = ref(0.5);
    const balance = ref(0);
    const walletAddress = ref('');
    const withdrawAmount = ref(0);
    // Флаг наличия адреса
    const hasWalletAddress = ref(true);

    const isLoadingData = ref(true);

    // Если кошелек не установлен, показываем прочерки в деталях и отключаем ввод суммы
    const displayedMinAmount = computed(() => {
      return hasWalletAddress.value ? `${minAmount.value} ${cryptoName.value}` : '-';
    });
    const displayedNetworkFee = computed(() => {
      return hasWalletAddress.value ? `${networkFee.value} ${cryptoName.value}` : '-';
    });

    const result = computed(() => {
      if (!hasWalletAddress.value) return '-';
      const amount = Number(withdrawAmount.value);
      if (amount < minAmount.value) {
        return '-';
      }
      const total = amount - networkFee.value;
      return total > 0 ? `${total.toFixed(2)} ${cryptoName.value}` : '-';
    });

    const isButtonDisabled = computed(() => {
      return (
          !hasWalletAddress.value ||
          String(walletAddress.value || '').trim() === '' ||
          withdrawAmount.value < minAmount.value
      );
    });

    const hideKeyboard = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    };

    const setMaxAmount = () => {
      withdrawAmount.value = balance.value;
      hideKeyboard();
    };

    const withdraw = () => {
      if (String(walletAddress.value || '').trim() === '') return;
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

    // Отправка запроса обновления адреса при потере фокуса
    const updateAddress = () => {
      if (String(walletAddress.value || '').trim() === '') return;
      apiService.postUpdateAddress(walletAddress.value, cryptoTypeMapping[cryptoNetwork.value])
          .then(response => {
            if (response.success) {
              if (response.data.wallet_address === "None") {
                hasWalletAddress.value = false;
              } else {
                hasWalletAddress.value = true;
                walletAddress.value = response.data.wallet_address;
                minAmount.value = response.data.minAmount;
                networkFee.value = response.data.fee;
                balance.value = response.data.balance;
              }
            }
          })
          .catch(error => {
            console.error('Ошибка обновления адреса:', error);
            events.emit('showNotification', {
              title: "Произошла ошибка!",
              subtitle: "Ошибка обновления адреса.",
              icon: 'withdraw',
              sticker: 'block_duck'
            });
          });
    };

    onMounted(async () => {
      apiService.getWithdrawalInfo(cryptoTypeMapping[cryptoNetwork.value])
          .then(response => {
            if (!response.success) {
              events.emit('showNotification', {
                title: "Произошла ошибка!",
                subtitle: "Ошибка получения данных вывода.",
                icon: 'withdraw',
                sticker: 'block_duck'
              });
              return;
            }

            // Если address равен "None", оставляем поля как прочерк
              if (response.data.wallet_address === "None") {
              hasWalletAddress.value = false;
            } else {
              hasWalletAddress.value = true;
              walletAddress.value = response.data.wallet_address;
              minAmount.value = response.data.minAmount;
              networkFee.value = response.data.fee;
              balance.value = response.data.balance;
            }

            isLoadingData.value = false;
            console.log("hasWalletAddress", hasWalletAddress.value);
          })
          .catch(error => {
            events.emit('showNotification', {
              title: "Произошла ошибка!",
              subtitle: "Ошибка получения данных вывода.",
              icon: 'withdraw',
              sticker: 'block_duck'
            });
            console.error('Ошибка получения данных вывода:', error);
          });
    });

    return {
      cryptoNetwork,
      cryptoName,
      minAmount,
      networkFee,
      balance,
      walletAddress,
      withdrawAmount,
      hasWalletAddress,
      displayedMinAmount,
      displayedNetworkFee,
      result,
      isButtonDisabled,
      hideKeyboard,
      setMaxAmount,
      withdraw,
      updateAddress,
      isLoadingData,
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
  resize: vertical;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1vh;
}

.max-button {
  position: absolute;
  right: 1vh;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5vh;
  color: var(--text-color);
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

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>

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
import {defineComponent, ref, computed, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import { events } from "@/events.ts";
import router from "@/router";
import apiService from "@/services/ApiService.ts";

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

    const cryptoTypeMapping: Record<string, string> = {
      "USDT TON": "usdtton",
      "TON": "ton",
    };

    const cryptoName = ref(cryptoMapping[cryptoNetwork.value] || cryptoNetwork.value);

    // Вычисляем итоговую сумму как сумму вывода и комиссии
    const result = computed(() => {
      const amountNum = parseFloat(withdrawAmount.value);
      const feeNum = parseFloat(networkFee.value);
      return (amountNum - feeNum).toString();
    });

    onMounted(async () => {
      await apiService.postVisit('withdraw_confirmation_popup');
    })

    function biometricRequest() {
      // @ts-ignore
      window.Telegram.WebApp.BiometricManager.init(); // один раз за сессию, без колбека

      // @ts-ignore
      if (!window.Telegram.WebApp.BiometricManager.isBiometricAvailable) {
        console.log('Устройство не поддерживает доступ к биометрии. Для вывода средств напишите в поддержку или воспользуйтесь другим устройством.');
        return;
      }

      // @ts-ignore
      window.Telegram.WebApp.BiometricManager.requestAccess({ reason: 'Для вывода средств требуется подтверждение через биометрию.' }, () => {
        try {
          // @ts-ignore
          window.Telegram.WebApp.BiometricManager.authenticate({ reason: 'Подтвердите вывод средств.' }, (success, token) => {
            if (success) {
              console.log('Аутентификация успешна, токен:', token);
              // @ts-ignore
              alert(window.Telegram.WebApp.BiometricManager.deviceId);
            } else {
              alert('Аутентификация не пройдена.');
            }
          });
        } catch (e) {
          alert('Для выполнения действия требуется доступ к биометрии.');
        }
      });
    }

    const confirm = () => {
      biometricRequest();
      //
      // events.emit('hidePopup');
      // let data = {
      //   to_addr: walletAddress.value,
      //   code: cryptoTypeMapping[cryptoNetwork.value],
      //   amount: withdrawAmount.value
      // }
      //
      // apiService.withdraw(data).then(response => {
      //   if(response.success)
      //     events.emit('showNotification', {title: "Вывод выполнен!", subtitle: `Вывод успешно выполнен. Ваш баланс: $${ response.data.balance }.`, icon: "withdraw",  sticker: 'money_duck'});
      //   else
      //     events.emit('showNotification', {title: "Ошибка вывода!", subtitle: `${response.error}`, icon: 'withdraw', sticker: 'block_duck'});
      //
      // }).catch( error => {
      //   events.emit('showNotification', {title: "Ошибка вывода!", subtitle: `К сожалению, произошла ошибка вывода.`, icon: 'withdraw', sticker: 'block_duck'});
      // });
      //
      //   apiService.postVisit('withdrawal');
      //   events.emit('showNotification', {title: "Запрос принят!", subtitle: `Запрос на вывод ${ withdrawAmount.value } ${ cryptoName.value } принят.`, icon: "withdraw",  sticker: 'like_duck'});
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

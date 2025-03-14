<template>
  <div class="panel wallet-panel">
    <div class="upper-block" @click="goToWallet">
      <div v-if="showTopButton" class="block-background animate-press" style="bottom: 0"></div>
      <div class="content">
        <button
            v-if="showTopButton"
            class="top-right-button"
            style="top: 0; right: 0; pointer-events: none"
        >
          <img class="icon" src="@/assets/icons/next-icon.svg" alt="Button Icon" />
        </button>
        <h2 class="wallet-title">Игровой баланс</h2>
        <!-- Плейсхолдер для текстовых данных (баланса) -->
        <a class="wallet-balance placeholder-container" :class="{ isLoading: isLoadingData }">
          {{ balanceText }}
        </a>
        <div class="buttons-container">
          <button class="secondary-button animate-press" @click.stop="goToDeposit">Депозит</button>
          <button class="secondary-button animate-press" @click.stop="goToWithdraw">Вывод</button>
        </div>
        <hr class="divider" style="margin: 2vh 0 0;"/>
      </div>
    </div>

    <div class="lower-block" style="padding-top: 2vh" @click="showBonusBalanceInformation">
      <div class="block-background animate-press" style="top: 0"></div>
      <div class="content">
        <div class="bonus-balance-container">
          <img src="@/assets/icons/bonus-dollar-icon.svg" alt="Bonus Icon" class="bonus-icon" />
          <h2 class="bonus-title">Бонусный баланс</h2>
          <!-- Плейсхолдер для текстовых данных (бонусного баланса) -->
          <a class="bonus-amount placeholder-container" :class="{ isLoading: isLoadingData }">
            {{ bonusText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { events } from "@/events.ts";

export default defineComponent({
  name: 'WalletPanel',
  props: {
    balance: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
    bonus: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
    showTopButton: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const router = useRouter();

    const balanceText = computed(() => `$${props.balance}`);
    const bonusText = computed(() => `$${props.bonus}`);

    const goToWallet = () => router.push('/wallet');
    const goToDeposit = () => router.push('/deposit-options');
    const goToWithdraw = () => router.push('/withdraw-options');
    const showBonusBalanceInformation = () => events.emit('showPopup', 'bonusBalanceInformation');

    const isLoadingData = ref(false);

    // Функция, которую можно вызвать извне для отключения плейсхолдера текстовых данных
    const showData = () => {
      isLoadingData.value = false;
    };

    const hideData = () => {
      isLoadingData.value = true;
    };

    return {
      balanceText,
      bonusText,
      goToWallet,
      goToDeposit,
      goToWithdraw,
      showBonusBalanceInformation,
      isLoadingData,
      showData,
    };
  },
});
</script>

<style scoped>
.block-background {
  position: absolute;
  background: var(--panel-color);
  left: -2vh;
  right: -2vh;
  top: -1vh;
  bottom: -1vh;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.content > * {
  pointer-events: auto;
}

.wallet-panel {
  margin-top: auto;
  padding: 0;
  position: relative;
  overflow: clip;
}

.upper-block {
  margin: 0;
  padding: 2vh 2vh 0 2vh;
  position: relative;
}

.lower-block {
  margin: 0;
  padding: 0 2vh 2vh;
  position: relative;
  border-bottom-left-radius: 1.2vh;
  border-bottom-right-radius: 1.2vh;
  background-color: var(--panel-color);
}

/* Остальные стили панели */
.wallet-title {
  text-align: left;
  padding-bottom: 0.5vh;
  pointer-events: none;
}

.wallet-balance {
  font-size: 3.5vh;
  font-weight: 600;
  text-align: left;
  pointer-events: none;
  max-width: 15vh;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  padding: 0 0 0.7vh 0;
  gap: 1vh;
  margin-top: 1.2vh;
}

.bonus-balance-container {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  pointer-events: none;
}

.bonus-icon {
  width: 2.4vh;
  height: 2.4vh;
  pointer-events: none;
}

.bonus-amount {
  margin-left: auto;
  font-size: 1.75vh;
  pointer-events: none;
}

.bonus-title {
  text-align: left;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
  pointer-events: none;
}

.top-right-button img {
  height: 50%;
}

.animate-press {
  transition: filter 0.2s, transform 0.1s;
}

.animate-press:active {
  filter: brightness(0.9);
  transform: scale(1);
}
</style>

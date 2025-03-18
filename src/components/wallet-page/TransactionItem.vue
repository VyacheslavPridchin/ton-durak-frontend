<template>
  <transition name="fade">
    <div class="panel transaction-item">
      <div class="icon-container">
        <img class="transaction-icon" :src="icon" alt="icon" />
      </div>
      <div class="transaction-text-container">
        <h2 class="transaction-title">{{ title }}</h2>
        <a class="transaction-date">{{ formattedDateTime }}</a>
      </div>
      <a :class="[amountColorClass]">
        {{ sign }}{{ amount }}
      </a>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import DepositIcon from "@/assets/icons/transactions/deposit-icon.svg"
import LossIcon from "@/assets/icons/transactions/loss-icon.svg"
import ReferralIcon from "@/assets/icons/transactions/referral-icon.svg"
import TournamentIcon from "@/assets/icons/transactions/tournament-icon.svg"
import WinIcon from "@/assets/icons/transactions/win-icon.svg"
import WithdrawIcon from "@/assets/icons/transactions/withdraw-icon.svg"
type TransactionType = 'withdraw' | 'loss' | 'tournament' | 'earn' | 'deposit' | 'referral';

export default defineComponent({
  props: {
    type: { type: String as () => TransactionType, required: true },
    amount: { type: Number, required: true },
    dateTime: { type: Number, required: true }
  },
  setup(props) {
    const icon = computed(() => {
      switch (props.type) {
        case 'withdraw':    return WithdrawIcon;
        case 'loss':        return LossIcon;
        case 'tournament':  return TournamentIcon;
        case 'earn':        return WinIcon;
        case 'deposit':     return DepositIcon;
        case 'referral':    return ReferralIcon;
      }
    });

    const title = computed(() => {
      switch (props.type) {
        case 'withdraw':    return 'Вывод';
        case 'loss':        return 'Поражение';
        case 'tournament':  return 'Турнир';
        case 'earn':        return 'Победа';
        case 'deposit':     return 'Депозит';
        case 'referral':    return 'Реферальная выплата';
      }
    });

    const sign = computed(() => {
      return (props.type === 'withdraw' || props.type === 'loss') ? '-$' : '+$';
    });

    const amountColorClass = computed(() => {
      return (props.type === 'withdraw' || props.type === 'loss') ? 'negative' : 'positive';
    });

    // Форматирование даты в виде "3 марта в 11:44"
    const formattedDateTime = computed(() => {
      const date = new Date(props.dateTime);
      const day = date.getDate();
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];
      const month = months[date.getMonth()];
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} в ${hours}:${minutes}`;
    });

    return {
      icon,
      title,
      sign,
      amountColorClass,
      formattedDateTime
    }
  }
})
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

.transaction-item {
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 2vh;
  margin: 0;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5vh;
  height: 4.5vh;
  border-radius: 50%;
  background: var(--blue-gradient);
  margin-right: 1vh;
}

.transaction-icon {
  width: 2vh;
  height: 2vh;
}

.transaction-text-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.transaction-title {
  font-size: 2vh;
  margin: 0;
}

.transaction-date {
  font-size: 1.5vh;
  color: #8B8B8B;
  margin: 0;
}

.positive {
  color: #2ecc71;
}

.negative {
  color: var(--text-color);
}
</style>

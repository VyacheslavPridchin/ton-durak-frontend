<template>
  <div class="panel referral-panel" @click="openInformationPopup">
    <div class="block-background animate-press"></div>
    <div class="content" >
      <button class="top-right-button"  style="top: 0; right: 0;">
        <img class="icon" src="@/assets/icons/info-icon.svg" alt="Button Icon" />
      </button>
      <h2 class="referral-title">Реферальные выплаты</h2>
      <a class="referral-balance">{{ balanceText }}</a>

      <div style="margin-top: 1.5vh" class="bonus-balance-container">
        <h2 class="bonus-title">Рефералы</h2>
        <a class="bonus-amount">{{ bonusText }}</a>
      </div>

      <div style="margin-top: 0.5vh" class="bonus-balance-container">
        <h2 class="bonus-title">Зачислено</h2>
        <a class="bonus-amount">${{ bonusText }}</a>
      </div>
      <hr class="divider" style="margin-top: 1.5vh"/>
    </div>

    <!-- Линия для отделения -->

    <div class="buttons-container">
      <button style="background: var(--blue-gradient); color: white" class="secondary-button animate-press" @click.stop="getMoney">Зачислить</button>
      <button style="background: var(--blue-gradient); color: var(--white-color)" class="secondary-button animate-press" @click.stop="">Пригласить</button>
    </div>
    <div style="margin-top: 0.2vh; padding: 0" class="buttons-container">
      <button style="width: 100%" class="secondary-button animate-press" @click.stop="pushReferralsDetails">Подробнее</button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';
import {events} from "@/events.ts";

export default defineComponent({
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
    }
  },
  setup(props) {
    const router = useRouter();

    const balanceText = computed(() => `$${props.balance}`);
    const bonusText = computed(() => `${props.bonus}`);

    const pushReferralsDetails = () => {
      router.push('/referrals/details');
    };


    const getMoney = () => {
      events.emit('showNotification', {title: "Реферальная выплата!", subtitle: "На ваш баланс зачислено $50.", icon: "referral", sticker: 'money_duck'});
    };

    const openInformationPopup = () => {
      events.emit('showPopup', "referralsInformation")
    }

    return { balanceText, bonusText, pushReferralsDetails, getMoney, openInformationPopup };
  }
});
</script>

<style scoped>
.referral-panel {
  margin-top: auto;
  position: relative;
  overflow: clip;
}

.referral-title {
  text-align: left;
  padding-bottom: 0.5vh;
}

.referral-balance {
  font-size: 3.5vh;
  font-weight: 600;
  text-align: left;
}

.buttons-container {
  display: flex;
  justify-content: space-between;
  padding: 0 0 0.7vh 0;
  gap: 1vh;
  margin-top: 1.5vh;
}

.bonus-balance-container {
  display: flex;
  align-items: center;
  gap: 0.8vh;
  margin: 2vh 0 0 0;
}

.bonus-icon {
  width: 2.4vh;
  height: 2.4vh;
}

.bonus-amount {
  margin-left: auto;
  font-size: 1.75vh;
}

.bonus-title {
  text-align: left;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

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

.top-right-button img {
  height: 65%;
  display: block;
}
</style>

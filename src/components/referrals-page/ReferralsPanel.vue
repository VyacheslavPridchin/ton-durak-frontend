<template>
  <div class="panel referral-panel" @click="openInformationPopup">
    <div class="block-background animate-press"></div>
    <div class="content">
      <button class="top-right-button" style="top: 0; right: 0;">
        <img class="icon" src="@/assets/icons/info-icon.svg" alt="Button Icon" />
      </button>
      <h2 class="referral-title">Реферальные выплаты</h2>
      <!-- Плейсхолдер для динамического значения баланса -->
      <a class="referral-balance placeholder-container" :class="{ isLoading: isLoadingData }">
        {{ balanceText }}
      </a>
      <div style="margin-top: 1.5vh" class="bonus-balance-container">
        <h2 class="bonus-title">Рефералы</h2>
        <!-- Плейсхолдер для динамического значения бонуса -->
        <a class="bonus-amount placeholder-container" :class="{ isLoading: isLoadingData }">
          {{ referralsText }}
        </a>
      </div>
      <div style="margin-top: 0.5vh" class="bonus-balance-container">
        <h2 class="bonus-title">Зачислено</h2>
        <!-- Плейсхолдер для динамического значения, с символом доллара -->
        <a class="bonus-amount placeholder-container" :class="{ isLoading: isLoadingData }">
          ${{ claimedText }}
        </a>
      </div>
      <hr class="divider" style="margin-top: 1.5vh"/>
    </div>
    <div class="buttons-container">
      <button style="background: var(--blue-gradient); color: white" class="secondary-button animate-press" @click.stop="getMoney">
        Зачислить
      </button>
      <button style="background: var(--blue-gradient); color: var(--white-color)" class="secondary-button animate-press" @click.stop="invite">
        Пригласить
      </button>
    </div>
    <div style="margin-top: 0.2vh; padding: 0" class="buttons-container">
      <button style="width: 100%" class="secondary-button animate-press" @click.stop="pushReferralsDetails">
        Подробнее
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

export default defineComponent({
  name: 'ReferralsPanel',
  props: {
    balance: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 1,
    },
    referrals: {
      type: Number,
      required: true,
    },
    claimed: {
      type: Number,
      required: true,
    },
    inviteLink: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    const router = useRouter();

    const balanceText = computed(() => `$${props.balance}`);
    const claimedText = computed(() => `${props.claimed}`);
    const referralsText = computed(() => `${props.referrals}`);

    const pushReferralsDetails = () => {
      router.push('/referrals/details');
    };

    const getMoney = async () => {
      await apiService.postVisit('claim_referrals_money');

      apiService.claimReferral().then((response) => {
        console.log(response);

        events.emit('showNotification', {
          title: "Реферальная выплата!",
          subtitle: "На ваш баланс успешно зачислена выплата.",
          icon: "referral",
          sticker: 'money_duck'
        });
      }).catch((err) => {
        events.emit('showNotification', {
          title: "Произошла ошибка!",
          subtitle: "Произошла ошибка при зачислении.",
          icon: "referral",
          sticker: 'block_duck'
        });
        console.log(err);
      })
    };

    const invite = async () => {
      navigator.clipboard.writeText(props.inviteLink)
          .then(() => {
            events.emit('showNotification', { title: "Скопировано!", subtitle: "Пригласительная ссылка скопирована.", icon: 'referral', sticker: 'like_duck' });
            console.log('Адрес скопирован');
          })
          .catch(err => {
            events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Не получилось скопировать.", icon: 'referral', sticker: 'block_duck' });
            console.error('Ошибка копирования адреса:', err);
          });

      await apiService.postVisit('copy_invite_link');

    }

    const openInformationPopup = () => {
      events.emit('showPopup', { name: "referralsInformation"});
    };

    // Одна переменная для управления плейсхолдерами текстовых данных
    const isLoadingData = ref(false);

    const hideData = () => {
      isLoadingData.value = true;
    };
    // Функция, вызываемая извне, для скрытия плейсхолдера
    const showData = () => {
      isLoadingData.value = false;
    };

    onMounted(() => {
      isLoadingData.value = true;
    });

    return {
      balanceText,
      referralsText,
      claimedText,
      pushReferralsDetails,
      getMoney,
      openInformationPopup,
      isLoadingData,
      showData,
      hideData,
      invite
    };
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

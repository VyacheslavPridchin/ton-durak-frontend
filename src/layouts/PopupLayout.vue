<template>
  <transition name="overlay-fade">
    <div v-if="activeKey" class="overlay" @click.self="hide">
      <transition name="popup-slide" @before-leave="onPopupLeave">
        <div v-if="popupVisible" class="popup">
          <component :is="activeComponent" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUnmounted, nextTick } from 'vue';
import { events } from '@/events.ts';
import GameSettingsPopup from "@/views/popups/GameSettingsPopup.vue";
import WithdrawConfirmationPopup from "@/views/popups/WithdrawConfirmationPopup.vue";
import ReferralsInformationPopup from "@/views/popups/ReferralsInformationPopup.vue";
import TournamentInformationPopup from "@/views/popups/TournamentInformationPopup.vue";
import LeagueInformationPopup from "@/views/popups/LeagueInformationPopup.vue";
import BonusBalanceInformationPopup from "@/views/popups/BonusBalanceInformationPopup.vue";
import OnBoardingPopup from "@/views/popups/OnBoardingPopup.vue";

export default defineComponent({
  name: 'PopupLayout',
  components: { GameSettingsPopup },
  setup() {
    const popupComponents: Record<string, any> = {
      gameSettings: GameSettingsPopup,
      withdrawConfirmation: WithdrawConfirmationPopup,
      referralsInformation : ReferralsInformationPopup,
      tournamentInformation : TournamentInformationPopup,
      leagueInformation : LeagueInformationPopup,
      bonusBalanceInformation : BonusBalanceInformationPopup,
      onBoarding : OnBoardingPopup,
    };

    const activeKey = ref<string | null>(null);
    const popupVisible = ref(false);
    const activeComponent = computed(() =>
        activeKey.value && popupComponents[activeKey.value]
            ? popupComponents[activeKey.value]
            : null
    );

    const show = (key: string) => {
      if (!popupComponents[key]) {
        console.warn(`Popup с ключом "${key}" не найден.`);
        return;
      }
      activeKey.value = key;
      nextTick(() => {
        popupVisible.value = true;
      });
    };

    const hide = () => {
      popupVisible.value = false;
    };

    // При запуске анимации скрытия (до начала) очищаем activeKey
    const onPopupLeave = () => {
      activeKey.value = null;
    };

    const showHandler = (key: string) => show(key);
    const hideHandler = () => hide();
    events.on('showPopup', showHandler);
    events.on('hidePopup', hideHandler);

    onUnmounted(() => {
      events.off('showPopup', showHandler);
      events.off('hidePopup', hideHandler);
    });

    return {
      activeKey,
      popupVisible,
      activeComponent,
      show,
      hide,
      onPopupLeave,
    };
  },
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
}

.popup {
  background-color: var(--panel-color);
  border-top-left-radius: 1.2vh;
  border-top-right-radius: 1.2vh;
  box-shadow: 0 0.2vh 0.6vh rgba(0, 0, 0, 0.2);
  padding: 2vh 0 11vh 0;
  width: 100%;
  max-width: 75vh;
  /* Конечное положение попапа */
  transform: translateY(8vh);
}

/* Плавный переход для overlay */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: background-color 0.5s;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  background-color: rgba(0, 0, 0, 0);
}

.overlay-fade-enter-to,
.overlay-fade-leave-from {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Переход для popup с эффектом back */
/* Для входа – back.out */
.popup-slide-enter-active {
  transition: transform 0.5s cubic-bezier(.35,.35,.2,1.2);
}
/* Для выхода – back.in */
.popup-slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.9,-0.3,.65,.65);
}
.popup-slide-enter-from,
.popup-slide-leave-to {
  transform: translateY(100%);
}
.popup-slide-enter-to,
.popup-slide-leave-from {
  transform: translateY(8vh);
}
</style>

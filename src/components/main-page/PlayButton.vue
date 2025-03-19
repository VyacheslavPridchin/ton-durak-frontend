<template>
  <button
      ref="playButton"
      class="main-button"
      @pointerenter="onButtonPointerEnter"
      @pointerleave="onButtonPointerLeave"
      @pointerdown="onButtonPointerDown"
      @pointerup="onButtonPointerUp"
      @click="onButtonClick"
  >
    <span class="button-text">Играть на {{ betText }}</span>
    <span class="right-content">
      <span class="separator"></span>
      <button
          ref="iconButton"
          type="button"
          class="icon-button"
          @pointerenter.stop="onIconPointerEnter"
          @pointerleave.stop="onIconPointerLeave"
          @pointerdown.stop="onIconPointerDown"
          @pointerup.stop="onIconPointerUp"
          @click.stop="onIconClick"
      >
        <img
            class="icon-settings"
            src="@/assets/icons/settings-icon.svg"
            alt="icon"
        />
      </button>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { events } from '@/events.ts';
// Импорт сервиса API (проверьте корректность пути)
import apiService from '@/services/ApiService';

export default defineComponent({
  name: 'PlayButton',
  props: {
    amount: {
      type: Number,
      default: 2.5,
    },
  },
  setup(props) {
    const playButton = ref<HTMLElement | null>(null);
    const iconButton = ref<HTMLElement | null>(null);
    const betText = ref('');

    const hideHandler = () => {
      const selectedBet = JSON.parse(localStorage.getItem('selectedBet') || '["$0.5"]');
      if (selectedBet.length > 1) {
        betText.value = selectedBet.slice(0, -1).join(', ') + ' или ' + selectedBet[selectedBet.length - 1];
      } else {
        betText.value = selectedBet[0] || '';
      }
    };

    onMounted(() => {
      const selectedBet = JSON.parse(localStorage.getItem('selectedBet') || '["$0.5"]');
      if (selectedBet.length > 1) {
        betText.value = selectedBet.slice(0, -1).join(', ') + ' или ' + selectedBet[selectedBet.length - 1];
      } else {
        betText.value = selectedBet[0] || '';
      }
      events.on('hidePopup', hideHandler);
    });

    onUnmounted(() => {
      events.off('hidePopup', hideHandler);
    });

    const onButtonClick = async () => {
      // Получаем данные из localStorage
      const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[3]');
      const selectedBet = JSON.parse(localStorage.getItem('selectedBet') || '["$0.5"]');
      const selectedRule = JSON.parse(localStorage.getItem('selectedRule') || '["Переводной"]');

      // Форматируем данные:
      // Bet: убираем знак доллара
      const formattedBets = selectedBet.map((bet: string) => bet.replace('$', ''));
      // Players: приводим к строкам
      const formattedPlayers = selectedPlayers.map((player: number | string) => String(player));
      // Rule: "Классический" -> "0", "Переводной" -> "1"
      const formattedRules = selectedRule.map((rule: string) =>
          rule === 'Классический' ? '0' : rule === 'Переводной' ? '1' : rule
      );

      try {
        const response = await apiService.quickGame(formattedBets, formattedPlayers, formattedRules);
        console.log('Response from quickGame:', response);
      } catch (err) {
        console.error('Error calling quickGame:', err);
      }
    };

    const onIconClick = () => {
      events.emit('showPopup', 'gameSettings');
      console.log('Клик по иконке');
    };

    // Анимации для основной кнопки (pointer events)
    const onButtonPointerEnter = () => {
      if (playButton.value) {
        gsap.to(playButton.value, { duration: 0.2, filter: 'brightness(0.9)' });
      }
    };

    const onButtonPointerLeave = () => {
      if (playButton.value) {
        gsap.to(playButton.value, { duration: 0.2, filter: 'brightness(1)', scale: 1 });
      }
    };

    const onButtonPointerDown = () => {
      if (playButton.value) {
        gsap.to(playButton.value, { duration: 0.2, filter: 'brightness(0.8)', scale: 0.95 });
      }
    };

    const onButtonPointerUp = () => {
      if (playButton.value) {
        gsap.to(playButton.value, { duration: 0.2, filter: 'brightness(0.9)', scale: 1 });
      }
    };

    // Анимации для кнопки с иконкой (pointer events)
    const onIconPointerEnter = () => {
      if (iconButton.value) {
        gsap.to(iconButton.value, { duration: 0.2, scale: 1.1 });
      }
      onButtonPointerLeave();
    };

    const onIconPointerLeave = () => {
      if (iconButton.value) {
        gsap.to(iconButton.value, { duration: 0.2, scale: 1 });
      }
      onButtonPointerEnter();
    };

    const onIconPointerDown = () => {
      if (iconButton.value) {
        gsap.to(iconButton.value, { duration: 0.2, scale: 0.9 });
      }
    };

    const onIconPointerUp = () => {
      if (iconButton.value) {
        gsap.to(iconButton.value, { duration: 0.2, scale: 1 });
      }
    };

    return {
      playButton,
      iconButton,
      betText,
      amount: props.amount,
      onButtonClick,
      onIconClick,
      onButtonPointerEnter,
      onButtonPointerLeave,
      onButtonPointerDown,
      onButtonPointerUp,
      onIconPointerEnter,
      onIconPointerLeave,
      onIconPointerDown,
      onIconPointerUp,
    };
  },
});
</script>

<style scoped>
.button-text {
  flex-grow: 1;
  text-align: center;
}

.right-content {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 1.8vh;
  display: flex;
  align-items: center;
}

.separator {
  display: inline-block;
  width: 1px;
  height: 60%;
  background-color: white;
  margin-right: 1.75vh;
}

.icon-button {
  height: 60%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  transform: scale(1);
}

.icon-settings {
  height: 60%;
  width: auto;
  object-fit: contain;
}
</style>

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
      <template v-if="!isLoading">
        <span class="button-text">
          Играть на {{ betText }}
        </span>
      </template>
      <template v-else>
        <div class="loader-container">
          <div class="loader"/>
        </div>
      </template>
    <span class="right-content">
      <span class="separator"></span>
      <span class="icon-button-wrapper"
            @pointerenter.stop="onIconPointerEnter"
            @pointerleave.stop="onIconPointerLeave"
            @pointerdown.stop="onIconPointerDown"
            @pointerup.stop="onIconPointerUp"
            @click.stop="onIconClick">
        <button
            ref="iconButton"
            type="button"
            class="icon-button"
        >
          <img
              class="icon-settings"
              src="@/assets/icons/settings-icon.svg"
              alt="icon"
          />
        </button>
      </span>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { events } from '@/events.ts';
import apiService from '@/services/ApiService.ts';
import { useRouter } from "vue-router";

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
    const isLoading = ref(false);
    const router = useRouter();

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
      isLoading.value = true;
      console.log('Клик по кнопке');

      const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers') || '[3]');
      const selectedBet = JSON.parse(localStorage.getItem('selectedBet') || '["$0.5"]');
      const selectedRule = JSON.parse(localStorage.getItem('selectedRule') || '["Переводной"]');

      const formattedBets = selectedBet.map((bet: string) => {
        const cleaned = bet.replace('$', '');
        const numberValue = parseFloat(cleaned);
        return !isNaN(numberValue) ? numberValue : bet;
      });
      const formattedPlayers = selectedPlayers.map((player: number | string) => String(player));
      const formattedRules = selectedRule.map((rule: string) =>
          rule === 'Классический' ? '0' : rule === 'Переводной' ? '1' : rule
      );

      apiService.quickGame(formattedBets, formattedPlayers, formattedRules)
          .then((response) => {
            isLoading.value = false;
            if (response.success === false) {
              if (response.error === "no_balance") {
                events.emit('showNotification', { title: "Недостаточно средств!", subtitle: "Пополните баланс для игры.", icon: 'deposit', sticker: 'block_duck' });
                return;
              }
              events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Не удалось начать игру.", icon: 'loss', sticker: 'block_duck' });
              return;
            }
            router.push(`/game?host=${response.data.host}&lobbyId=${response.data.lobby_id}&playerId=${window.userData?.id}&language=ru`);
          })
          .catch(() => {
            isLoading.value = false;
            events.emit('showNotification', { title: "Произошла ошибка!", subtitle: "Не удалось начать игру.", icon: 'loss', sticker: 'block_duck' });
          });
    };

    const onIconClick = () => {
      events.emit('showPopup', { name: 'gameSettings'});
      console.log('Клик по иконке');
    };

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
      isLoading,
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 0.1em;
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

.icon-button-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1vh; /* Увеличивает область нажатия */
  margin: -1vh; /* Компенсирует увеличение, чтобы не сместилось */
}

.icon-settings {
  height: 60%;
  width: auto;
  object-fit: contain;
}

.loader {
  height: 50%;
  aspect-ratio: 1;
  border: 0.2em solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  z-index: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

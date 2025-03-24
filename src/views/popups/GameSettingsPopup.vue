<template>
  <div class="game-settings">
    <h1>Настройки игры</h1>

    <div class="toggle-group">
      <h2>Кол-во игроков</h2>
      <div class="toggles">
        <button
            v-for="option in playerOptions"
            :key="option"
            :class="['animate-press', 'secondary-button', { selected: selectedPlayers.includes(option) }]"
            @click="togglePlayers(option)"
            :disabled="option > 1"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div class="toggle-group">
      <h2>Ставка</h2>
      <div class="toggles placeholder-container" style="overflow: visible" :class="{ isLoading: isLoadingData }">
        <button
            v-for="bet in betOptions"
            :key="bet"
            :class="['animate-press', 'secondary-button', { selected: selectedBet.includes(bet) }]"
            @click="toggleBet(bet)"
        >
          {{ bet }}
        </button>
      </div>
    </div>

    <div class="toggle-group">
      <h2>Правила</h2>
      <div class="toggles">
        <button
            v-for="rule in ruleOptions"
            :key="rule"
            :class="['animate-press', 'secondary-button', { selected: selectedRule.includes(rule) }]"
            @click="toggleRule(rule)"
        >
          {{ rule }}
        </button>
      </div>
    </div>

    <button class="main-button animate-press" @click="saveSettings">Сохранить</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import apiService from "@/services/ApiService";
import { events } from "@/events.ts";

export default defineComponent({
  setup() {
    const playerOptions = [2, 3, 4];
    const betOptions = ref<string[]>(["$0"]);
    const ruleOptions = ['Переводной', 'Классический'];

    const selectedPlayers = ref<number[]>([]);
    const selectedBet = ref<string[]>([]);
    const selectedRule = ref<string[]>([]);

    const isLoadingData = ref(true);

    const loadSettings = () => {
      selectedPlayers.value = JSON.parse(localStorage.getItem('selectedPlayers') || '[1, 2, 3]');
      selectedRule.value = JSON.parse(localStorage.getItem('selectedRule') || '["Классический", "Переводной"]');
      selectedBet.value = JSON.parse(localStorage.getItem('selectedBet') || '[]');
    };

    const saveSettings = () => {
      localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers.value));
      localStorage.setItem('selectedBet', JSON.stringify(selectedBet.value));
      localStorage.setItem('selectedRule', JSON.stringify(selectedRule.value));
      events.emit('hidePopup');
      console.log({ players: selectedPlayers.value, bet: selectedBet.value, rule: selectedRule.value });
    };

    const togglePlayers = (option: number) => {
      if (selectedPlayers.value.includes(option)) {
        if (selectedPlayers.value.length === 1) return;
        selectedPlayers.value = selectedPlayers.value.filter(item => item !== option);
      } else {
        selectedPlayers.value.push(option);
      }
    };

    const toggleBet = (bet: string) => {
      if (selectedBet.value.includes(bet)) {
        if (selectedBet.value.length === 1) return;
        selectedBet.value = selectedBet.value.filter(item => item !== bet);
      } else {
        selectedBet.value.push(bet);
      }
    };

    const toggleRule = (rule: string) => {
      if (selectedRule.value.includes(rule)) {
        if (selectedRule.value.length === 1) return;
        selectedRule.value = selectedRule.value.filter(item => item !== rule);
      } else {
        selectedRule.value.push(rule);
      }
    };

    const fetchBets = async () => {
      try {
        isLoadingData.value = true;

        const response = await apiService.checkBids();
        if (response.success) {
          betOptions.value = response.data.bids.map(b => `$${b}`);
          // Обновим выбор, если сохранённые ставки отсутствуют в новом списке
          selectedBet.value = selectedBet.value.filter(b => betOptions.value.includes(b));
          if (selectedBet.value.length === 0 && betOptions.value.length > 0) {
            selectedBet.value = [betOptions.value[0]];
          }

          isLoadingData.value = false;

        } else {
          events.emit('showNotification', {
            title: "Ошибка",
            subtitle: "Не удалось загрузить ставки",
            icon: 'profile',
            sticker: 'block_duck'
          });
        }
      } catch (e) {
        events.emit('showNotification', {
          title: "Ошибка",
          subtitle: "Не удалось загрузить ставки",
          icon: 'profile',
          sticker: 'block_duck'
        });
      }
    };

    onMounted(() => {
      loadSettings();
      fetchBets();
    });

    return {
      playerOptions,
      betOptions,
      ruleOptions,
      selectedPlayers,
      selectedBet,
      selectedRule,
      togglePlayers,
      toggleBet,
      toggleRule,
      saveSettings,
      isLoadingData,
    };
  }
});
</script>

<style scoped>
.game-settings {
  display: flex;
  flex-direction: column;
  padding: 0 2vh;
  margin: 0 auto;
}

.toggle-group {
  margin-bottom: 2vh;
}

.toggles {
  margin-top: 1vh;
  display: flex;
  gap: 1vh;
}

.secondary-button.selected {
  outline: 0.2vh solid #2D83EC;
}
</style>

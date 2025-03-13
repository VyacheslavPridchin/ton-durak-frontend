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
        >
          {{ option }}
        </button>
      </div>
    </div>

    <div class="toggle-group">
      <h2>Ставка</h2>
      <div class="toggles">
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
import { defineComponent, ref } from 'vue';
import { events } from "@/events.ts";

export default defineComponent({
  setup() {
    const playerOptions = [2, 3, 4];
    const betOptions = ['$0.5', '$1'];
    const ruleOptions = ['Переводной', 'Классический'];

    // Начальные выбранные значения
    const selectedPlayers = ref([3]);
    const selectedBet = ref(['$0.5']);
    const selectedRule = ref(['Переводной']);

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

    const saveSettings = () => {
      events.emit('hidePopup');
      console.log({
        players: selectedPlayers.value,
        bet: selectedBet.value,
        rule: selectedRule.value
      });
    };

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
      saveSettings
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

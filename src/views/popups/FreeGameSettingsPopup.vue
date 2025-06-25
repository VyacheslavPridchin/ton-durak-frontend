<template>
  <div class="game-settings">
    <h1>Настройки бесплатной игры</h1>

    <div class="toggle-group">
      <h2>Кол-во игроков</h2>
      <div class="toggles">
        <button
            v-for="option in playerOptions"
            :key="option"
            :class="['secondary-button', { selected: (selectedPlayers.includes(option) && option <= 2) }, { 'animate-press': option <= 2 }]"
            @click="togglePlayers(option)"
            :disabled="option > 2"
        >
          {{ option }}
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
import { events } from "@/events.ts";
import apiService from "@/services/ApiService";

export default defineComponent({
  setup() {
    const playerOptions = [2, 3, 4];
    const ruleOptions = ['Переводной', 'Классический'];

    const selectedPlayers = ref<number[]>([]);
    const selectedRule = ref<string[]>([]);

    const loadSettings = () => {
      selectedPlayers.value = JSON.parse(localStorage.getItem('selectedPlayersFree') || '[2]');
      selectedRule.value = JSON.parse(localStorage.getItem('selectedRuleFree') || '["Классический", "Переводной"]');

      selectedPlayers.value = selectedPlayers.value.filter((item) => item >= 2);
      if (selectedPlayers.value.length === 0) selectedPlayers.value.push(2);
    };

    const saveSettings = () => {
      localStorage.setItem('selectedPlayersFree', JSON.stringify(selectedPlayers.value));
      localStorage.setItem('selectedRuleFree', JSON.stringify(selectedRule.value));
      events.emit('hidePopup');
    };

    const togglePlayers = (option: number) => {
      if (selectedPlayers.value.includes(option)) {
        if (selectedPlayers.value.length === 1) return;
        selectedPlayers.value = selectedPlayers.value.filter(item => item !== option);
      } else {
        selectedPlayers.value.push(option);
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

    onMounted(async () => {
      await apiService.postVisit('game_settings_popup');
    });

    onMounted(() => {
      loadSettings();
    });

    return {
      playerOptions,
      ruleOptions,
      selectedPlayers,
      selectedRule,
      togglePlayers,
      toggleRule,
      saveSettings,
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

button:disabled {
  opacity: 0.3;
}
</style>

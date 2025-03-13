<template>
  <div class="panel expandable-panel animate-press">
    <div class="panel-header">
      <div class="icon-container">
        <img class="icon-img" :src="iconSrc" alt="icon" />
      </div>
      <h2>{{ cryptoNetwork }}</h2>
      <button
          class="right-button"
      >
        <img class="icon" src="@/assets/icons/next-icon.svg" alt="Settings Icon" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, toRefs } from 'vue';
import {useRouter} from "vue-router";

const props = defineProps<{
  cryptoNetwork: string;
  iconSrc: string;
}>();

const {
  cryptoNetwork,
  iconSrc,
} = toRefs(props);
</script>

<style scoped>
.expandable-panel {
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 2vh;
  border: none;
  outline: none;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5vh;
  height: 4.5vh;
  border-radius: 50%;
  background: var(--blue-gradient);
  margin-right: 1.5vh;
}

.icon-img {
  height: 2.5vh;
  width: 2.5vh;
}

.right-button {
  margin-left: auto;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 2.4vh;
  width: 2.4vh;
  border-radius: 50%;
  background: var(--gray-color);
}

.right-button img {
  height: 50%;
  display: block;
}
</style>

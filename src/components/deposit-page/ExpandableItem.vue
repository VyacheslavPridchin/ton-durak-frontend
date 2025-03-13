<template>
  <div class="expandable-panel-wrapper">
    <!-- Заголовок в виде кнопки с плюс/минус, сохраняя визуальные стили -->
    <button class="collapsible" @click="toggleExpand" :class="{ expanded: expanded }">
      <div class="icon-container">
        <img class="icon-img" :src="iconSrc" alt="icon" />
      </div>
      <h2>{{ cryptoNetwork }}</h2>
    </button>

    <!-- Контент, который разворачивается/сворачивается -->
    <div
        class="content"
        ref="contentRef"
        :style="{ maxHeight: expanded ? contentHeight : '0px' }"
    >
      <div class="panel-inner-content">
        <hr class="divider" style="margin: 0 0 1vh 0" />
        <h2 style="margin-bottom: 1vh">Кошелек</h2>
        <div class="address-box animate-press" @click="copyAddress">
          <a class="address-text">{{ walletAddress }}</a>
          <button class="copy-button">
            <img src="@/assets/icons/copy-icon.svg" alt="Copy" />
          </button>
        </div>
        <a class="secondary-text" style="margin-bottom: 1.5vh">
          Отправляйте только <span style="font-weight: 500;">{{ cryptoNetwork }}</span> на этот адрес.
          Любые другие активы будут безвозвратно утеряны.
        </a>
        <h2 style="margin-bottom: 1vh">Детали</h2>
        <div class="details-row">
          <h2 class="details-title">Примерный курс (1 {{ cryptoName }}):</h2>
          <a class="details-value">${{ approximateRate }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Минимальная сумма:</h2>
          <a class="details-value">{{ minAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Рекомендованная сумма:</h2>
          <a class="details-value">{{ recommendedAmount }} {{ cryptoName }}</a>
        </div>
        <div class="details-row">
          <h2 class="details-title">Комиссия сети:</h2>
          <a class="details-value">{{ networkFee }} {{ cryptoName }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  cryptoNetwork: string;
  cryptoName: string;
  walletAddress: string;
  approximateRate: number;
  minAmount: number;
  recommendedAmount: number;
  networkFee: number;
  iconSrc: string;
  expanded: boolean;
}>();

const emit = defineEmits<{ (e: 'toggle'): void }>();

const expanded = ref(props.expanded);
watch(() => props.expanded, newVal => {
  expanded.value = newVal;
});

const contentRef = ref<HTMLElement | null>(null);
const contentHeight = ref('0px');

const updateHeight = () => {
  if (contentRef.value) {
    contentHeight.value = contentRef.value.scrollHeight + 'px';
  }
};

const toggleExpand = () => {
  expanded.value = !expanded.value;
  emit('toggle');
  nextTick(updateHeight);
};

const copyAddress = () => {
  navigator.clipboard.writeText(props.walletAddress);
};

onMounted(() => {
  nextTick(updateHeight);
});
watch(expanded, () => {
  nextTick(updateHeight);
});
</script>

<style scoped>
.expandable-panel-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-bottom: 1vh;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 1.2vh;
}

/* Фон панели с анимацией */
.panel-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff; /* задайте нужный фон */
  transform-origin: top;
  transform: scaleY(0);
  transition: transform 0.5s ease;
  z-index: 0;
}
.panel-bg.expanded {
  transform: scaleY(1);
}

/* Заголовок в виде кнопки (collapsible) */
.collapsible {
  background-color: #777;
  color: white;
  cursor: pointer;
  padding: 18px;
  width: 100%;
  border: none;
  text-align: left;
  outline: none;
  font-size: 15px;
  display: flex;
  align-items: center;
  z-index: 2;
}
.collapsible:hover,
.collapsible.expanded {
  background-color: #555;
}
.collapsible:after {
  content: '\002B';
  color: white;
  font-weight: bold;
  margin-left: auto;
}
.collapsible.expanded:after {
  content: "\2212";
}

/* Стили для иконки */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5vh;
  height: 4.5vh;
  border-radius: 50%;
  background: linear-gradient(90deg, #2D83EC, #1AC9FF);
  margin-right: 1.5vh;
}
.icon-img {
  height: 2.5vh;
  width: 2.5vh;
}

/* Контент, который разворачивается */
.content {
  padding: 0 18px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  background-color: #f1f1f1;
  z-index: 1;
}

/* Внутреннее содержимое панели */
.panel-inner-content {
  padding: 0 2vh 2vh 2vh;
}

/* Разделитель */
.divider {
  margin: 0 0 1vh 0;
}

/* Стили для адресного блока */
.address-box {
  display: flex;
  align-items: center;
  background: #F5F4F4;
  border-radius: 1vh;
  padding: 1vh;
  margin: 0 0 0.25vh 0;
  height: 3vh;
}
.address-text {
  font-size: 1.75vh;
  color: #000;
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}
.copy-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}
.copy-button img {
  width: 2vh;
  height: 2vh;
}

/* Стили для деталей */
.details-row {
  margin-top: 0.25vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
}
.details-title {
  text-align: left;
  font-size: 1.75vh;
  color: rgba(0, 0, 0, 0.75);
}
.details-value {
  margin-left: auto;
  font-size: 1.75vh;
}
</style>

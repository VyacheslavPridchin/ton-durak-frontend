<template>
  <div class="panel">
    <h2 class="stats-title">Статистика за 7 дней</h2>
    <div class="chart-container placeholder-container" :class="{ isLoading: isLoadingData }">
      <div class="bars">
        <div
            v-for="(item, index) in data"
            :key="index"
            class="bar-container"
        >
          <div
              class="bar"
              :style="{ height: animatedHeights[index] + '%' }"
          >
            <a class="bar-label">${{ item.value }}</a>
          </div>
        </div>
      </div>
      <hr class="divider" />
      <div class="days">
        <div
            v-for="(item, index) in data"
            :key="index"
            class="day-container"
        >
          <a class="day-label">{{ item.day }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';

export default defineComponent({
  name: 'WeeklyStatsChart',
  props: {
    data: {
      type: Array as () => { day: string; value: number }[],
      required: true,
    },
  },
  setup(props) {
    const maxValue = computed(() =>
        Math.max(...props.data.map(d => d.value))
    );

    const animatedHeights = ref<number[]>(props.data.map(() => 15));
    const isLoadingData = ref(true);

    // Функция для анимации столбиков
    const animate = (dataArr: { day: string; value: number }[]) => {
      // Сброс анимированных высот до дефолтного размера 15
      animatedHeights.value = dataArr.map(() => 15);
      // Запуск анимации с задержкой
      dataArr.forEach((d, index) => {
        setTimeout(() => {
          animatedHeights.value[index] =
              Math.max(d.value / maxValue.value, 0.15) * 100;
        }, index * 50);
      });
    };

    onMounted(() => {
      isLoadingData.value = true;
    });

    // Watch на получение данных
    watch(
        () => props.data,
        (newData) => {
          isLoadingData.value = false;
          animate(newData);
        },
        { immediate: true, deep: true }
    );

    return { maxValue, animatedHeights, isLoadingData };
  },
});
</script>

<style scoped>
.stats-title {
  margin-bottom: 1vh;
  text-align: left;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bars {
  display: flex;
  align-items: baseline;
  height: 20vh;
  width: 100%;
  padding: 0.2vh 0;
}

.bar-container {
  flex: 1;
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: flex-end;
}

.bar {
  width: 3vh;
  background: var(--blue-gradient);
  border-radius: 0.5vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height 0.75s ease-in-out;
}

.bar-label {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2vh;
  color: var(--white-color);
  z-index: 1;
}

.divider {
  width: 100%;
  border: none;
  height: 1px;
  background: var(--gray-color);
  margin: 0.5vh 0;
}

.days {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.day-container {
  flex: 1;
  text-align: center;
}

.day-label {
  font-size: 1.5vh;
  color: var(--white-color);
  min-height: 1.5vh;
}
</style>

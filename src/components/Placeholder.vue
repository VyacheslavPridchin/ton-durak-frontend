<template>
  <div class="placeholder-wrapper" :class="{ loading }">
    <!-- Контент всегда отрисовывается, чтобы сохранялись размеры и положение,
         но стиль передается через customClass -->
    <div class="content" :class="customClass">
      <slot />
    </div>
    <!-- Абсолютно позиционированный плейсхолдер -->
    <div v-if="loading" class="placeholder-overlay">
      <slot name="fallback">
        <div class="default-placeholder" :class="customClass"></div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UniversalPlaceholder',
  // Не наследуем атрибуты, чтобы можно было вручную перенаправить классы
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { attrs }) {
    // Извлекаем только класс, чтобы применить его к внутренним элементам
    const customClass = computed(() => attrs.class);
    return { customClass };
  },
});
</script>

<style scoped>
.placeholder-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.content {
  transition: opacity 0.3s ease;
}
.loading .content {
  opacity: 0;
}
.placeholder-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.default-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 4px; /* можно переопределить через переданный класс */
  background: linear-gradient(90deg, var(--gray-color, #e0e0e0) 25%, var(--secondary-text-color, #f0f0f0) 50%, var(--gray-color, #e0e0e0) 75%);
  background-size: 200% 100%;
  animation: gradientFlow 1.5s ease-in-out infinite;
}

@keyframes gradientFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

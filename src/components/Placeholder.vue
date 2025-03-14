<template>
  <div class="placeholder-wrapper" :class="{ loading }">
    <!-- Контент всегда отрисовывается, чтобы сохранялись размеры и положение -->
    <div class="content">
      <slot />
    </div>
    <!-- Абсолютно позиционированный placeholder -->
    <div v-if="loading" class="placeholder-overlay">
      <slot name="fallback">
        <div class="default-placeholder"></div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UniversalPlaceholder',
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style scoped>
.placeholder-wrapper {
  position: relative;
  /* По умолчанию размеры задаются контентом */
}

.content {
  transition: opacity 0.3s ease;
}

/* Когда loading, контент скрываем (но он занимает место) */
.loading .content {
  opacity: 0;
}

/* Placeholder накладывается поверх всего контента */
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

/* Стандартная анимация для placeholder */
.default-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 4px;
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

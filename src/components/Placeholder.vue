<template>
  <template v-if="internalLoading">
    <slot name="fallback">
      <div class="default-placeholder" :class="customClass"></div>
    </slot>
  </template>
  <template v-else>
    <slot />
  </template>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onUnmounted } from 'vue';

export default defineComponent({
  name: 'UniversalPlaceholder',
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { attrs }) {
    const customClass = computed(() => attrs.class);
    const internalLoading = ref(props.loading);
    let timeoutId: number | null = null;

    watch(
        () => props.loading,
        (newVal) => {
          if (newVal) {
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
            internalLoading.value = true;
          } else {
            timeoutId = window.setTimeout(() => {
              internalLoading.value = false;
            }, 3000);
          }
        },
        { immediate: true }
    );

    onUnmounted(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });

    return { customClass, internalLoading };
  },
});
</script>

<style scoped>
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

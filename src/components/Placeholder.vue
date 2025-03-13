<template>
  <div class="loader-wrapper">
    <transition name="fade">
      <template v-if="loading">
        <slot name="fallback">
          <div class="placeholder" :style="{ height: `${contentHeight}px` }"></div>
        </slot>
      </template>
      <template v-else>
        <div ref="content" class="content">
          <slot />
        </div>
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';

export default defineComponent({
  name: 'Placeholder',
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const contentHeight = ref(0);
    const content = ref<HTMLElement | null>(null);

    const updateHeight = () => {
      if (content.value) {
        contentHeight.value = content.value.offsetHeight;
      }
    };

    onMounted(() => {
      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      if (content.value) observer.observe(content.value);
    });

    watch(() => props.loading, async (newVal) => {
      if (!newVal) {
        await nextTick(); // Ждём рендеринг контента
        updateHeight();
      }
    });

    return { contentHeight, content };
  }
});
</script>

<style scoped>
.loader-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder {
  width: 40%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.5vh;
  border-radius: 0.5vh;
  background: linear-gradient(90deg, var(--gray-color) 25%, var(--secondary-text-color) 50%, var(--gray-color) 75%);
  background-size: 200% 100%;
  animation: gradientFlow 1.5s ease-in-out infinite;
}

.content {
  position: absolute;
}

@keyframes gradientFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
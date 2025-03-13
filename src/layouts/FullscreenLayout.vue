<script setup lang="ts">
import { ref, watch, computed, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface FullscreenLayoutProps {
  /** Пути, для которых данный лэйаут не отображается */
  excludePaths: string[]
}
const props = defineProps<FullscreenLayoutProps>()

const route = useRoute()
const router = useRouter()

const shouldRender = computed(() => !props.excludePaths.includes(route.path))

const currentComponent = ref<any>(null)
const currentKey = ref(route.path)
const transitionName = ref('slide-left')

// Запоминаем текущую позицию истории
let previousPosition = window.history.state?.position || 0

function loadComponent(path: string) {
  const matchingRoute = router.getRoutes().find(r => r.path === path)
  if (matchingRoute && matchingRoute.components && matchingRoute.components.default) {
    return markRaw(matchingRoute.components.default)
  }
  return null
}

// Инициализация текущей страницы
if (shouldRender.value) {
  currentComponent.value = loadComponent(route.path)
}

watch(() => route.path, (newPath) => {
  const newPosition = window.history.state?.position || 0

  // Если новый путь входит в excludePaths, задаём анимацию как при переходе назад
  if (props.excludePaths.includes(newPath)) {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = newPosition < previousPosition ? 'slide-right' : 'slide-left'
  }
  previousPosition = newPosition

  if (!shouldRender.value) {
    currentComponent.value = null
    return
  }

  // Загружаем новую страницу
  currentComponent.value = loadComponent(newPath)
  currentKey.value = newPath
})
</script>

<template>
  <transition :name="transitionName">
    <div v-if="shouldRender" class="fullscreen-layout">
      <transition :name="transitionName">
        <component
            v-if="currentComponent"
            :is="currentComponent"
            :key="currentKey"
            class="layer"
        />
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fullscreen-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Анимация для перехода вперёд: старая страница уходит влево, новая появляется справа */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30vh);
}
.slide-left-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30vh);
}

/* Анимация для перехода назад (и для excludePaths): старая страница уходит вправо, новая появляется слева */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30vh);
}
.slide-right-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30vh);
}
</style>

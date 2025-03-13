<script setup lang="ts">
import { ref, watch, computed, markRaw, onMounted, nextTick  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import SlideContainer from './SlideContainer.vue'

interface SliderLayoutProps {
  sliderPaths: string[]
}
const props = defineProps<SliderLayoutProps>()

const router = useRouter()
const route = useRoute()

// Отбираем маршруты, чей путь входит в sliderPaths, и сортируем согласно порядку в массиве
const sliderRoutes = computed(() => {
  return router.getRoutes()
      .filter(r => props.sliderPaths.includes(r.path))
      .sort((a, b) => props.sliderPaths.indexOf(a.path) - props.sliderPaths.indexOf(b.path))
})

// Массив путей слайдера
const pages = computed(() => sliderRoutes.value.map(r => r.path))

const shouldRender = computed(() => props.sliderPaths.includes(route.path))

// Формируем mapping: путь → компонент (берем r.components.default) и оборачиваем через markRaw
const componentsMap: Record<string, any> = {}
sliderRoutes.value.forEach(r => {
  if (r.components && r.components.default) {
    componentsMap[r.path] = markRaw(r.components.default)
  }
})

// Определяем текущий индекс (если route.path не найден, то 0)
const initialIndex = pages.value.indexOf(route.path)
const currentIndex = ref(initialIndex !== -1 ? initialIndex : 0)
const targetIndex = ref(currentIndex.value)
const initialLoad = ref(true)
const isSwiping = ref(false)

// Флаги для видимости слайдов:
// activatedSlides – содержит путь полностью активного (открытого) слайда
// previewSlides – временно содержит путь слайда, который показывается в preview (при свайпе)
const activatedSlides = ref(new Set<string>())
const previewSlides = ref(new Set<string>())
activatedSlides.value.add(pages.value[currentIndex.value])

// Для вызова метода Initialize сохраняем ссылки на экземпляры динамических компонентов
const componentRefs = ref<Record<string, any>>({})

// Ссылка на экземпляр Swiper
const swiperInstance = ref<any>(null)
function onSwiper(swiper: any) {
  swiperInstance.value = swiper
}

// При перелистывании (slideChange) обновляем targetIndex, вызываем router.push
// и сразу добавляем целевой слайд в preview, чтобы его превью отображалось до окончания анимации
function onSlideChange(swiper: any) {
  // Если новый индекс совпадает с текущим, значит, ложное срабатывание – выходим
  if (swiper.activeIndex === currentIndex.value) return;

  targetIndex.value = swiper.activeIndex;
  const targetPage = pages.value[swiper.activeIndex];
  if (targetPage !== route.path) {
    router.push(targetPage);
  }
  previewSlides.value.add(targetPage);
  isSwiping.value = true;
}


// После завершения анимации (slideChangeTransitionEnd) обновляем активный слайд,
// очищаем preview и вызываем метод Initialize у активного слайда.
function onTransitionEnd() {
  const activePage = pages.value[targetIndex.value]
  const instance = componentRefs.value[activePage]
  if (instance && typeof instance.Load === 'function' && currentIndex.value != targetIndex.value) {
    instance.Load()
  }

  currentIndex.value = targetIndex.value
  isSwiping.value = false
  activatedSlides.value = new Set([pages.value[currentIndex.value]])
  previewSlides.value.clear()
}

// Если маршрут меняется извне, синхронизируем слайдер
watch(() => route.path, (newPath) => {
  nextTick(() => {
    const newIndex = pages.value.indexOf(newPath)

    if (newIndex !== -1 && swiperInstance.value)
    {
      if (initialLoad.value) {
        swiperInstance.value.slideTo(newIndex, 0, false)
        initialLoad.value = false
        currentIndex.value = newIndex
        targetIndex.value = newIndex
        activatedSlides.value = new Set([pages.value[newIndex]])
        nextTick(() => {
          const instance = componentRefs.value[newPath]
          if (instance && typeof instance.Load === 'function') {
            instance.Load()
          }
        })
      } else {
        swiperInstance.value.slideTo(newIndex)
        targetIndex.value = newIndex
        previewSlides.value.add(pages.value[newIndex])
        isSwiping.value = true
      }
    }
  })

})

// --- Обработка событий (touch и pointer) для preview ---
const startX = ref(0)
const threshold = 10  // порог в пикселях для активации preview

// Touch-обработчики
function handleTouchStart(e: TouchEvent) {
  startX.value = e.touches[0].clientX
}
function handleTouchMove(e: TouchEvent) {
  updatePreview(e.touches[0].clientX)
}

// Pointer-обработчики (для ПК)
function handlePointerDown(e: PointerEvent) {
  startX.value = e.clientX
}
function handlePointerMove(e: PointerEvent) {
  updatePreview(e.clientX)
}

// Общая функция для обновления preview на основе текущей позиции
function updatePreview(clientX: number) {
  if (!swiperInstance.value) return
  const slideWidth = swiperInstance.value.width
  const activePos = -currentIndex.value * slideWidth
  const currentTranslate = swiperInstance.value.translate
  const offset = currentTranslate - activePos
  // Если свайп влево (следующий слайд справа)
  if (offset < 0 && currentIndex.value < pages.value.length - 1) {
    if (Math.abs(offset) >= threshold) {
      previewSlides.value.add(pages.value[currentIndex.value + 1])
    } else {
      previewSlides.value.delete(pages.value[currentIndex.value + 1])
    }
  }
  // Если свайп вправо (предыдущий слайд слева)
  if (offset > 0 && currentIndex.value > 0) {
    if (offset >= threshold) {
      previewSlides.value.add(pages.value[currentIndex.value - 1])
    } else {
      previewSlides.value.delete(pages.value[currentIndex.value - 1])
    }
  }
}

onMounted(() => {
  if (pages.value.includes(route.path)) {
    activatedSlides.value.add(route.path)
  }
})
</script>

<template>
  <transition name="fade">
    <div v-if="shouldRender" class="slider-layout"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
    >
      <Swiper
          :initial-slide="currentIndex"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
          @transitionEnd="onTransitionEnd"
          class="page-swiper"
      >
        <SwiperSlide v-for="page in pages" :key="page">
          <SlideContainer :enabled="activatedSlides.has(page) || previewSlides.has(page)" style="width: 100%;height: 100%;">
            <component :is="componentsMap[page]"
                       :ref="(el: any) => { componentRefs[page] = el }"
            />
          </SlideContainer>
        </SwiperSlide>
      </Swiper>
    </div>
  </transition>
</template>

<style scoped>
.slider-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* если требуется занять весь экран */
  display: flex;
  flex-direction: column;
  z-index: 1;

}
.page-swiper {
  width: 100vw;
  flex: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10vh);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

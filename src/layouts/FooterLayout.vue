<template>
  <transition name="footer-transition">
    <footer v-if="shouldRender" class="footer">
      <div class="buttons-container" ref="containerRef">
        <div
            v-for="(highlight, i) in highlights"
            :key="i"
            class="highlight"
            :style="highlight.style"
            :ref="el => highlightsRefs[i] = el"
        ></div>
        <div
            v-for="(item, index) in links"
            :key="item.name"
            class="icon-wrapper"
            :class="{ active: currentIndex === index }"
            @click="navigate(item.route)"
            :ref="el => iconRefs[index] = el"
        >
          <img :src="item.icon" alt="icon" />
        </div>
      </div>
    </footer>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ReferralsIcon from '@/assets/icons/referrals-menu-icon.svg'
import MainIcon from '@/assets/icons/main-menu-icon.svg'
import ProfileIcon from '@/assets/icons/profile-menu-icon.svg'

interface LinkItem {
  name: string
  icon: string
  route: string
}

interface Highlight {
  style: Record<string, any>
  baseTransform: string
  visible: boolean
}

interface FullscreenLayoutProps {
  /** Пути, для которых данный лэйаут не отображается */
  excludePaths: string[]
}

const props = defineProps<FullscreenLayoutProps>()
const route = useRoute()
const shouldRender = computed(() => !props.excludePaths.includes(route.path))

const links: LinkItem[] = [
  { name: 'Referrals', icon: ReferralsIcon, route: '/referrals' },
  { name: 'Main', icon: MainIcon, route: '/main' },
  { name: 'Profile', icon: ProfileIcon, route: '/profile' }
]

const router = useRouter()
const currentIndex = ref(-1)
const previousIndex = ref(-1)

const containerRef = ref<HTMLElement | null>(null)
const iconRefs: (HTMLElement | any)[] = []
const highlightsRefs: (HTMLElement | any)[]  = []

const originalHighlightWidth = ref(0)

const highlights = ref<Highlight[]>(
    Array(3)
        .fill(null)
        .map(() => ({
          style: {
            transform: 'translateX(0px) translateY(0px) rotate(0deg) scale(0)',
            zIndex: 0,
            transition: 'transform 0.3s ease',
          },
          baseTransform: 'translateX(0px) translateY(0px) rotate(0deg)',
          visible: true
        }))
)

onMounted(() => {
  nextTick(() => {
    if (highlightsRefs[1]) {
      originalHighlightWidth.value = parseFloat(
          window.getComputedStyle(highlightsRefs[1]).width
      )
    }
    updateCurrentIndex()
  })
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

watch(() => route.path, updateCurrentIndex)

function updateCurrentIndex() {
  const foundIndex = links.findIndex(link => link.route === route.path)
  if (foundIndex === -1) {
    previousIndex.value = currentIndex.value
    currentIndex.value = -1
    nextTick(() => updateHighlightPositions())
    return
  }
  previousIndex.value = currentIndex.value === -1 ? 0 : currentIndex.value
  currentIndex.value = foundIndex
  nextTick(() => updateHighlightPositions(previousIndex.value < currentIndex.value))
}

function navigate(to: string) {
  // @ts-ignore
  window.Telegram.WebApp.HapticFeedback.impactOccurred("medium")
  router.push(to)
}

const windowWidth = ref(window.innerWidth)
function onResize() {
  if (highlightsRefs[1]) {
    originalHighlightWidth.value = parseFloat(
        window.getComputedStyle(highlightsRefs[1]).width
    )
  }
  windowWidth.value = window.innerWidth
  nextTick(updateHighlightPositions)
}

function updateHighlightPositions(isForward: boolean = true) {
  if (currentIndex.value === -1) {
    highlights.value.forEach((highlight, index) => {
      const duration = 0.3 + index * 0.1
      const base = highlight.baseTransform || 'translateX(0px) translateY(0px) rotate(0deg)'
      highlight.style = {
        transform: `${base} scale(0)`,
        transition: `transform ${duration}s ease`,
        zIndex: 0
      }
      highlight.visible = false
    })
    return
  }

  if (!containerRef.value) return
  const iconEl = iconRefs[currentIndex.value]
  if (!iconEl) return
  const containerRect = containerRef.value.getBoundingClientRect()
  const iconRect = iconEl.getBoundingClientRect()

  const highlightWidth = originalHighlightWidth.value || 0
  const baseLeft = iconRect.left - containerRect.left + iconRect.width / 2 - highlightWidth / 2
  const offset = 20

  const orderedHighlights = isForward ? [...highlights.value].reverse() : highlights.value
  let counter = isForward ? 1 : -1

  orderedHighlights.forEach((highlight, index) => {
    const highlightIndex = counter
    const baseTransform = `translateX(${baseLeft + highlightIndex * offset}px) translateY(${highlightIndex === 0 ? 0 : 0.7}vh) rotate(${highlightIndex * 15}deg)`
    highlight.baseTransform = baseTransform
    const duration = 0.3 + index * 0.1

    if (!highlight.visible) {
      highlight.style = {
        transform: `${baseTransform} scale(0)`,
        transition: 'none',
        zIndex: index === 1 ? 1 : 0
      }
      setTimeout(() => {
        highlight.style = {
          transform: `${baseTransform} scale(1)`,
          transition: `transform ${duration}s ease`,
          zIndex: index === 1 ? 1 : 0
        }
        highlight.visible = true
      }, 20)
    } else {
      highlight.style = {
        transform: `${baseTransform} scale(1)`,
        transition: `transform ${duration}s ease`,
        zIndex: index === 1 ? 1 : 0
      }
    }
    counter += isForward ? -1 : 1
  })
}
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: row;
  width: 100%;
  position: relative;
  justify-content: space-around;
  align-items: center;
  height: 8vh;
  margin-top: auto;
  padding: 1.5vh 0 2.5vh 0;
  bottom: 0;
}

/* Transition для анимации высоты, padding и opacity */
.footer-transition-enter-active,
.footer-transition-leave-active {
  transition: height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}
.footer-transition-enter-from,
.footer-transition-leave-to {
  height: 0;
  padding: 0;
  opacity: 0;
}
.footer-transition-enter-to,
.footer-transition-leave-from {
  height: 8vh;
  padding: 1.5vh 0 2.5vh 0;
  opacity: 1;
}

.buttons-container {
  height: 100%;
  width: 100%;
  max-width: 50vh;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.highlight {
  position: absolute;
  width: 4vh;
  height: 6vh;
  top: 0.5vh;
  left: 0;
  border-radius: 1vh;
  background: var(--blue-gradient);
  z-index: 0;
}

.icon-wrapper {
  position: relative;
  z-index: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: brightness(30%);
  transition: filter 0.3s ease;
  border: none;
  outline: none;
  user-select: none;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.icon-wrapper::before {
  content: '';
  position: absolute;
  top: -2vh;
  bottom: -2vh;
  left: -2vh;
  right: -2vh;
  background: transparent;
}

.icon-wrapper.active {
  color: #fff;
  filter: brightness(90%);
}

.icon-wrapper img {
  width: 2.8vh;
  height: 2.8vh;
}
</style>

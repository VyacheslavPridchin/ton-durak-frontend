<template>
  <div
    ref="cardElement"
    class="card"
    :class="{ 'is-dragging': isDragging }"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div class="card-background">
      <img v-if="cachedImage" :src="cachedImage" :alt="`${props.rank} of ${props.suit}`" class="card-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted  } from 'vue';
import { gsap } from 'gsap';
import { CardUtils } from '../../../../utils/CardUtils';
import { EventService, EventType } from '../../../../network/EventService';
import { ImageCache } from '../../../../utils/ImageCache';

const props = defineProps<{
  cardId: string;
  rank: CardUtils.Rank;
  suit: CardUtils.Suit;
  skin: string;
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  isFaceDown?: boolean;
}>();

const emit = defineEmits(['update-position']);

const cardElement = ref<HTMLElement | null>(null);

const isDragging = ref(false);
const isAnimating = ref(false);
const canDrag = ref(true);

const isFaceDown = ref(props.isFaceDown ?? false);

const x = ref(props.x);
const y = ref(props.y);
const rotation = ref(props.rotation ?? 0);
const scale = ref(props.scale ?? 1);
const zIndex = ref(props.zIndex ?? 1);

const location = ref<CardUtils.Location>(CardUtils.Location.Deck);

const rank = ref(props.rank);
const suit = ref(props.suit);

const cachedImage = ref<string | null>(null);

async function loadCardImage() {
  try {
    const imagePath = isFaceDown.value
      ? CardUtils.getCardImagePath(props.skin, CardUtils.Suit.Unknown, CardUtils.Rank.Unknown)
      : CardUtils.getCardImagePath(props.skin, suit.value, rank.value);

    const img = await ImageCache.getImage(imagePath);
    if (img) {
      cachedImage.value = img.src;
    } else {
      console.error(`Не удалось загрузить изображение: ${imagePath}`);
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
  }
}

function setLocation(newLocation: CardUtils.Location) {
  location.value = newLocation;
}

function setAppearance(newRank: CardUtils.Rank, newSuit: CardUtils.Suit, newIsFaceDown: boolean = false){
  rank.value = newRank;
  suit.value = newSuit;
  isFaceDown.value = newIsFaceDown;
  loadCardImage();
}

function getCoordinates(): { x: number; y: number } {
  if (!cardElement.value) {
    console.warn('cardElement is not defined.');
    return { x: 0, y: 0 };
  }

  // Получаем значения 'x' и 'y' с единицами измерения 'px'
  const xValue = gsap.getProperty(cardElement.value, 'x', 'px');
  const yValue = gsap.getProperty(cardElement.value, 'y', 'px');

  // Преобразуем значения к числу, если они являются строками
  const x = typeof xValue === 'number' ? xValue : parseFloat(xValue);
  const y = typeof yValue === 'number' ? yValue : parseFloat(yValue);

  return { x, y };
}

/*const cardImage = computed(() => {
  return isFaceDown.value
    ? CardUtils.getCardImagePath(props.skin, CardUtils.Suit.Unknown, CardUtils.Rank.Unknown)
    : CardUtils.getCardImagePath(props.skin, suit.value, rank.value); // Используем реактивные rank и suit
});*/

onMounted(() => {
  if (cardElement.value) {
    gsap.set(cardElement.value, {
      x: x.value,
      y: y.value,
      rotation: rotation.value,
      scale: scale.value,
      transformOrigin: '50% 50%',
      xPercent: -50,
      yPercent: -50,
    });
  }

  loadCardImage();
});

watch(() => props.isFaceDown, (newVal) => {
  if (newVal !== undefined) {
    isFaceDown.value = newVal;
  }
});

let liftAnimation: gsap.core.Tween | null = null;
let dropAnimation: gsap.core.Tween | null = null;

function animateLift() {
  dropAnimation?.kill();
  dropAnimation = null;
  if (cardElement.value) {
    liftAnimation = gsap.to(cardElement.value, {
      duration: 0.1,
      scale: 0.85,
      rotation: 0,
      ease: 'power2.out',
    });
  }
}

function animateDrop() {
  liftAnimation?.kill();
  liftAnimation = null;
}

function moveTo(
    newX: number,
    newY: number,
    newRotation = 0,
    newScale = 1,
    duration = 0.5,
    newCanDrag = true,
    newZIndex = 1,
    newIsFaceDown = isFaceDown.value
) {
  if (isDragging.value) return;
  if(location.value !== CardUtils.Location.Hand)
    isAnimating.value = true;
  canDrag.value = newCanDrag;
  x.value = newX;
  y.value = newY;
  rotation.value = newRotation;
  scale.value = newScale;
  zIndex.value = newZIndex;
  isFaceDown.value = newIsFaceDown;

  if (cardElement.value) {
    gsap.set(cardElement.value, { zIndex: newZIndex });
    gsap.to(cardElement.value, {
      x: newX,
      y: newY,
      rotation: newRotation,
      scale: newScale,
      xPercent: -50,
      yPercent: -50,
      duration,
      ease: 'power2.out',
      onComplete: () => {
        isAnimating.value = false;
      },
    });
  }
}

function set(
  newX: number,
  newY: number,
  newRotation = 0,
  newScale = 1,
  newCanDrag = true,
  newZIndex = 1,
  newIsFaceDown = isFaceDown.value
) {
  x.value = newX;
  y.value = newY;
  rotation.value = newRotation;
  scale.value = newScale;
  canDrag.value = newCanDrag;
  zIndex.value = newZIndex;
  isFaceDown.value = newIsFaceDown;

  if (cardElement.value) {
    gsap.set(cardElement.value, {
      x: newX,
      y: newY,
      rotation: newRotation,
      scale: newScale,
      xPercent: -50,
      yPercent: -50,
      zIndex: newZIndex,
    });
  }
}

let offsetX = 0;
let offsetY = 0;

function onMouseDown(e: MouseEvent) {
  if (isAnimating.value || !canDrag.value) return;
  isDragging.value = true;
  offsetX = e.clientX - x.value;
  offsetY = e.clientY - y.value;
  animateLift();
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}
function onMouseMove(e: MouseEvent) {
  x.value = e.clientX - offsetX;
  y.value = e.clientY - offsetY;
  if (cardElement.value) {
    gsap.set(cardElement.value, { x: x.value, y: y.value });
  }
  emit('update-position', { x: x.value, y: y.value });
}
function onMouseUp() {
  stopDrag();
}
function onTouchStart(e: TouchEvent) {
  if (!canDrag.value) return;

  isDragging.value = true;
  const t = e.touches[0];
  offsetX = t.clientX - x.value;
  offsetY = t.clientY - y.value;
  animateLift();
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);
}
function onTouchMove(e: TouchEvent) {
  const t = e.touches[0];
  x.value = t.clientX - offsetX;
  y.value = t.clientY - offsetY;
  if (cardElement.value) {
    gsap.set(cardElement.value, { x: x.value, y: y.value });
  }
  emit('update-position', { x: x.value, y: y.value });
}
function onTouchEnd() {
  stopDrag();
}

function stopDrag() {
  isDragging.value = false;
  animateDrop();
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
  EventService.Instance.emit(EventType.TryAttackOrDefend, {
    suit: props.suit,
    rank: props.rank,
  });
}

onUnmounted(() => {
  // Очистка обработчиков событий
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);

  // Очистка анимаций
  liftAnimation?.kill();
  dropAnimation?.kill();

  cachedImage.value = null;
  cardElement.value = null;
});

defineExpose({
  moveTo,
  set,
  setLocation,    // Новый метод
  setAppearance,
  location,        // Чтобы обращаться к свойству напрямую
  getCoordinates
});
</script>

<style scoped>
.card {
  height: 22vh; /* Увеличиваем размер карты */
  width: calc(22vh * (130 / 190)); /* Сохраняем пропорции */
  position: absolute;
  top: 0;
  left: 0;
  border-radius: calc(22vh * 0.05); /* Скругление углов */
  box-shadow: 0 calc(22vh * 0.02) calc(22vh * 0.03) rgba(0, 0, 0, 0.2);
  user-select: none;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transform-origin: center;
}

.card-background {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
}

.is-dragging {
  z-index: 5000 !important;
}
</style>



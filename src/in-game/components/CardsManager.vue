<template>
  <div class="cards-container">
    <Card
      v-for="card in cards"
      :key="card.id"
      :ref="(el) => setRef(el, card.id)"
      :cardId="card.id"
      :rank="card.rank"
      :suit="card.suit"
      :skin="card.skin"
      :x="card.x"
      :y="card.y"
      :rotation="card.rotation"
      :scale="card.scale"
      :zIndex="card.zIndex"
      :isFaceDown="card.isFaceDown"
    />
    <img v-if="trumpSuitIcon" :src="trumpSuitIcon" class="trump-icon" />
    <img v-if="transferIconData.isVisible && transferIcon" :src="transferIcon" class="transfer-icon" :style="{ left: transferIconData.posX + 'px', top: transferIconData.posY + 'px' }" />
    <div v-if="cardsCount > 0" class="cards-pill">{{ cardsCount }}</div>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type ComponentPublicInstance, onMounted, onUnmounted } from 'vue';
import Card from '@/in-game/components/prefabs/Card.vue';
import { CardUtils } from '../utils/CardUtils.ts';
import { ImageCache } from '../utils/ImageCache.ts';
import { EventService, EventType } from '../network/EventService.ts';
import {Validator} from "../utils/Validator.ts";

type TransferIconData = {
  isVisible: boolean;
  posX: number;
  posY: number;
};

// Тип данных о карте
type CardData = {
  id: string; // Уникальный идентификатор
  rank: CardUtils.Rank;
  suit: CardUtils.Suit;
  skin: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  zIndex: number;
  isFaceDown: boolean;
};

// Тип компонента Card
type CardInstance = InstanceType<typeof Card>;

// Храним все данные
const cards = ref<CardData[]>([]);

// Ссылки на Vue-компоненты: cardRefs[id] = CardInstance
const cardRefs = ref<Record<string, CardInstance | null>>({});

const trumpSuitIcon = ref<string | null>(null);

const transferIconData = ref<TransferIconData>({ isVisible: false, posX: 0, posY: 0 });

const transferIcon = ref<string | null>(null);

// Храним количество карт
const cardsCount = ref<number>(0);

function onCardAmountSet(amount: number) {
  cardsCount.value = amount;
}

async function onTrumpSet(trumpCard: CardUtils.Card) {
  Validator.SetTrumpCard(trumpCard);
  if (trumpCard.suit && trumpCard.suit !== CardUtils.Suit.Unknown) {
    const iconPath = `/assets/icons/suits/${trumpCard.suit}.svg`;
    trumpSuitIcon.value = await ImageCache.getImage(iconPath).then(img => img?.src ?? null);
  } else {
    trumpSuitIcon.value = null;
  }
}

function onGameEnded() {
  Validator.SetBatComplete(false);

  trumpSuitIcon.value = null;

  setTimeout(() => {
    clearCards();
  }, 550);
}

function onTransferIconShow(event: { isVisible: boolean; posX: number; posY: number }) {
  const height = window.innerHeight / 100 * 22; /* Увеличиваем размер карты */
  const width = height * (130 / 190); /* Сохраняем пропорции */

  event.posX -= (width * 0.55) / 2;
  event.posY -= (height * 0.55) / 2;
  transferIconData.value = event;
}

async function loadTransferIcon() {
  const iconPath = `/assets/icons/transfer-card.svg`;
  transferIcon.value = await ImageCache.getImage(iconPath).then(img => img?.src ?? null);
}

function destroyInvalidCards() {
  // Удаляем инвалидные карты
  for (const card of [...cards.value]) {
    const refCmp = cardRefs.value[card.id];
    const isInvalid =
        (card.rank === undefined || card.suit === undefined || card.isFaceDown) &&
        refCmp && (refCmp as any).location === CardUtils.Location.Table;

    if (isInvalid) {
      destroyCardById(card.id);
    }
  }

  // Удаляем ссылки в cardRefs, если id нет в cards
  const validIds = new Set(cards.value.map(c => c.id));
  for (const id of Object.keys(cardRefs.value)) {
    if (!validIds.has(id)) {
      destroyCardById(id);
    }
  }
}


// Подписываемся на событие при монтировании
onMounted(() => {
  EventService.Instance.on(EventType.TrumpSet, onTrumpSet);
  EventService.Instance.on(EventType.GameEnded, onGameEnded);
  EventService.Instance.on(EventType.TransferIconShow, onTransferIconShow);
  EventService.Instance.on(EventType.DeckCardAmountChanged, onCardAmountSet);

  loadTransferIcon();
});

// Отписываемся при размонтировании
onUnmounted(() => {
  EventService.Instance.off(EventType.TrumpSet, onTrumpSet);
  EventService.Instance.off(EventType.GameEnded, onGameEnded);
  EventService.Instance.off(EventType.TransferIconShow, onTransferIconShow);
  EventService.Instance.off(EventType.DeckCardAmountChanged, onCardAmountSet);

  clearCards();
});

/** Функция для очистки ссылок и данных */
function clearCards() {
  // Очищаем все ссылки на компоненты
  cardRefs.value = {};

  // Очищаем данные о картах
  cards.value = [];

  console.log("Clear all cards");
}

/**
 * Коллбек-реф. Vue может передать:
 *  - null (размонтирование)
 *  - DOM-элемент (Element)
 *  - экземпляр компонента (ComponentPublicInstance)
 */
function setRef(el: Element | ComponentPublicInstance | null, id: string) {
  if (!el) {
    // el === null => компонент размонтирован
    delete cardRefs.value[id];
    return;
  }

  // Проверяем, является ли el действительно экземпляром Card
  const maybeCard = el as Partial<CardInstance>;
  if (maybeCard.$props?.cardId !== undefined) {
    // Это наш компонент
    cardRefs.value[id] = el as CardInstance;
  } else {
    // Это DOM-элемент или что-то ещё
    delete cardRefs.value[id];
  }
}

/** Поиск карты (компонента) по rank/suit - возвращает первую найденную */
function getCard(rank: CardUtils.Rank, suit: CardUtils.Suit) {
  const entry = Object.entries(cardRefs.value).find(([_, cmp]) =>
    cmp?.$props.rank === rank && cmp?.$props.suit === suit
  );
  return entry ? entry[1] : null;
}

/** Поиск карты (компонента) по ID */
function getCardById(id: string) {
  return cardRefs.value[id] ?? null;
}

/** Создание карты, возвращаем ссылку на компонент */
async function spawnCard(
  rank: CardUtils.Rank,
  suit: CardUtils.Suit,
  skin: string,
  x: number,
  y: number,
  rotation: number,
  scale: number,
  zIndex: number,
  isFaceDown = true
) {
  const newId = crypto.randomUUID();

  cards.value.push({
    id: newId,
    rank,
    suit,
    skin,
    x,
    y,
    rotation,
    scale,
    zIndex,
    isFaceDown
  });

  // Ждём монтирования
  await nextTick();

  const newCmp = getCardById(newId);
  if (!newCmp) {
    console.warn(`spawnCard: component with id=${newId} not found`);
    return null;
  }
  return newCmp;
}

/** Удаление карты по rank/suit (удаляем первую подходящую) */
function destroyCard(rank: CardUtils.Rank, suit: CardUtils.Suit) {
  const cmp = getCard(rank, suit);
  if (!cmp) {
    console.log(`destroyCard: no card component found with rank=${rank}, suit=${suit}. Perhaps all the cards have been cleared.`);
    return;
  }

  const idx = cards.value.findIndex(c => c.rank === rank && c.suit === suit);
  if (idx === -1) {
    console.log(`destroyCard: no card id found with rank=${rank}, suit=${suit}. Perhaps all the cards have been cleared.`);
    return;
  }

  cards.value.splice(idx, 1);
}

/** Удаление карты по ID */
function destroyCardById(id: string) {
  const idx = cards.value.findIndex(c => c.id === id);
  if (idx === -1) {
    console.log(`destroyCardById: no card with id=${id}. Perhaps all the cards have been cleared.`);
    return;
  }
  cards.value.splice(idx, 1);

  if (cardRefs.value[id]) {
    delete cardRefs.value[id];
  }
}

/** Проверяем существование карты (первая по rank/suit) */
function isCardExist(rank: CardUtils.Rank, suit: CardUtils.Suit): boolean {
  return !!getCard(rank, suit);
}

/** Проверяем существование карты по ID */
function isCardExistById(id: string): boolean {
  return !!cardRefs.value[id];
}

/** Получить (x,y) карты (первой по rank/suit) */
function getCardPosition(rank: CardUtils.Rank, suit: CardUtils.Suit) {
  const cmp = getCard(rank, suit);
  if (!cmp) return null;
  return cmp.getCoordinates();
}

/** Анимация перемещения по rank/suit (первой найденной) */
function moveCardTo(
  rank: CardUtils.Rank,
  suit: CardUtils.Suit,
  newX: number,
  newY: number,
  newRotation = 0,
  newScale = 1,
  duration = 0.5,
  newCanDrag = true,
  newZIndex = 1,
  newIsFaceDown?: boolean
) {
  const cmp = getCard(rank, suit);
  if (!cmp) {
    console.warn(`moveCardTo: no card found with rank=${rank}, suit=${suit}`);
    return;
  }
  const cardData = cards.value.find(c => c.id === cmp.$props.cardId);
  if (cardData) {
    cardData.x = newX;
    cardData.y = newY;
    cardData.rotation = newRotation;
    cardData.scale = newScale;
    cardData.zIndex = newZIndex;
    if (newIsFaceDown !== undefined) {
      cardData.isFaceDown = newIsFaceDown;
    }
  }
  cmp.moveTo(newX, newY, newRotation, newScale, duration, newCanDrag, newZIndex, newIsFaceDown);
}

/** Мгновенное перемещение (по rank/suit) */
function setCard(
  rank: CardUtils.Rank,
  suit: CardUtils.Suit,
  newX: number,
  newY: number,
  newRotation = 0,
  newScale = 1,
  newCanDrag = true,
  newZIndex = 1,
  newIsFaceDown?: boolean
) {
  const cmp = getCard(rank, suit);
  if (!cmp) {
    console.warn(`setCard: no card found with rank=${rank}, suit=${suit}`);
    return;
  }
  const cardData = cards.value.find(c => c.id === cmp.$props.cardId);
  if (cardData) {
    cardData.x = newX;
    cardData.y = newY;
    cardData.rotation = newRotation;
    cardData.scale = newScale;
    cardData.zIndex = newZIndex;
    if (newIsFaceDown !== undefined) {
      cardData.isFaceDown = newIsFaceDown;
    }
  }
  cmp.set(newX, newY, newRotation, newScale, newCanDrag, newZIndex, newIsFaceDown);
}

/** Мгновенное перемещение, но по ID */
function setCardById(
    id: string,
    newX: number,
    newY: number,
    newRotation = 0,
    newScale = 1,
    newCanDrag = true,
    newZIndex = 1,
    newIsFaceDown?: boolean
) {
  const cmp = getCardById(id);
  if (!cmp) {
    console.warn(`moveCardToById: no card with id=${id}`);
    return;
  }
  const cardData = cards.value.find(c => c.id === id);
  if (!cardData) return;
  cardData.x = newX;
  cardData.y = newY;
  cardData.rotation = newRotation;
  cardData.scale = newScale;
  cardData.zIndex = newZIndex;
  if (newIsFaceDown !== undefined) {
    cardData.isFaceDown = newIsFaceDown;
  }
  cmp.set(newX, newY, newRotation, newScale, newCanDrag, newZIndex, newIsFaceDown);
}

/** Аналог анимации, но по ID */
function moveCardToById(
  id: string,
  newX: number,
  newY: number,
  newRotation = 0,
  newScale = 1,
  duration = 0.5,
  newCanDrag = true,
  newZIndex = 1,
  newIsFaceDown?: boolean
) {
  const cmp = getCardById(id);
  if (!cmp) {
    console.warn(`moveCardToById: no card with id=${id}`);
    return;
  }
  const cardData = cards.value.find(c => c.id === id);
  if (!cardData) return;
  cardData.x = newX;
  cardData.y = newY;
  cardData.rotation = newRotation;
  cardData.scale = newScale;
  cardData.zIndex = newZIndex;
  if (newIsFaceDown !== undefined) {
    cardData.isFaceDown = newIsFaceDown;
  }
  cmp.moveTo(newX, newY, newRotation, newScale, duration, newCanDrag, newZIndex, newIsFaceDown);
}

/** Экспортируем наружу всё нужное */
defineExpose({
  // По rank/suit
  getCard,
  destroyCard,
  isCardExist,
  getCardPosition,
  moveCardTo,
  setCard,

  // По ID
  getCardById,
  destroyCardById,
  isCardExistById,
  moveCardToById,
  setCardById,

  // Основные
  spawnCard,
  destroyInvalidCards,
});
</script>

<style scoped>
.cards-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.trump-icon {
  position: absolute;
  left: 5px;
  top: calc(38vh);
  width: 5.3vh;
  height: 5.3vh;
  z-index: 0;
}

.transfer-icon {
  position: absolute;
  height: 22vh; /* Увеличиваем размер карты */
  width: calc(22vh * (130 / 190)); /* Сохраняем пропорции */
  z-index: 0;
  transform-origin: left top;
  scale: 0.55;
}

.cards-pill {
  position: absolute;
  top: 48%;
  left: 10px;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 0.3vh 1.4vh;
  font-size: 1.5vh;
  max-width: 10vh;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}
</style>

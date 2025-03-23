<template>
  <div class="players-controller">
    <!-- Левый игрок -->
    <Player
      v-if="players.length >= 2"
      :id="players[0]?.id"
      :nickname="players[0]?.nickname"
      :profileImage="players[0]?.profileImage"
      :cards-count="players[0]?.cardsCount"
      :status="players[0]?.status"
      :endTime="players[0]?.endTime"
      :isDurak="players[0]?.isDurak"
      class="player left"
    />

    <!-- Центральный игрок -->
    <Player
      v-if="players.length === 1 || players.length >= 3"
      :id="players[players.length === 1 ? 0 : 1]?.id"
      :nickname="players[players.length === 1 ? 0 : 1]?.nickname"
      :profileImage="players[players.length === 1 ? 0 : 1]?.profileImage"
      :cards-count="players[players.length === 1 ? 0 : 1]?.cardsCount"
      :status="players[players.length === 1 ? 0 : 1]?.status"
      :endTime="players[players.length === 1 ? 0 : 1]?.endTime"
      :isDurak="players[players.length === 1 ? 0 : 1]?.isDurak"
      class="player center"
    />

    <!-- Правый игрок -->
    <Player
      v-if="players.length === 2 || players.length >= 3"
      :id="players[players.length === 2 ? 1 : 2]?.id"
      :nickname="players[players.length === 2 ? 1 : 2]?.nickname"
      :profileImage="players[players.length === 2 ? 1 : 2]?.profileImage"
      :cards-count="players[players.length === 2 ? 1 : 2]?.cardsCount"
      :status="players[players.length === 2 ? 1 : 2]?.status"
      :endTime="players[players.length === 2 ? 1 : 2]?.endTime"
      :isDurak="players[players.length === 2 ? 1 : 2]?.isDurak"
      class="player right"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Player from './Prefabs/Player.vue';
import { EventService, EventType } from '../../../network/EventService';
import { CardUtils } from '../../../utils/CardUtils';
import { CardsManagerRef } from './CardsManagerRef.ts';
import PlayerSettingsStorage from '../../../network/PlayerSettingsStorage';

/** Получаем координаты игрока */
function getPlayerCoords(index: number) {
  const centerX = window.innerWidth / 2;
  const centerY = 120;
  const sideXOffset = 90;
  const sideY = 155;
  const playersCount = players.value.length;

  if (playersCount === 1) {
    return { x: centerX, y: centerY }; // Центральный игрок
  }

  if (playersCount === 2) {
    return index === 0 
      ? { x: centerX - sideXOffset, y: sideY }  // Левый игрок
      : { x: centerX + sideXOffset, y: sideY }; // Правый игрок
  }

  if (playersCount === 3) {
    if (index === 0) return { x: centerX - sideXOffset, y: sideY }; // Левый
    if (index === 1) return { x: centerX, y: centerY };            // Центральный
    return { x: centerX + sideXOffset, y: sideY };                 // Правый
  }

  return { x: centerX, y: centerY }; // Значение по умолчанию (безопасный fallback)
}


const players = ref([
]);

const takerId = ref<string | null>(null);

async function fetchNickname(userId: string): Promise<string> {
  try {
    const response = await fetch(`https://tondurakgame.com/users/info?user_id=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name || 'Unknown';
    } else {
      console.warn(`Failed to fetch nickname for user_id ${userId}:`, response.statusText);
      return 'Unknown';
    }
  } catch (error) {
    console.error(`Error fetching nickname for user_id ${userId}:`, error);
    return 'Unknown';
  }
}

function handlePlayerAmountSet(amount: number) {
  players.value = Array.from({ length: amount - 1 }, (_, index) => ({
    id: '',
    nickname: ``,
    profileImage: '',
    cardsCount: 0,
    status: 'Empty',
    endTime: 0,
    isDurak: false,
  }));
}

function updatePlayerIDs(ids: string[]) {
  // Назначение новых ID по порядку
  for (let i = 0; i < players.value.length; i++) {
    if (i < ids.length) {
      players.value[i].id = ids[i];
      players.value[i].nickname = ``;
      players.value[i].profileImage = `https://tondurakgame.com/users/photo?user_id=${ids[i]}`;
      players.value[i].status = '';
      players.value[i].isDurak = false;
      PlayerSettingsStorage.setPlayerCoordinate(ids[i], getPlayerCoords(i));
    } else {
      players.value[i].id = '';
      players.value[i].nickname = '';
      players.value[i].profileImage = '';
      players.value[i].status = 'Empty';
      players.value[i].isDurak = false;
    }
  }

  updateProfiles(ids);
}

async function updateProfiles(ids: string[]) {
  await Promise.all(
    ids.map(async (id) => {
      const player = players.value.find((p) => p.id === id);
      if (player) {
        const nickname = await fetchNickname(id);
        player.nickname = nickname.replace('87**1!a', ' ');
        player.profileImage = `https://tondurakgame.com/users/photo?user_id=${id}`;
      }
    })
  );
}

function updatePlayerStates({ playerIds, states }: { playerIds: string[]; states: string[] }) {
  //console.log(playerIds, states);

  playerIds.forEach((id, index) => {
    const player = players.value.find((p) => p.id === id);
    if (player) {
      if(states[index] === "wait" || states[index] === "paid") states[index] = '';
      player.status = states[index];
      //console.log("Set to", id, states[index]);
      if(states[index] == "durak") {
        //console.log("Set to", id, "DURAK STATE");
        player.isDurak = 1;
        //console.log("Value of isDurak", player.isDurak);

      }
    }
  });
}

function updatePlayerTimers(timers: [string, number][]) {
  players.value.forEach((player) => {
    player.endTime = 0;
  });

  timers.forEach((timer) => {
    const player = players.value.find((p) => p.id === timer[0]);
    if (player) {
      player.endTime = timer[1];
    }
  });
}

function updateCardAmounts({ playerIds, cardAmounts }: { playerIds: string[]; cardAmounts: number[] }) {
  playerIds.forEach((id, index) => {
    const player = players.value.find((p) => p.id === id);
    if (player) {
      if(player.cardsCount < cardAmounts[index])
      {
        if(takerId.value != id)
          invokeCardAnimation(cardAmounts[index] - player.cardsCount, id);
      }

      player.cardsCount = cardAmounts[index];
    }
  });
}

async function invokeCardAnimation(count: number, playerId: string)
{
  const xDeckPos = -30;
  const yDeckPos = window.innerHeight / 2 - 150;

  const cardsManagerRef = CardsManagerRef.get();
  const idList : string[] = [];
  for (let i = 0; i < count; i++) {
    const card = await cardsManagerRef.value.spawnCard(
                CardUtils.Rank.Unknown,
                CardUtils.Suit.Unknown,
                'ton_default',
                xDeckPos,
                yDeckPos,
                20,
                0.4,
                0,
                true
            );

    const idx = players.value.findIndex((p) => p.id === playerId);

    const coords = getPlayerCoords(idx)

    card?.moveTo(coords.x, coords.y, 0, 0.2, 0.5, false);

    if(card?.$props.cardId)
      idList.push(card?.$props.cardId);

    await new Promise(resolve => setTimeout(resolve, 50)); 
  }

  await new Promise(resolve => setTimeout(resolve, 500)); 

  idList.forEach(id => {
    cardsManagerRef.value?.destroyCardById(id)
  });
}

/** 
 * Если карты уже существуют в CardsManager (spawned), 
 * то берём их по rank/suit и двигаем к игроку, 
 * после анимации уничтожаем. 
 */
function handleCardsTakenByPlayer({ playerId, cards }: { playerId: string; cards: CardUtils.Card[] }) {
  const cardsManagerRef = CardsManagerRef.get();
  if (!cardsManagerRef?.value) return;

  const idx = players.value.findIndex((p) => p.id === playerId);
  if (idx === -1) return;

  const coords = getPlayerCoords(idx);
  console.log(coords);
  cards.forEach((cardData) => {
    // Ищем карту по rank/suit
    const cardCmp = cardsManagerRef?.value?.getCard(cardData.rank, cardData.suit);
    if (!cardCmp) {
      console.warn(`Card ${cardData.rank}-${cardData.suit} not found.`);
      return;
    }
    // console.log("moveto: ", coords.x, coords.y, 0, 1, 0.2, false, -999, false);
    cardCmp.moveTo(coords.x, coords.y, 0, 0.2, 0.4, false, 0, false);
    setTimeout(() => {
      cardsManagerRef?.value?.destroyCard(cardData.rank, cardData.suit);
    }, 800);
  });
}

function handleTakerIdSet(playerId: string) {
  takerId.value = playerId;
}

function handleGameStarted() {
  players.value.forEach((player) => {
    player.isDurak = 0;
  });
}

onMounted(() => {
  EventService.Instance.on(EventType.PlayerAmountSet, handlePlayerAmountSet);
  EventService.Instance.on(EventType.PlayerIDsSet, updatePlayerIDs);
  EventService.Instance.on(EventType.PlayerStatesChanged, updatePlayerStates);
  EventService.Instance.on(EventType.CardAmountsChanged, updateCardAmounts);
  EventService.Instance.on(EventType.PlayerTimersChanged, updatePlayerTimers);
  EventService.Instance.on(EventType.CardsTakenByPlayer, handleCardsTakenByPlayer);
  EventService.Instance.on(EventType.TakerIdSet, handleTakerIdSet);
  EventService.Instance.on(EventType.GameStarted, handleGameStarted);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.PlayerAmountSet, handlePlayerAmountSet);
  EventService.Instance.off(EventType.PlayerIDsSet, updatePlayerIDs);
  EventService.Instance.off(EventType.PlayerStatesChanged, updatePlayerStates);
  EventService.Instance.off(EventType.PlayerTimersChanged, updatePlayerTimers);
  EventService.Instance.off(EventType.CardAmountsChanged, updateCardAmounts);
  EventService.Instance.off(EventType.CardsTakenByPlayer, handleCardsTakenByPlayer);
  EventService.Instance.off(EventType.TakerIdSet, handleTakerIdSet);
  EventService.Instance.off(EventType.GameStarted, handleGameStarted);
});
</script>

<style scoped>
.players-controller {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -30%);
  width: 300px;
  height: 60px;
  z-index: 100;
}

.player {
  position: absolute;
  top: 50%;
  transform: translateY(100%);
}

.center {
  left: 50%;
  transform: translate(-50%, 60%);
}

.left {
  left: 0;
}

.right {
  right: 0;
}
</style>

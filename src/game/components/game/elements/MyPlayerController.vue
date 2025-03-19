<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Profile from './Prefabs/Profile.vue';
import { EventService, EventType } from '../../../network/EventService';

const player = ref({
  id: '',
  nickname: '',
  profileImage: '',
  cardsCount: 0,
  status: '',
  endTime: 0,
  isDurak: false,
});

const emoteIconIsActive = ref<boolean>(true);
const cooldownDuration = 5000; // 5 секунд

const emotePopupIsActive = ref(false);

const fetchNickname = async (userId: string): Promise<string> => {
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
};

const updatePlayerProfile = async (id: string) => {
  const nickname = await fetchNickname(id);
  player.value = {
    id,
    nickname: nickname.replace('87**1!a', ' '),
    profileImage: `https://tondurakgame.com/users/photo?user_id=${id}`,
    cardsCount: player.value.cardsCount,
    status: player.value.status,
    endTime: player.value.endTime,
    isDurak: false,
  };
};

const setPlayerID = (id: string) => {
  player.value = {
    id,
    nickname: '',
    profileImage: '',
    cardsCount: 0,
    status: '',
    endTime: 0,
    isDurak: false,
  };
  updatePlayerProfile(id);
};

const updatePlayerStates = ({ playerIds, states }: { playerIds: string[]; states: string[] }) => {
  //console.log(playerIds, states);
  playerIds.forEach((id, index) => {
    if (player.value.id === id) {
      if(states[index] === "wait" || states[index] === "paid") states[index] = '';
      player.value.status = states[index];
      //console.log("Set to", id, states[index]);
      if(states[index] == "durak") {
        //console.log("Set to", id, "DURAK STATE");
        player.value.isDurak = true;
      }
    }
  });
};

function updatePlayerTimers(timers: [string, number][]) {
  const timer = Object.values(timers).find((p) => p[0] === player.value.id);

  if(timer)
    player.value.endTime = timer[1];
  else
    player.value.endTime = 0;
}

const updateCardAmounts = ({ playerIds, cardAmounts }: { playerIds: string[]; cardAmounts: number[] }) => {
  playerIds.forEach((id, index) => {
    if (player.value.id === id) {
      player.value.cardsCount = cardAmounts[index];
    }
  });
};

const handleMyPlayerIdSet = (id: string) => setPlayerID(id);

function handleGameStarted() {
  player.value.isDurak = false;
}

function setTempState(state: string) {
  player.value.status = state;
  player.value.endTime = 0;
}

function hideMyTimer() {
  player.value.endTime = 0;
}

const showEmotionsPopup = () => {
  if (!emoteIconIsActive.value) return;

  emotePopupIsActive.value = !emotePopupIsActive.value;
  EventService.Instance.emit(EventType.ShowEmotionsPopup, emotePopupIsActive.value);
};

function onEmotionsCooldown() {
  emoteIconIsActive.value = false;
  emotePopupIsActive.value = false;

  setTimeout(() => {
    emoteIconIsActive.value = true;
  }, cooldownDuration);
}


onMounted(() => {
  EventService.Instance.on(EventType.MyPlayerIdSet, handleMyPlayerIdSet);
  EventService.Instance.on(EventType.PlayerStatesChanged, updatePlayerStates);
  EventService.Instance.on(EventType.PlayerTimersChanged, updatePlayerTimers);
  EventService.Instance.on(EventType.CardAmountsChanged, updateCardAmounts);
  EventService.Instance.on(EventType.GameStarted, handleGameStarted);
  EventService.Instance.on(EventType.SetMyState, setTempState);
  EventService.Instance.on(EventType.HideMyTimer, hideMyTimer);
  EventService.Instance.on(EventType.EmotionsCooldown, onEmotionsCooldown);
});

onUnmounted(() => {
  EventService.Instance.off(EventType.MyPlayerIdSet, handleMyPlayerIdSet);
  EventService.Instance.off(EventType.PlayerStatesChanged, updatePlayerStates);
  EventService.Instance.off(EventType.PlayerTimersChanged, updatePlayerTimers);
  EventService.Instance.off(EventType.CardAmountsChanged, updateCardAmounts);
  EventService.Instance.off(EventType.GameStarted, handleGameStarted);
  EventService.Instance.off(EventType.SetMyState, setTempState);
  EventService.Instance.off(EventType.HideMyTimer, hideMyTimer);
  EventService.Instance.off(EventType.EmotionsCooldown, onEmotionsCooldown);
});

</script>

<template>
  <div class="footer">
    <Profile
      class="raised-player"
      :id="player.id"
      :profileImage="player.profileImage"
      :status="player.status"
      :endTime="player.endTime"
      :isDurak="player.isDurak"
      :isMe="true"
      @click="showEmotionsPopup"
    />

    <img
        v-if="emoteIconIsActive"
        class="smiley-icon"
        :src="emotePopupIsActive ? '/assets/icons/close-emote-icon.svg' : '/assets/icons/emote-icon.svg'"
        alt="smiley"
        @click="showEmotionsPopup"
    />
  </div>
</template>

<style scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: #ffffff;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px 20px 0 0;
  z-index: 100;
}

.raised-player {
  transform: translateY(-30%);
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.2);
  transition: filter 0.2s ease-in-out;
}

.raised-player:active {
  filter: brightness(0.7);
}

.smiley-icon {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
}
</style>

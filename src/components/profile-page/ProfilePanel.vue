<template>
  <div class="panel profile-panel">
    <button class="top-right-button animate-press" @click="openEdit">
      <img class="icon" src="@/assets/icons/edit-icon.svg" alt="Settings Icon" />
    </button>
    <button class="top-left-button animate-press" @click="changeTheme">
      <img class="icon" src="@/assets/icons/light-icon.svg" alt="Settings Icon" />
    </button>
    <div class="profile-header">
      <div class="profile-picture-wrapper">
        <img class="profile-picture" :src="profileImage" alt="Profile Picture" />
      </div>
    </div>
    <Placeholder :loading="isLoading" style="margin-top: 0.5vh; height: 2.25vh" @click="test">
      <h2 class="profile-name">{{ profileName }}</h2>
    </Placeholder>
    <div v-if="gamesCount" class="details-row" style="margin-top: 2vh">
      <h2 class="details-title">Количество игр:</h2>
      <a class="details-value">{{ gamesCount }}</a>
    </div>
    <div v-if="winsCount" class="details-row">
      <h2 class="details-title">Побед:</h2>
      <a class="details-value">{{ winsCount }}</a>
    </div>
    <div v-if="earnings" class="details-row">
      <h2 class="details-title">Заработок:</h2>
      <a class="details-value">${{ earnings }}</a>
    </div>
<!--    <h2 class="profile-username">@{{ username }}</h2>-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'
import Placeholder from "@/components/Placeholder.vue";
const router = useRouter()


export default defineComponent({
  name: 'ProfilePanel',
  components: {Placeholder},
  setup() {
    const router = useRouter(); // Получаем доступ к роутеру
    const isLoading = ref(false);
    const openEdit = () => {
      router.push("/profile/edit"); // Навигация к странице редактирования профиля
    };

    //@ts-ignore
    let colorScheme = window.Telegram?.WebApp?.colorScheme || 'light';

    const changeTheme = () => {
      colorScheme = colorScheme == 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', colorScheme);
    };

    const test = () => {
      isLoading.value = false;
    }

    return { openEdit, changeTheme, isLoading, test};
  },
  props: {
    profileImage: {
      type: String,
      required: true
    },
    profileName: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    gamesCount:{
      type: Number,
    },
    winsCount:{
      type: Number,
    },
    earnings:{
      type: Number,
    }
  },
});
</script>

<style scoped>
.top-right-button img {
  height: 50%;
}

.profile-panel {
  position: relative;
  margin-top: 12vh;
}

.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8vh;
}

.profile-picture-wrapper {
  width: 15vh;
  height: 15vh;
  border-radius: 50%;
  background: var(--gray-color);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.3);
  transform: translateY(-4vh);
  transition: background 0.2s, color 0.2s;
}

.profile-picture {
  width: 90%;
  height: 90%;
  border-radius: 50%;
}

.profile-name {
  text-align: center;
  margin-top: 0.5vh;
}

.top-left-button img {
  height: 75%;
}

.profile-username {
  text-align: center;
  color: gray;
  margin-top: 0.2vh;
  font-size: 1.8vh;
}

.details-row {
  margin-top: 0.25vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
}

.details-title {
  text-align: left;
  font-size: 1.75vh;
  color: var(--secondary-text-color);
}

.details-value {
  margin-left: auto;
  font-size: 1.75vh;
}
</style>
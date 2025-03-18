<template>
  <div class="panel profile-panel">
    <button class="top-right-button animate-press" @click="openEdit">
      <img class="icon" src="@/assets/icons/edit-icon.svg" alt="Edit" />
    </button>
<!--    <button class="top-left-button animate-press" @click="changeTheme">-->
<!--      <img class="icon" src="@/assets/icons/light-icon.svg" alt="Change Theme" />-->
<!--    </button>-->
    <div class="profile-header">
      <div class="profile-picture-wrapper placeholder-container" :class="{ isLoading: isLoadingImage }">
        <img
            class="profile-picture"
            :src="profileImage"
            alt="Profile Picture"
            @load="onImageLoad"
        />
      </div>
    </div>
    <div style="display: flex; justify-content: center;">
      <h2 class="profile-name placeholder-container" :class="{ isLoading: isLoadingData }" style="margin-bottom: 2vh">
        {{ profileName.replace('87**1!a', ' ') }}
      </h2>
    </div>

    <div v-for="(stat, index) in stats" :key="index" class="details-row">
      <!-- Плейсхолдеры для каждого элемента статистики -->
      <h2 class="details-title placeholder-container" :class="{ isLoading: isLoadingData }">
        {{ stat.title }}
      </h2>
      <a class="details-value placeholder-container" :class="{ isLoading: isLoadingData }">
        {{ stat.value }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

interface Stat {
  title: string;
  value: string | number;
}

export default defineComponent({
  name: 'ProfilePanel',
  props: {
    profileImage: {
      type: String,
      required: true,
    },
    profileName: {
      type: String,
      required: true,
      default: 'default_profile_name',
    },
    username: {
      type: String,
      required: true,
    },
    stats: {
      type: Array as PropType<Stat[]>,
      required: false,
      default: () => [
        { title: "Статистика #1: ", value: "Данные" },
        { title: "Статистика #2: ", value: "Данные" },
        { title: "Статистика #3: ", value: "Данные" }
      ],
    },
  },
  setup(props) {
    const router = useRouter();

    // Состояния загрузки для каждого элемента – изначально true
    const isLoadingImage = ref(true);
    const isLoadingData = ref(false);

    // Функция onImageLoad не отключает плейсхолдер автоматически
    const onImageLoad = () => {
      isLoadingImage.value = false;
    };

    const openEdit = () => {
      router.push("/profile/edit");
    };

    //@ts-ignore
    let colorScheme = window.Telegram?.WebApp?.colorScheme || 'light';
    const changeTheme = () => {
      colorScheme = colorScheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', colorScheme);
    };

    const hideData = () => {
      isLoadingData.value = false;
    };

    // Функция, которую можно вызывать из другого скрипта, чтобы скрыть все плейсхолдеры
    const showData = () => {
      isLoadingData.value = false;
    };

    return { openEdit, changeTheme, isLoadingImage, isLoadingData, onImageLoad, showData, hideData };
  },
});
</script>

<style scoped>
/* Стили панели */
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
  max-width: 15vh;
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

@keyframes gradientFlow {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

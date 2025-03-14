<template>
  <div class="panel profile-panel">
    <button class="top-right-button animate-press" @click="openEdit">
      <img class="icon" src="@/assets/icons/edit-icon.svg" alt="Edit" />
    </button>
    <button class="top-left-button animate-press" @click="changeTheme">
      <img class="icon" src="@/assets/icons/light-icon.svg" alt="Change Theme" />
    </button>
    <div class="profile-header">
      <div class="profile-picture-wrapper">
        <!-- Плейсхолдер для подгружаемой картинки, ждём событие load -->
        <Placeholder class="profile-picture" :loading="isLoadingImage">
          <img
              class="profile-picture"
              :src="profileImage"
              alt="Profile Picture"
              @load="onImageLoad"
          />
        </Placeholder>
      </div>
    </div>
    <!-- Плейсхолдер для подгружаемого имени -->
    <h2 class="profile-name placeholder-container" style="margin-bottom: 2vh">{{ profileName }}</h2>
    <div v-for="(stat, index) in stats" :key="index" class="details-row">
      <!-- Плейсхолдеры для каждого элемента статистики -->
        <h2 class="details-title">{{ stat.title }}</h2>
        <a class="details-value">{{ stat.value }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Placeholder from "@/components/Placeholder.vue";

interface Stat {
  title: string;
  value: string | number;
}

export default defineComponent({
  name: 'ProfilePanel',
  components: { Placeholder },
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
    stats: {
      type: Array as PropType<Stat[]>,
      required: false,
      default: () => [
        { title: "Статистика: ", value: "0" },
        { title: "Статистика: ", value: "0" },
        { title: "Статистика: ", value: "0" }
      ]
    }
  },
  setup(props) {
    const router = useRouter();
    // Переменные загрузки для отдельных подгружаемых элементов
    const isLoadingImage = ref(true);
    const isLoadingName = ref(true);
    const isLoadingStats = ref(true);

    // Если изображение меняется, заново включаем загрузку
    watch(() => props.profileImage, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        isLoadingImage.value = true;
      }
    }, { immediate: true });

    watch(() => props.profileName, (newVal) => {
      if (newVal) isLoadingName.value = false;
    }, { immediate: true });

    watch(() => props.stats, (newVal) => {
      if (newVal && newVal.length > 0) isLoadingStats.value = false;
    }, { immediate: true });

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

    return { openEdit, changeTheme, isLoadingImage, isLoadingName, isLoadingStats, onImageLoad };
  },
});
</script>

<style>
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

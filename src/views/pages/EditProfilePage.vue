<template>
  <div class="container">
    <div class="page">
      <div class="panel" style="margin-bottom: 0.5vh; margin-top: 12vh">
        <div class="profile-header" style="margin-bottom: 1vh">
          <div class="profile-picture-wrapper">
            <img class="profile-picture" :src="profilePictureSource" alt="Profile Picture" />
          </div>
          <button class="secondary-button animate-press" style="width: auto; padding: 0 2vh" @click="changePicture">Изменить</button>
        </div>


        <h2 style="margin-bottom: 1vh">Имя</h2>
        <input
            type="text"
            class="input-box"
            placeholder="Введите новое имя"
            v-model="newName"
            @keyup.enter="hideKeyboard"
        />
        <button
            class="main-button animate-press"
            style="width: 100%; margin-top: 2vh"
            @click="saveSettings"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProfilePanel from '@/components/profile-page/ProfilePanel.vue';
import { useRouter } from 'vue-router';
import {events} from "@/events.ts";

export default defineComponent({
  components: { ProfilePanel },
  setup() {
    const newName = ref('');
    const profilePictureSource = ref('https://xsgames.co/randomusers/assets/avatars/male/11.jpg');
    const router = useRouter();

    const hideKeyboard = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    };

    const saveSettings = () => {
      router.push(`/profile`);

      setTimeout(() => {
        events.emit('showNotification', { title: "Успешно!", subtitle: "Профиль сохранен.", icon: "profile", sticker: 'profile_duck' })

      }, 23)
    };

    const changePicture = () => {
      console.log('Change picture triggered');
      // Добавьте логику изменения аватарки здесь
    };

    return { newName, profilePictureSource, hideKeyboard, saveSettings, changePicture };
  }
});
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 95%;
  max-width: 75vh;
}

.input-box {
  width: 100%;
  display: flex;
  align-items: center;
  background: var(--gray-color);
  color: var(--text-color);
  border-radius: 1vh;
  padding: 1.5vh 1vh;
  margin: 0 0 0.25vh 0;
  font-size: 1.75vh;
  box-sizing: border-box;
  border-color: transparent;
}

.right-button img {
  height: 50%;
  display: block;
}

.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1vh;
  width: 100%;
}

.profile-picture-wrapper {
  position: relative;
  width: 15vh;
  height: 15vh;
  border-radius: 50%;
  background: var(--gray-color);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0.2vh 0.4vh rgba(0, 0, 0, 0.3);
}

.profile-picture {
  width: 90%;
  height: 90%;
  border-radius: 50%;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
}

.overlay-button {
  font-size: 1.5vh;
  padding: 0.5vh 1vh;
  border: none;
  border-radius: 0.5vh;
  cursor: pointer;
}
</style>

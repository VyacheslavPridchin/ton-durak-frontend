<template>
  <div class="container">
    <div class="page">
      <div class="panel" style="margin-bottom: 0.5vh; margin-top: 12vh">
        <div class="profile-header" style="margin-bottom: 1vh">
          <div class="profile-picture-wrapper">
            <img class="profile-picture" :src="profilePictureSource" alt="Profile Picture" />
          </div>
          <!-- Кнопка теперь запускает выбор файла -->
          <button class="secondary-button animate-press" style="width: auto; padding: 0 2vh" @click="triggerFileInput">
            Изменить
          </button>
          <!-- Скрытый input для выбора файла -->
          <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" accept="image/*" />
        </div>

        <h2 style="margin-bottom: 1vh">Новое имя</h2>
        <input
            type="text"
            class="input-box"
            placeholder="Введите новое имя"
            v-model="newName"
            @keyup.enter="hideKeyboard"
        />
        <!-- Если пользователь не менял фото, можно сохранить профиль как раньше -->
        <button
            class="main-button animate-press"
            style="width: 100%; margin-top: 2vh"
            @click="saveSettings"
        >
          Сохранить
        </button>
      </div>
    </div>

    <!-- Оверлей cropper -->
    <div v-if="showCropper" class="cropper-overlay">
      <div class="cropper-container">
        <Cropper
            ref="cropperRef"
            class="cropper"
            :src="selectedImage"
            :stencil-component="Stencil"
        />
        <div class="cropper-buttons">
          <button class="secondary-button" @click="cancelCrop">Отмена</button>
          <button class="main-button" @click="cropAndSave">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ProfilePanel from '@/components/profile-page/ProfilePanel.vue';
import { useRouter } from 'vue-router';
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

// Импортируем cropper и его стили
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Stencil from "@/components/Stencil.vue";

export default defineComponent({
  components: { ProfilePanel, Cropper, Stencil },
  setup() {
    const newName = ref('');
    const profilePictureSource = ref(`https://tondurakgame.com/users/photo?user_id=${window.userData?.id}`);
    const router = useRouter();

    const hideKeyboard = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && typeof activeElement.blur === 'function') {
        activeElement.blur();
      }
    };

    // Сохранение без фото (если фото не изменялось)
    const saveSettings = async () => {
      apiService.updateProfileEdit(newName.value, undefined)
          .then(() => {
            router.push(`/profile`);
            setTimeout(() => {
              events.emit('showNotification', { title: "Успешно!", subtitle: "Профиль сохранен.", icon: "profile", sticker: 'profile_duck' });
            }, 200);
          })
          .catch(() => {
            events.emit('showNotification', { title: "Ошибка!", subtitle: "Произошла ошибка при сохранении профиля.", icon: "profile", sticker: 'block_duck' });
          });
    };

    // --- Логика cropper ---
    const showCropper = ref(false);
    const selectedImage = ref<string | null>(null);
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const cropperRef = ref<any>(null);

    // Триггер выбора файла
    const triggerFileInput = () => {
      fileInputRef.value?.click();
    };

    // Обработка выбранного файла
    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          selectedImage.value = e.target?.result as string;
          showCropper.value = true;
        };
        reader.readAsDataURL(file);
      }
    };

    // Получаем Blob из cropper и отправляем запрос
    const cropAndSave = () => {
      if (cropperRef.value) {
        const result = cropperRef.value.getResult();
        if (result && result.canvas) {
          result.canvas.toBlob((blob: Blob | null) => {
            if (blob) {
              apiService.updateProfileEdit(newName.value, blob)
                  .then(() => {
                    router.push(`/profile`);
                    setTimeout(() => {
                      events.emit('showNotification', { title: "Успешно!", subtitle: "Профиль сохранен.", icon: "profile", sticker: 'profile_duck' });
                    }, 200);
                  })
                  .catch(() => {
                    events.emit('showNotification', { title: "Ошибка!", subtitle: "Произошла ошибка при сохранении профиля.", icon: "profile", sticker: 'block_duck' });
                  });
              showCropper.value = false;
              selectedImage.value = null;
            }
          }, "image/jpeg");
        }
      }
    };

    // Отмена изменения фото
    const cancelCrop = () => {
      showCropper.value = false;
      selectedImage.value = null;
    };

    return {
      newName,
      profilePictureSource,
      hideKeyboard,
      saveSettings,
      triggerFileInput,
      handleFileChange,
      showCropper,
      selectedImage,
      cropperRef,
      cropAndSave,
      cancelCrop,
      fileInputRef
    };
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

/* Стили для оверлея cropper */
.cropper-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cropper-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.cropper-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>

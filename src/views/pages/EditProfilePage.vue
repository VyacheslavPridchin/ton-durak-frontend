<template>
  <div class="container">
    <div class="page">
      <div class="panel" style="margin-bottom: 0.5vh; margin-top: 12vh">
        <div class="profile-header" style="margin-bottom: 1vh">
          <div class="profile-picture-wrapper">
            <img class="profile-picture" :src="profilePictureSource" alt="Profile Picture" />
          </div>
          <button
              class="secondary-button animate-press placeholder-container"
              :class="{ isLoading: isLoadingData }"
              style="width: auto; padding: 0 2vh"
              @click="triggerFileInput"
              :disabled="!!photoFormattedTime"
          >
            {{ photoFormattedTime ? photoFormattedTime : 'Изменить' }}
          </button>
          <!-- Скрытый input для выбора файла -->
          <input type="file" ref="fileInputRef" style="display: none" @change="handleFileChange" accept="image/*" />
        </div>

        <h2 style="margin-bottom: 1vh">Новое имя</h2>
        <!-- Если name_timer активен, вместо placeholder выводим таймер и блокируем ввод -->
        <div class="placeholder-container" :class="{ isLoading: isLoadingData }">
          <input
          type="text"
          class="input-box"
          :placeholder="nameFormattedTime ? nameFormattedTime : 'Введите новое имя'"
          v-model="newName"
          @keyup.enter="hideKeyboard"
          :disabled="!!nameFormattedTime"
          />
        </div>

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
    <transition name="fade">
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
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ProfilePanel from '@/components/profile-page/ProfilePanel.vue';
import { useRouter } from 'vue-router';
import { events } from "@/events.ts";
import apiService from "@/services/ApiService.ts";

// Импорт cropper
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import Stencil from "@/components/Stencil.vue";

export default defineComponent({
  computed: {
    Stencil() {
      return Stencil;
    }
  },
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

    const saveSettings = async () => {
      apiService.updateProfileEdit(newName.value, undefined)
          .then(() => {
            router.push(`/profile`);
            setTimeout(() => {
              events.emit('showNotification', {
                title: "Успешно!",
                subtitle: "Профиль сохранен.",
                icon: "profile",
                sticker: 'profile_duck'
              });
            }, 200);
          })
          .catch(() => {
            events.emit('showNotification', {
              title: "Ошибка!",
              subtitle: "Произошла ошибка при сохранении профиля.",
              icon: "profile",
              sticker: 'block_duck'
            });
          });
    };

    // --- Cropper ---
    const showCropper = ref(false);
    const selectedImage = ref<string | null>(null);
    const fileInputRef = ref<HTMLInputElement | null>(null);
    const cropperRef = ref<any>(null);

    const triggerFileInput = () => {
      if (!photoFormattedTime.value) {
        fileInputRef.value?.click();
      }
    };

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

    const cropAndSave = () => {
      if (cropperRef.value) {
        const result = cropperRef.value.getResult();
        if (result && result.canvas) {
          const originalCanvas = result.canvas;
          let targetCanvas = originalCanvas;

          if (originalCanvas.width > 512 || originalCanvas.height > 512) {
            const scaleFactor = Math.min(512 / originalCanvas.width, 512 / originalCanvas.height);
            const newWidth = Math.round(originalCanvas.width * scaleFactor);
            const newHeight = Math.round(originalCanvas.height * scaleFactor);
            targetCanvas = document.createElement('canvas');
            targetCanvas.width = newWidth;
            targetCanvas.height = newHeight;
            const ctx = targetCanvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(originalCanvas, 0, 0, newWidth, newHeight);
            }
          }

          targetCanvas.toBlob((blob: Blob | null) => {
            if (blob) {
              apiService.updateProfileEdit(undefined, blob)
                  .then(() => {
                    router.push(`/profile`);
                    setTimeout(() => {
                      events.emit('showNotification', {
                        title: "Успешно!",
                        subtitle: "Профиль сохранен.",
                        icon: "profile",
                        sticker: 'profile_duck'
                      });
                    }, 200);
                  })
                  .catch(() => {
                    events.emit('showNotification', {
                      title: "Ошибка!",
                      subtitle: "Произошла ошибка при сохранении профиля.",
                      icon: "profile",
                      sticker: 'block_duck'
                    });
                  });
              showCropper.value = false;
              selectedImage.value = null;
            }
          }, "image/jpeg");
        }
      }
    };

    const cancelCrop = () => {
      showCropper.value = false;
      selectedImage.value = null;
    };

    // --- Таймеры для блокировки изменения имени и фото ---
    const nameDeadline = ref(0);
    const photoDeadline = ref(0);
    const nameFormattedTime = ref('');
    const photoFormattedTime = ref('');
    let timerInterval: number;
    const isLoadingData = ref(true);

    const updateTimers = () => {
      const now = Math.floor(Date.now() / 1000);

      // Таймер для имени
      const nameTimeLeft = nameDeadline.value - now;
      if (nameTimeLeft <= 0) {
        nameFormattedTime.value = '';
      } else {
        const hours = Math.floor(nameTimeLeft / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((nameTimeLeft % 3600) / 60).toString().padStart(2, '0');
        const seconds = (nameTimeLeft % 60).toString().padStart(2, '0');
        nameFormattedTime.value = `${hours}:${minutes}:${seconds}`;
      }

      // Таймер для фото
      const photoTimeLeft = photoDeadline.value - now;
      if (photoTimeLeft <= 0) {
        photoFormattedTime.value = '';
      } else {
        const hours = Math.floor(photoTimeLeft / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((photoTimeLeft % 3600) / 60).toString().padStart(2, '0');
        const seconds = (photoTimeLeft % 60).toString().padStart(2, '0');
        photoFormattedTime.value = `${hours}:${minutes}:${seconds}`;
      }
    };

    onMounted(async () => {
      try {
        const response = await apiService.getProfileEditTimers();
        if (response.success && response.data) {
          nameDeadline.value = response.data.name_timer;
          photoDeadline.value = response.data.photo_timer;

          updateTimers();
          timerInterval = window.setInterval(updateTimers, 1000);
          isLoadingData.value = false;
        } else {
          events.emit('showNotification', {
            title: "Ошибка!",
            subtitle: "Ошибка получения данных.",
            icon: "profile",
            sticker: 'block_duck'
          });
        }
      } catch (error) {
        events.emit('showNotification', {
          title: "Ошибка!",
          subtitle: "Ошибка получения данных.",
          icon: "profile",
          sticker: 'block_duck'
        });
        console.error('Ошибка получения таймеров:', error);
      }

    });

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
      fileInputRef,
      nameFormattedTime,
      photoFormattedTime,
      isLoadingData,
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

.main-button {
  width: 50%;
  height: 4.5vh;
  background-color: var(--blue-gradient);
  color: var(--white-color);
  transition: background 0.2s, color 0.2s;
  border-radius: 0.5vh;
  font-size: 1.8vh;
  position: relative;
  margin: 0;
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
  display: flex;
  flex-direction: column;
  background: var(--panel-color);
  padding: 2vh;
  border-radius: 1.2vh;
  max-width: 90%;
  max-height: 75%;
  overflow: hidden;
}

.cropper {
  flex: 1;
  height: 50vh;
  width: 100%;
  background: transparent;
}

.cropper-buttons {
  display: flex;
  width: 100%;
  gap: 2vh;
  margin-top: 1vh;
}

.cropper-buttons button {
  flex: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>

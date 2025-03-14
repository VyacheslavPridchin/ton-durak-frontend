<template>
  <div class="container">
    <div class="page">
      <ProfilePanel
          :username="username"
          :profile-name="profileName"
          :profile-image="profileImage"
          :stats="stats"
      />

      <div class="panel wallet-item animate-press" @click="onWalletButtonClick">
        <img class="icon wallet-icon" src="@/assets/icons/wallet-icon.svg" alt="Wallet" />
        <h2>Кошелёк</h2>
        <button class="right-button">
          <img class="icon" src="@/assets/icons/next-icon.svg" alt="Settings Icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ProfilePanel from '@/components/profile-page/ProfilePanel.vue';
import router from "@/router";
import apiService from '@/services/ApiService.ts';

export default defineComponent({
  components: { ProfilePanel },
  setup() {
    const username = ref('');
    const profileName = ref('default_profile_name');
    const profileImage = ref('');
    const stats = ref<Array<{ title: string; value: string }>>([
      { title: "Статистика #1: ", value: "0" },
      { title: "Статистика #2: ", value: "0" },
      { title: "Статистика #3: ", value: "0" }]);

    const onWalletButtonClick = () => {
      router.push('/wallet');
    };

    const loadProfileData = async () => {
      const response = await apiService.getScreenProfile();
      if (response.success && response.data) {
        profileName.value = response.data.name;
        username.value = "unknown";
        // Используем userData для формирования ссылки на фото профиля
        if (window.userData && window.userData.id) {
          profileImage.value = `https://tondurakgame.com/users/photo?user_id=${window.userData.id}`;
        } else {
          profileImage.value = "https://xsgames.co/randomusers/assets/avatars/male/11.jpg";
        }
        stats.value = response.data.stats.map(item => ({
          title: item.stat_name,
          value: item.value
        }));
      }
    };

    onMounted(() => {
      loadProfileData();
    });

    return { onWalletButtonClick, username, profileName, profileImage, stats };
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

.right-button {
  margin-left: auto;
  right: 2vh;
  width: 2.4vh;
  height: 2.4vh;
  border-radius: 50%;
  background: var(--gray-color);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.right-button img {
  height: 50%;
  display: block;
}

.wallet-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 2vh;
}

.wallet-icon {
  height: 2vh;
  object-fit: cover;
  margin-left: 0.5vh;
  margin-right: 1vh;
}
</style>

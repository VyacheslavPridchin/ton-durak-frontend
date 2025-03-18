<template>
  <div class="container">
    <div class="page">
      <ProfilePanel
          ref="profilePanelRef"
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

const CACHE_KEY = 'screenProfileData';

export default defineComponent({
  components: { ProfilePanel },
  setup() {
    const username = ref('');
    const profileName = ref('');
    const profileImage = ref('');
    const stats = ref<Array<{ title: string; value: string }>>([]);
    const profilePanelRef = ref<any>(null);

    const onWalletButtonClick = () => {
      router.push('/wallet');
    };

    const loadCachedData = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Ошибка парсинга кэша', e);
        }
      }
      return null;
    };

    const saveCachedData = (data: any) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    };

    const updateData = (data: any) => {
      profileName.value = data.name;
      username.value = "unknown";
      if (window.userData && window.userData.id) {
        profileImage.value = `https://tondurakgame.com/users/photo?user_id=${window.userData.id}`;
      } else {
        profileImage.value = "https://xsgames.co/randomusers/assets/avatars/male/11.jpg";
      }
      stats.value = data.stats.map((item: any) => ({
        title: item.stat_name,
        value: item.value
      }));
    };

    const fetchScreenProfile = async () => {
      const response = await apiService.getScreenProfile();
      if (response.success && response.data) {
        updateData(response.data);
        saveCachedData(response);
        setTimeout(() => {
          profilePanelRef.value.showData();
        }, 23);
      }
    };

    onMounted(() => {
      const cachedResponse = loadCachedData();
      if (cachedResponse && cachedResponse.data) {
        updateData(cachedResponse.data);
      } else if (profilePanelRef.value?.hideData) {
        profilePanelRef.value.hideData();
      }
      fetchScreenProfile();
    });

    return { username, profileName, profileImage, stats, profilePanelRef, onWalletButtonClick };
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

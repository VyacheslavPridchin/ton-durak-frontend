<template>
  <div class="container">
    <div class="page">
      <!-- ReferralsPanel ожидает баланс и бонус, а метод showData отключит плейсхолдеры текстовых данных -->
      <ReferralsPanel
          ref="referralsPanelRef"
          style="margin-top: 12vh"
          :balance="balance"
          :referrals="referrals"
          :claimed="claimed"
      />

      <h2 style="margin-top: 1vh; margin-bottom: 0.5vh">Топ рефералов</h2>
      <div class="list">
        <FriendItem
            v-for="(friend, index) in friends"
            :key="index"
            :avatar="friend.avatar"
            :nickname="friend.nickname"
            :username="friend.username"
            :place="friend.place"
            :currencyAmount="friend.amount"
            :percent="friend.percent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import ReferralsPanel from '@/components/referrals-page/ReferralsPanel.vue';
import FriendItem from '@/components/referrals-page/FriendItem.vue';
import apiService from '@/services/ApiService';

// Интерфейс для друга в списке топ-рефералов
interface Friend {
  avatar: string;
  nickname: string;
  username: string;
  amount: number;
  place: number;
  percent: number;
}

const CACHE_KEY = 'screenReferralData';

export default defineComponent({
  name: 'ReferralsPage',
  components: { FriendItem, ReferralsPanel },
  setup() {
    const balance = ref(0);
    const claimed = ref(0);
    const referrals = ref(0);
    const friends = ref<Friend[]>([]);
    const referralsPanelRef = ref<InstanceType<typeof ReferralsPanel> | null>(null);

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
      balance.value = data.overview.unclaimed;
      claimed.value = data.overview.claimed;
      referrals.value = data.overview.referrals;

      const topReferrals = data.top_referrals.referrals;
      if (topReferrals && topReferrals.length > 0) {
        // Сортируем по количеству заработанных средств (по убыванию)
        const sorted = topReferrals.slice().sort((a: any, b: any) => b.amount - a.amount);
        const maxAmount = sorted[0].amount || 0;
        friends.value = sorted.map((item: any) => ({
          avatar: `https://tondurakgame.com/users/photo?user_id=${item.user_id}`,
          nickname: 'User',
          username: item.name,
          amount: item.amount,
          place: item.place,
          // Не опускаем ниже 60%
          percent: Math.max((item.amount / maxAmount) * 100, 60),
        }));
      }
    };

    const fetchReferralData = async () => {
      const response = await apiService.getScreenReferral();
      if (response.success && response.data) {
        updateData(response.data);
        saveCachedData(response);
        setTimeout(() => {
          if (referralsPanelRef.value && typeof referralsPanelRef.value.showData === 'function') {
            referralsPanelRef.value.showData();
          }
        }, 23);
      }
    };

    onMounted(() => {
      const cachedResponse = loadCachedData();
      if (cachedResponse && cachedResponse.data) {
        updateData(cachedResponse.data);
        if (referralsPanelRef.value && typeof referralsPanelRef.value.showData === 'function') {
          referralsPanelRef.value.showData();
        }
      } else if (referralsPanelRef.value && typeof referralsPanelRef.value.hideData === 'function') {
        referralsPanelRef.value.hideData();
      }
      fetchReferralData();
    });

    return {
      balance,
      claimed,
      referrals,
      friends,
      referralsPanelRef,
    };
  },
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
  height: 100%;
}
</style>

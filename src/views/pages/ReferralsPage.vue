<template>
  <div class="container">
    <div class="page">
      <!-- ReferralsPanel ожидает баланс и бонус, а метод showData отключит плейсхолдеры текстовых данных -->
      <ReferralsPanel
          ref="referralsPanelRef"
          style="margin-top: 12vh"
          :balance="balance"
          :bonus="bonus"
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

export default defineComponent({
  name: 'ReferralsPage',
  components: { FriendItem, ReferralsPanel },
  setup() {
    const balance = ref(0);
    const bonus = ref(0);
    const friends = ref<Friend[]>([]);
    const referralsPanelRef = ref<InstanceType<typeof ReferralsPanel> | null>(null);

    // Функция для загрузки данных о рефералах
    const loadReferralData = async () => {
      const response = await apiService.getScreenReferral();
      if (response.success && response.data) {
        // Устанавливаем баланс и бонус (например, используем claimed / unclaimed)
        balance.value = response.data.overview.claimed;
        bonus.value = response.data.overview.unclaimed;

        // Получаем массив топ-рефералов
        const topReferrals = response.data.top_referrals.referrals; // place, user_id, amount

        if (topReferrals && topReferrals.length > 0) {
          // Сортируем по amount (по убыванию), чтобы найти maxAmount
          const sorted = topReferrals.slice().sort((a, b) => b.amount - a.amount);
          const maxAmount = sorted[0].amount || 0;

          // Преобразуем в массив Friend
          friends.value = sorted.map((item) => ({
            avatar: `https://tondurakgame.com/users/photo?user_id=${item.user_id}`, // Или другой URL
            nickname: `User`,
            username: `@unknown`,
            amount: item.amount,
            place: item.place,
            // Используем Math.max, чтобы не опускаться ниже 60%
            percent: Math.max((item.amount / maxAmount) * 100, 60),
          }));
        }
      }
    };

    onMounted(async () => {
      await loadReferralData();
      // Вызываем showData у панели, чтобы отключить плейсхолдеры
      if (referralsPanelRef.value && typeof referralsPanelRef.value.showData === 'function') {
        referralsPanelRef.value.showData();
      }
    });

    return {
      balance,
      bonus,
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

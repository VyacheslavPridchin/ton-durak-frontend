<template>
  <div class="container">
    <div class="page">
      <ReferallsPanel style="margin-top: 12vh" :bonus="10" :balance="10"/>

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
import ReferallsPanel from '@/components/referrals-page/ReferralsPanel.vue';
import router from "@/router";
import FriendItem from "@/components/referrals-page/FriendItem.vue";

interface Friend {
  avatar: string;
  nickname: string;
  username: string;
  amount: number;
  percent: number | undefined;
  place: number | undefined;
}

export default defineComponent({
  components: { FriendItem, ReferallsPanel },
  setup() {
    const friends = ref<Friend[]>([]);

    onMounted(() => {

      const max = (a: number, b: number): number => {
        return a > b ? a : b;
      }

      const initialFriends = [
        { avatar: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg', nickname: 'Алексей', username: '@alex', amount: 21 },
        { avatar: 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg', nickname: 'Катюха', username: '@katya', amount: 13 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/male/4.jpg', nickname: 'Иван', username: '@ivan', amount: 23 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/female/7.jpg', nickname: 'Мария', username: '@maria', amount: 8 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/male/13.jpg', nickname: 'Дмитрий', username: '@dmitry', amount: 18 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/female/23.jpg', nickname: 'Анна', username: '@anna', amount: 4 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/female/16.jpg', nickname: 'Жанна', username: '@zhanna', amount: 2 },
        { avatar: 'https://xsgames.co/randomusers/assets/avatars/male/33.jpg', nickname: 'Георгий', username: '@gayorgy', amount: 24 },
        // { avatar: 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg', nickname: 'Алёша', username: '@leha123', amount: 3 },
      ];

      const sortedFriends = initialFriends.slice().sort((a, b) => b.amount - a.amount);
      const maxAmount = sortedFriends[0].amount;

      friends.value = sortedFriends.map((friend, index) => ({
        ...friend,
        place: index + 1,
        percent: max((friend.amount / maxAmount) * 100, 60)
      }));
    });

    return {
      friends
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
  height: 100%;
}
</style>

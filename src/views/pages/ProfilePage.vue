<template>
  <div class="container">
    <div class="page">
      <ProfilePanel username="best-username"
                    profile-name="Супер Имя"
                    profile-image="https://xsgames.co/randomusers/assets/avatars/male/11.jpg"
                    :games-count="10"
                    :wins-count="5"
                    :earnings="543"/>

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
import { defineComponent, ref } from 'vue';
import ProfilePanel from '@/components/profile-page/ProfilePanel.vue'
import router from "@/router";

export default defineComponent({
  components: {ProfilePanel},
  setup() {
    const onWalletButtonClick = () => {
      router.push('/wallet');
    };

    return { onWalletButtonClick };
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

.right-button{
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
  padding: 0 2vh
}

.wallet-icon {
  height: 2vh;
  object-fit: cover;
  margin-left: 0.5vh;
  margin-right: 1vh;
}
</style>
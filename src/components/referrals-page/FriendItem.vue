<template>
  <transition name="fade">
    <div class="friend-item-wrapper" :style="{ width: animatedWidth + '%' }">
      <div class="panel friend-item">
        <h1 class="friend-place">#{{ place }}</h1>
        <div class="friend-text-container">
          <h2 class="friend-title">{{ nickname }}</h2>
          <!--        <a v-if="username" class="friend-username">{{ username }}</a>-->
        </div>
        <a class="currency">${{ formattedCurrency }}</a>
      </div>
      <div class="profile-picture-wrapper placeholder-container" :class="{ isLoading: isLoadingImage }">
        <img class="profile-picture" :src="avatar" @load="onImageLoad" alt="avatar" />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'FriendItem',
  props: {
    avatar: { type: String, required: true },
    nickname: { type: String, required: true },
    username: { type: String, default: '' },
    currencyAmount: { type: Number, default: 0 },
    place: { type: Number, default: 0 },
    percent: { type: Number, default: 100 },
  },
  setup(props) {
    const animatedWidth = ref(60);
    const isLoadingImage = ref(true);

    onMounted(() => {
      animatedWidth.value = props.percent;
    });

    const onImageLoad = () => {
      isLoadingImage.value = false;
    };

    const formattedCurrency = computed(() => props.currencyAmount);
    return { formattedCurrency, animatedWidth, isLoadingImage, onImageLoad };
  },
});
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}

.friend-item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-width: fit-content;
}

/* Остальной CSS без изменений */
.friend-item {
  width: calc(100% - 3.5vh);
  display: flex;
  align-items: center;
  height: 7vh;
  padding: 0 4.25vh 0 2vh;
  margin: 0;
  box-sizing: border-box;
  min-width: fit-content;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}

.friend-place {
  font-size: 2vh;
  font-weight: 600;
  margin: 0 2vh 0 0;
}

.friend-text-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-right: 1vh;
}

.friend-title {
  font-size: 2vh;
  margin: 0;
}

.friend-username {
  font-size: 1.5vh;
  color: #8B8B8B;
  margin: 0;
}

.currency {
  font-size: 1.8vh;
}

.profile-picture-wrapper {
  width: 7vh;
  height: 7vh;
  margin-left: -3.5vh;
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
  object-fit: cover;
}
</style>

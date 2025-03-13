<template>
  <div class="container">
    <div class="page">
      <h2 style="margin-bottom: 1vh; margin-top: 12vh">Вывод</h2>
      <a class="secondary-text" style="margin-bottom: 1vh">Выберите сеть вывода</a>
      <div class="list">
        <CryptoItem
            :crypto-network="'USDT TON'"
            :icon-src="USDTTonIcon"
            @click="() => {router.push('/withdraw?network=USDT TON')}"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import TonIcon from "@/assets/icons/ton-icon.svg";
import USDTTonIcon from "@/assets/icons/usdt-ton-icon.svg";
import CryptoItem from "@/components/withdraw-options-page/CryptoItem.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {CryptoItem },
  setup() {

    // Храним id текущего раскрытого элемента. Если ни один не открыт, то null.
    const activeItem = ref<string | null>(null);

    // При клике обновляем activeItem: если элемент уже открыт – сворачиваем, иначе раскрываем.
    const handleToggle = (id: string) => {
      activeItem.value = activeItem.value === id ? null : id;
    };

    const router = useRouter();

    return { TonIcon, USDTTonIcon, activeItem, router, handleToggle };
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

.right-button img {
  height: 50%;
  display: block;
}

.secondary-text {
  font-size: 1.5vh;
  color: #8B8B8B;
  margin: 0 1vh 0 0;
  display: block;
}
</style>

<template>
  <div class="popup-container">
    <h1 style="margin-bottom: 1.5vh">Бонусный баланс</h1>
    <a class="secondary-text">Бонусный баланс — это своего рода награда за ваши успехи в игре. Вы получаете его за участие в турнирах, за первую игру и другие достижения.</a>
    <br/>
    <a class="secondary-text">Эти бонусные средства можно использовать для ставок, но вывести их напрямую нельзя. Однако, если вы выигрываете, ваш выигрыш всегда зачисляется в реальный баланс.</a>
    <br/>
    <a class="secondary-text" style="margin-bottom: 1.5vh">Такой механизм позволяет вам пробовать новые стратегии и совершенствовать игру без риска собственных средств, а успехи переходят в реальные деньги.</a>
    <button class="main-button animate-press" @click="closePopup">
      Окей!
    </button>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue';
import {events} from "@/events.ts";
import apiService from "@/services/ApiService.ts";

export default defineComponent({
  setup() {
    const closePopup = () => {
      events.emit("hidePopup");
    }

    onMounted(async () => {
      await apiService.postVisit('bonus_balance_information_popup');
    })

    return {
      closePopup
    };
  }
});
</script>

<style scoped>
.popup-container {
  display: flex;
  flex-direction: column;
  padding: 0 2vh;
  margin: 0 auto;
}
</style>

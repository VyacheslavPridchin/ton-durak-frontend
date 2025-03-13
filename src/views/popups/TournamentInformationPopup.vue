<template>
  <div class="popup-container">
    <h1 style="margin-bottom: 1.5vh">Турнир</h1>
    <a class="secondary-text">Каждую неделю проходит турнир, в котором учитываются все ваши победы. В конце недели топ-5 игроков получают бонусный баланс, который можно использовать для игры.</a>
    <br/>
    <a class="secondary-text" style="margin-bottom: 1.5vh">Также не забывайте — чем выше ваша лига, тем больше награды в турнире!</a>
    <button class="main-button animate-press" @click="closePopup">
      Окей!
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {events} from "@/events.ts";


export default defineComponent({
  setup() {
    const closePopup = () => {
      events.emit("hidePopup");
    }
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

<template xmlns="http://www.w3.org/1999/html">
  <div class="popup-container">
    <h1 style="margin-bottom: 1.5vh">Бесплатные игры</h1>

    <a class="secondary-text">Играй в «Дурака» совершенно бесплатно — выбирай лобби или создавай своё и начинай партию в любое время!</a>
    <br/>
    <a class="secondary-text">Для игры используется энергия — это количество доступных бесплатных партий. Одна игра тратит одну единицу энергии.</a>
    <br/>
    <a class="secondary-text">Не волнуйся, энергия восстанавливается автоматически — по <span style="font-weight: 500;">1 единице каждые 15 минут</span>.</a>
    <br/>
    <a class="secondary-text" style="margin-bottom: 1.5vh">Зови друзей, играй с другими участниками и докажи, что ты — настоящий мастер в «Дураке»!</a>

    <button class="main-button animate-press" @click="closePopup">
      Окей!
    </button>
    <br/>
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
      await apiService.postVisit('free_game_popup');
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

<template xmlns="http://www.w3.org/1999/html">
  <div class="popup-container">
    <h1 style="margin-bottom: 1.5vh">Реферальная система</h1>

    <a class="secondary-text">Каждая игра имеет комиссию, которая рассчитывается исходя из суммы ставки и процента комиссии в конкретной лиги игрока - комиссия варьируется от <span style="font-weight: 500;">$0.15</span> до <span style="font-weight: 500;">$1.6</span> за игру.</a>
    <br/>
    <a class="secondary-text">Затем эта комиссия делится на количество игроков. Вы же в свою очередь получаете <span style="font-weight: 500;">50%</span> за каждую игру пользователя, который был приглашен вами. Ему даже не обязательно побеждать!</a>
    <br/>
    <a class="secondary-text">Таким образом, чем выше лига игрока (чем дольше и лучше он играет), тем больше вы будете зарабатывать за приглашенного человека.</a>
    <br/>
    <a class="secondary-text" style="margin-bottom: 1.5vh">Например, если в игре было <span style="font-weight: 500;">2</span> игрока (1 из них ваш реферал) со ставкой <span style="font-weight: 500;">$1.25</span>, то призовой пул (деньги проигравшего) составляет <span style="font-weight: 500;">$1.25</span>. Мы забираем процент комиссии - от <span style="font-weight: 500;">10%</span> до <span style="font-weight: 500;">30%</span>. В данном примере возьмем <span style="font-weight: 500;">20%</span> от призового пула: <span style="font-weight: 500;">$1.25 * 20% = $0.25</span>. Комиссия делится на кол-во играющих (в данном примере 2 игрока): <span style="font-weight: 500;">$0.25 / 2 = $0.125</span>. И половина  от получившейся суммы отправляется пригласившему, т.е. <span style="font-weight: 500;">$0.125 / 2 = $0.0625</span>. Если бы в игре участвовали оба ваших реферала, то вы бы получили за каждого соответственно.</a>

    <button class="main-button animate-press" @click="closePopup">
      Окей!
    </button>
    <br/>
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

.address-box {
  display: flex;
  align-items: center;
  background: #F5F4F4;
  border-radius: 1vh;
  padding: 1vh;
  margin: 0 0 0.25vh 0;
  height: 3vh;
}

.address-text {
  font-size: 1.75vh;
  color: #000;
  margin-right: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.details-row {
  margin-top: 0.25vh;
  display: flex;
  align-items: center;
  gap: 0.8vh;
}

.details-title {
  text-align: left;
  font-size: 1.75vh;
  color: rgba(0, 0, 0, 0.75);
}

.details-value {
  margin-left: auto;
  font-size: 1.75vh;
}
</style>

<template>
  <div class="container">
  <div class="content">
    <h1>Current Route: {{ currentRoute }}</h1>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentRoute = computed(() => route.path);

onMounted(() => {

})

function Load(){
  console.log("Load", currentRoute.value);
}

defineExpose({ Load });
</script>

<style scoped>
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
}
</style>

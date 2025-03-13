<script setup lang="ts">
interface SlideContainerProps {
  enabled: boolean
}
const props = defineProps<SlideContainerProps>()
</script>

<template>
  <div v-if="enabled">
    <slot />
  </div>
</template>

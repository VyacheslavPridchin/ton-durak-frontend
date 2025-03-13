<template>
  <div class="overlay">
    <div class="notifications-wrapper">
      <transition-group name="notification" tag="div">
        <div
            v-for="(notification, index) in notifications"
            :key="notification.id"
            class="notification-item"
            :style="{ bottom: `calc(13vh + ${(notifications.length - index - 1) * 0.5}vh)` }"
        >
          <NotificationItem
              :title="notification.title"
              :subtitle="notification.subtitle"
              :icon="notification.icon"
              :sticker="notification.sticker"
              @close="removeNotification(notification.id)"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, watch } from 'vue';
import { events } from '@/events.ts';
import { useRoute } from 'vue-router';
import NotificationItem from "@/components/notification-layout/NotificationItem.vue";

interface Notification {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  sticker: string;
}

export default defineComponent({
  components: { NotificationItem },
  setup() {
    const notifications = ref<Notification[]>([]);
    let idCounter = 0;

    const removeNotification = (id: number) => {
      notifications.value = notifications.value.filter(n => n.id !== id);
    };

    const show = (title: string, subtitle: string, icon: string, sticker: string) => {
      // Ограничиваем количество уведомлений до 3
      if (notifications.value.length >= 3) {
        notifications.value.shift(); // удаляем самое старое уведомление
      }
      const id = ++idCounter;
      notifications.value.push({ id, title, subtitle, icon, sticker });
      // Автоудаление уведомления через 5 секунд
      setTimeout(() => removeNotification(id), 5000);
    };

    const showHandler = (value: { title: string; subtitle: string; icon: string; sticker: string }) => {
      show(value.title, value.subtitle, value.icon, value.sticker);
    };

    events.on('showNotification', showHandler);
    onUnmounted(() => {
      events.off('showNotification', showHandler);
    });

    const route = useRoute();
    watch(() => route.fullPath, () => {
      notifications.value = [];
    });

    return {
      notifications,
      show,
      removeNotification,
    };
  },
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
  pointer-events: none;
  z-index: 900;
}

.notifications-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.notification-item {
  position: absolute;
  left: 50%;
  width: 95%;
  transform: translateX(-50%);
  transition: bottom 0.5s;
}

/* Анимация появления/исчезновения уведомлений */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(2vh) translateX(-50%);
}
</style>

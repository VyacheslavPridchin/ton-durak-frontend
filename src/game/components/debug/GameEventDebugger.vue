<!--<template>-->
<!--  <div-->
<!--      class="event-debugger"-->
<!--      :style="{ width: size.width + 'px', height: size.height + 'px' }"-->
<!--      ref="panel"-->
<!--  >-->
<!--    <div class="header" @mousedown="startDrag" @touchstart="startDrag">-->
<!--      <button class="styled-button" @click="toggleCollapse">☰</button>-->
<!--      <span v-if="isCollapsed" class="log-summary">✍{{ logCounts.log }} ⚠{{ logCounts.warn }} ☠{{ logCounts.error }}</span>-->
<!--      <button v-if="!isCollapsed" @click="switchTab" class="styled-button">Switch</button>-->
<!--      <button v-if="!isCollapsed" @click="resetPosition" class="styled-button">𐄂</button>-->
<!--    </div>-->

<!--    <div v-if="!isCollapsed" class="content">-->
<!--      <div v-if="activeTab === 'Events'">-->
<!--        <div class="event-item" v-for="event in events" :key="event.name">-->
<!--          <button @click="triggerEvent(event)" class="styled-button">{{ event.name }}</button>-->
<!--          <input-->
<!--              v-model="event.payload"-->
<!--              :placeholder="`Payload for ${event.name}`"-->
<!--              type="text"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--      <div v-else class="log-panel">-->
<!--        <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">-->
<!--          <div class="log-prefix">> {{ log.type.toUpperCase() }}</div>-->
<!--          <div  class="log-content">{{ log.message }}</div>-->
<!--          <pre class="log-stack" v-if="log.expanded">{{ log.trace }}</pre>-->
<!--          <div class="log-time">{{ log.time }}</div>-->
<!--          <button @click="log.expanded = !log.expanded" class="styled-button" style="font-size: 0.8em;">-->
<!--            {{ log.expanded ? '▲' : '▼' }}-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

<!--    <div v-if="!isCollapsed" class="resizer" @mousedown.stop="startResize" @touchstart.stop="startResize"></div>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { reactive, ref, computed, onMounted, onUnmounted } from 'vue';-->
<!--import { EventService, EventType } from '../../network/EventService';-->
<!--import gsap from 'gsap';-->
<!--import LogInterceptor from '../../utils/LogInterceptor';-->

<!--// Получаем инстанс LogInterceptor-->
<!--const logInterceptor = LogInterceptor.getInstance();-->
<!--const isCollapsed = ref(true);-->
<!--const activeTab = ref<'Events' | 'Logs'>('Logs');-->
<!--const panel = ref<HTMLElement | null>(null);-->
<!--const size = reactive({ width: 170, height: 45});-->
<!--let widthCached = 350;-->
<!--let heightCached = 300;-->
<!--const position = reactive({ x: 0, y: 0 });-->
<!--const logs = reactive([] as Array<{ type: string; message: string; trace: string; time: number; expanded: boolean }>);-->
<!--const events = reactive(-->
<!--    Object.keys(EventType).map((key) => ({-->
<!--      name: key,-->
<!--      payload: '',-->
<!--    }))-->
<!--);-->
<!--const logCounts = computed(() => {-->
<!--  return {-->
<!--    log: logs.filter(log => log.type === 'log').length,-->
<!--    warn: logs.filter(log => log.type === 'warn').length,-->
<!--    error: logs.filter(log => log.type === 'error').length,-->
<!--  };-->
<!--});-->

<!--// Подписка на обновления логов-->
<!--const onLogAdded = (event: CustomEvent) => {-->
<!--  const newLog = event.detail;-->

<!--  // Добавляем поле `expanded` при добавлении лога-->
<!--  logs.push({ ...newLog, expanded: false });-->
<!--};-->

<!--const initializeLogs = () => {-->
<!--  const existingLogs = logInterceptor.getLogs();-->
<!--  logs.push(...existingLogs.map(log => ({ ...log, expanded: false })));-->
<!--};-->

<!--onMounted(() => {-->
<!--  initializeLogs(); // Инициализируем текущие логи-->
<!--  logInterceptor.addEventListener('logAdded', onLogAdded);-->
<!--});-->

<!--onUnmounted(() => {-->
<!--  logInterceptor.removeEventListener('logAdded', onLogAdded);-->
<!--});-->

<!--const toggleCollapse = () => {-->
<!--  isCollapsed.value = !isCollapsed.value;-->

<!--  if (panel.value) {-->
<!--    if(isCollapsed.value)-->
<!--    {-->
<!--      gsap.to(panel.value, { width: 170, height: 45, duration: 0.3,-->
<!--        onComplete: () => {-->
<!--          // Присваивание новых значений после завершения анимации-->
<!--          size.width = 170;-->
<!--          size.height = 45;-->
<!--        }, });-->
<!--    } else-->
<!--    {-->
<!--      // Ваш текущий код анимации-->
<!--      gsap.to(panel.value, {-->
<!--        width: widthCached,-->
<!--        height: heightCached,-->
<!--        duration: 0.3,-->
<!--        onComplete: () => {-->
<!--          // Присваивание новых значений после завершения анимации-->
<!--          size.width = widthCached;-->
<!--          size.height = heightCached;-->
<!--        },-->
<!--      });-->
<!--    }-->
<!--  }-->
<!--};-->

<!--const resetPosition = () => {-->
<!--  position.x = 0;-->
<!--  position.y = 0;-->
<!--  isCollapsed.value = true;-->
<!--  if (panel.value) {-->
<!--    gsap.to(panel.value, { x: 0, y: 0, width: 170, height: 45, duration: 0.3,-->
<!--      onComplete: () => {-->
<!--        // Присваивание новых значений после завершения анимации-->
<!--        size.width = 170;-->
<!--        size.height = 45;-->
<!--        widthCached = 350;-->
<!--        heightCached = 300;-->
<!--      }, });-->
<!--  }-->
<!--};-->

<!--const switchTab = () => {-->
<!--  activeTab.value = activeTab.value === 'Events' ? 'Logs' : 'Events';-->
<!--};-->

<!--const triggerEvent = (event: { name: string; payload: string }) => {-->
<!--  try {-->
<!--    const payload = event.payload ? JSON.parse(event.payload) : undefined;-->
<!--    EventService.Instance.emit(EventType[event.name as keyof typeof EventType], payload);-->
<!--    console.log(`Event ${event.name} triggered with payload:`, payload);-->
<!--  } catch (error) {-->
<!--    console.error(`Failed to trigger event ${event.name}:`, error);-->
<!--  }-->
<!--};-->

<!--let isDragging = false;-->
<!--let startMousePosition = { x: 0, y: 0 };-->

<!--const startDrag = (e: MouseEvent | TouchEvent) => {-->
<!--  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;-->
<!--  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;-->

<!--  if (panel.value) {-->
<!--    isDragging = true;-->
<!--    startMousePosition = { x: clientX - position.x, y: clientY - position.y };-->
<!--    document.addEventListener('mousemove', drag);-->
<!--    document.addEventListener('mouseup', stopDrag);-->
<!--    document.addEventListener('touchmove', drag, { passive: false });-->
<!--    document.addEventListener('touchend', stopDrag);-->
<!--  }-->
<!--};-->

<!--const drag = (e: MouseEvent | TouchEvent) => {-->
<!--  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;-->
<!--  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;-->

<!--  if (isDragging && panel.value) {-->
<!--    position.x = clientX - startMousePosition.x;-->
<!--    position.y = clientY - startMousePosition.y;-->

<!--    gsap.set(panel.value, { x: position.x, y: position.y });-->
<!--    e.preventDefault(); // Предотвращение прокрутки на мобильных устройствах-->
<!--  }-->
<!--};-->

<!--const stopDrag = () => {-->
<!--  isDragging = false;-->
<!--  document.removeEventListener('mousemove', drag);-->
<!--  document.removeEventListener('mouseup', stopDrag);-->
<!--  document.removeEventListener('touchmove', drag);-->
<!--  document.removeEventListener('touchend', stopDrag);-->
<!--};-->

<!--let isResizing = false;-->
<!--let startResizePosition = { x: 0, y: 0 };-->

<!--const startResize = (e: MouseEvent | TouchEvent) => {-->
<!--  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;-->
<!--  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;-->

<!--  isResizing = true;-->
<!--  startResizePosition = { x: clientX, y: clientY };-->
<!--  document.addEventListener('mousemove', resize);-->
<!--  document.addEventListener('mouseup', stopResize);-->
<!--  document.addEventListener('touchmove', resize, { passive: false });-->
<!--  document.addEventListener('touchend', stopResize);-->
<!--};-->

<!--const resize = (e: MouseEvent | TouchEvent) => {-->
<!--  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;-->
<!--  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;-->

<!--  if (isResizing) {-->
<!--    size.width += clientX - startResizePosition.x;-->
<!--    size.height += clientY - startResizePosition.y;-->
<!--    startResizePosition = { x: clientX, y: clientY };-->

<!--    widthCached = size.width;-->
<!--    heightCached = size.height;-->
<!--    e.preventDefault();-->
<!--  }-->
<!--};-->

<!--const stopResize = () => {-->
<!--  isResizing = false;-->
<!--  document.removeEventListener('mousemove', resize);-->
<!--  document.removeEventListener('mouseup', stopResize);-->
<!--  document.removeEventListener('touchmove', resize);-->
<!--  document.removeEventListener('touchend', stopResize);-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->

<!--.log-panel {-->
<!--  background: transparent;-->
<!--  padding: 0px;-->
<!--  overflow-y: auto;-->
<!--}-->
<!--.log-item {-->
<!--  padding: 5px;-->
<!--  border-bottom: 1px solid #444;-->
<!--  cursor: pointer;-->
<!--}-->
<!--.log-item.log { color: #00ff00; }-->
<!--.log-item.warn { color: #ffa500; }-->
<!--.log-item.error { color: #ff0000; }-->

<!--.log-summary {-->
<!--  font-size: 0.9em;-->
<!--  color: white;-->
<!--  font-weight: bold;-->
<!--  padding-left: 10px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  height: 100%;-->
<!--}-->

<!--.log-content {-->
<!--  font-size: 0.8em;-->
<!--  display: inline-block;-->
<!--  overflow: auto;-->
<!--}-->
<!--.log-stack {-->
<!--  font-size: 0.8em;-->
<!--  color: #bbb;-->
<!--  margin-top: 5px;-->
<!--  white-space: pre-wrap;-->
<!--}-->
<!--.log-time {-->
<!--  font-size: 0.75em;-->
<!--  color: #aaa;-->
<!--  margin-top: 2px;-->
<!--}-->

<!--.event-debugger {-->
<!--  position: fixed;-->
<!--  background: rgba(0, 0, 0, 0.8);-->
<!--  color: white;-->
<!--  border-radius: 8px;-->
<!--  z-index: 99999999;-->
<!--  overflow: hidden;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--}-->
<!--.event-debugger .header {-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  background: #444;-->
<!--  padding: 5px;-->
<!--  cursor: grab;-->
<!--}-->
<!--.event-debugger .content {-->
<!--  flex-grow: 1;-->
<!--  overflow-y: auto;-->
<!--  padding: 10px;-->
<!--}-->
<!--.event-debugger .event-item {-->
<!--  margin-bottom: 10px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  gap: 10px;-->
<!--}-->
<!--.event-debugger .event-item button {-->
<!--  flex-shrink: 0;-->
<!--}-->
<!--.event-debugger .event-item input {-->
<!--  flex-grow: 1;-->
<!--  padding: 5px;-->
<!--  border: 1px solid #ccc;-->
<!--  border-radius: 4px;-->
<!--}-->
<!--.event-debugger .resizer {-->
<!--  width: 10px;-->
<!--  height: 10px;-->
<!--  background: #ccc;-->
<!--  border-radius: 2px;-->
<!--  position: absolute;-->
<!--  bottom: 0;-->
<!--  right: 0;-->
<!--  cursor: se-resize;-->
<!--}-->

<!--.styled-button {-->
<!--  background-color: #d3d3d3;-->
<!--  border: none;-->
<!--  border-radius: 5px;-->
<!--  padding: 5px 10px;-->
<!--  cursor: pointer;-->
<!--  transition: background 0.3s;-->
<!--}-->

<!--.styled-button:hover {-->
<!--  background-color: #b0b0b0;-->
<!--}-->
<!--</style>-->

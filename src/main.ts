import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// @ts-ignore
const colorScheme = window.Telegram?.WebApp?.colorScheme || 'light'; // По умолчанию 'light'
document.documentElement.setAttribute('data-theme', colorScheme);

const app = createApp(App)

app.use(router)

app.mount('#app')

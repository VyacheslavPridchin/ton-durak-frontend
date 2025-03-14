import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'
import type { ApiResponse, AuthRequest, AuthResponseData } from "@/services/ApiService.ts";
import apiService from "@/services/ApiService.ts";

// @ts-ignore
const colorScheme = window.Telegram?.WebApp?.colorScheme || 'light';
document.documentElement.setAttribute('data-theme', colorScheme);

const authData = ref<ApiResponse<AuthResponseData> | null>(null);

// Функция авторизации
const auth = async (init_data: string) => {
    const payload: AuthRequest = { initData: init_data };
    try {
        authData.value = await apiService.auth(payload);
        console.log("Auth Response:", authData.value);
    } catch (error) {
        console.error("Authorization error:", error);
    }
    return authData.value;
};

// Функция кэширования initData и данных пользователя
const cacheUserData = (rawInitData: string) => {
    if (rawInitData) {
        localStorage.setItem("initData", rawInitData);
    }
    const params = new URLSearchParams(rawInitData);
    const userEncoded = params.get("user");
    if (userEncoded) {
        try {
            const userJson = decodeURIComponent(userEncoded);
            const userObj = JSON.parse(userJson);
            localStorage.setItem("userData", JSON.stringify(userObj));
            // @ts-ignore
            window.userData = userObj;
            console.log("Cached user data:", userObj);
        } catch (err) {
            console.error("Error parsing user data", err);
        }
    } else {
        console.warn("User data not found in initData");
    }
};

// Запускаем аутентификацию, затем приложение
(async () => {
    // @ts-ignore
    const telegramInitData = window.Telegram.WebApp.initData || localStorage.getItem("initData");

    if (telegramInitData) {
        cacheUserData(telegramInitData);
        await auth(telegramInitData);
    } else {
        console.error("initData не найден ни в Telegram.WebApp, ни в кэше");
    }

    // Запуск приложения после успешной аутентификации
    const app = createApp(App);
    app.use(router);
    app.mount('#app');
})();

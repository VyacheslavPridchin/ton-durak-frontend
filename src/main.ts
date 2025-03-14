import './assets/main.css'

import {createApp, ref} from 'vue'
import App from './App.vue'
import router from './router'
import type {ApiResponse, AuthRequest, AuthResponseData} from "@/services/ApiService.ts";
import apiService from "@/services/ApiService.ts";

// @ts-ignore
const colorScheme = window.Telegram?.WebApp?.colorScheme || 'light'; // По умолчанию 'light'
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
    return { authData };
};

// Функция кэширования initData и данных пользователя
const cacheUserData = (rawInitData: string) => {
    if (rawInitData) {
        // Сохраняем полную строку initData для будущих обращений
        localStorage.setItem("initData", rawInitData);
    }
    const params = new URLSearchParams(rawInitData);
    const userEncoded = params.get("user");
    if (userEncoded) {
        try {
            const userJson = decodeURIComponent(userEncoded);
            const userObj = JSON.parse(userJson);
            // Сохраняем данные пользователя в кэше
            localStorage.setItem("userData", JSON.stringify(userObj));
            // Также можно положить их в глобальную переменную для быстрого доступа
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

// @ts-ignore
const telegramInitData = window.Telegram.WebApp.initData || localStorage.getItem("initData");
if (telegramInitData) {
    cacheUserData(telegramInitData);
    await auth(telegramInitData);
} else {
    console.error("initData не найден ни в Telegram.WebApp, ни в кэше");
}

const app = createApp(App)

app.use(router)

app.mount('#app')

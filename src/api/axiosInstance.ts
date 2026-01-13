import axios from "axios";
import { getAccessToken, removeTokens } from "@/utils/auth";

export const urlApi = "https://1-zvonok.com/";

const instance = axios.create({
    baseURL: urlApi + "api/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

instance.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обработка 401 — токен недействителен
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("Access token недействителен, очищаем и редиректим на логин");
            await removeTokens();
            window.location.href = "/login"; // редирект на страницу логина
        }
        return Promise.reject(error);
    }
);

export default instance;

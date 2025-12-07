/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://34.58.230.252";

function Login() {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        user: null,
        error: null,
    });

    useEffect(() => {
        const authenticateUser = async () => {
            const tg = (window as any).Telegram?.WebApp;

            if (!tg || !tg.initData) {
                console.error("Приложение запущено не в Telegram. Аутентификация невозможна.");
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    user: null,
                    error: "Пожалуйста, откройте приложение через Telegram.",
                });
                return;
            }

            const initData = tg.initData;

            try {
                console.log("Отправка initData на бэкенд для аутентификации...");
                const response = await axios.post(`${API_BASE_URL}/api/auth/telegram`, {
                    init_data: initData,
                });

                const { access_token, refresh_token, user } = response.data;

                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("refreshToken", refresh_token);

                console.log("Аутентификация успешна. Пользователь:", user);

                setAuthState({
                    isLoading: false,
                    isAuthenticated: true,
                    user: user,
                    error: null,
                });
            } catch (err) {
                console.error("Ошибка аутентификации на бэкенде:", err.response?.data || err.message);
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    user: null,
                    error: "Не удалось войти в систему. Попробуйте перезапустить приложение.",
                });
            }
        };

        authenticateUser();
    }, []);

    if (authState.isLoading) {
        return <h1>sdcsdcsdc</h1>;
    }

    if (authState.error) {
        return <h3>error</h3>;
    }

    if (authState.isAuthenticated) {
        return <h1>успешно</h1>;
    }

    return <h2>error2</h2>;
}

export default Login;

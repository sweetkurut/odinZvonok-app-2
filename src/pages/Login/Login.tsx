/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTelegramAuth, fetchMe } from "@/store/slices/authSlice";
import styles from "./style.module.scss";
import FullRegistrationForm from "@/widgets/FullRegistrationForm/FullRegistrationForm";

type Status = "loading" | "need-register" | "error" | "authenticated" | "mock-login";

const Login = () => {
    const [status, setStatus] = useState<Status>("loading");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading: authLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;

        // === ЛОКАЛЬНАЯ РАЗРАБОТКА: МОК ДАННЫХ ===
        if (import.meta.env.DEV && !tg) {
            console.log("🛠 Локальная разработка: Telegram WebApp не найден — используем мок-данные");

            // Пример мок initData (можно изменить под свои тесты)
            const mockInitData =
                "query_id=AAHdF6IQAAAAAN0XohD9g4eO&user=%7B%22id%22%3A999999999%2C%22first_name%22%3A%22Тестовый%22%2C%22last_name%22%3A%22Пользователь%22%2C%22username%22%3A%22dev_user%22%2C%22language_code%22%3A%22ru%22%7D&auth_date=1735680000&hash=fakehashforlocaldev";

            const initMockAuth = async () => {
                try {
                    await dispatch(fetchTelegramAuth(mockInitData)).unwrap();
                    const me = await dispatch(fetchMe()).unwrap();

                    // Редирект по роли
                    if (me.role === "client") navigate("/client");
                    else if (me.role === "operator") navigate("/operator");
                    else if (me.role === "master") navigate("/master");

                    setStatus("authenticated");
                } catch (err: any) {
                    console.error("Мок-авторизация ошибка:", err);
                    if (err?.status === 404) {
                        setStatus("need-register"); // Покажем форму регистрации
                    } else {
                        setStatus("mock-login"); // Специальный экран для выбора
                    }
                }
            };

            initMockAuth();
            return;
        }

        // === НАСТОЯЩИЙ TELEGRAM MINI APP ===
        if (!tg?.initData) {
            setStatus("error");
            return;
        }

        tg.ready();
        tg.expand();

        const initAuth = async () => {
            try {
                await dispatch(fetchTelegramAuth(tg.initData)).unwrap();
                const me = await dispatch(fetchMe()).unwrap();

                if (me.role === "client") navigate("/client");
                else if (me.role === "operator") navigate("/operator");
                else if (me.role === "master") navigate("/master");

                setStatus("authenticated");
            } catch (err: any) {
                console.error("Auth error:", err);
                if (err?.status === 404) {
                    setStatus("need-register");
                } else {
                    setStatus("error");
                }
            }
        };

        initAuth();
    }, [dispatch, navigate]);

    // Лоадеры
    if (authLoading || status === "loading") {
        return <div className={styles.loader}>Загрузка...</div>;
    }

    // Форма полной регистрации
    if (status === "need-register") {
        return <FullRegistrationForm />;
    }

    // Ошибка в настоящем Telegram
    if (status === "error") {
        return (
            <div className={styles.error}>
                <h3>Ошибка запуска приложения</h3>
                <p>Убедитесь, что вы открыли приложение через Telegram-бота.</p>
                <button onClick={() => window.location.reload()}>Повторить</button>
            </div>
        );
    }

    // Специальный экран для локалки, если мок не сработал
    if (status === "mock-login") {
        return (
            <div className={styles.error}>
                <h3>Локальная разработка</h3>
                <p>Авторизация не удалась даже с мок-данными.</p>
                <button onClick={() => navigate("/client")}>Войти как клиент (тест)</button>
                <button onClick={() => navigate("/operator")} style={{ marginLeft: 10 }}>
                    Войти как оператор (тест)
                </button>
                <button onClick={() => navigate("/master")} style={{ marginLeft: 10 }}>
                    Войти как мастер (тест)
                </button>
            </div>
        );
    }

    return null;
};

export default Login;

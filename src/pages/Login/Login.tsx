/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTelegramAuth, fetchMe } from "@/store/slices/authSlice";
import FullRegistrationForm from "@/widgets/FullRegistrationForm/FullRegistrationForm";
import { saveTokens } from "@/utils/auth"; // твой файл с токенами
import styles from "./style.module.scss";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (loading) return;
        const tg = (window as any).Telegram?.WebApp;
        if (!tg?.initData) return;

        // DEV MODE — мок initData
        if (import.meta.env.DEV && !tg) {
            console.log("DEV MODE: Telegram WebApp не найден — используем мок initData");

            const mockInitData =
                "query_id=AAH...&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%7D";

            const initDev = async () => {
                try {
                    const result = await dispatch(fetchTelegramAuth(mockInitData)).unwrap();
                    if (result.access_token && result.refresh_token) {
                        await saveTokens(result.access_token, result.refresh_token);
                    }
                    await dispatch(fetchMe()).unwrap(); // обновляем профиль пользователя
                    navigate("/client"); // редирект после авторизации
                } catch (err) {
                    console.error("Ошибка DEV auth:", err);
                }
            };

            initDev();
            return;
        }

        // REAL Telegram
        if (!tg?.initData) {
            console.warn("Telegram WebApp initData не найден — открыто вне Telegram?");
            return;
        }

        tg.ready();
        tg.expand();

        const init = async () => {
            try {
                const result = await dispatch(fetchTelegramAuth(tg.initData)).unwrap();

                // Сохраняем токены через utils
                if (result.access_token && result.refresh_token) {
                    await saveTokens(result.access_token, result.refresh_token);
                }

                // Обновляем данные пользователя
                await dispatch(fetchMe()).unwrap();

                // Редирект после завершения регистрации
                if (result.user?.is_registration_complete) {
                    navigate("/client");
                }
            } catch (err) {
                console.error("Ошибка Telegram auth:", err);
            }
        };

        init();
    }, [dispatch, navigate]);

    // Загрузка
    if (loading) {
        return <div className={styles.loader}>Загрузка...</div>;
    }

    // Ошибка
    if (error) {
        return (
            <div className={styles.error}>
                <h3>Ошибка входа</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Повторить</button>
            </div>
        );
    }

    // Нужно завершить регистрацию
    if (isAuthenticated && user && !user.is_registration_complete) {
        return <FullRegistrationForm />;
    }

    // Всё ок — редирект уже произошёл или пользователь не авторизован
    return null;
};

export default Login;

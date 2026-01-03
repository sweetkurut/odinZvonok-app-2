/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTelegramAuth } from "@/store/slices/authSlice";
import FullRegistrationForm from "@/widgets/FullRegistrationForm/FullRegistrationForm";
import styles from "./style.module.scss";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const tg = (window as any).Telegram?.WebApp;

        // Локальная разработка — мок
        if (import.meta.env.DEV && !tg) {
            console.log("Локалка: Telegram WebApp не найден — пропускаем (или добавь мок)");
            // Можно добавить мок initData здесь, если хочешь
            return;
        }

        // Реальный Telegram
        if (!tg?.initData) {
            // Не в Telegram — ошибка
            return;
        }

        tg.ready();
        tg.expand();

        const init = async () => {
            try {
                // Один единственный запрос
                const result = await dispatch(fetchTelegramAuth(tg.initData)).unwrap();

                const currentUser = result.user;

                // Проверяем, завершена ли регистрация
                if (!currentUser.is_registration_complete) {
                    // Нужно заполнить данные
                    return;
                }

                // Регистрация завершена — редиректим по роли
                if (currentUser.role === "client") navigate("/client");
                else if (currentUser.role === "operator") navigate("/operator");
                else if (currentUser.role === "master") navigate("/master");
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

    // Всё ок — ничего не рендерим (редирект уже произошёл)
    return null;
};

export default Login;

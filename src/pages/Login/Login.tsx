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

        // DEV MODE — мок initData
        if (import.meta.env.DEV && !tg) {
            console.log("DEV MODE: Telegram WebApp не найден — используем мок initData");

            const mockInitData =
                "query_id=AAH...&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%7D";

            const initDev = async () => {
                try {
                    const result = await dispatch(fetchTelegramAuth(mockInitData)).unwrap();
                    saveAndRedirect(result.user);
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
                saveAndRedirect(result.user, result.access_token, result.refresh_token);
            } catch (err) {
                console.error("Ошибка Telegram auth:", err);
            }
        };

        init();
    }, [dispatch, navigate]);

    // Сохраняем токены и редиректим
    const saveAndRedirect = (currentUser: any, accessToken?: string, refreshToken?: string) => {
        if (!currentUser) return;

        // Сохраняем токены
        if (accessToken) localStorage.setItem("access_token", accessToken);
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(currentUser));

        // Нужно завершить регистрацию
        if (!currentUser.is_registration_complete) return;

        // Редирект по роли
        switch (currentUser.role) {
            case "client":
                navigate("/client");
                break;
            case "operator":
                navigate("/operator");
                break;
            case "master":
                navigate("/master");
                break;
            default:
                navigate("/"); // fallback
        }
    };

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

    // Всё ок — редирект уже произошёл
    return null;
};

export default Login;

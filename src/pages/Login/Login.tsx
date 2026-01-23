/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTelegramAuth, fetchMe } from "@/store/slices/authSlice";
import FullRegistrationForm from "@/widgets/FullRegistrationForm/FullRegistrationForm";
import { saveTokens } from "@/utils/auth"; // твой файл с токенами
import styles from "./style.module.scss";
import Loader from "@/shared/ui/Loader/Loader";

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (loading || isAuthenticated) return;

        const tg = (window as any).Telegram?.WebApp;
        if (!tg?.initData) return;

        tg.ready();
        tg.expand();

        const init = async () => {
            try {
                const result = await dispatch(fetchTelegramAuth(tg.initData)).unwrap();

                if (result.access_token && result.refresh_token) {
                    await saveTokens(result.access_token, result.refresh_token);
                }

                await dispatch(fetchMe()).unwrap();

                navigate("/client");
            } catch (e) {
                console.error("Telegram auth error", e);
            }
        };

        init();
    }, [dispatch, navigate, loading, isAuthenticated]);

    // Загрузка
    if (loading) {
        return (
            <div className={styles.loader}>
                <Loader />
            </div>
        );
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

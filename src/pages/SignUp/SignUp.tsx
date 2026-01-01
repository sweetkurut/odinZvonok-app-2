import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { storesApi } from "@/api";
import styles from "./style.module.scss";

const SignUp = () => {
    const dispatch = useAppDispatch();
    const [role, setRole] = useState<"client" | "operator" | "master">("client");
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        try {
            setLoading(true);
            await storesApi.quickRegister({ role });

            // после регистрации → просто заново авторизуемся
            window.location.href = "/";
        } catch {
            alert("Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>Регистрация</h1>

            <div className={styles.card}>
                <label>Выберите роль</label>

                <select value={role} onChange={(e) => setRole(e.target.value as any)}>
                    <option value="client">Клиент</option>
                    <option value="operator">Оператор</option>
                    <option value="master">Мастер</option>
                </select>

                <button onClick={submit} disabled={loading}>
                    {loading ? "..." : "Продолжить"}
                </button>
            </div>
        </div>
    );
};

export default SignUp;

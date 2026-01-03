/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storesApi } from "@/api";
import { useAppDispatch } from "@/store/hooks";
import { fetchMe } from "@/store/slices/authSlice";
import styles from "./FullRegistrationForm.module.scss";

const FullRegistrationForm = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Берём данные из Telegram, если доступны (для автозаполнения)
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    const [form, setForm] = useState({
        first_name: tgUser?.first_name || "",
        last_name: tgUser?.last_name || "",
        middle_name: "",
        phone_number: "",
        email: "",
        address: "",
        profile_photo_url: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        if (!form.first_name || !form.last_name || !form.phone_number) {
            alert("Заполните обязательные поля: Имя, Фамилия, Телефон");
            return;
        }

        try {
            setLoading(true);

            await storesApi.completeRegistration({
                first_name: form.first_name,
                last_name: form.last_name,
                middle_name: form.middle_name || undefined,
                phone_number: form.phone_number,
                email: form.email || undefined,
                address: form.address || undefined,
                profile_photo_url: form.profile_photo_url || undefined,
            });

            // Обновляем данные пользователя
            const updatedUser = await dispatch(fetchMe()).unwrap();

            alert("Регистрация завершена!");

            // Редиректим по роли
            if (updatedUser.role === "client") {
                navigate("/client");
            } else if (updatedUser.role === "operator") {
                navigate("/operator");
            } else if (updatedUser.role === "master") {
                navigate("/master");
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Ошибка при сохранении данных";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1>Завершите регистрацию</h1>
            <div className={styles.card}>
                <p>Заполните недостающие данные для полного доступа к приложению</p>

                <input
                    name="first_name"
                    placeholder="Имя *"
                    value={form.first_name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="last_name"
                    placeholder="Фамилия *"
                    value={form.last_name}
                    onChange={handleChange}
                    required
                />

                <input
                    name="middle_name"
                    placeholder="Отчество"
                    value={form.middle_name}
                    onChange={handleChange}
                />

                <input
                    name="phone_number"
                    placeholder="Телефон * (+7XXXXXXXXXX)"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />

                <input name="address" placeholder="Адрес" value={form.address} onChange={handleChange} />

                <input
                    name="profile_photo_url"
                    placeholder="Ссылка на фото профиля (опционально)"
                    value={form.profile_photo_url}
                    onChange={handleChange}
                />

                <button onClick={submit} disabled={loading}>
                    {loading ? "Сохранение..." : "Продолжить"}
                </button>
            </div>
        </div>
    );
};

export default FullRegistrationForm;

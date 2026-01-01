/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { storesApi } from "@/api";
import styles from "./FullRegistrationForm.module.scss";

const FullRegistrationForm = () => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        telegram_id: "",
        username: "",
        first_name: "",
        last_name: "",
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
        if (!form.telegram_id || !form.first_name || !form.last_name || !form.phone_number) {
            alert("Заполните обязательные поля: Telegram ID, Имя, Фамилия, Телефон");
            return;
        }

        try {
            setLoading(true);

            await storesApi.fullRegister({
                telegram_id: Number(form.telegram_id),
                username: form.username || undefined,
                first_name: form.first_name,
                last_name: form.last_name,
                middle_name: form.middle_name || undefined,
                phone_number: form.phone_number,
                email: form.email || undefined,
                address: form.address || undefined,
                profile_photo_url: form.profile_photo_url || undefined,
            });

            alert("Регистрация успешна!");
            // Перезагружаем — Telegram снова отправит initData → авторизация пройдёт
            window.location.href = "/";
        } catch (err: any) {
            const msg = err?.response?.data?.message || "Ошибка регистрации";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    // Автозаполнение из Telegram, если доступно
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    return (
        <div className={styles.wrapper}>
            <h1>Завершите регистрацию</h1>
            <div className={styles.card}>
                <p>Заполните данные для входа в приложение</p>

                <input
                    name="telegram_id"
                    type="number"
                    placeholder="Telegram ID * (ваш числовой ID)"
                    value={form.telegram_id || tgUser?.id || ""}
                    onChange={handleChange}
                    disabled={!!tgUser?.id}
                />
                {tgUser?.id && <p className={styles.hint}>ID взят из Telegram: {tgUser.id}</p>}

                <input
                    name="username"
                    placeholder="Username (опционально, например: @mynick)"
                    value={form.username || tgUser?.username || ""}
                    onChange={handleChange}
                />

                <input
                    name="first_name"
                    placeholder="Имя *"
                    value={form.first_name || tgUser?.first_name || ""}
                    onChange={handleChange}
                />

                <input
                    name="last_name"
                    placeholder="Фамилия *"
                    value={form.last_name || tgUser?.last_name || ""}
                    onChange={handleChange}
                />

                <input
                    name="middle_name"
                    placeholder="Отчество"
                    value={form.middle_name}
                    onChange={handleChange}
                />

                <input
                    name="phone_number"
                    placeholder="Телефон * (+7...)"
                    value={form.phone_number}
                    onChange={handleChange}
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
                    {loading ? "Регистрация..." : "Продолжить"}
                </button>
            </div>
        </div>
    );
};

export default FullRegistrationForm;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Phone, Mail, Edit, LogOut, Camera, Loader } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { fetchMe, fetchLogout, completeRegistration } from "@/store/slices/authSlice";
import { Modal } from "@/shared/ui/Modal";
import { getAvatarUploadMeta, getAvatarDownloadUrl, clearAvatarUploadMeta } from "@/store/slices/filesSlice";
import { ProfileSkeleton } from "@/shared/ui/ProfileSkeleton/ProfileSkeleton";

type ProfileForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    email: string;
    address: string;
    profile_photo_url: string; // objectName
};

const LABELS: Record<keyof Omit<ProfileForm, "profile_photo_url">, string> = {
    first_name: "Имя",
    last_name: "Фамилия",
    middle_name: "Отчество",
    phone_number: "Телефон",
    email: "Email",
    address: "Адрес",
};

export const ProfilePage = () => {
    const { user, loading, error } = useAppSelector((state) => state.auth);
    const filesState = useAppSelector((state) => state.files);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>(""); // для отображения
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

    const displayName = user
        ? `${user.first_name || ""} ${user.last_name || ""} ${user.middle_name || ""}`.trim()
        : "";

    const [form, setForm] = useState<ProfileForm>({
        profile_photo_url: "",
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: "",
        email: "",
        address: "",
    });

    // Функция для извлечения objectName из полного URL MinIO
    const extractObjectNameFromUrl = (url: string): string => {
        if (!url) return "";

        // Если это не URL (уже objectName), возвращаем как есть
        if (!url.startsWith("http")) return url;

        try {
            // Паттерн для URL MinIO: https://s3.ismir-kurulush-backend.com.kg/zvonok/avatars/filename.jpg
            const match = url.match(/\/zvonok\/(.+)$/);
            if (match && match[1]) {
                return match[1]; // "avatars/fdf07c2f-1dea-43db-847d-eb7224452b9a.jpg"
            }

            // Если это Telegram URL (как в примере), возвращаем пустую строку
            if (url.includes("t.me")) {
                return "";
            }
        } catch (e) {
            console.error("Ошибка извлечения objectName:", e);
        }

        return "";
    };

    // Загружаем профиль при монтировании
    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchMe());
        }
    }, [dispatch, user, loading]);

    // Загружаем временную ссылку для аватара, если у пользователя есть objectName
    useEffect(() => {
        const loadAvatarUrl = async () => {
            const objectName = user?.profile_photo_url;
            if (!objectName) {
                setAvatarUrl("");
                return;
            }
            try {
                const url = await dispatch(getAvatarDownloadUrl(objectName)).unwrap();
                setAvatarUrl(url + `?t=${Date.now()}`); // кеш-бастер
            } catch (e) {
                console.error("Не удалось загрузить аватар", e);
                setAvatarUrl("");
            }
        };
        loadAvatarUrl();
    }, [user?.profile_photo_url, dispatch]);

    // Заполняем форму при открытии модалки
    // Заполняем форму при открытии модалки
    useEffect(() => {
        if (isEditOpen && user) {
            // Извлекаем objectName из URL, который приходит с бэкенда
            const photoObjectName = extractObjectNameFromUrl(user.profile_photo_url || "");

            console.log("Заполняем форму из user:", {
                original_url: user.profile_photo_url,
                extracted_objectName: photoObjectName,
            });

            setForm({
                profile_photo_url: photoObjectName,
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                middle_name: user.middle_name ?? "",
                phone_number: user.phone_number ?? "",
                email: user.email ?? "",
                address: user.address ?? "",
            });
            setUploadSuccess(false);
            dispatch(clearAvatarUploadMeta());
        }
    }, [isEditOpen, user, dispatch]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

            console.log("🔵 1. Getting upload meta for extension:", extension);
            const meta = await dispatch(getAvatarUploadMeta({ extension })).unwrap();

            console.log("🟢 2. Meta received:", {
                url: meta.url,
                fieldsCount: Object.keys(meta.fields).length,
                objectName: meta.objectName,
            });

            // СОЗДАЁМ FORM DATA
            const fd = new FormData();

            // Добавляем ВСЕ поля из meta.fields
            Object.entries(meta.fields).forEach(([key, value]) => {
                fd.append(key, value);
                console.log(`   Added field: ${key}`);
            });

            // Добавляем файл
            fd.append("file", file);
            console.log("   Added file:", file.name);

            // ОТПРАВЛЯЕМ В MINIO
            console.log("🔵 3. Uploading to MinIO URL:", meta.url);
            const uploadRes = await fetch(meta.url, {
                method: "POST",
                body: fd,
                // НЕ СТАВИМ headers! Браузер сам добавит boundary
            });

            console.log("🟡 4. MinIO response status:", uploadRes.status);

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text();
                console.error("❌ MinIO error:", errorText);
                throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
            }

            console.log("🟢 5. Upload successful!");

            // СОХРАНЯЕМ OBJECT NAME
            setForm((prev) => ({ ...prev, profile_photo_url: meta.objectName }));
            setUploadSuccess(true);

            // ПОЛУЧАЕМ DOWNLOAD URL
            console.log("🔵 6. Getting download URL for:", meta.objectName);
            const downloadUrl = await dispatch(getAvatarDownloadUrl(meta.objectName)).unwrap();
            console.log("🟢 7. Download URL:", downloadUrl);

            setAvatarUrl(downloadUrl + "?t=" + Date.now());

            alert("✅ Фото успешно загружено!");
        } catch (err: any) {
            console.error("❌ ERROR in handleFileChange:", err);
            alert("Ошибка: " + (err.message || "Неизвестная ошибка"));
        } finally {
            setUploading(false);
        }
    };

    // ===== СОХРАНЕНИЕ ПРОФИЛЯ =====
    const handleSaveProfile = async () => {
        if (!form.first_name || !form.last_name || !form.phone_number) {
            alert("Имя, фамилия и телефон обязательны");
            return;
        }

        // Данные для отправки - profile_photo_url уже должен содержать objectName!
        const dataToSend = {
            first_name: form.first_name,
            last_name: form.last_name,
            middle_name: form.middle_name,
            phone_number: form.phone_number,
            email: form.email,
            address: form.address,
            profile_photo_url: form.profile_photo_url, // ЭТО ДОЛЖЕН БЫТЬ OBJECTNAME!
        };

        console.log("🔍 Данные перед отправкой:", dataToSend);

        // Проверяем, что это действительно objectName, а не URL
        if (dataToSend.profile_photo_url && dataToSend.profile_photo_url.startsWith("http")) {
            console.error("❌ Ошибка: profile_photo_url содержит URL, а должен содержать objectName!");
            alert("Ошибка: фото не было загружено через MinIO. Пожалуйста, загрузите фото заново.");
            return;
        }

        try {
            const result = await dispatch(completeRegistration(dataToSend)).unwrap();
            console.log("✅ Профиль сохранён:", result);
            await dispatch(fetchMe()).unwrap();
            setIsEditOpen(false);
            alert("✅ Профиль успешно сохранён!");
        } catch (err: any) {
            console.error("❌ Ошибка сохранения:", err);
            alert("Ошибка: " + (err.message || "Не удалось сохранить профиль"));
        }
    };
    const handleLogout = async () => {
        try {
            await dispatch(fetchLogout()).unwrap();
            navigate("/");
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    };

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div>Профиль не найден</div>;

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <Link to="/client">
                    <img src={Logo} alt="Логотип" className={styles.logo} />
                </Link>
                <h1>Профиль</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.userCard}>
                    <div className={styles.userAvatar}>
                        {filesState.loading ? (
                            <Loader size={32} className={styles.spinner} />
                        ) : avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className={styles.avatar}
                                onError={() => {
                                    if (user?.profile_photo_url) {
                                        dispatch(getAvatarDownloadUrl(user.profile_photo_url))
                                            .unwrap()
                                            .then((url) => setAvatarUrl(url + `?t=${Date.now()}`))
                                            .catch(() => setAvatarUrl(""));
                                    }
                                }}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                <User size={32} />
                            </div>
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <h2>{displayName || "Пользователь"}</h2>
                        <p className={styles.userRole}>{user.role === "client" ? "Клиент" : "Мастер"}</p>
                    </div>
                    <Button size="small" variant="secondary" onClick={() => setIsEditOpen(true)}>
                        Редактировать <Edit size={16} />
                    </Button>
                </Card>

                <section className={styles.contactSection}>
                    <h3>Контактная информация</h3>
                    {user.phone_number && (
                        <Card className={styles.contactCard}>
                            <Phone size={18} />
                            <span>{user.phone_number}</span>
                        </Card>
                    )}
                    {user.email && (
                        <Card className={styles.contactCard}>
                            <Mail size={18} />
                            <span>{user.email}</span>
                        </Card>
                    )}
                    {user.address && (
                        <Card className={styles.contactCard}>
                            <span>{user.address}</span>
                        </Card>
                    )}
                    {isProfileIncomplete && (
                        <Card className={styles.warningCard}>
                            <p>⚠️ Профиль заполнен не полностью</p>
                            <Button onClick={() => setIsEditOpen(true)}>Завершить регистрацию</Button>
                        </Card>
                    )}
                </section>

                <Button
                    variant="secondary"
                    onClick={() => setIsLogoutOpen(true)}
                    className={styles.logoutButton}
                >
                    <LogOut size={18} /> Выйти
                </Button>
            </main>

            {/* Модалка редактирования */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Редактирование профиля"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveProfile} disabled={uploading}>
                            {uploading ? <Loader size={16} className={styles.spinner} /> : "Сохранить"}
                        </Button>
                    </>
                }
            >
                <div className={styles.formGroup}>
                    <label>Фотография профиля</label>
                    <div className={styles.fileUpload}>
                        <input
                            type="file"
                            accept=".png,.jpg,.jpeg,.webp"
                            onChange={handleFileChange}
                            disabled={uploading}
                            id="avatar-upload"
                        />
                        <label htmlFor="avatar-upload" className={styles.fileUploadLabel}>
                            <Camera size={18} />
                            {uploading ? "Загрузка..." : "Выбрать фото"}
                        </label>
                    </div>
                    {uploading && (
                        <div className={styles.uploadProgress}>
                            <Loader size={16} className={styles.spinner} />
                            <span>Загрузка...</span>
                        </div>
                    )}
                    {uploadSuccess && <p className={styles.successMessage}>✓ Фото загружено</p>}
                    {!uploadSuccess && form.profile_photo_url && (
                        <p className={styles.infoMessage}>Текущее фото будет использовано</p>
                    )}
                </div>

                {(Object.keys(LABELS) as (keyof typeof LABELS)[]).map((key) => (
                    <div key={key} className={styles.formGroup}>
                        <label>{LABELS[key]}</label>
                        <input
                            type={key === "phone_number" ? "tel" : "text"}
                            value={form[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={`Введите ${LABELS[key].toLowerCase()}`}
                            disabled={uploading}
                        />
                    </div>
                ))}
            </Modal>

            {/* Модалка выхода */}
            <Modal
                isOpen={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
                title="Выход"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsLogoutOpen(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </>
                }
            >
                <p>Вы уверены, что хотите выйти?</p>
            </Modal>

            <Navigation role="client" />
        </div>
    );
};

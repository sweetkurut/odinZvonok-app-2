/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Phone, Mail, Edit, LogOut, Camera, Loader, UserSquare2, MapPin } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { fetchMe, fetchLogout, completeRegistration, updateProfile } from "@/store/slices/authSlice";
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
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    // const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

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

    // Загружаем профиль при монтировании
    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchMe());
        }
    }, [dispatch, user, loading]);

    // Загружаем временную ссылку для аватара
    useEffect(() => {
        const loadAvatarUrl = async () => {
            const photoUrl = user?.profile_photo_url;
            if (!photoUrl) {
                setAvatarUrl("");
                return;
            }

            setAvatarLoading(true);
            try {
                // Если это objectName, получаем presigned URL
                if (!photoUrl.startsWith("http")) {
                    const url = await dispatch(getAvatarDownloadUrl(photoUrl)).unwrap();
                    setAvatarUrl(url + "?t=" + Date.now());
                } else {
                    // Если это уже URL, используем как есть
                    setAvatarUrl(photoUrl + "?t=" + Date.now());
                }
            } catch (e) {
                console.error("Ошибка загрузки аватара:", e);
                setAvatarUrl("");
            } finally {
                setAvatarLoading(false);
            }
        };

        loadAvatarUrl();
    }, [user?.profile_photo_url, dispatch]);

    // Заполняем форму при открытии модалки
    useEffect(() => {
        if (isEditOpen && user) {
            console.log("Заполняем форму из user:", user);

            setForm({
                profile_photo_url: user.profile_photo_url ?? "",
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

    const handleChange = (key: keyof Omit<ProfileForm, "profile_photo_url">, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const getFullPhotoUrl = (objectName: string): string => {
        if (!objectName) return "";
        if (objectName.startsWith("http")) return objectName;
        return `https://s3.ismir-kurulush-backend.com.kg/zvonok/${objectName}`;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

            const meta = await dispatch(getAvatarUploadMeta({ extension })).unwrap();

            const fd = new FormData();
            Object.entries(meta.fields).forEach(([key, value]) => fd.append(key, value));
            fd.append("file", file);

            const uploadRes = await fetch(meta.url, { method: "POST", body: fd });

            if (!uploadRes.ok) {
                throw new Error("Upload failed");
            }

            // Сохраняем objectName в форму
            setForm((prev) => ({ ...prev, profile_photo_url: meta.objectName }));
            setUploadSuccess(true);

            // Получаем ссылку для отображения
            const downloadUrl = await dispatch(getAvatarDownloadUrl(meta.objectName)).unwrap();
            setAvatarUrl(downloadUrl + "?t=" + Date.now());
        } catch (err: any) {
            alert("Ошибка загрузки фото: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!form.first_name || !form.last_name || !form.phone_number) {
            alert("Имя, фамилия и телефон обязательны");
            return;
        }

        const dataToSend = {
            first_name: form.first_name,
            last_name: form.last_name,
            middle_name: form.middle_name,
            phone_number: form.phone_number,
            email: form.email,
            address: form.address,
            profile_photo_url: getFullPhotoUrl(form.profile_photo_url),
        };

        try {
            let result;
            if (user?.is_registration_complete) {
                result = await dispatch(updateProfile(dataToSend)).unwrap();
            } else {
                result = await dispatch(completeRegistration(dataToSend)).unwrap();
            }

            await dispatch(fetchMe()).unwrap();
            setIsEditOpen(false);
            alert("✅ Профиль сохранён!");
        } catch (err: any) {
            alert("Ошибка сохранения: " + (err.message || "Неизвестная ошибка"));
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
                        {avatarLoading || filesState.loading ? (
                            <div className={styles.avatarLoader}>
                                <Loader size={32} className={styles.spinner} />
                            </div>
                        ) : avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="avatar"
                                className={styles.avatar}
                                onError={() => {
                                    setAvatarUrl("");
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
                                <User size={40} />
                            </div>
                        )}
                    </div>
                    <div className={styles.userInfo}>
                        <div>
                            <h4>{displayName || "Пользователь"}</h4>
                        </div>
                        <div>
                            <p className={styles.userRole}>{user.role}</p>
                        </div>
                    </div>
                    <Button size="small" variant="secondary" onClick={() => setIsEditOpen(true)}>
                        {user.is_registration_complete ? (
                            <>
                                <Edit size={16} /> Редактировать
                            </>
                        ) : (
                            <>
                                <UserSquare2 size={16} /> Завершить регистрацию
                            </>
                        )}
                    </Button>
                </Card>

                <section className={styles.contactSection}>
                    <h3>Контактная информация</h3>
                    {user.phone_number && (
                        <Card className={styles.contactCard}>
                            <div className={styles.contactIcon}>
                                <Phone size={18} />
                            </div>
                            <div className={styles.contactInfo}>
                                <label>Телефон</label>
                                <span>{user.phone_number}</span>
                            </div>
                        </Card>
                    )}
                    {user.email && (
                        <Card className={styles.contactCard}>
                            <div className={styles.contactIcon}>
                                <Mail size={18} />
                            </div>
                            <div className={styles.contactInfo}>
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>
                        </Card>
                    )}
                    {user.address && (
                        <Card className={styles.contactCard}>
                            <div className={styles.contactIcon}>
                                <MapPin size={18} />
                            </div>
                            <div className={styles.contactInfo}>
                                <label>Адрес</label>
                                <span>{user.address}</span>
                            </div>
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
            <div className={styles.modalContainer}>
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

                        {/* КРУГЛОЕ превью фото (текущее или новое) */}
                        <div className={styles.modalPhotoPreview}>
                            {uploading ? (
                                <div className={styles.previewLoader}>
                                    <Loader size={24} className={styles.spinner} />
                                </div>
                            ) : form.profile_photo_url ? (
                                <img
                                    src={getFullPhotoUrl(form.profile_photo_url)}
                                    alt="preview"
                                    className={styles.previewImage}
                                    onError={(e) => {
                                        console.log("Ошибка загрузки превью");
                                        (e.target as HTMLImageElement).style.display = "none";
                                        // Показываем заглушку
                                        e.currentTarget.parentElement?.classList.add(styles.noImage);
                                    }}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    <User size={40} />
                                </div>
                            )}
                        </div>

                        <div className={styles.fileUpload}>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.webp"
                                onChange={handleFileChange}
                                disabled={uploading}
                                id="avatar-upload"
                            />
                            <label htmlFor="avatar-upload" className={styles.fileUploadLabel}>
                                {uploading ? (
                                    <>
                                        <Loader size={18} className={styles.spinner} />
                                        Загрузка...
                                    </>
                                ) : (
                                    <>
                                        <Camera size={18} />
                                        {form.profile_photo_url ? "Изменить фото" : "Выбрать фото"}
                                    </>
                                )}
                            </label>
                        </div>

                        {uploadSuccess && <p className={styles.successMessage}>✓ Фото загружено</p>}
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
            </div>

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
                <p className={styles.logoutText}>Вы уверены, что хотите выйти?</p>
            </Modal>

            <Navigation role="client" />
        </div>
    );
};

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchMe, fetchLogout, completeRegistration } from "@/store/slices/authSlice";
import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Edit, LogOut, Star } from "lucide-react";
import styles from "./MasterProfile.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "@/shared/ui/Modal";
import { getAvatarUploadMeta, getAvatarUploadUrl } from "@/store/slices/filesSlice";
import axios from "axios";
import { ProfileSkeleton } from "@/shared/ui/ProfileSkeleton/ProfileSkeleton";

export const MasterProfile = () => {
    const { user, loading, error } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedObjectName, setUploadedObjectName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: "",
        email: "",
        address: "",
        profile_photo_object_name: "",
    });

    useEffect(() => {
        if (!user && !loading) dispatch(fetchMe());
    }, [dispatch, user, loading]);

    useEffect(() => {
        if (isEditOpen && user) {
            setForm({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                middle_name: user.middle_name ?? "",
                phone_number: user.phone_number ?? "",
                email: user.email ?? "",
                address: user.address ?? "",
                profile_photo_object_name: user.profile_photo_object_name ?? "",
            });
        }
    }, [isEditOpen, user]);

    useEffect(() => {
        if (!user?.profile_photo_object_name) return;
        axios
            .get("/api/files/download-url", { params: { objectName: user.profile_photo_object_name } })
            .then((res) => setAvatarUrl(res.data.downloadUrl))
            .catch(() => setAvatarUrl(""));
    }, [user?.profile_photo_object_name]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const ext = file.name.split(".").pop();
        setUploading(true);
        try {
            const uploadData = await dispatch(getAvatarUploadMeta(ext!)).unwrap();
            await axios.put(uploadData.uploadUrl, file, { headers: { "Content-Type": file.type } });
            setUploadedObjectName(uploadData.objectName);
        } catch {
            alert("Ошибка загрузки фото");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        const payload = {
            ...form,
            profile_photo_object_name: uploadedObjectName || user?.profile_photo_object_name || "",
        };
        try {
            await dispatch(completeRegistration(payload)).unwrap();
            await dispatch(fetchMe()).unwrap();
            setIsEditOpen(false);
            setUploadedObjectName("");
        } catch (err) {
            alert("Не удалось сохранить");
        }
    };

    const handleLogout = async () => {
        await dispatch(fetchLogout()).unwrap();
        navigate("/");
    };

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;
    if (!user) return <div>Профиль не загружен</div>;

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <Link to="/master">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Профиль мастера</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.profileCard}>
                    <div className={styles.avatarSection}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Аватар" className={styles.avatar} />
                        ) : (
                            <User size={64} />
                        )}
                    </div>

                    <div className={styles.infoSection}>
                        <h2>
                            {user.last_name} {user.first_name} {user.middle_name}
                        </h2>
                        <div className={styles.meta}>
                            <div>
                                <Star size={18} fill="#f59e0b" color="#f59e0b" /> 4.7 (пока заглушка)
                            </div>
                            <div>Опыт: 5 лет (пока заглушка)</div>
                        </div>
                        <p className={styles.bio}>
                            Коротко о себе: делаю быстро и качественно (пока заглушка)
                        </p>
                    </div>

                    <Button onClick={() => setIsEditOpen(true)}>
                        <Edit size={16} /> Редактировать профиль
                    </Button>
                </Card>

                <Button variant="secondary" onClick={() => setIsLogoutOpen(true)}>
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
                        <Button onClick={handleSave} disabled={uploading}>
                            Сохранить
                        </Button>
                    </>
                }
            >
                <div className={styles.formGroup}>
                    <label>Фото профиля</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {uploading && <p>Загружается...</p>}
                    {uploadedObjectName && <p>Фото обновлено ✓</p>}
                </div>

                <div className={styles.formGroup}>
                    <label>Имя</label>
                    <input
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Фамилия</label>
                    <input
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                </div>

                {/* Добавь остальные поля по аналогии: отчество, телефон, email, адрес, bio и т.д. */}
            </Modal>

            {/* Модалка выхода */}
            <Modal
                isOpen={isLogoutOpen}
                onClose={() => setIsLogoutOpen(false)}
                title="Выход из аккаунта"
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
                <p>Вы действительно хотите выйти?</p>
            </Modal>

            <Navigation role="master" />
        </div>
    );
};

export default MasterProfile;

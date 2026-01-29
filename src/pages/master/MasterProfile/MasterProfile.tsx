import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Phone, Mail, Edit, LogOut } from "lucide-react";
import styles from "./MasterProfile.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { fetchMe, fetchLogout, completeRegistration } from "@/store/slices/authSlice";
import { Modal } from "@/shared/ui/Modal";
// import { getAvatarUploadUrl } from "@/store/slices/filesSlice";
import axios from "axios";
import { ProfileSkeleton } from "@/shared/ui/ProfileSkeleton/ProfileSkeleton";
import { getAvatarUploadUrl } from "@/store/slices/filesSlice";

type ProfileForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    email: string;
    address: string;
    profile_photo_url: string;
};

const LABELS: Record<keyof ProfileForm, string> = {
    first_name: "Имя",
    last_name: "Фамилия",
    middle_name: "Отчество",
    phone_number: "Телефон",
    email: "Email",
    address: "Адрес",
    profile_photo_url: "Фотография профиля",
};

export const MasterProfile = () => {
    const { user, loading, error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>("");

    const [form, setForm] = useState<ProfileForm>({
        experienceYears: "",
        specializations: "",
        bio: "",
        // first_name: "",
        // last_name: "",
        // middle_name: "",
        // phone_number: "",
        // email: "",
        // address: "",
    });

    // ===== LOAD PROFILE =====
    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchMe());
        }
    }, [dispatch, user, loading]);

    // ===== FILL FORM =====
    useEffect(() => {
        if (isEditOpen && user) {
            setForm({
                experienceYears: user.experience_years || "",
                specializations: user.specializations || "",
                bio: user.bio || "",
            });
        }
    }, [isEditOpen, user]);

    const handleChange = (key: keyof ProfileForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // ===== HANDLE FILE CHANGE AND UPLOAD =====
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setUploading(true);

            try {
                const uploadData = await dispatch(getAvatarUploadUrl()).unwrap();

                // загружаем файл на uploadUrl
                await axios.put(uploadData.uploadUrl, file, {
                    headers: { "Content-Type": file.type },
                });

                // сохраняем accessUrl для отправки в профиль
                setUploadedPhotoUrl(uploadData.accessUrl);
            } catch (err) {
                console.error("Ошибка загрузки фото:", err);
                alert("Не удалось загрузить фото");
                setUploadedPhotoUrl("");
            } finally {
                setUploading(false);
            }
        }
    };

    // ===== SAVE PROFILE =====
    const handleSaveProfile = async () => {
        if (!form.first_name || !form.last_name || !form.phone_number) {
            alert("Имя, фамилия и телефон обязательны");
            return;
        }

        const payload = {
            ...form,
            profile_photo_url: uploadedPhotoUrl || user?.profile_photo_url || "",
        };

        try {
            await dispatch(completeRegistration(payload)).unwrap();
            await dispatch(fetchMe()).unwrap();
            setIsEditOpen(false);
            setSelectedFile(null);
            setUploadedPhotoUrl("");
        } catch (err) {
            console.error(err);
            alert("Не удалось сохранить профиль");
        }
    };

    const handleLogout = async () => {
        await dispatch(fetchLogout()).unwrap();
        navigate("/master");
    };

    // ===== UI STATES =====
    if (loading) {
        return <ProfileSkeleton />;
    }

    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div className={styles.error}>Профиль не найден</div>;

    const displayName =
        user.middle_name ||
        [user.last_name, user.first_name].filter(Boolean).join(" ") ||
        user.username ||
        "Пользователь";

    const isProfileIncomplete = !user.phone_number;

    const navigationRole = ["client", "operator", "master"].includes(user.role?.toLowerCase())
        ? (user.role!.toLowerCase() as "client" | "operator" | "master")
        : "client";

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <Link to="/master">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Профиль</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.userCard}>
                    <div className={styles.userAvatar}>
                        {user.profile_photo_url ? (
                            <img src={user.profile_photo_url} alt="avatar" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>

                    <div className={styles.userInfo}>
                        <h2>{displayName}</h2>
                        <p>{user.role}</p>
                    </div>

                    <Button size="small" variant="secondary" onClick={() => setIsEditOpen(true)}>
                        Редактировать <Edit size={16} />
                    </Button>
                </Card>

                <section className={styles.contactSection}>
                    <h3>Контактная информация</h3>

                    {user.phone_number && (
                        <Card className={styles.contactCard}>
                            <Phone /> {user.phone_number}
                        </Card>
                    )}

                    {user.email && (
                        <Card className={styles.contactCard}>
                            <Mail /> {user.email}
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
                    <LogOut /> Выйти
                </Button>
            </main>

            {/* ===== EDIT MODAL ===== */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Заполнение профиля"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveProfile}>Сохранить</Button>
                    </>
                }
            >
                <div className={styles.formGroup}>
                    <label>Фотография профиля</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {uploading && <p>Загрузка...</p>}
                    {uploadedPhotoUrl && !uploading && <p>Файл загружен ✅</p>}
                </div>

                {(Object.keys(form) as (keyof ProfileForm)[]).map((key) =>
                    key !== "profile_photo_url" ? (
                        <div key={key} className={styles.formGroup}>
                            <label>{LABELS[key]}</label>
                            <input
                                type={key === "phone_number" ? "tel" : "text"}
                                value={form[key]}
                                onChange={(e) => handleChange(key, e.target.value)}
                            />
                        </div>
                    ) : null,
                )}
            </Modal>

            {/* ===== LOGOUT MODAL ===== */}
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
                Вы уверены, что хотите выйти?
            </Modal>

            <Navigation role={navigationRole} />
        </div>
    );
};

export default MasterProfile;

import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Edit, LogOut } from "lucide-react";
import styles from "./MasterProfile.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { fetchMe, fetchLogout, completeRegistration } from "@/store/slices/authSlice";
import { Modal } from "@/shared/ui/Modal";
import { getAvatarUploadUrl } from "@/store/slices/filesSlice";
import axios from "axios";
import { ProfileSkeleton } from "@/shared/ui/ProfileSkeleton/ProfileSkeleton";

type ProfileForm = {
    first_name: string;
    last_name: string;
    middle_name: string;
    phone_number: string;
    email: string;
    address: string;
    profile_photo_object_name: string;
};

export const MasterProfile = () => {
    const { user, loading, error } = useAppSelector((s) => s.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [uploadedObjectName, setUploadedObjectName] = useState<string>("");

    const [avatarUrl, setAvatarUrl] = useState<string>("");

    const [form, setForm] = useState<ProfileForm>({
        first_name: "",
        last_name: "",
        middle_name: "",
        phone_number: "",
        email: "",
        address: "",
        profile_photo_object_name: "",
    });

    // ===== LOAD PROFILE =====
    useEffect(() => {
        if (!user && !loading) dispatch(fetchMe());
    }, [dispatch, user, loading]);

    // ===== FILL FORM =====
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

    // ===== LOAD AVATAR =====
    useEffect(() => {
        if (!user?.profile_photo_object_name) return;

        axios
            .get("/api/files/download-url", {
                params: { objectName: user.profile_photo_object_name },
            })
            .then((res) => setAvatarUrl(res.data.downloadUrl))
            .catch(() => setAvatarUrl(""));
    }, [user?.profile_photo_object_name]);

    // ===== FILE UPLOAD =====
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const ext = file.name.split(".").pop();

        setUploading(true);

        try {
            const uploadData = await dispatch(getAvatarUploadUrl(ext!)).unwrap();

            await axios.put(uploadData.uploadUrl, file, {
                headers: { "Content-Type": file.type },
            });

            setUploadedObjectName(uploadData.objectName);
        } catch {
            alert("Ошибка загрузки аватара");
        } finally {
            setUploading(false);
        }
    };

    // ===== SAVE PROFILE =====
    const handleSaveProfile = async () => {
        const payload = {
            ...form,
            profile_photo_object_name: uploadedObjectName || user?.profile_photo_object_name || "",
        };

        await dispatch(completeRegistration(payload)).unwrap();
        await dispatch(fetchMe()).unwrap();

        setIsEditOpen(false);
        setUploadedObjectName("");
    };

    const handleLogout = async () => {
        await dispatch(fetchLogout()).unwrap();
        navigate("/");
    };

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div>Профиль не найден</div>;

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <Link to="/client">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Профиль</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.userCard}>
                    <div className={styles.userAvatar}>
                        {avatarUrl ? <img src={avatarUrl} /> : <User size={32} />}
                    </div>

                    <div className={styles.userInfo}>
                        <h2>{[user.last_name, user.first_name].filter(Boolean).join(" ")}</h2>
                        <p>{user.role}</p>
                    </div>

                    <Button onClick={() => setIsEditOpen(true)}>
                        Редактировать <Edit size={16} />
                    </Button>
                </Card>

                <Button variant="secondary" onClick={() => setIsLogoutOpen(true)}>
                    <LogOut /> Выйти
                </Button>
            </main>

            {/* EDIT MODAL */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Редактирование профиля"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            Отмена
                        </Button>
                        <Button onClick={handleSaveProfile}>Сохранить</Button>
                    </>
                }
            >
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {uploading && <p>Загрузка...</p>}
                {uploadedObjectName && <p>Фото загружено ✅</p>}
            </Modal>

            {/* LOGOUT MODAL */}
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

            <Navigation role={user.role} />
        </div>
    );
};

export default MasterProfile;
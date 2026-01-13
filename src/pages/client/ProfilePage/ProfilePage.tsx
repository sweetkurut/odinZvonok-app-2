import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Phone, Mail, Edit, LogOut } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect, useState } from "react";
import { fetchMe, fetchLogout } from "@/store/slices/authSlice";
import { Modal } from "@/shared/ui/Modal";

export const ProfilePage = () => {
    const { user, loading, error } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLogoutOpen, setIsLogoutOpen] = useState(false);

    // console.log(user, "ssdsdsd");

    // Загружаем профиль, если его нет
    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchMe());
        }
    }, [dispatch, user, loading]);

    const handleLogout = async () => {
        try {
            await dispatch(fetchLogout()).unwrap();
            navigate("/");
        } catch (err) {
            console.error("Ошибка выхода:", err);
        }
    };

    // === ЗАГРУЗКА И ОШИБКИ ===
    if (loading) {
        return <div className={styles.loader}>Загрузка профиля...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Ошибка загрузки профиля: {error}</p>
                <button onClick={() => dispatch(fetchMe())}>Повторить</button>
            </div>
        );
    }

    if (!user) {
        return <div className={styles.error}>Профиль не найден</div>;
    }

    // === БЕЗОПАСНОЕ ФОРМИРОВАНИЕ ИМЕНИ ===
    const displayName =
        user.full_name ||
        [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(" ") ||
        user.username ||
        "Пользователь";

    // === БЕЗОПАСНОЕ ОТОБРАЖЕНИЕ РОЛИ ===
    const getRoleText = (role?: string) => {
        if (!role) return "Роль не указана";

        const upperRole = role.toUpperCase();
        switch (upperRole) {
            case "CLIENT":
                return "Клиент";
            case "OPERATOR":
                return "Оператор";
            case "MASTER":
                return "Мастер";
            default:
                return role;
        }
    };

    const userRoleText = getRoleText(user.role);

    // === РОЛЬ ДЛЯ NAVIGATION (с fallback) ===
    const navigationRole =
        user.role?.toLowerCase() === "client" ||
        user.role?.toLowerCase() === "operator" ||
        user.role?.toLowerCase() === "master"
            ? (user.role.toLowerCase() as "client" | "operator" | "master")
            : "client";

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <Link to="/client">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1 className={styles.pageTitle}>Профиль</h1>
            </header>

            <main className={styles.main}>
                {/* Карточка пользователя */}
                <Card className={styles.userCard}>
                    <div className={styles.userAvatar}>
                        {user.profile_photo_url && user.profile_photo_url !== "string" ? (
                            <img src={user.profile_photo_url} alt="Аватар" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>

                    <div className={styles.userInfo}>
                        <h2>{displayName}</h2>
                        <p className={styles.userRole}>{userRoleText}</p>
                    </div>

                    <Button
                        variant="secondary"
                        size="small"
                        className={styles.editBtn}
                        onClick={() => setIsEditOpen(true)}
                    >
                        Редактировать <Edit size={16} />
                    </Button>
                </Card>

                {/* Контактная информация */}
                <section className={styles.contactSection}>
                    <h3>Контактная информация</h3>

                    {user.phone_number && (
                        <Card className={styles.contactCard}>
                            <div className={styles.contactIcon}>
                                <Phone size={20} />
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
                                <Mail size={20} />
                            </div>
                            <div className={styles.contactInfo}>
                                <label>Email</label>
                                <span>{user.email}</span>
                            </div>
                        </Card>
                    )}

                    {user.address && user.address !== "string" && (
                        <Card className={styles.contactCard}>
                            <div className={styles.contactIcon}>
                                <Mail size={20} />
                            </div>
                            <div className={styles.contactInfo}>
                                <label>Адрес</label>
                                <span>{user.address}</span>
                            </div>
                        </Card>
                    )}

                    {!user.phone_number && !user.email && !user.address && (
                        <Card className={styles.contactCard}>
                            <p className={styles.noContact}>Контактные данные не указаны</p>
                        </Card>
                    )}
                </section>

                <div className={styles.actions}>
                    <Button variant="danger" size="large" onClick={() => setIsLogoutOpen(true)}>
                        <LogOut size={20} style={{ marginRight: 8 }} />
                        Выйти из аккаунта
                    </Button>
                </div>
            </main>

            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Редактирование профиля"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                            Отмена
                        </Button>
                        <Button>Сохранить</Button>
                    </>
                }
            >
                <div className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label>Имя</label>
                        <input defaultValue={user.first_name || ""} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Фамилия</label>
                        <input defaultValue={user.last_name || ""} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Телефон</label>
                        <input defaultValue={user.phone_number || ""} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input defaultValue={user.email || ""} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Адрес</label>
                        <input defaultValue={user.address || ""} />
                    </div>
                </div>
            </Modal>

            <div className={styles.logoutModal}>
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
                    <p className={styles.logoutText}>Вы действительно хотите выйти из аккаунта?</p>
                </Modal>
            </div>

            <Navigation role={navigationRole} />
        </div>
    );
};

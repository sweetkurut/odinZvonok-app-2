import { Navigation, Card, Button } from "../../../shared/ui";
import { User, Phone, Mail, Edit, LogOut } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import { fetchMe, fetchLogout } from "@/store/slices/authSlice";

export const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user, loading, error } = useAppSelector((state) => state.auth);
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
                            <img
                                src={user.profile_photo_url}
                                alt="Аватар"
                                className={styles.avatarImage}
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                        ) : (
                            <User size={40} />
                        )}
                    </div>

                    <div className={styles.userInfo}>
                        <h2>{displayName}</h2>
                        <p className={styles.userRole}>{userRoleText}</p>
                    </div>

                    <Button variant="secondary" size="small">
                        <Edit size={16} />
                        Редактировать
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

                {/* Настройки */}
                <section className={styles.preferencesSection}>
                    <h3>Настройки</h3>

                    <Card className={styles.preferenceCard}>
                        <div className={styles.preferenceInfo}>
                            <span>Уведомления</span>
                            <p>Получать уведомления о статусе заказов</p>
                        </div>
                        <div className={styles.toggle}>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </Card>

                    <Card className={styles.preferenceCard}>
                        <div className={styles.preferenceInfo}>
                            <span>SMS уведомления</span>
                            <p>Получать SMS о важных обновлениях</p>
                        </div>
                        <div className={styles.toggle}>
                            <input type="checkbox" />
                        </div>
                    </Card>
                </section>

                {/* Выход */}
                <div className={styles.actions}>
                    <Button variant="danger" size="large" onClick={handleLogout}>
                        <LogOut size={20} style={{ marginRight: 8 }} />
                        Выйти из аккаунта
                    </Button>
                </div>
            </main>

            <Navigation role={navigationRole} />
        </div>
    );
};

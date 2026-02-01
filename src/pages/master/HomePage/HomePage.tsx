// HomePage.tsx
import { useEffect, useState } from "react";
import { Navigation, Card, Button } from "../../../shared/ui"; // предполагаем, что Input есть или добавь
import { User, Star, MapPin, Edit, Check, Clock } from "lucide-react";
import styles from "./HomePage.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchProfileMaster, updateMasterStatus } from "@/store/slices/masterSlice";

// Цвета статусов мастера (семантические + приятные глазу)
const MASTER_STATUS_CONFIG = {
    AVAILABLE: { label: "Свободен", color: "#22c55e", bg: "#f0fdf4" }, // зелёный
    ON_CALL: { label: "На вызове", color: "#f59e0b", bg: "#fffbeb" }, // жёлтый/оранжевый
    ON_BREAK: { label: "На обеде", color: "#ef4444", bg: "#fef2f2" }, // красный
    LAST_CALL: { label: "Последний вызов", color: "#a855f7", bg: "#f3e8ff" }, // фиолетовый
    OFFLINE: { label: "Не в сети", color: "#6b7280", bg: "#f3f4f6" },
};

// Статусы заказа (для текущего вызова)
const ORDER_STATUS_CONFIG = {
    ON_WAY: { label: "В пути", color: "#3b82f6" },
    IN_PROGRESS: { label: "В процессе", color: "#8b5cf6" },
    COMPLETED: { label: "Выполнено", color: "#22c55e" },
};

export const HomePage = () => {
    const dispatch = useAppDispatch();
    const { profile, loading, statusUpdating } = useAppSelector((s) => s.masters);

    // Локальное состояние для редактирования текущего заказа (пока заглушка)
    const [currentOrder, setCurrentOrder] = useState({
        category: "Сантехника • Протечка крана",
        address: "Бишкек, ул. Советская, 45, кв. 12",
        price: 2800,
        description: "Кран сильно течёт в ванной, нужна срочная замена прокладки",
        photo: "https://example.com/leak.jpg", // можно заменить на реальное
        status: "ON_WAY" as keyof typeof ORDER_STATUS_CONFIG,
    });

    const [editingPrice, setEditingPrice] = useState(false);
    const [tempPrice, setTempPrice] = useState(currentOrder.price);

    useEffect(() => {
        if (!profile) dispatch(fetchProfileMaster());
    }, [dispatch, profile]);

    const handleMasterStatusChange = (newStatus: keyof typeof MASTER_STATUS_CONFIG) => {
        if (statusUpdating) return;
        dispatch(updateMasterStatus(newStatus));
    };

    const handleOrderStatusChange = (newStatus: keyof typeof ORDER_STATUS_CONFIG) => {
        setCurrentOrder((prev) => ({ ...prev, status: newStatus }));
        // здесь должен быть dispatch на бэкенд для обновления статуса заказа
    };

    const savePrice = () => {
        setCurrentOrder((prev) => ({ ...prev, price: tempPrice }));
        setEditingPrice(false);
        // dispatch на бэкенд для обновления цены
    };

    const status = profile?.status || "OFFLINE";
    const masterStatusInfo = MASTER_STATUS_CONFIG[status] || MASTER_STATUS_CONFIG.OFFLINE;

    if (loading && !profile) return <div className={styles.loading}>Загрузка профиля...</div>;

    return (
        <div className={styles.homePage}>
            <header className={styles.header}>
                <Link to="/master">
                    <img src={Logo} alt="Логотип" className={styles.logo} />
                </Link>
                <h1>Главная мастера</h1>
            </header>

            <main className={styles.main}>
                {/* Раздел 1 — Профиль пользователя */}
                <Card className={styles.profileSection}>
                    <div className={styles.profileAvatar}>
                        {profile?.profile_photo_url ? (
                            <img src={profile.profile_photo_url} alt="Фото мастера" />
                        ) : (
                            <User size={56} />
                        )}
                    </div>

                    <div className={styles.profileContent}>
                        <h2 className={styles.fullName}>{profile?.fullName || "Мастер"}</h2>

                        <div className={styles.metaRow}>
                            <div className={styles.rating}>
                                <Star size={20} fill="#f59e0b" color="#f59e0b" />
                                <span>{profile?.rating?.toFixed(1) || "—"}</span>
                            </div>
                            <span className={styles.dealsCount}>
                                {profile?.completedOrdersCount || 0} сделок
                            </span>
                        </div>

                        <div className={styles.categories}>
                            {profile?.specializations?.length ? (
                                profile.specializations.map((cat, idx) => (
                                    <span key={idx} className={styles.categoryTag}>
                                        {cat}
                                    </span>
                                ))
                            ) : (
                                <span className={styles.noCategories}>Категории не указаны</span>
                            )}
                        </div>

                        <div
                            className={styles.currentStatusBadge}
                            style={{ backgroundColor: masterStatusInfo.bg, color: masterStatusInfo.color }}
                        >
                            {masterStatusInfo.label}
                        </div>
                    </div>
                </Card>

                {/* Раздел 2 — Статус занятости */}
                <Card className={styles.statusSection}>
                    <h3>Мой статус доступности</h3>
                    <div className={styles.statusButtonsGrid}>
                        {Object.entries(MASTER_STATUS_CONFIG).map(([key, val]) => (
                            <button
                                key={key}
                                className={`${styles.statusButton} ${status === key ? styles.active : ""}`}
                                style={{
                                    backgroundColor: status === key ? val.color : "transparent",
                                    color: status === key ? "white" : val.color,
                                    borderColor: val.color,
                                }}
                                onClick={() =>
                                    handleMasterStatusChange(key as keyof typeof MASTER_STATUS_CONFIG)
                                }
                                disabled={statusUpdating}
                            >
                                {val.label}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Раздел 3 — Текущий вызов */}
                <Card className={styles.currentOrderSection}>
                    <h3>Текущий вызов</h3>

                    {profile?.status === "ON_CALL" && currentOrder ? (
                        <div className={styles.orderContent}>
                            <div className={styles.orderHeader}>
                                <h4>{currentOrder.category}</h4>
                                <div className={styles.priceEdit}>
                                    {editingPrice ? (
                                        <>
                                            <input
                                                type="number"
                                                value={tempPrice}
                                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                                autoFocus
                                            />
                                            <Button size="small" onClick={savePrice}>
                                                <Check size={16} />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <span className={styles.price}>{currentOrder.price} сом</span>
                                            <Button
                                                variant="primary"
                                                size="small"
                                                onClick={() => setEditingPrice(true)}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.orderAddress}>
                                <MapPin size={18} /> {currentOrder.address}
                            </div>

                            <p className={styles.orderDescription}>{currentOrder.description}</p>

                            {currentOrder.photo && (
                                <img
                                    src={currentOrder.photo}
                                    alt="Фото поломки"
                                    className={styles.orderPhoto}
                                />
                            )}

                            <div className={styles.orderStatusControls}>
                                <h4>Статус выполнения</h4>
                                <div className={styles.statusButtons}>
                                    {Object.entries(ORDER_STATUS_CONFIG).map(([key, val]) => (
                                        <Button
                                            key={key}
                                            variant={currentOrder.status === key ? "primary" : "secondary"}
                                            style={{
                                                backgroundColor:
                                                    currentOrder.status === key ? val.color : undefined,
                                                color: currentOrder.status === key ? "white" : val.color,
                                            }}
                                            onClick={() =>
                                                handleOrderStatusChange(
                                                    key as keyof typeof ORDER_STATUS_CONFIG,
                                                )
                                            }
                                        >
                                            {val.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.noActiveOrder}>
                            <Clock size={48} />
                            <p>Нет активного вызова</p>
                            <small>Когда статус «Свободен», заказы начнут поступать</small>
                        </div>
                    )}
                </Card>

                {/* Ссылки на другие страницы */}
                <div className={styles.navigationLinks}>
                    <Link to="/master/history" className={styles.linkButton}>
                        История сделок
                    </Link>
                    <Link to="/master/reviews" className={styles.linkButton}>
                        Мои отзывы и рейтинг
                    </Link>
                </div>
            </main>

            <Navigation role="master" />
        </div>
    );
};

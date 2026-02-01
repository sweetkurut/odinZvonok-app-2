/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, User, Tag, Clock, DollarSign } from "lucide-react";
import styles from "./MasterPage.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import {
    fetchOrderById,
    assignMasterToOrder,
    confirmOrderPrice,
    completeOrder,
    cancelOrder,
} from "@/store/slices/orderSlice";
import { fetchMasters } from "@/store/slices/masterSlice";
import { toast } from "react-toastify";

export const MasterPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { orderDetails, loading } = useAppSelector((state) => state.orders);
    const { masters, loading: mastersLoading } = useAppSelector((state) => state.masters);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
            dispatch(fetchMasters());
        }
    }, [dispatch, id]);

    if (loading || !orderDetails) return <div className={styles.loading}>Загрузка...</div>;

    const handleAssignMaster = async (masterId: string) => {
        try {
            await dispatch(assignMasterToOrder({ orderId: id!, masterId })).unwrap();
            toast.success("Мастер успешно назначен ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось назначить мастера ❌");
        }
    };

    const handleConfirmPrice = async () => {
        try {
            await dispatch(confirmOrderPrice({ orderId: id! })).unwrap();
            toast.success("Цена успешно подтверждена ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось подтвердить цену ❌");
        }
    };

    const handleCompleteOrder = async () => {
        try {
            await dispatch(completeOrder({ orderId: id! })).unwrap();
            toast.success("Заказ успешно завершен ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось завершить заказ ❌");
        }
    };

    const handleCancelOrder = async () => {
        try {
            await dispatch(cancelOrder({ orderId: id! })).unwrap();
            toast.success("Заказ отменён ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось отменить заказ");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CANCELED":
                return styles.statusCanceled;
            case "COMPLETED":
                return styles.statusCompleted;
            case "IN_PROGRESS":
                return styles.statusProgress;
            default:
                return styles.statusDefault;
        }
    };

    return (
        <div className={styles.masterPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/operator")}>
                    <ArrowLeft size={14} />
                </button>
                <div className={styles.headerTitle}>
                    <h1>Заказ #{id?.length}</h1>
                    <span className={`${styles.statusBadge} ${getStatusColor(orderDetails.status)}`}>
                        {orderDetails.status === "CANCELED"
                            ? "Отменён"
                            : orderDetails.status === "COMPLETED"
                              ? "Завершён"
                              : orderDetails.status}
                    </span>
                </div>
            </header>

            <main className={styles.main}>
                {/* Мастер */}
                {orderDetails.master ? (
                    <Card className={styles.section}>
                        <h2 className={styles.sectionTitle}>Мастер</h2>
                        <div className={styles.masterCard}>
                            <div className={styles.masterAvatar}>
                                <span>
                                    {orderDetails.master.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </span>
                            </div>
                            <div className={styles.masterInfo}>
                                <h3>{orderDetails.master.fullName}</h3>
                                <div className={styles.masterRating}>
                                    <div className={styles.stars}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={styles.star}
                                                fill="currentColor"
                                            />
                                        ))}
                                    </div>
                                    <span>{orderDetails.master.rating ?? "0.0"}</span>
                                </div>
                                <div className={styles.masterSpecializations}>
                                    {orderDetails.master.specializations?.map((spec, index) => (
                                        <span key={index} className={styles.specializationTag}>
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className={styles.section}>
                        <h2 className={styles.sectionTitle}>Мастер</h2>
                        <div className={styles.noMaster}>
                            <User size={48} className={styles.noMasterIcon} />
                            <p>Мастер не назначен</p>
                        </div>
                    </Card>
                )}

                {/* Информация о заказе */}
                <Card className={styles.section}>
                    <h2 className={styles.sectionTitle}>Детали заказа</h2>
                    <div className={styles.orderGrid}>
                        <div className={styles.orderItem}>
                            <div className={styles.orderIcon}>
                                <Tag size={16} />
                            </div>
                            <div>
                                <span className={styles.orderLabel}>Категория</span>
                                <span className={styles.orderValue}>{orderDetails.category}</span>
                            </div>
                        </div>
                        <div className={styles.orderItem}>
                            <div className={styles.orderIcon}>
                                <MapPin size={16} />
                            </div>
                            <div>
                                <span className={styles.orderLabel}>Адрес</span>
                                <span className={styles.orderValue}>{orderDetails.address}</span>
                            </div>
                        </div>
                        <div className={styles.orderItem}>
                            <div className={styles.orderIcon}>
                                <User size={16} />
                            </div>
                            <div>
                                <span className={styles.orderLabel}>Клиент</span>
                                <span className={styles.orderValue}>{orderDetails.client.fullName}</span>
                            </div>
                        </div>
                        {orderDetails.price && (
                            <div className={styles.orderItem}>
                                <div className={styles.orderIcon}>
                                    <DollarSign size={16} />
                                </div>
                                <div>
                                    <span className={styles.orderLabel}>Цена</span>
                                    <span className={styles.orderValue}>{orderDetails.price} сом</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.description}>
                        <h4>Описание</h4>
                        <p>{orderDetails.description}</p>
                    </div>
                </Card>

                {/* Доступные мастера для назначения */}
                {!orderDetails.master && masters.length > 0 && (
                    <Card className={styles.section}>
                        <h2 className={styles.sectionTitle}>Доступные мастера</h2>
                        {mastersLoading ? (
                            <div className={styles.loadingMasters}>Загрузка мастеров...</div>
                        ) : (
                            <div className={styles.mastersGrid}>
                                {masters.map((master) => (
                                    <div key={master.id} className={styles.availableMaster}>
                                        <div className={styles.availableMasterHeader}>
                                            <div className={styles.availableMasterAvatar}>
                                                {master.fullName
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className={styles.availableMasterInfo}>
                                                <h4>{master.fullName}</h4>
                                                <div className={styles.availableMasterMeta}>
                                                    <span className={styles.rating}>
                                                        ★ {master.rating ?? "0.0"}
                                                    </span>
                                                    <span
                                                        className={styles.statusIndicator}
                                                        data-available={master.status === "AVAILABLE"}
                                                    >
                                                        {master.status === "AVAILABLE" ? "🟢" : "⚫"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.availableMasterSpecializations}>
                                            {master.specializations?.slice(0, 2).map((spec, index) => (
                                                <span key={index} className={styles.specializationChip}>
                                                    {spec}
                                                </span>
                                            ))}
                                            {master.specializations && master.specializations.length > 2 && (
                                                <span className={styles.moreChip}>
                                                    +{master.specializations.length - 2}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant={master.status === "AVAILABLE" ? "primary" : "secondary"}
                                            size="small"
                                            fullWidth
                                            disabled={master.status !== "AVAILABLE"}
                                            onClick={() => handleAssignMaster(master.userId)}
                                            className={styles.assignButton}
                                        >
                                            {master.status === "AVAILABLE" ? "Назначить" : "Недоступен"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}

                {/* Действия с заказом */}
                {orderDetails.status !== "COMPLETED" && orderDetails.status !== "CANCELED" && (
                    <Card className={styles.section}>
                        <h2 className={styles.sectionTitle}>Действия с заказом</h2>
                        <div className={styles.actionsGrid}>
                            <Button
                                variant="primary"
                                onClick={handleConfirmPrice}
                                className={styles.actionButton}
                                icon={<DollarSign size={18} />}
                            >
                                Подтвердить цену
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleCompleteOrder}
                                className={styles.actionButton}
                                icon={<Clock size={18} />}
                            >
                                Завершить заказ
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleCancelOrder}
                                className={styles.actionButton}
                                icon={<ArrowLeft size={18} />}
                            >
                                Отменить заказ
                            </Button>
                        </div>
                    </Card>
                )}
            </main>

            <Navigation role="operator" />
        </div>
    );
};

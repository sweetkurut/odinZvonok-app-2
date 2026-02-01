/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./OrderPage.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import {
    assignMasterToOrder,
    fetchOrderById,
    confirmOrderPrice,
    completeOrder,
    cancelOrder,
} from "@/store/slices/orderSlice";
import { useEffect } from "react";
import { ORDER_STATUS_MAP } from "@/utils/orderStatus";
import { OrderPageSkeleton } from "@/shared/ui/OrderPageSkeleton/OrderPageSkeleton";
import { fetchMasters } from "@/store/slices/masterSlice";
import { toast } from "react-toastify";

export const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { user } = useAppSelector((state) => state.auth);
    const { orderDetails, loading, error } = useAppSelector((state) => state.orders);
    const { masters, loading: mastersLoading } = useAppSelector((state) => state.masters);

    const userId = user;

    // загрузка мастеров
    useEffect(() => {
        dispatch(fetchMasters());
    }, [dispatch]);

    // загрузка деталей заказа
    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    if (loading) return <OrderPageSkeleton />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!orderDetails) return null;

    const { category, title, description, address, status, client, master, price, created_at, completed_at } =
        orderDetails;

    const statusConfig = ORDER_STATUS_MAP[status] ?? { label: status, className: "default" };

    // кнопки действий
    const handleAssignMaster = async (masterId: string) => {
        try {
            await dispatch(assignMasterToOrder({ orderId: id!, masterId })).unwrap();
            toast.success("Мастер успешно назначен ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось назначить мастера");
        }
    };

    const handleConfirmPrice = async () => {
        try {
            await dispatch(confirmOrderPrice({ orderId: id! })).unwrap();
            toast.success("Цена подтверждена ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось подтвердить цену");
        }
    };

    const handleCompleteOrder = async () => {
        try {
            await dispatch(completeOrder({ orderId: id! })).unwrap();
            toast.success("Заказ завершён ✅");
            dispatch(fetchOrderById(id!));
        } catch (err: any) {
            toast.error(err || "Не удалось завершить заказ");
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

    const handleNav = () => {
        if (userId) {
            navigate(`/operator/master/${userId}`);
        }
    };

    return (
        <div className={styles.orderPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/operator")}>
                    <ArrowLeft size={20} />
                </button>
                <h1>{title}</h1>
            </header>

            <main className={styles.main}>
                {/* Информация о заказе */}
                <Card className={styles.orderCard}>
                    <div className={styles.orderImage}>
                        <img
                            src="https://images.pexels.com/photos/5825358/pexels-photo-5825358.jpeg"
                            alt="Поломка"
                        />
                    </div>

                    <div className={styles.categoryTag}>
                        <span>Категория: {category}</span>
                    </div>
                    <h2>{title}</h2>
                    <p className={styles.orderDescription}>{description}</p>

                    <div className={styles.orderDetails}>
                        <div className={styles.detail}>
                            <span>Дата заявки:</span>
                            <span>{new Date(created_at).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Адрес:</span>
                            <span>{address}</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Статус:</span>
                            <span className={`${styles.status} ${styles[statusConfig.className]}`}>
                                {statusConfig.label}
                            </span>
                        </div>
                        <div className={styles.detail}>
                            <span>Заказчик:</span>
                            <span>{client.fullName}</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Мастер:</span>
                            <span>{master ? master.fullName : "Не назначен"}</span>
                        </div>
                        {price && (
                            <div className={styles.detail}>
                                <span>Цена:</span>
                                <span>{price} сом</span>
                            </div>
                        )}
                        {completed_at && (
                            <div className={styles.detail}>
                                <span>Дата завершения:</span>
                                <span>{new Date(completed_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Доступные мастера */}
                <Card className={styles.mastersList}>
                    <h3>Доступные мастера</h3>

                    {mastersLoading && <div>Загрузка мастеров...</div>}
                    {!mastersLoading && masters.length === 0 && (
                        <div className={styles.empty}>Нет доступных мастеров</div>
                    )}

                    {masters?.map((m) => {
                        const initials = m.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("");
                        const isDisabled = !!orderDetails.master || m.status !== "AVAILABLE";
                        return (
                            <div key={m.id} className={styles.masterCard} onClick={handleNav}>
                                <div className={styles.masterTop}>
                                    <div className={styles.masterAvatar}>
                                        <span>{initials}</span>
                                    </div>

                                    <div className={styles.masterDetails}>
                                        <h4>{m.fullName}</h4>
                                        <div className={styles.masterMeta}>
                                            <span className={styles.rating}>★ {m.rating ?? "—"}</span>
                                            <span className={styles.category}>
                                                {m.specializations?.join(", ")}
                                            </span>
                                        </div>
                                        <span className={styles.masterStatus}>
                                            {m.status === "AVAILABLE" ? "Готов принять заказ" : "Недоступен"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.masterActions}>
                                    <Button
                                        variant="primary"
                                        size="small"
                                        className={styles.assignButton}
                                        disabled={isDisabled}
                                        onClick={() => handleAssignMaster(m.userId)}
                                    >
                                        {orderDetails.master?.id === m.userId ? "Назначен" : "Назначить"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Card>

                {/* Действия */}
                <Card className={styles.actionsCard}>
                    {status === "PENDING_PRICE_CONFIRMATION" && (
                        <Button variant="primary" size="large" onClick={handleConfirmPrice}>
                            Подтвердить цену
                        </Button>
                    )}

                    {status === "IN_PROGRESS" && (
                        <Button variant="success" size="large" onClick={handleCompleteOrder}>
                            Завершить заказ
                        </Button>
                    )}

                    {status !== "COMPLETED" && (
                        <Button variant="danger" size="large" onClick={handleCancelOrder}>
                            Отменить заказ
                        </Button>
                    )}
                </Card>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

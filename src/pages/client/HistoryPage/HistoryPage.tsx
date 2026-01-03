import { Navigation, Card } from "../../../shared/ui";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import styles from "./HistoryPage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import { fetchOrders } from "@/store/slices/orderSlice";

export const HistoryPage = () => {
    const orders = useAppSelector((state: RootState) => state.orders.orders);
    const loading = useAppSelector((state: RootState) => state.orders.loading);
    const error = useAppSelector((state: RootState) => state.orders.error);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "COMPLETED":
            case "completed":
                return <CheckCircle size={20} className={styles.statusCompleted} />;
            case "CANCELLED":
            case "cancelled":
                return <XCircle size={20} className={styles.statusCancelled} />;
            default:
                return <Clock size={20} className={styles.statusPending} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "COMPLETED":
            case "completed":
                return "Завершён";
            case "CANCELLED":
            case "cancelled":
                return "Отменён";
            case "IN_PROGRESS":
            case "in_progress":
                return "В работе";
            case "PENDING_ASSIGNMENT":
                return "Ожидает мастера";
            default:
                return "Ожидает";
        }
    };

    if (loading) {
        return <div className={styles.loader}>Загрузка истории...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>Ошибка: {error}</p>
                <button onClick={() => dispatch(fetchOrders())}>Повторить</button>
            </div>
        );
    }

    return (
        <div className={styles.historyPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>История заказов</h1>
            </header>

            <main className={styles.main}>
                {!orders || orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>У вас пока нет заказов</p>
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <Card key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3>{order.title || "Без заголовка"}</h3>
                                    <div className={styles.orderStatus}>
                                        {getStatusIcon(order.status)}
                                        <span>{getStatusText(order.status)}</span>
                                    </div>
                                </div>

                                <p className={styles.orderDescription}>
                                    {order.description || "Нет описания"}
                                </p>

                                {order.address && (
                                    <p className={styles.orderAddress}>Адрес: {order.address}</p>
                                )}

                                <div className={styles.orderFooter}>
                                    <span className={styles.orderDate}>
                                        {new Date(order.created_at).toLocaleDateString("ru-RU")}
                                    </span>

                                    {order.master && (
                                        <span className={styles.orderMaster}>
                                            Мастер: {order.master.fullName}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Navigation role="client" />
        </div>
    );
};

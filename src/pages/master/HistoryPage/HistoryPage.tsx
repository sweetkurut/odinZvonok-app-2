import { Navigation, Card } from "../../../shared/ui";
import styles from "./HistoryPage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import { fetchOrders } from "@/store/slices/orderSlice";
import { OrderCardSkeleton } from "@/shared/ui/OrderCardSkeleton/OrderCardSkeleton";

export const HistoryPage = () => {
    const dispatch = useAppDispatch();
    const { orders, loading, isInitialLoading, error } = useAppSelector((state: RootState) => state.orders);

    const navigate = useNavigate();

    useEffect(() => {
        if (isInitialLoading) {
            dispatch(fetchOrders());
        }
    }, [dispatch, isInitialLoading]);

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

    if (isInitialLoading && loading) {
        return (
            <div className={styles.historyPage}>
                <header className={styles.header}>
                    <Link to="/master">
                        <img src={Logo} alt="Логотип" />
                    </Link>
                    <h1>История заказов</h1>
                </header>

                <main className={styles.main}>
                    <div className={styles.ordersList}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <OrderCardSkeleton key={i} />
                        ))}
                    </div>
                </main>

                <Navigation role="master" />
            </div>
        );
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
                <Link to={"/master"}>
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>История заказов</h1>
            </header>

            <main className={styles.main}>
                {!orders || orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>У вас пока нет заказов</p>
                        {/* <button onClick={handleNavigate}>Добавить</button> */}
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <Card
                                key={order.id}
                                className={styles.orderCard}
                                onClick={() => navigate(`/master/history/${order.id}`)}
                            >
                                <div className={styles.topRow}>
                                    <h3 className={styles.title}>{order.title || "Без заголовка"}</h3>

                                    <span
                                        className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}
                                    >
                                        {getStatusText(order.status)}
                                    </span>
                                </div>

                                <p className={styles.description}>
                                    {order.description || "Описание отсутствует"}
                                </p>

                                {order.address && <div className={styles.address}>📍 {order.address}</div>}

                                <div className={styles.bottomRow}>
                                    <span className={styles.date}>
                                        {new Date(order.created_at).toLocaleDateString("ru-RU")}
                                    </span>

                                    {order.master && (
                                        <span className={styles.master}>👨‍🔧 {order.master.fullName}</span>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            <Navigation role="master" />
        </div>
    );
};

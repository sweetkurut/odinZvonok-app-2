import { Navigation, Card } from "../../../shared/ui";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import { fetchAllOrders } from "@/store/slices/orderSlice";
import type { RootState } from "@/store";
import { OrderCardSkeleton } from "@/shared/ui/OrderCardSkeleton/OrderCardSkeleton";

export const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { orders, loading, isInitialLoading } = useAppSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (isInitialLoading) {
            dispatch(fetchAllOrders());
        }
    }, [dispatch, isInitialLoading]);

    if (isInitialLoading && loading) {
        return (
            <div className={styles.historyPage}>
                <header className={styles.header}>
                    <Link to="/client">
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

                <Navigation role="client" />
            </div>
        );
    }

    return (
        <div className={styles.homePage}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/operator"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    {/* <h1 className={styles.userName}>{user?.name}</h1> */}
                    <h1 className={styles.userName}>Оператор</h1>
                </div>
            </header>

            <main className={styles.main}>
                {/* <div className={styles.filters}>
                    <Button variant="primary" size="small">
                        Все категории
                    </Button>
                    <Button variant="secondary" size="small">
                        Бытовая
                    </Button>
                    <Button variant="secondary" size="small">
                        Сантех
                    </Button>
                </div> */}

                <section className={styles.currentOrders}>
                    <h2>Текущие сделки</h2>

                    {!orders || orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Текущих сделок нет</p>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map((order) => (
                                <Card
                                    key={order.id}
                                    className={styles.orderCard}
                                    // onClick={() => navigate(`/operator/master/:id${order.id}`)}
                                    // onClick={() => navigate("/operator/order/:id")}
                                    onClick={() => navigate(`/operator/order/${order.id}`)}
                                >
                                    <div className={styles.topRow}>
                                        <h3 className={styles.title}>{order.title || "Без заголовка"}</h3>

                                        {/* <span
                                            className={`${styles.status} ${styles[order.status?.toLowerCase()]}`}
                                        >
                                            {getStatusText(order.status)}
                                        </span> */}
                                    </div>

                                    <p className={styles.description}>
                                        {order.description || "Описание отсутствует"}
                                    </p>

                                    {order.address && (
                                        <div className={styles.address}>📍 {order.address}</div>
                                    )}

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
                </section>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

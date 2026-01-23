import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchOrderById } from "@/store/slices/orderSlice";
import { Navigation, Card } from "@/shared/ui";
import Loader from "@/shared/ui/Loader/Loader";
import styles from "./style.module.scss";
import Logo from "@/assets/Logo.png";
import { MapPin, Clock, User } from "lucide-react";

export const DetailOrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { orderDetails, loading, error } = useAppSelector((state) => state.orders);
    const role = useAppSelector((state) => state.auth.user?.role);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    if (loading || !orderDetails) {
        return <Loader />;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const order = orderDetails;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/client/orders">
                    <img src={Logo} alt="Назад" />
                </Link>
                <h1>Заказ</h1>
            </header>

            <main className={styles.main}>
                {/* Статус */}

                {/* Основной блок */}
                <Card className={styles.mainCard}>
                    <div className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                        {getStatusText(order.status)}
                    </div>
                    <h2 className={styles.title}>{order.title}</h2>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <MapPin size={16} />
                            <span>{order.address}</span>
                        </div>

                        <div className={styles.metaItem}>
                            <Clock size={16} />
                            <span>{new Date(order.created_at).toLocaleString("ru-RU")}</span>
                        </div>
                    </div>
                    {order.description && <p className={styles.description}>{order.description}</p>}
                </Card>

                {/* Мастер */}
                {order.master && (
                    <Card className={styles.masterCard}>
                        <span className={styles.sectionTitle}>Ваш мастер</span>

                        <div className={styles.master}>
                            <div className={styles.avatar}>
                                {order.master.profile_photo_url ? (
                                    <img src={order.master.profile_photo_url} />
                                ) : (
                                    order.master.fullName[0]
                                )}
                            </div>

                            <div>
                                <div className={styles.masterName}>{order.master.fullName}</div>
                                <div className={styles.masterSub}>Назначен на заказ</div>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            <Navigation role="client" />
        </div>
    );
};

const getStatusText = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "Завершён";
        case "CANCELLED":
            return "Отменён";
        case "IN_PROGRESS":
            return "В работе";
        case "PENDING_ASSIGNMENT":
            return "Ожидает мастера";
        default:
            return "Ожидает";
    }
};

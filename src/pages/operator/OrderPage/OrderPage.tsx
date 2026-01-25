import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import styles from "./OrderPage.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchOrderById } from "@/store/slices/orderSlice";
import { useEffect } from "react";
import { ORDER_STATUS_MAP } from "@/utils/orderStatus";
import { OrderPageSkeleton } from "@/shared/ui/OrderPageSkeleton/OrderPageSkeleton";

export const OrderPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { orderDetails, loading, error } = useAppSelector((state) => state.orders);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return <OrderPageSkeleton />;
    }

    if (error) return <div className={styles.error}>{error}</div>;
    if (!orderDetails) return null;

    const { category, title, description, address, status, client, master, created_at, completed_at } =
        orderDetails;

    const statusConfig = ORDER_STATUS_MAP[status] ?? {
        label: status,
        className: "default",
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
                <Card className={styles.orderCard}>
                    <div className={styles.orderImage}>
                        {" "}
                        <img
                            src="https://images.pexels.com/photos/5825358/pexels-photo-5825358.jpeg"
                            alt="Стиральная машина"
                        />{" "}
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

                        {completed_at && (
                            <div className={styles.detail}>
                                <span>Дата завершения:</span>
                                <span>{new Date(completed_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </Card>

                <Card className={styles.mastersList}>
                    <h3>Доступные мастера</h3>

                    {[1, 2, 3].map((masterId) => (
                        <div key={masterId} className={styles.masterCard}>
                            <div className={styles.masterTop}>
                                <div className={styles.masterAvatar}>
                                    <span>AM</span>
                                </div>

                                <div className={styles.masterDetails}>
                                    <h4>Alex Alexandr</h4>

                                    <div className={styles.masterMeta}>
                                        <span className={styles.rating}>★ 4.9</span>
                                        <span className={styles.category}>{category}</span>
                                    </div>

                                    <span className={styles.masterStatus}>Готов принять заказ</span>
                                </div>
                            </div>

                            <div className={styles.masterActions}>
                                <div className={styles.iconButton}>
                                    <Phone size={16} />
                                </div>

                                <div className={styles.iconButton}>
                                    <MessageCircle size={16} />
                                </div>

                                <Button
                                    variant="primary"
                                    size="small"
                                    className={styles.assignButton}
                                    onClick={() => navigate(`/operator/master/${masterId}`)}
                                >
                                    Назначить
                                </Button>
                            </div>
                        </div>
                    ))}
                </Card>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

import { Navigation, Card } from "../../../shared/ui";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import styles from "./HistoryPage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";

export const HistoryPage = () => {
    const orders = useSelector((state: RootState) => state.order.orders);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle size={20} className={styles.statusCompleted} />;
            case "cancelled":
                return <XCircle size={20} className={styles.statusCancelled} />;
            default:
                return <Clock size={20} className={styles.statusPending} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Завершен";
            case "cancelled":
                return "Отменен";
            case "in_progress":
                return "В работе";
            default:
                return "Ожидает";
        }
    };

    return (
        <div className={styles.historyPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="" />
                </Link>
                <h1>История сделок</h1>
            </header>

            <main className={styles.main}>
                {orders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>У вас пока нет заказов</p>
                    </div>
                ) : (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <Card key={order.id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3>{order.title}</h3>
                                    <div className={styles.orderStatus}>
                                        {getStatusIcon(order.status)}
                                        <span>{getStatusText(order.status)}</span>
                                    </div>
                                </div>
                                <p className={styles.orderDescription}>{order.description}</p>
                                <div className={styles.orderFooter}>
                                    <span className={styles.orderDate}>
                                        {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                                    </span>
                                    {order.price && (
                                        <span className={styles.orderPrice}>{order.price} ₽</span>
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

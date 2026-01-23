import { Navigation, Card } from "../../../shared/ui";
import { Star } from "lucide-react";
import styles from "./HistoryPage.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/Logo.png";

export const HistoryPage = () => {
    const nav = useNavigate();

    const handleCardClick = (orderId: string) => {
        nav(`/master/order/${orderId}`);
    };

    const orders = [
        {
            id: "1",
            client: "Alex Alexandr",
            rating: 4.9,
            date: "2024-01-15",
            category: "Бытовая техника",
            description: "Ремонт стиральной машины",
            completedTime: "10:00-12",
            status: "completed",
        },
        {
            id: "2",
            client: "Alex Alexandr",
            rating: 5.0,
            date: "2024-01-14",
            category: "Сантехника",
            description: "Замена крана",
            completedTime: "14:00-15:30",
            status: "completed",
        },
    ];

    return (
        <div className={styles.historyPage}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/master"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    {/* <h1 className={styles.userName}>{user?.name}</h1> */}
                    <h1 className={styles.userName}>История сделок</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.ordersList}>
                    {orders.map((order) => (
                        <Card key={order.id} className={styles.orderCard} onClick={handleCardClick}>
                            <div className={styles.orderHeader}>
                                <div className={styles.clientInfo}>
                                    <div className={styles.clientAvatar}>
                                        <span>
                                            {order.client
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    </div>
                                    <div className={styles.clientDetails}>
                                        <h3>{order.client}</h3>
                                        <div className={styles.rating}>
                                            <Star size={14} className={styles.star} />
                                            <span>{order.rating}</span>
                                        </div>
                                        <div className={styles.orderMeta}>
                                            <span>{order.category}</span>
                                            <span>•</span>
                                            <span>Оценка клиенту: {order.rating}</span>
                                        </div>
                                        <div className={styles.orderTime}>
                                            <span>
                                                Дата выполнения:{" "}
                                                {new Date(order.date).toLocaleDateString("ru-RU")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.orderStatus}>
                                    <span className={styles.statusCompleted}>Завершен</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>У вас пока нет выполненных заказов</p>
                    </div>
                )}
            </main>

            <Navigation role="master" />
        </div>
    );
};

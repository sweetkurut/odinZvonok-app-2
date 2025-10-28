import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import styles from "./OrderPage.module.scss";

export const OrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className={styles.orderPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/master")}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Завершено</h1>
                <div className={styles.statusIcon}>
                    <CheckCircle size={24} />
                </div>
            </header>

            <main className={styles.main}>
                <Card className={styles.orderCard}>
                    <div className={styles.statusBadge}>
                        <CheckCircle size={16} />
                        <span>Завершено</span>
                    </div>

                    <h2>Ремонт бытовой техники</h2>
                    <p className={styles.description}>Выполнено</p>

                    <div className={styles.clientInfo}>
                        <span className={styles.label}>Клиент:</span>
                        <span>Владимир Иван</span>
                    </div>

                    <div className={styles.orderDetails}>
                        <div className={styles.detail}>
                            <span>Стиральная машина</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Стиральная машина не сливает что сливается</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Город Бишкек</span>
                        </div>
                        <div className={styles.detail}>
                            <span>марка ХХХ, модель УУУ</span>
                        </div>
                    </div>

                    <div className={styles.orderImage}>
                        <img
                            src="https://images.pexels.com/photos/5825358/pexels-photo-5825358.jpeg"
                            alt="Completed repair"
                        />
                    </div>

                    <div className={styles.completionInfo}>
                        <div className={styles.detail}>
                            <span>Дата сдачи:</span>
                            <span>10.06.25 г</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Выполнил:</span>
                            <span>Иван</span>
                        </div>
                    </div>
                </Card>

                <Card className={styles.ratingCard}>
                    <h3>Отзыв</h3>
                    <div className={styles.rating}>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={20} className={styles.star} />
                            ))}
                        </div>
                    </div>
                    <p className={styles.reviewText}>
                        Отличный клиент! Хорошо объяснил проблему и предоставил все необходимое для работы.
                    </p>
                </Card>

                <div className={styles.actions}>
                    <Button variant="primary" size="large" onClick={() => navigate("/master")}>
                        Вернуться к заказам
                    </Button>
                </div>
            </main>

            <Navigation role="master" />
        </div>
    );
};

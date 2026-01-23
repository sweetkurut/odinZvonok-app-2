import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";
import styles from "./CompletedPage.module.scss";

export const CompletedPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className={styles.completedPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/operator")}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Завершенные сделки</h1>
                <div className={styles.statusIcon}>
                    <CheckCircle size={24} />
                </div>
            </header>

            <main className={styles.main}>
                <Card className={styles.completedCard}>
                    <div className={styles.statusBadge}>
                        <CheckCircle size={16} />
                        <span>Завершено</span>
                    </div>

                    <h2>Ремонт бытовой техники</h2>
                    <p className={styles.description}>Выполнено</p>

                    <div className={styles.masterInfo}>
                        <span className={styles.label}>Клиент:</span>
                        <span>Владимир Иван</span>
                    </div>

                    <div className={styles.completionDetails}>
                        <div className={styles.detail}>
                            <span>Стиральная машина</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Город Бишкек</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Стиральная машина не сливает что сливается</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Марка ХХХ, модель УУУ</span>
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
                        Отличный мастер! Быстро диагностировал проблему и качественно все исправил.
                        Рекомендую!
                    </p>
                </Card>

                <div className={styles.actions}>
                    <Button variant="primary" size="large" onClick={() => navigate("/operator")}>
                        Вернуться к заказам
                    </Button>
                </div>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

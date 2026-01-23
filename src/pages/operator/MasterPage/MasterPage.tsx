import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import styles from "./MasterPage.module.scss";

export const MasterPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className={styles.masterPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/operator")}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Alex Alexandr</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.masterProfile}>
                    <div className={styles.masterInfo}>
                        <div className={styles.masterAvatar}>
                            <span>AA</span>
                        </div>
                        <div className={styles.masterDetails}>
                            <h2>Alex Alexandr</h2>
                            <div className={styles.masterRating}>
                                <div className={styles.stars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={16} className={styles.star} />
                                    ))}
                                </div>
                                <span>4.9 (127 отзывов)</span>
                            </div>
                            <div className={styles.masterCategories}>
                                <span className={styles.category}>Бытовая техника</span>
                                <span className={styles.category}>Сантехника</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className={styles.orderDetails}>
                    <h3>Информация о заказе</h3>
                    <div className={styles.orderInfo}>
                        <div className={styles.detail}>
                            <span>Категория:</span>
                            <span>Ремонт бытовой техники</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Проблема:</span>
                            <span>Стиральная машина</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Адрес:</span>
                            <span>ул. Советская, 15</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Клиент:</span>
                            <span>Иван</span>
                        </div>
                    </div>
                </Card>

                <Card className={styles.assignmentCard}>
                    <h3>Назначить мастера</h3>
                    <p>Вы уверены, что хотите назначить Alex Alexandr на этот заказ?</p>

                    <div className={styles.actions}>
                        <Button variant="secondary" onClick={() => navigate("/operator")}>
                            Отмена
                        </Button>
                        <Button variant="primary" onClick={() => navigate("/operator/completed/1")}>
                            Назначить
                        </Button>
                    </div>
                </Card>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

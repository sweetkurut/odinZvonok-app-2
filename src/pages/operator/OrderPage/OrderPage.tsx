import { Navigation, Card, Button } from "../../../shared/ui";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import styles from "./OrderPage.module.scss";

export const OrderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className={styles.orderPage}>
            <header className={styles.header}>
                <button className={styles.backButton} onClick={() => navigate("/operator")}>
                    <ArrowLeft size={20} />
                </button>
                <h1>Ремонт бытовой техники</h1>
            </header>

            <main className={styles.main}>
                <Card className={styles.orderCard}>
                    <div className={styles.categoryTag}>
                        <span>Категория: Бытовая техника</span>
                    </div>

                    <h2>Стиральная машина</h2>
                    <p className={styles.orderDescription}>
                        Стиральная машина не сливает воду. Барабан бьет. Стиральная машина не сливается
                        что-то.
                    </p>

                    <div className={styles.orderImage}>
                        <img
                            src="https://images.pexels.com/photos/5825358/pexels-photo-5825358.jpeg"
                            alt="Стиральная машина"
                        />
                    </div>

                    <div className={styles.orderDetails}>
                        <div className={styles.detail}>
                            <span>Дата заявки:</span>
                            <span>10.06.25 г</span>
                        </div>
                        <div className={styles.detail}>
                            <span>Заказчик:</span>
                            <span>Иван</span>
                        </div>
                    </div>
                </Card>

                <Card className={styles.mastersList}>
                    <h3>Доступные мастера</h3>

                    {[1, 2, 3].map((master) => (
                        <div key={master} className={styles.masterCard}>
                            <div className={styles.masterInfo}>
                                <div className={styles.masterAvatar}>
                                    <span>AM</span>
                                </div>
                                <div className={styles.masterDetails}>
                                    <h4>Alex Alexandr</h4>
                                    <div className={styles.masterMeta}>
                                        <span className={styles.rating}>★ 4.9</span>
                                        <span className={styles.category}>Бытовая техника</span>
                                    </div>
                                    <span className={styles.masterStatus}>Готов принять заказ</span>
                                </div>
                            </div>

                            <div className={styles.masterActions}>
                                <div className={styles.contactButton}>
                                    <Phone size={16} />
                                </div>
                                <div className={styles.contactButton}>
                                    <MessageCircle size={16} />
                                </div>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => navigate(`/operator/master/${master}`)}
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

import { Navigation, Card } from "../../../shared/ui";
import { Phone, MessageCircle, Clock } from "lucide-react";
import styles from "./HelpPage.module.scss";

import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";

export const HelpPage = () => {
    return (
        <div className={styles.helpPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="" />
                </Link>
                <div>
                    <h1>Помощь</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.contactOptions}>
                    <Card className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <Phone size={24} />
                        </div>
                        <div className={styles.contactInfo}>
                            <h3>Позвонить в поддержку</h3>
                            <p>+7 (800) 123-45-67</p>
                        </div>
                    </Card>

                    <Card className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <MessageCircle size={24} />
                        </div>
                        <div className={styles.contactInfo}>
                            <h3>Написать в чат</h3>
                            <p>Ответим в течение 5 минут</p>
                        </div>
                    </Card>
                </div>

                <section className={styles.faqSection}>
                    <h2>Часто задаваемые вопросы</h2>

                    <Card className={styles.faqCard}>
                        <h3>Как создать заказ?</h3>
                        <p>
                            Нажмите кнопку "Создать заказ" на главной странице, заполните форму с описанием
                            проблемы и прикрепите фото при необходимости.
                        </p>
                    </Card>

                    <Card className={styles.faqCard}>
                        <h3>Сколько стоят услуги?</h3>
                        <p>Стоимость зависит от сложности работы. Мастер озвучит цену после осмотра.</p>
                    </Card>

                    <Card className={styles.faqCard}>
                        <h3>Как быстро приедет мастер?</h3>
                        <p>Обычно мастер прибывает в течение 1-2 часов после подтверждения заказа.</p>
                    </Card>
                </section>

                <section className={styles.workingHours}>
                    <h2>Время работы</h2>
                    <Card className={styles.scheduleCard}>
                        <div className={styles.scheduleIcon}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <p>
                                <strong>Пн-Вс:</strong> 24/7
                            </p>
                            <p className={styles.note}>Круглосуточная поддержка</p>
                        </div>
                    </Card>
                </section>
            </main>

            <Navigation role="client" />
        </div>
    );
};

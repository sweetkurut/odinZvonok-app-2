import { Navigation, Card, Button } from "../../../shared/ui";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store";
import { User, Phone, Mail, CreditCard as Edit } from "lucide-react";
import styles from "./ProfilePage.module.scss";
import Logo from "../../../assets/Logo.png";
import { Link } from "react-router-dom";

export const ProfilePage = () => {
    // const user = useSelector((state: RootState) => state.user.currentUser);

    return (
        <div className={styles.profilePage}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/client"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    <h1 className={styles.userName}>Профиль</h1>
                </div>
            </header>

            <main className={styles.main}>
                <Card className={styles.userCard}>
                    <div className={styles.userAvatar}>
                        <User size={40} />
                    </div>
                    <div className={styles.userInfo}>
                        <h2>{"Владимир Иван Осипов"}</h2>
                        <p className={styles.userRole}>Клиент</p>
                    </div>
                    <Button variant="secondary" size="small">
                        <Edit size={16} />
                    </Button>
                </Card>

                <section className={styles.contactSection}>
                    <h3>Контактная информация</h3>

                    <Card className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <Phone size={20} />
                        </div>
                        <div className={styles.contactInfo}>
                            <label>Телефон</label>
                            <span>+996(552)XXX-XXX</span>
                        </div>
                    </Card>

                    <Card className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <Mail size={20} />
                        </div>
                        <div className={styles.contactInfo}>
                            <label>Email</label>
                            <span>ivanov@example.com</span>
                        </div>
                    </Card>
                </section>

                <section className={styles.preferencesSection}>
                    <h3>Настройки</h3>

                    <Card className={styles.preferenceCard}>
                        <div className={styles.preferenceInfo}>
                            <span>Уведомления</span>
                            <p>Получать уведомления о статусе заказов</p>
                        </div>
                        <div className={styles.toggle}>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </Card>

                    <Card className={styles.preferenceCard}>
                        <div className={styles.preferenceInfo}>
                            <span>SMS уведомления</span>
                            <p>Получать SMS о важных обновлениях</p>
                        </div>
                        <div className={styles.toggle}>
                            <input type="checkbox" />
                        </div>
                    </Card>
                </section>

                <div className={styles.actions}>
                    <Button variant="danger" size="large">
                        Выйти из аккаунта
                    </Button>
                </div>
            </main>

            <Navigation role="client" />
        </div>
    );
};

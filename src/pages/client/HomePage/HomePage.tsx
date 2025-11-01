import { Navigation, Card, Button } from "../../../shared/ui";
// import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.scss";

import Img from "../../../assets/Rectangle 1.png";
import Logo from "../../../assets/Logo.png";

export const HomePage = () => {
    // const user = useSelector((state: RootState) => state.user.currentUser);
    const navigate = useNavigate();

    return (
        <div className={styles.homePage}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/client"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    {/* <h1 className={styles.userName}>{user?.name}</h1> */}
                    <h1 className={styles.userName}>Пользователь</h1>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.heroSection}>
                    <img src={Img} alt="" className={styles.heroImage} />
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Один ZvonOk - и проблемы решены</h1>
                        <p className={styles.heroDescription}>
                            Услуги профессионалов по электрике, сантехнике и другим мастерам. Быстрое решение
                            и качественный результат.
                        </p>
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <Button
                        variant="primary"
                        onClick={() => navigate("/client/create-order")}
                        className={styles.createOrderBtn}
                    >
                        Создать заказ
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/client/help")}>
                        Получить помощь
                    </Button>
                </div>

                <div className={styles.services}>
                    <h2 className={styles.sectionTitle}>Наши услуги</h2>
                    <div className={styles.servicesList}>
                        <Card className={styles.serviceCard}>
                            <h3>Электрика</h3>
                            <p>Установка, ремонт и обслуживание электрических систем</p>
                        </Card>
                        <Card className={styles.serviceCard}>
                            <h3>Сантехника</h3>
                            <p>Ремонт и установка сантехнического оборудования</p>
                        </Card>
                        <Card className={styles.serviceCard}>
                            <h3>Бытовая техника</h3>
                            <p>Ремонт стиральных машин, холодильников и другой техники</p>
                        </Card>
                    </div>
                </div>
            </main>

            <Navigation role="client" />
        </div>
    );
};

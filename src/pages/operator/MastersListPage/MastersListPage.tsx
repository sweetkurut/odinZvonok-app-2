import { Button, Card, Navigation } from "@/shared/ui";
import styles from "./MastersListPage.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";

const mastersData = [
    {
        id: 1,
        name: "Alex Alexandr",
        category: "Бытовая техника",
        rating: 4.9,
        status: "free",
    },
    {
        id: 2,
        name: "Ivan Petrov",
        category: "Электрика",
        rating: 4.6,
        status: "busy",
    },
    {
        id: 3,
        name: "Maria Ivanova",
        category: "Сантехника",
        rating: 4.8,
        status: "free",
    },
    {
        id: 4,
        name: "Oleg Smirnov",
        category: "Бытовая техника",
        rating: 4.3,
        status: "busy",
    },
];

const MastersListPage = () => {
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [minRating, setMinRating] = useState(0);

    const filteredMasters = useMemo(() => {
        return mastersData.filter((m) => {
            if (category !== "all" && m.category !== category) return false;
            if (status !== "all" && m.status !== status) return false;
            if (m.rating < minRating) return false;
            return true;
        });
    }, [category, status, minRating]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <Link to="/client">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Список мастеров</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.mastersList}>
                    <div className={styles.filters}>
                        <select onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">Все категории</option>
                            <option value="Бытовая техника">Бытовая техника</option>
                            <option value="Электрика">Электрика</option>
                            <option value="Сантехника">Сантехника</option>
                        </select>

                        <select onChange={(e) => setStatus(e.target.value)}>
                            <option value="all">Все статусы</option>
                            <option value="free">Свободен</option>
                            <option value="busy">Занят</option>
                        </select>

                        <select onChange={(e) => setMinRating(Number(e.target.value))}>
                            <option value="0">Любой рейтинг</option>
                            <option value="4.5">4.5+</option>
                            <option value="4.8">4.8+</option>
                        </select>
                    </div>

                    <div className={styles.grid}>
                        {filteredMasters.map((master) => (
                            <div key={master.id} className={styles.masterCard}>
                                <div className={styles.masterTop}>
                                    <div className={styles.masterAvatar}>
                                        {master.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>

                                    <div className={styles.masterDetails}>
                                        <h4>{master.name}</h4>

                                        <div className={styles.masterMeta}>
                                            <span className={styles.rating}>★ {master.rating}</span>
                                            <span className={styles.category}>{master.category}</span>
                                        </div>

                                        <span
                                            className={`${styles.masterStatus} ${
                                                master.status === "free" ? styles.free : styles.busy
                                            }`}
                                        >
                                            {master.status === "free" ? "Готов принять заказ" : "Занят"}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.masterActions}>
                                    <div className={styles.iconButton}>
                                        <Phone size={16} />
                                    </div>

                                    <div className={styles.iconButton}>
                                        <MessageCircle size={16} />
                                    </div>

                                    <Button variant="primary" size="small" className={styles.assignButton}>
                                        Назначить
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

export default MastersListPage;

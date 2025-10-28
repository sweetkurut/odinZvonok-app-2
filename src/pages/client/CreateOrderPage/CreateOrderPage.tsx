import { useState } from "react";
import { Navigation, Card, Button } from "../../../shared/ui";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin } from "lucide-react";
import styles from "./CreateOrderPage.module.scss";
import Logo from "../../../assets/Logo.png";

export const CreateOrderPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here would be the logic to create order
        navigate("/client");
    };

    return (
        <div className={styles.createOrderPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="" />
                </Link>
                <div>
                    <h1>Создание сделки</h1>
                </div>
            </header>

            <main className={styles.main}>
                <form onSubmit={handleSubmit}>
                    <Card className={styles.formCard}>
                        <div className={styles.formGroup}>
                            <label>Категория услуги</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value="">Выберите категорию</option>
                                <option value="plumbing">Сантехника</option>
                                <option value="electrical">Электрика</option>
                                <option value="appliances">Бытовая техника</option>
                                <option value="other">Другое</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Название заказа</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Например: Ремонт стиральной машины"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Описание проблемы</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опишите детально что нужно сделать..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Адрес</label>
                            <div className={styles.addressInput}>
                                <input type="text" placeholder="Введите адрес" required />
                                <button type="button" className={styles.mapButton}>
                                    <MapPin size={20} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Фото (необязательно)</label>
                            <div className={styles.photoUpload}>
                                <button type="button" className={styles.uploadButton}>
                                    <Camera size={24} />
                                    <span>Добавить фото</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Желаемое время</label>
                            <div className={styles.timeOptions}>
                                <label className={styles.timeOption}>
                                    <input type="radio" name="time" value="asap" defaultChecked />
                                    <span>Как можно скорее</span>
                                </label>
                                <label className={styles.timeOption}>
                                    <input type="radio" name="time" value="today" />
                                    <span>Сегодня</span>
                                </label>
                                <label className={styles.timeOption}>
                                    <input type="radio" name="time" value="tomorrow" />
                                    <span>Завтра</span>
                                </label>
                                <label className={styles.timeOption}>
                                    <input type="radio" name="time" value="specific" />
                                    <span>Выбрать время</span>
                                </label>
                            </div>
                        </div>
                    </Card>

                    <div className={styles.submitSection}>
                        <Button type="submit" variant="primary" size="large">
                            Создать заказ
                        </Button>
                    </div>
                </form>
            </main>

            <Navigation role="client" />
        </div>
    );
};

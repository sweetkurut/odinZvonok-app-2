import { useState } from "react";
import { Navigation, Card, Button } from "../../../shared/ui";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin, X } from "lucide-react";
import styles from "./CreateOrderPage.module.scss";
import Logo from "../../../assets/Logo.png";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { createOrder } from "@/store/slices/orderSlice";

export const CreateOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { creating, createError } = useAppSelector((state) => state.orders);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    // Обработка загрузки фото
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages((prev) => [...prev, ...files]);

            // Создаём превью
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewUrls((prev) => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Подготовка FormData (если бэк принимает multipart/form-data)
        const formData = new FormData();
        formData.append("category", category);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("address", address);
        images.forEach((image) => {
            formData.append("images", image);
        });

        // Или если бэк принимает JSON с base64 или URL — используй этот вариант:
        const payload = {
            category,
            title,
            description,
            address,
            imageUrls: previewUrls, // временно — пока бэк не примет файлы
        };

        const result = await dispatch(createOrder(payload));

        if (createOrder.fulfilled.match(result)) {
            // Успешно — переходим в список заказов клиента
            navigate("/client");
        }
        // Если ошибка — она уже в createError, покажем ниже формы
    };

    return (
        <div className={styles.createOrderPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Создание заказа</h1>
            </header>

            <main className={styles.main}>
                <form onSubmit={handleSubmit}>
                    <Card className={styles.formCard}>
                        {/* Категория */}
                        <div className={styles.formGroup}>
                            <label>Категория услуги *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                disabled={creating}
                            >
                                <option value="">Выберите категорию</option>
                                <option value="Ремонт бытовой техники">Бытовая техника</option>
                                <option value="Сантехника">Сантехника</option>
                                <option value="Электрика">Электрика</option>
                                <option value="Другое">Другое</option>
                            </select>
                        </div>

                        {/* Название */}
                        <div className={styles.formGroup}>
                            <label>Название заказа *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Например: Стиральная машина не сливает воду"
                                required
                                disabled={creating}
                            />
                        </div>

                        {/* Описание */}
                        <div className={styles.formGroup}>
                            <label>Описание проблемы *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Опишите подробно: марку, модель, симптомы поломки..."
                                rows={5}
                                required
                                disabled={creating}
                            />
                        </div>

                        {/* Адрес */}
                        <div className={styles.formGroup}>
                            <label>Адрес *</label>
                            <div className={styles.addressInput}>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="г. Бишкек, ул. Исанова, 105"
                                    required
                                    disabled={creating}
                                />
                                <button type="button" className={styles.mapButton}>
                                    <MapPin size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Фото */}
                        <div className={styles.formGroup}>
                            <label>Фото (до 5 шт., необязательно)</label>
                            <div className={styles.photoUpload}>
                                <label className={styles.uploadButton}>
                                    <Camera size={24} />
                                    <span>Добавить фото</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        disabled={creating || images.length >= 5}
                                        style={{ display: "none" }}
                                    />
                                </label>

                                <div className={styles.previewGrid}>
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className={styles.previewItem}>
                                            <img src={url} alt={`Превью ${index + 1}`} />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className={styles.removeImage}
                                                disabled={creating}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {images.length >= 5 && (
                                    <p className={styles.limitText}>Максимум 5 фото</p>
                                )}
                            </div>
                        </div>

                        {/* Ошибка создания */}
                        {createError && (
                            <div className={styles.errorMessage}>
                                {createError}
                            </div>
                        )}
                    </Card>

                    {/* Кнопка отправки */}
                    <div className={styles.submitSection}>
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            className={styles.submitButton}
                            disabled={creating || !title || !description || !category || !address}
                        >
                            {creating ? (
                                <>
                                    {/* <Spinner size="small" /> */}
                                    Создание...
                                </>
                            ) : (
                                "Создать заказ"
                            )}
                        </Button>
                    </div>
                </form>
            </main>

            <Navigation role="client" />
        </div>
    );
};
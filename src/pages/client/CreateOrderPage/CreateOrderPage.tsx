/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigation, Card, Button } from "../../../shared/ui";
import { Link, useNavigate } from "react-router-dom";
import { Camera, MapPin, X, Loader } from "lucide-react";
import styles from "./CreateOrderPage.module.scss";
import Logo from "../../../assets/Logo.png";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useState } from "react";
import { createOrder } from "@/store/slices/orderSlice";
import { getOrderImageUploadUrl } from "@/store/slices/filesSlice";

export const CreateOrderPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { creating, createError } = useAppSelector((state) => state.orders);
    const filesState = useAppSelector((state) => state.files);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]); // Здесь будут objectName'ы из MinIO
    const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Локальные превью для отображения
    const [uploadingImages, setUploadingImages] = useState<boolean[]>([]); // Статус загрузки для каждого фото

    // Загрузка фото в MinIO (POST с FormData, как в профиле)
    const uploadImageToMinIO = async (file: File): Promise<string> => {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

        try {
            // Получаем метаданные для загрузки (URL и fields)
            const meta = await dispatch(getOrderImageUploadUrl({ extension })).unwrap();

            console.log("📤 Загружаем фото в MinIO:", meta);

            // СОЗДАЁМ FORM DATA
            const fd = new FormData();

            // Добавляем ВСЕ поля из meta.fields
            Object.entries(meta.fields).forEach(([key, value]) => {
                fd.append(key, value);
            });

            // Добавляем файл последним
            fd.append("file", file);

            // ОТПРАВЛЯЕМ POST ЗАПРОС (НЕ PUT!)
            const uploadRes = await fetch(meta.url, {
                method: "POST",
                body: fd,
                // НЕ СТАВИМ headers! Браузер сам добавит boundary
            });

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text().catch(() => "");
                throw new Error(`Upload failed: ${uploadRes.status} ${errorText}`);
            }

            console.log("✅ Фото успешно загружено, objectName:", meta.objectName);
            return meta.objectName; // Возвращаем objectName для отправки на бэкенд
        } catch (error) {
            console.error("❌ Ошибка загрузки фото:", error);
            throw error;
        }
    };

    // Обработка выбора файлов
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        // Проверка на максимум 5 фото
        if (imageUrls.length + newFiles.length > 5) {
            alert("Максимум 5 фото");
            return;
        }

        // Добавляем статусы загрузки для новых файлов
        setUploadingImages((prev) => [...prev, ...newFiles.map(() => true)]);

        // Создаем локальные превью
        newFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Загружаем каждый файл в MinIO
        const uploadPromises = newFiles.map(async (file, idx) => {
            try {
                const objectName = await uploadImageToMinIO(file);
                return { objectName, index: idx };
            } catch (error) {
                console.error("Ошибка загрузки файла:", file.name);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);

        // Обновляем статусы загрузки (все завершены)
        setUploadingImages((prev) => prev.map(() => false));

        // Добавляем успешно загруженные objectName'ы
        const successfulUploads = results
            .filter((result): result is { objectName: string; index: number } => result !== null)
            .map((result) => result.objectName);

        setImageUrls((prev) => [...prev, ...successfulUploads]);

        // Если есть неудачные загрузки, показываем сообщение
        if (successfulUploads.length < newFiles.length) {
            alert(`Загружено ${successfulUploads.length} из ${newFiles.length} фото`);
        }

        // Очищаем input, чтобы можно было выбрать те же файлы снова
        e.target.value = "";
    };

    // Удаление фото
    const removeImage = (index: number) => {
        setImageUrls((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setUploadingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!category || !title || !description || !address) {
            alert("Заполните все обязательные поля");
            return;
        }

        // Проверяем, что все фото загружены
        if (uploadingImages.some((status) => status)) {
            alert("Дождитесь загрузки всех фото");
            return;
        }

        const payload = {
            category,
            title,
            description,
            address,
            imageUrls: imageUrls, // Отправляем objectName'ы из MinIO
        };

        console.log("📦 Отправка заказа:", payload);

        const result = await dispatch(createOrder(payload));

        if (createOrder.fulfilled.match(result)) {
            alert("✅ Заказ успешно создан!");
            navigate("/client");
        }
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
                <form onSubmit={handleSubmit} className={styles.orderForm}>
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
                                        disabled={
                                            creating ||
                                            imageUrls.length >= 5 ||
                                            uploadingImages.some((status) => status)
                                        }
                                        style={{ display: "none" }}
                                    />
                                </label>

                                <div className={styles.previewGrid}>
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className={styles.previewItem}>
                                            <img src={url} alt={`Превью ${index + 1}`} />
                                            {uploadingImages[index] ? (
                                                <div className={styles.uploadingOverlay}>
                                                    <Loader size={20} className={styles.spinner} />
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className={styles.removeImage}
                                                    disabled={creating}
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {imageUrls.length >= 5 && <p className={styles.limitText}>Максимум 5 фото</p>}
                            </div>
                        </div>

                        {/* Ошибка */}
                        {createError && <div className={styles.errorMessage}>{createError}</div>}
                    </Card>

                    {/* Кнопка отправки */}
                    <div className={styles.submitSection}>
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            disabled={
                                creating ||
                                !title ||
                                !description ||
                                !category ||
                                !address ||
                                uploadingImages.some((status) => status)
                            }
                        >
                            {creating ? "Создание..." : "Создать заказ"}
                        </Button>
                    </div>
                </form>
            </main>

            <Navigation role="client" />
        </div>
    );
};

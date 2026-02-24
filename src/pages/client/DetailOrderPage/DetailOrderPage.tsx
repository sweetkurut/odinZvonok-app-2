import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchOrderById } from "@/store/slices/orderSlice";
import { getAvatarDownloadUrl } from "@/store/slices/filesSlice";
import { Navigation, Card } from "@/shared/ui";
import Loader from "@/shared/ui/Loader/Loader";
import styles from "./style.module.scss";
import Logo from "@/assets/Logo.png";
import { MapPin, Clock, ChevronLeft, ChevronRight, X, User, Camera } from "lucide-react";

export const DetailOrderPage = () => {
    const { id } = useParams<{ id: string }>(); // ← ПОЛУЧАЕМ ID ИЗ URL
    const dispatch = useAppDispatch();
    const { orderDetails, loading, error } = useAppSelector((state) => state.orders);
    const role = useAppSelector((state) => state.auth.user?.role);

    // Состояние для галереи
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    // Состояние для загруженных URL фото
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);

    // 🟢 ЗАГРУЖАЕМ ДАННЫЕ ПО ID
    useEffect(() => {
        if (id) {
            dispatch(fetchOrderById(id));
        }
    }, [dispatch, id]);

    // Загружаем временные ссылки для фото заказа
    useEffect(() => {
        const loadImageUrls = async () => {
            if (!orderDetails?.imageUrls || orderDetails.imageUrls.length === 0) {
                setImageUrls([]);
                return;
            }

            setLoadingImages(true);
            try {
                const urls = await Promise.all(
                    orderDetails.imageUrls.map(async (objectName) => {
                        try {
                            if (objectName.startsWith("http")) {
                                return objectName + `?t=${Date.now()}`;
                            }
                            const url = await dispatch(getAvatarDownloadUrl(objectName)).unwrap();
                            return url + `?t=${Date.now()}`;
                        } catch (e) {
                            console.error("Ошибка загрузки фото:", objectName, e);
                            return null;
                        }
                    }),
                );

                const validUrls = urls.filter((url): url is string => url !== null);
                setImageUrls(validUrls);
            } catch (e) {
                console.error("Ошибка загрузки фото заказа:", e);
            } finally {
                setLoadingImages(false);
            }
        };

        loadImageUrls();
    }, [orderDetails?.imageUrls, dispatch]);

    // Загружаем фото мастера
    const [masterPhotoUrl, setMasterPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadMasterPhoto = async () => {
            const masterPhoto = orderDetails?.master?.profile_photo_url;
            if (!masterPhoto) {
                setMasterPhotoUrl(null);
                return;
            }

            try {
                if (masterPhoto.startsWith("http")) {
                    setMasterPhotoUrl(masterPhoto + `?t=${Date.now()}`);
                } else {
                    const url = await dispatch(getAvatarDownloadUrl(masterPhoto)).unwrap();
                    setMasterPhotoUrl(url + `?t=${Date.now()}`);
                }
            } catch (e) {
                console.error("Ошибка загрузки фото мастера:", e);
                setMasterPhotoUrl(null);
            }
        };

        loadMasterPhoto();
    }, [orderDetails?.master?.profile_photo_url, dispatch]);

    if (loading || !orderDetails) {
        return <Loader />;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const order = orderDetails;

    // Функции для навигации по галерее
    const openGallery = (index: number) => setSelectedImageIndex(index);
    const closeGallery = () => setSelectedImageIndex(null);
    const nextImage = () => {
        if (selectedImageIndex !== null && imageUrls.length > 0) {
            setSelectedImageIndex((selectedImageIndex + 1) % imageUrls.length);
        }
    };
    const prevImage = () => {
        if (selectedImageIndex !== null && imageUrls.length > 0) {
            setSelectedImageIndex((selectedImageIndex - 1 + imageUrls.length) % imageUrls.length);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <Link to="/client/orders" className={styles.backLink}>
                    <img src={Logo} alt="Назад" />
                </Link>
                <h1>Заказ</h1>
                <div className={styles.headerRight}></div>
            </header>

            <main className={styles.main}>
                <Card className={styles.mainCard}>
                    <div className={styles.statusWrapper}>
                        <div className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                            {getStatusText(order.status)}
                        </div>
                    </div>

                    {/* Галерея фото */}
                    {loadingImages ? (
                        <div className={styles.loadingPhotos}>
                            <Loader size={32} className={styles.spinner} />
                            <span>Загрузка фото...</span>
                        </div>
                    ) : imageUrls.length > 0 ? (
                        <div className={styles.gallery}>
                            <div className={styles.mainPhoto} onClick={() => openGallery(0)}>
                                <img
                                    src={imageUrls[0]}
                                    alt="Фото заказа"
                                    onError={(e) => {
                                        console.log("Ошибка загрузки фото:", imageUrls[0]);
                                        (e.target as HTMLImageElement).style.display = "none";
                                        (e.target as HTMLImageElement).parentElement?.classList.add(
                                            styles.photoError,
                                        );
                                    }}
                                />
                                {imageUrls.length > 1 && (
                                    <div className={styles.photoCount}>+{imageUrls.length - 1}</div>
                                )}
                            </div>

                            {imageUrls.length > 1 && (
                                <div className={styles.thumbnails}>
                                    {imageUrls.slice(1, 5).map((url, index) => (
                                        <div
                                            key={index}
                                            className={styles.thumbnail}
                                            onClick={() => openGallery(index + 1)}
                                        >
                                            <img
                                                src={url}
                                                alt={`Фото ${index + 2}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                    (
                                                        e.target as HTMLImageElement
                                                    ).parentElement?.classList.add(styles.photoError);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.noPhoto}>
                            <Camera size={32} />
                            <span>Нет фото</span>
                        </div>
                    )}

                    <h2 className={styles.title}>{order.title}</h2>

                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <MapPin size={18} className={styles.metaIcon} />
                            <span>{order.address}</span>
                        </div>

                        <div className={styles.metaItem}>
                            <Clock size={18} className={styles.metaIcon} />
                            <span>{formatDate(order.created_at)}</span>
                        </div>
                    </div>

                    {order.description && (
                        <div className={styles.description}>
                            <h4>Описание</h4>
                            <p>{order.description}</p>
                        </div>
                    )}
                </Card>

                {order.master && (
                    <Card className={styles.masterCard}>
                        <h3 className={styles.sectionTitle}>Ваш мастер</h3>
                        <div className={styles.master}>
                            <div className={styles.avatar}>
                                {masterPhotoUrl ? (
                                    <img
                                        src={masterPhotoUrl}
                                        alt={order.master.fullName}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = "none";
                                            (e.target as HTMLImageElement).parentElement?.classList.add(
                                                styles.avatarFallback,
                                            );
                                        }}
                                    />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <div className={styles.masterInfo}>
                                <div className={styles.masterName}>{order.master.fullName}</div>
                                <div className={styles.masterSub}>Назначен на заказ</div>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* Модалка галереи */}
            {selectedImageIndex !== null && (
                <div className={styles.galleryModal} onClick={closeGallery}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeGallery}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalImageContainer}>
                            <img
                                src={imageUrls[selectedImageIndex]}
                                alt={`Фото ${selectedImageIndex + 1}`}
                                className={styles.modalImage}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                                }}
                            />
                        </div>

                        {imageUrls.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navButton} ${styles.prevButton}`}
                                    onClick={prevImage}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className={`${styles.navButton} ${styles.nextButton}`}
                                    onClick={nextImage}
                                >
                                    <ChevronRight size={24} />
                                </button>
                                <div className={styles.imageCounter}>
                                    {selectedImageIndex + 1} / {imageUrls.length}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <Navigation role="client" />
        </div>
    );
};

const getStatusText = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "Завершён";
        case "CANCELLED":
            return "Отменён";
        case "IN_PROGRESS":
            return "В работе";
        case "PENDING_ASSIGNMENT":
            return "Ожидает мастера";
        default:
            return status;
    }
};

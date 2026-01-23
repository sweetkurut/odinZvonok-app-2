import { Navigation, Card } from "../../../shared/ui";
import { Check } from "lucide-react";
import styles from "./TariffPage.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { useEffect } from "react";
import { fetchTariffs } from "@/store/slices/tariffSlice";
import { TariffCardSkeleton } from "@/shared/ui/TariffCardSkeleton/TariffCardSkeleton";

export const TariffPage = () => {
    const dispatch = useAppDispatch();
    const { tariffs, loading, isInitialLoading } = useAppSelector((state) => state.tariffs);

    useEffect(() => {
        if (isInitialLoading) {
            dispatch(fetchTariffs());
        }
    }, [dispatch, isInitialLoading]);

    if (isInitialLoading && loading) {
        return (
            <div className={styles.tariffPage}>
                <header className={styles.header}>
                    <Link to="/client">
                        <img src={Logo} alt="Логотип" />
                    </Link>
                    <h1>Тариф</h1>
                </header>

                <main className={styles.main}>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <TariffCardSkeleton key={i} />
                    ))}
                </main>

                <Navigation role="client" />
            </div>
        );
    }

    return (
        <div className={styles.tariffPage}>
            <header className={styles.header}>
                <Link to={"/client"}>
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Тариф</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.tariffsList}>
                    {tariffs?.map((tariff) => (
                        <Card
                            key={tariff.id}
                            className={`${styles.tariffCard} ${tariff.active ? styles.active : ""}`}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.overline}>ТАРИФ</span>
                                    <h3 className={styles.tariffName}>{tariff.name}</h3>
                                </div>
                                <div className={styles.priceWrapper}>
                                    <span className={styles.priceValue}>{tariff.price} Сом</span>
                                    <span className={styles.pricePeriod}>/мес</span>
                                </div>
                            </div>

                            <p className={styles.description}>{tariff.description}</p>

                            <div className={styles.featuresList}>
                                {tariff.features.map((feature, index) => (
                                    <div key={index} className={styles.featureItem}>
                                        <div className={styles.checkIconWrapper}>
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`${styles.actionButton} ${tariff.active ? styles.activeButton : ""}`}
                            >
                                {tariff.active ? "Активен" : "Не активен"}
                            </button>
                        </Card>
                    ))}
                    {/* {!loading && tariffs.length === 0 && (
                        <p style={{ textAlign: "center", color: "#868e96" }}>Тарифы недоступны</p>
                    )} */}
                </div>
            </main>

            <Navigation role="client" />
        </div>
    );
};

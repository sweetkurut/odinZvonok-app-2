import styles from "./TariffCardSkeleton.module.scss";

export const TariffCardSkeleton = () => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <div className={styles.overline} />
                    <div className={styles.title} />
                </div>
                <div className={styles.price} />
            </div>

            <div className={styles.description} />
            <div className={styles.descriptionShort} />

            <div className={styles.features}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={styles.feature} />
                ))}
            </div>

            <div className={styles.button} />
        </div>
    );
};

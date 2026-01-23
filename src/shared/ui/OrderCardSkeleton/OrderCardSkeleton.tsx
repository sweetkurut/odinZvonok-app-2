import styles from "./OrderCardSkeleton.module.scss";

export const OrderCardSkeleton = () => {
    return (
        <div className={styles.card}>
            <div className={styles.topRow}>
                <div className={styles.title} />
                <div className={styles.status} />
            </div>

            <div className={styles.description} />
            <div className={styles.descriptionShort} />

            <div className={styles.address} />

            <div className={styles.bottomRow}>
                <div className={styles.date} />
                <div className={styles.master} />
            </div>
        </div>
    );
};

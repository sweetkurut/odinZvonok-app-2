import styles from "./MasterCardSkeleton.module.scss";

const MasterCardSkeleton = () => {
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <div className={styles.avatar} />

                <div className={styles.details}>
                    <div className={styles.lineLg} />
                    <div className={styles.lineSm} />
                    <div className={styles.lineXs} />
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.icon} />
                <div className={styles.icon} />
                <div className={styles.button} />
            </div>
        </div>
    );
};

export default MasterCardSkeleton;

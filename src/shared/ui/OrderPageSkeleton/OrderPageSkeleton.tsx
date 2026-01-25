import { Card } from "@/shared/ui";
import styles from "./OrderPageSkeleton.module.scss";

export const OrderPageSkeleton = () => {
    return (
        <div className={styles.orderPage}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.back} />
                <div className={styles.title} />
            </div>

            <div className={styles.main}>
                {/* Order card */}
                <Card className={styles.orderCard}>
                    <div className={styles.image} />

                    <div className={styles.tag} />
                    <div className={styles.h2} />

                    <div className={styles.description}>
                        <div />
                        <div />
                        <div />
                    </div>

                    <div className={styles.details}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={styles.detail}>
                                <div className={styles.label} />
                                <div className={styles.value} />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Masters list */}
                <Card className={styles.masters}>
                    <div className={styles.h3} />

                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.masterCard}>
                            <div className={styles.masterTop}>
                                <div className={styles.avatar} />
                                <div className={styles.masterInfo}>
                                    <div className={styles.lineShort} />
                                    <div className={styles.lineTiny} />
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <div className={styles.icon} />
                                <div className={styles.icon} />
                                <div className={styles.button} />
                            </div>
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

import styles from "./ProfileSkeleton.module.scss";

export const ProfileSkeleton = () => {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.logo} />
                <div className={styles.title} />
            </header>

            <main className={styles.main}>
                <div className={styles.userCard}>
                    <div className={styles.avatar} />
                    <div className={styles.name} />
                    <div className={styles.role} />
                    <div className={styles.button} />
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionTitle} />
                    <div className={styles.contact} />
                    <div className={styles.contact} />
                </div>

                <div className={styles.logoutButton} />
            </main>
        </div>
    );
};

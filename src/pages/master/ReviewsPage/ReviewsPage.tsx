import { Link } from "react-router-dom";
import styles from "./Reviews.module.scss";
import Logo from "../../../assets/Logo.png";
import { Navigation } from "@/shared/ui";

const ReviewsPage = () => {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/master"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    <h1 className={styles.userName}>Отзывы</h1>
                </div>
            </header>
            <h4>Отзывы</h4>

            <Navigation role="master" />
        </div>
    );
};

export default ReviewsPage;

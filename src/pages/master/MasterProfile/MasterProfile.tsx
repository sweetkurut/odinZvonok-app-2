import { Navigation } from "@/shared/ui";
import styles from "./MasterProfile.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";

const MasterProfile = () => {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.userInfo}>
                    <Link to={"/master"}>
                        <img src={Logo} alt="" />
                    </Link>
                </div>
                <div>
                    <h1 className={styles.userName}>Профиль</h1>
                </div>
            </header>

            <h2>профыль</h2>
            <Navigation role="master" />
        </div>
    );
};

export default MasterProfile;

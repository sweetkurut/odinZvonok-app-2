import { Button, Navigation } from "@/shared/ui";
import styles from "./MastersListPage.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo.png";
import { useEffect, useMemo, useState } from "react";
import MasterCardSkeleton from "@/shared/ui/MasterCardSkeleton/MasterCardSkeleton";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchMasters } from "@/store/slices/masterSlice";

const MastersListPage = () => {
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [minRating, setMinRating] = useState(0);
    // const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    const { masters, loading } = useAppSelector((state) => state.masters);

    useEffect(() => {
        dispatch(fetchMasters());
    }, [dispatch]);

    // useEffect(() => {
    //     const timer = setTimeout(() => setLoading(false), 1200);
    //     return () => clearTimeout(timer);
    // }, []);

    const filteredMasters = useMemo(() => {
        return masters?.filter((m) => {
            if (category !== "all" && !m.specializations?.includes(category)) return false;

            // статус
            if (status !== "all") {
                const uiStatus = m.status === "AVAILABLE" ? "free" : "busy";
                if (uiStatus !== status) return false;
            }

            // рейтинг
            if ((m.rating ?? 0) < minRating) return false;

            return true;
        });
    }, [masters, category, status, minRating]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <Link to="/client">
                    <img src={Logo} alt="Логотип" />
                </Link>
                <h1>Список мастеров</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.mastersList}>
                    <div className={styles.filters}>
                        <select onChange={(e) => setCategory(e.target.value)}>
                            <option value="all">Все категории</option>
                            <option value="Бытовая техника">Бытовая техника</option>
                            <option value="Электрика">Электрика</option>
                            <option value="Сантехника">Сантехника</option>
                        </select>

                        <select onChange={(e) => setStatus(e.target.value)}>
                            <option value="all">Все статусы</option>
                            <option value="free">Свободен</option>
                            <option value="busy">Занят</option>
                        </select>

                        <select onChange={(e) => setMinRating(Number(e.target.value))}>
                            <option value="0">Любой рейтинг</option>
                            <option value="4.5">4.5+</option>
                            <option value="4.8">4.8+</option>
                        </select>
                    </div>

                    <div className={styles.grid}>
                        {loading
                            ? Array.from({ length: 4 }).map((_, idx) => <MasterCardSkeleton key={idx} />)
                            : filteredMasters?.map((master) => {
                                  const isFree = master.status === "AVAILABLE";

                                  return (
                                      <div key={master.id} className={styles.masterCard}>
                                          <div className={styles.masterTop}>
                                              <div className={styles.masterAvatar}>
                                                  {master.fullName
                                                      .split(" ")
                                                      .map((n) => n[0])
                                                      .join("")}
                                              </div>

                                              <div className={styles.masterDetails}>
                                                  <h4>{master.fullName}</h4>

                                                  <div className={styles.masterMeta}>
                                                      <span className={styles.rating}>
                                                          ★ {master.rating || "Нет рейтинга"}
                                                      </span>
                                                      <span className={styles.category}>
                                                          {master.specializations || "Без категории"}
                                                      </span>
                                                  </div>

                                                  <span
                                                      className={`${styles.masterStatus} ${
                                                          isFree ? styles.free : styles.busy
                                                      }`}
                                                  >
                                                      {isFree ? "Готов принять заказ" : "Недоступен"}
                                                  </span>
                                              </div>
                                          </div>

                                          <div className={styles.masterActions}>
                                              {/* <div className={styles.iconButton}>
                                                  <Phone size={16} />
                                              </div>

                                              <div className={styles.iconButton}>
                                                  <MessageCircle size={16} />
                                              </div> */}

                                              <Button
                                                  variant="primary"
                                                  size="small"
                                                  className={styles.assignButton}
                                                  disabled={!isFree}
                                              >
                                                  Назначить
                                              </Button>
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>
                </div>
            </main>

            <Navigation role="operator" />
        </div>
    );
};

export default MastersListPage;

import { useState } from 'react';
import { Navigation, Card, Button } from '../../../shared/ui';
import { User } from 'lucide-react';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>М</div>
          <span className={styles.userName}>Мастер</span>
        </div>
      </header>

      <main className={styles.main}>
        <Card className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>
              <User size={32} />
            </div>
            <div className={styles.profileInfo}>
              <h2>Профиль пользователя</h2>
              <div className={styles.profileDetails}>
                <span>Alex Alexandr • 4.7 ⭐</span>
                <span>Бытовая техника • Сантехника</span>
                <span>Занятость: Сейчас свободен</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <h3>Статус занятости мастера</h3>
          </div>
          
          <div className={styles.statusToggle}>
            <span>Выберите свой статус</span>
            <div className={styles.availabilityButtons}>
              <Button 
                variant={isAvailable ? "secondary" : "primary"}
                size="small"
                onClick={() => setIsAvailable(false)}
              >
                Не доступен
              </Button>
              <Button 
                variant={isAvailable ? "primary" : "secondary"}
                size="small"
                onClick={() => setIsAvailable(true)}
              >
                Доступен
              </Button>
            </div>
          </div>
        </Card>

        <Card className={styles.currentOrderCard}>
          <h3>Текущий вызов</h3>
          <div className={styles.orderFilters}>
            <select className={styles.filterSelect}>
              <option>Для всех профессий</option>
              <option>Электрика</option>
              <option>Сантехника</option>
              <option>Бытовая техника</option>
            </select>
            <select className={styles.filterSelect}>
              <option>Адрес: Все области</option>
              <option>Бишкек</option>
              <option>Ош</option>
            </select>
          </div>

          <div className={styles.callDetails}>
            <div className={styles.callInfo}>
              <div className={styles.callMeta}>
                <span className={styles.distance}>3 км от вас</span>
                <span className={styles.time}>История заказа</span>
                <button className={styles.phoneButton}>📞</button>
              </div>
              <div className={styles.callDescription}>
                <h4>Фильтр</h4>
                <div className={styles.callButtons}>
                  <button className={styles.actionButton}>❌ Не интересно</button>
                  <button className={styles.actionButton}>⭐ Мне нравится</button>
                  <button className={styles.actionButton}>✅ Принять</button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <Navigation role="master" />
    </div>
  );
};
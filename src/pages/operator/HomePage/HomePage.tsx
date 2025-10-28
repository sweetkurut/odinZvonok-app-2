import { Navigation, Card, Button } from '../../../shared/ui';
import { useNavigate } from 'react-router-dom';
import { Clock, User, MapPin } from 'lucide-react';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  const navigate = useNavigate();

  const currentOrders = [
    {
      id: '1',
      title: 'Ремонт бытовой техники',
      client: 'Alex Master',
      address: 'ул. Советская, 15',
      time: '4:1 ○',
      category: 'Бытовая техника'
    },
    {
      id: '2',
      title: 'Сантехника',
      client: 'Alex Master',
      address: 'ул. Советская, 15',
      time: '4:1 ○',
      category: 'Сантехника'
    },
    {
      id: '3',
      title: 'Электрика',
      client: 'Alex Master',
      address: 'ул. Советская, 15',
      time: '4:1 ○',
      category: 'Электрика'
    }
  ];

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>О</div>
          <span className={styles.userName}>Оператор</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.filters}>
          <Button variant="primary" size="small">Все категории</Button>
          <Button variant="secondary" size="small">Бытовая</Button>
          <Button variant="secondary" size="small">Сантех</Button>
        </div>

        <section className={styles.currentOrders}>
          <h2>Текущие сделки</h2>
          
          {currentOrders.map((order) => (
            <Card 
              key={order.id} 
              className={styles.orderCard}
              onClick={() => navigate(`/operator/order/${order.id}`)}
            >
              <div className={styles.orderHeader}>
                <h3>{order.category}</h3>
                <span className={styles.orderTime}>
                  <Clock size={14} />
                  {order.time}
                </span>
              </div>
              
              <div className={styles.orderInfo}>
                <div className={styles.clientInfo}>
                  <User size={16} />
                  <span>{order.client}</span>
                </div>
                <div className={styles.addressInfo}>
                  <MapPin size={16} />
                  <span>{order.address}</span>
                </div>
              </div>

              <div className={styles.orderActions}>
                <Button variant="primary" size="small">
                  Подробнее
                </Button>
              </div>
            </Card>
          ))}
        </section>
      </main>

      <Navigation role="operator" />
    </div>
  );
};
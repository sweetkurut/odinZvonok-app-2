import { Navigation, Card, Button } from '../../../shared/ui';
import { Check } from 'lucide-react';
import styles from './TariffPage.module.scss';

export const TariffPage = () => {
  const tariffs = [
    {
      id: 'standard',
      name: 'ТАРИФ «СТАНДАРТ»',
      price: '2000 сом',
      period: 'ежемесячно',
      features: [
        'Диагностика',
        'Электрика',
        'Монтажные работы',
        'Каркас Бытовой техники',
        'Другие и закуки'
      ],
      color: '#333'
    },
    {
      id: 'premium',
      name: 'ТАРИФ «ПРЕМИУМ»',
      price: '3000 сом',
      period: 'ежемесячно',
      features: [
        'Диагностика',
        'Электрика',
        'Монтажные работы',
        'Каркас Бытовой техники',
        'Другие и закуки',
        'Приоритетное обслуживание',
        'Скидки до 50%',
        'Без выезда и диагностики',
        'VIP статус'
      ],
      color: '#0088cc',
      recommended: true
    }
  ];

  return (
    <div className={styles.tariffPage}>
      <header className={styles.header}>
        <h1>Мой тариф</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.tariffsList}>
          {tariffs.map((tariff) => (
            <Card 
              key={tariff.id} 
              className={`${styles.tariffCard} ${tariff.recommended ? styles.recommended : ''}`}
            >
              {tariff.recommended && (
                <div className={styles.recommendedBadge}>
                  Рекомендуемый
                </div>
              )}
              
              <div className={styles.tariffHeader}>
                <h3 style={{ color: tariff.color }}>{tariff.name}</h3>
                <div className={styles.tariffPrice}>
                  <span className={styles.price}>{tariff.price}</span>
                  <span className={styles.period}>{tariff.period}</span>
                </div>
              </div>

              <div className={styles.tariffFeatures}>
                {tariff.features.map((feature, index) => (
                  <div key={index} className={styles.feature}>
                    <Check size={16} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={styles.tariffActions}>
                <Button 
                  variant={tariff.recommended ? "primary" : "secondary"}
                  size="medium"
                >
                  {tariff.id === 'premium' ? 'Активировать' : 'Выбрать тариф'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.currentTariff}>
          <Card className={styles.currentCard}>
            <h3>Текущий тариф</h3>
            <p>ТАРИФ «СТАНДАРТ»</p>
            <div className={styles.tariffDetails}>
              <div className={styles.detail}>
                <span>Активен до:</span>
                <span>25.02.2024</span>
              </div>
              <div className={styles.detail}>
                <span>Остается дней:</span>
                <span>15</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Navigation role="client" />
    </div>
  );
};
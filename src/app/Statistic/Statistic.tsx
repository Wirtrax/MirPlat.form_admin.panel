import s from './Statistic.module.scss';
// 1. Локальные модули — компоненты
import StatCard from '../../components/StatCard/StatCard';

// 2. Локальные модули — типы
import type { StatisticCardProps } from './statisticCardProps';

// 3. Ассеты
import UsersIcon from '../../assets/ico/admin/users.svg?react';
import GameIcon from '../../assets/ico/admin/game.svg?react';
import AllOrderIcon from '../../assets/ico/admin/allOrder.svg?react';

function Statistic({ totalUser, waitingAttempt, waitingOrder }: StatisticCardProps) {
  return (
    <section className={s['stat-card__container']}>
      <StatCard icon={<AllOrderIcon />} value={waitingOrder} title="Заказов в ожидании" />
      <StatCard
        className={s['stat-card--deafult-blue']}
        icon={<GameIcon />}
        value={waitingAttempt}
        title="Попыток в играх"
      />
      <StatCard className={s['stat-card--dark-blue']} icon={<UsersIcon />} value={totalUser} title="Всего участников" />
    </section>
  );
}

export default Statistic;

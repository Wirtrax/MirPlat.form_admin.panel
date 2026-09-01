import s from './AdminLayout.module.scss';

import SideBar from '../components/SideBar/SideBar';

import UsersIcon from '../assets/ico/admin/users.svg?react';
import GameIcon from '../assets/ico/admin/game.svg?react';
import ProductIcon from '../assets/ico/admin/product.svg?react';
import AllOrderIcon from '../assets/ico/admin/allOrder.svg?react';
import LogoIcon from '../assets/ico/app/plat.romIco.png?url';
import { Outlet } from 'react-router-dom';
import { downloadXLSXFile } from '../service/api';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useEffect } from 'react';
import { fetchUserStatistic } from '../service/features/userStatistic/userStatisticSlice';
import { fetchAttemptStatistic } from '../service/features/attemptStatistic/attemptStatisticSlice';
import { fetchOrderStatistic } from '../service/features/orderStatistic/orderStatisticSlice';
import { unsetSuperAdmin } from '../service/features/superAdmin/superAdminSlice';
import { TOKEN_STORAGE_KEY } from '../service/utils/authToken';
import Statistic from './Statistic/Statistic';
import { fetchItemStatistic } from '../service/features/itemStatistic/itemStatisticSlice';

interface AdminLayoutProps {}

const AdminLayout: React.FC<AdminLayoutProps> = () => {
  const dispatch = useAppDispatch();

  const totalUser = useAppSelector((state) => state.userStatistic.data.totalUser);
  const waitingAttempt = useAppSelector((state) => state.attemptStatistic.data.waitingAttempts);
  const waitingOrder = useAppSelector((state) => state.orderStatistic.data.waitingOrder);
  const totalItem = useAppSelector((state) => state.itemStatistic.data.totalItem);

  useEffect(() => {
    dispatch(fetchUserStatistic());
    dispatch(fetchAttemptStatistic());
    dispatch(fetchOrderStatistic());
    dispatch(fetchItemStatistic());
  }, [dispatch]);

  const handleDownload = async () => {
    const blob = await downloadXLSXFile();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'отчет.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    dispatch(unsetSuperAdmin());
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  return (
    <div className={s['wrapper']}>
      <SideBar
        logo={LogoIcon}
        title="Leska"
        subtitle="ADMIN PANEL"
        navItems={[
          { label: 'Пользователи', path: '/admin_panel/users', count: totalUser, icon: <UsersIcon /> },
          { label: 'Товары', path: '/admin_panel/items', count: totalItem, icon: <ProductIcon /> },
          { label: 'Все заказы', path: '/admin_panel/orders', count: waitingOrder, icon: <AllOrderIcon /> },
          { label: 'Участники игр', path: '/admin_panel/attempts', count: waitingAttempt, icon: <GameIcon /> },
        ]}
        adminName="Админ Дежурный"
        adminRole="Суперадмин"
        adminAvatar="АД"
        onDownloadReport={handleDownload}
        onLogout={handleLogout}
      />
      <main className={s['main']}>
        <Statistic totalUser={totalUser} waitingAttempt={waitingAttempt} waitingOrder={waitingOrder} />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

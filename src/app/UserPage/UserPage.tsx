import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import { useEffect, useState } from 'react';
import type { AttemptsTypeFullInformation, OrderResponseByUserId, User } from '../../types/apiType';
import { getAllAttemptsByUser, getAllOrdersByUser, getUser, updateUser, updateUserRole } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import s from './UserPage.module.scss';
import SelectAdmin from '../../components/Select/SelectAdmin';
import { specializationOptions } from '../../constants/specializationOptions';
import { levelOptions } from '../../constants/programmingLeveloptions';
import ChekboxAdmin from '../../components/Chekbox/ChekboxAdmin';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { generateBlueGray } from '../../utils/generateBlueGray';
import Coin from '../../assets/ico/interface/currency.svg?react';

function UserPage() {
  const { id } = useParams();
  const userId = Number(id);
  const [user, setUser] = useState<User>();
  const [userOrders, setUserOrders] = useState<OrderResponseByUserId[]>([]);
  const [userAttempts, setUserAttempts] = useState<AttemptsTypeFullInformation[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    patronym: '',
    telegram_id: '',
    email: '',
    specialization: '',
    programming_level: '',
    phone_number: '',
    balance: 0,
    profile_picture: '',
    send_notifications: false,
    is_admin: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
        setFormData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          patronym: userData.patronym || '',
          telegram_id: userData.telegram_id || '',
          specialization: userData.specialization || '',
          programming_level: userData.programming_level || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          balance: userData.balance || 0,
          profile_picture: userData.profile_picture || '',
          send_notifications: userData.send_notifications || false,
          is_admin: userData.is_admin || false,
        });

        try {
          const userDataByOrders = await getAllOrdersByUser(userId);
          if (userDataByOrders) setUserOrders(userDataByOrders);
        } catch (error) {
          console.log('Заказы не найдены');
          setUserOrders([]);
        }

        try {
          const userDataByAttempts = await getAllAttemptsByUser(userId);
          if (userDataByAttempts) setUserAttempts(userDataByAttempts);
        } catch (error) {
          console.log('Попытки не найдены');
          setUserAttempts([]);
        }
      } catch (error) {
        console.log('пользователь не найден');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    const type = 'type' in e.target ? e.target.type : undefined;
    const checked = 'checked' in e.target ? e.target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedUserData: User = {
        ...user,
        ...formData,
        balance: Number(formData.balance),
      };

      const updateFullUser = await updateUser(user.id, updatedUserData);
      const updateStatusUser = await updateUserRole(user.id, { isAdmin: updatedUserData.is_admin });
      console.log('роль успешно сменена', updateStatusUser);
      console.log('данные обновлены успешно', updateFullUser);
      setUser(updatedUserData);
    } catch (error) {
      console.log('ошибка обновления', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>{getFirstLetters(`${user.first_name} ${user.last_name}`)}</dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__full-name']}>
                {user.first_name} {user.last_name} {user.patronym}
              </dt>
              <dd className={s['substrate__details']}>
                {user.specialization} {user.programming_level} {user.id}
              </dd>
            </dl>
          </dd>
        </dl>
      </SubstrateForUser>
      <div className={s['container']}>
        <SubstrateForFrom title="Данные пользователя">
          <form className={s['form']}>
            <AdminInput
              label="Имя"
              value={formData.first_name}
              onChange={handleChange}
              name="first_name"
              type="text"
              placeholder="Имя"
            />
            <AdminInput
              label="Фамилия"
              value={formData.last_name}
              onChange={handleChange}
              name="last_name"
              type="text"
              placeholder="Фамилия"
            />
            <AdminInput
              label="Отчество"
              value={formData.patronym}
              onChange={handleChange}
              name="patronym"
              type="text"
              placeholder="Отчество"
            />
            <AdminInput
              label="Telegram ID"
              value={formData.telegram_id}
              onChange={handleChange}
              name="telegram_id"
              type="text"
              placeholder="Telegram ID"
              disabled
            />
            <SelectAdmin
              label="Специализация"
              options={specializationOptions}
              name="specialization"
              onChange={handleChange}
              value={formData.specialization}
            />
            <SelectAdmin
              label="Уровень программирования"
              options={levelOptions}
              name="programming_level"
              onChange={handleChange}
              value={formData.programming_level}
            />
            <AdminInput
              label="Email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Email"
            />
            <AdminInput
              label="Телефон"
              value={formData.phone_number}
              onChange={handleChange}
              name="phone_number"
              type="tel"
              placeholder="Телефон"
            />
            <AdminInput
              label="Баланс баллов"
              value={formData.balance}
              onChange={handleChange}
              name="balance"
              type="number"
              placeholder="Баланс баллов"
            />
            <AdminInput
              label="Фото профиля (URL)"
              value={formData.profile_picture}
              onChange={handleChange}
              name="profile_picture"
              type="text"
              placeholder="Фото профиля (URL)"
            />
            <div className={s['form__checkbox-panel']}>
              <ChekboxAdmin
                label="Уведомления"
                subtitle="Получать уведомления в Telegram"
                name="send_notifications"
                isCheck={formData.send_notifications}
                onChange={handleChange}
              />
              <span className={s['form__line']}></span>
              <ChekboxAdmin
                label="Права администратора"
                subtitle="Доступ к админ-панели"
                name="is_admin"
                isCheck={formData.is_admin}
                onChange={handleChange}
              />
            </div>
          </form>
          <AdminButton type="submit" disabled={isSubmitting} className={s['form__button']} onClick={handleSubmit}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </AdminButton>
        </SubstrateForFrom>

        <SubstrateForFrom title="Заказы" count={userOrders.length}>
          <ul className={s['orders-list']}>
            {userOrders.length > 0 ? (
              userOrders.slice(0, 7).map((order) => (
                <li className={s['orders-list__item']}>
                  <div className={s['orders-list__info']}>
                    <span className={s['orders-list__initials']} style={{ background: generateBlueGray() }}>
                      <img src={order.itemImage} alt="" />
                    </span>
                    <p className={s['orders-list__customer']}>
                      {order.itemName}
                      <span className={s['orders-list__order-number']}>#{order.orderId}</span>
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <p> пользователь еще не покупал товары </p>
            )}
          </ul>
        </SubstrateForFrom>

        <SubstrateForFrom title="Попытки в играх" count={userAttempts.length}>
          <ul className={s['orders-list']}>
            {userAttempts.length > 0 ? (
              userAttempts.slice(0, 7).map((attempt) => (
                <li className={s['orders-list__item']}>
                  <div className={s['orders-list__info']}>
                    <p className={s['orders-list__customer']}>
                      {attempt.activityName}
                      <span className={s['orders-list__attempt-result']}>
                        {attempt.attemptStatus} · {attempt.reward} <Coin />
                      </span>
                    </p>
                  </div>
                  <span className={s['orders-list__status']}>
                    <StatusBadge
                      variant={
                        attempt.attemptStatus == 'waiting'
                          ? 'pending'
                          : attempt.attemptStatus == 'accepted'
                            ? 'received'
                            : 'cancelled'
                      }
                    />
                  </span>
                </li>
              ))
            ) : (
              <p> пользователь еще не учавствовал в играх</p>
            )}
          </ul>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default UserPage;

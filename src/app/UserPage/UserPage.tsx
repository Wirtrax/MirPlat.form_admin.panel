import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
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
import ChekboxAdmin from '../../components/Chekbox/CheckboxAdmin';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { generateBlueGray } from '../../utils/generateBlueGray';
import Coin from '../../assets/ico/interface/currency.svg?react';
import { toast } from 'sonner';

const schema = yup.object({
  first_name: yup.string().trim().required('Укажите имя'),
  last_name: yup.string().trim().required('Укажите фамилию'),
  patronym: yup.string().trim().required(),
  specialization: yup.string().required('Выберите специализацию'),
  programming_level: yup.string().required('Выберите уровень'),
  email: yup.string().trim().email('Некорректный email').required('Укажите email'),
  phone_number: yup.string().trim().required(),
  balance: yup.number().typeError('Введите число').min(0, 'Не может быть отрицательным').required('Укажите баланс'),
  send_notifications: yup.boolean().required(),
  is_admin: yup.boolean().required(),
});

type FormValues = yup.InferType<typeof schema>;

const defaultValues: FormValues = {
  first_name: '',
  last_name: '',
  patronym: '',
  specialization: '',
  programming_level: '',
  email: '',
  phone_number: '',
  balance: 0,
  send_notifications: false,
  is_admin: false,
};

function UserPage() {
  const { id } = useParams();
  const userId = Number(id);
  const [user, setUser] = useState<User>();
  const [userOrders, setUserOrders] = useState<OrderResponseByUserId[]>([]);
  const [userAttempts, setUserAttempts] = useState<AttemptsTypeFullInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await getUser(userId);
        setUser(userData);
        reset({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          patronym: userData.patronym || '',
          specialization: userData.specialization || '',
          programming_level: userData.programming_level || '',
          email: userData.email || '',
          phone_number: userData.phone_number || '',
          balance: userData.balance || 0,
          send_notifications: userData.send_notifications || false,
          is_admin: userData.is_admin || false,
        });

        try {
          const userDataByOrders = await getAllOrdersByUser(userId);
          if (userDataByOrders) setUserOrders(userDataByOrders);
        } catch (error) {
          setUserOrders([]);
        }

        try {
          const userDataByAttempts = await getAllAttemptsByUser(userId);
          if (userDataByAttempts) setUserAttempts(userDataByAttempts);
        } catch (error) {
          setUserAttempts([]);
        }
      } catch (error) {
        toast.error('пользователь не найдет');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      const updatedUserData: User = { ...user, ...values };

      const updateFullUser = await updateUser(user.id, updatedUserData);
      const updateStatusUser = await updateUserRole(user.id, { isAdmin: updatedUserData.is_admin });

      if (updateFullUser.success && updateStatusUser.success) {
        toast.success(`пользователь ${updatedUserData.last_name} обновлен`);
      }

      setUser(updatedUserData);
    } catch (error) {
      toast.error('ошибка при обновлении пользователя');
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return <div>Пользователь не найден</div>;
  }

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
            <div>
              <AdminInput label="Имя" type="text" placeholder="Имя" {...register('first_name')} />
              {errors.first_name && <p className={s['form__error']}>{errors.first_name.message}</p>}
            </div>

            <div>
              <AdminInput label="Фамилия" type="text" placeholder="Фамилия" {...register('last_name')} />
              {errors.last_name && <p className={s['form__error']}>{errors.last_name.message}</p>}
            </div>

            <div>
              <AdminInput label="Отчество" type="text" placeholder="Отчество" {...register('patronym')} />
              {errors.patronym && <p className={s['form__error']}>{errors.patronym.message}</p>}
            </div>

            <AdminInput
              label="Telegram ID"
              defaultValue={user.telegram_id}
              name="telegram_id"
              type="number"
              placeholder="Telegram ID"
              disabled
            />

            <Controller
              name="specialization"
              control={control}
              render={({ field, fieldState }) => (
                <SelectAdmin
                  {...field}
                  label="Специализация"
                  options={specializationOptions}
                  name="specialization"
                  error={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              name="programming_level"
              control={control}
              render={({ field, fieldState }) => (
                <SelectAdmin
                  {...field}
                  label="Уровень программирования"
                  options={levelOptions}
                  name="programming_level"
                  error={fieldState.error?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <div>
              <AdminInput label="Email" type="email" placeholder="Email" {...register('email')} />
              {errors.email && <p className={s['form__error']}>{errors.email.message}</p>}
            </div>

            <div>
              <AdminInput label="Телефон" type="tel" placeholder="Телефон" {...register('phone_number')} />
              {errors.phone_number && <p className={s['form__error']}>{errors.phone_number.message}</p>}
            </div>

            <div>
              <AdminInput label="Баланс баллов" type="number" placeholder="Баланс баллов" {...register('balance')} />
              {errors.balance && <p className={s['form__error']}>{errors.balance.message}</p>}
            </div>

            <div className={s['form__checkbox-panel']}>
              <ChekboxAdmin
                label="Уведомления"
                subtitle="Получать уведомления в Telegram"
                isCheck={watch('send_notifications')}
                {...register('send_notifications')}
              />
              <span className={s['form__line']}></span>
              <ChekboxAdmin
                label="Права администратора"
                subtitle="Доступ к админ-панели"
                isCheck={watch('is_admin')}
                {...register('is_admin')}
              />
            </div>
          </form>
          <AdminButton
            type="submit"
            disabled={isSubmitting}
            className={s['form__button']}
            onClick={handleSubmit(onSubmit)}>
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

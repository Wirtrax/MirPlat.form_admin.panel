// 1. Сторонние библиотеки
import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';

// 2. Локальные модули — компоненты
import Input from '../../components/Input/AdminInput';
import AdminButton from '../../components/AdminButton/AdminButton';

// 3. Локальные модули — сервисы и утилиты
import { adminLogin } from '../../service/api';
import { setSuperAdmin, unsetSuperAdmin } from '../../service/features/superAdmin/superAdminSlice';
import { useAppDispatch } from '../../hooks/redux';

// 4. Локальные модули — типы
import type { AdminLoginFormProps } from './adminLoginFormProps';

// 5. Ассеты
import Shild from '../../assets/ico/interface/shild.svg?react';

// 6. Стили
import s from './AdminLoginForm.module.scss';
import { ROUTES } from '../../constants/routes';

const schema = yup.object({
  login: yup.string().trim().required('введите логин'),
  password: yup.string().trim().required('введите пароль'),
});

type FormValues = yup.InferType<typeof schema>;

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ className = '' }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { login: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (value: FormValues) => {
    try {
      await adminLogin(value.login, value.password);
      dispatch(setSuperAdmin(true));
      navigate(ROUTES.USER, { replace: true });
    } catch (err) {
      setError('root.serverError', { type: 'auth', message: 'неверный логин или пароль' });
      dispatch(unsetSuperAdmin());
    }
  };

  return (
    <div className={`${s['admin-login']} ${className}`}>
      <div className={s['admin-login__card']}>
        <div className={s['admin-login__illustration']}>
          <div className={s['admin-login__illustration-circle']}>
            <Shild className={s['admin-login__illustration-icon']} />
          </div>

          <span className={`${s['admin-login__shape']} ${s['admin-login__shape--circle']}`} />
          <span className={`${s['admin-login__shape']} ${s['admin-login__shape--triangle']}`} />
          <span className={`${s['admin-login__shape']} ${s['admin-login__shape--square']}`} />
        </div>

        <form className={s['admin-login__form']} onSubmit={handleSubmit(onSubmit)}>
          <h1 className={s['admin-login__title']}>Вход в панель</h1>
          <p className={s['admin-login__subtitle']}>Доступ только для администраторов</p>

          <div className={s['admin-login__fields']}>
            <Input
              label="Логин"
              placeholder="Введите логин"
              type="text"
              autoComplete="username"
              disabled={isSubmitting}
              {...register('login')}
            />
            {errors.login && <p className={s['admin-login__error']}>{errors.login.message}</p>}

            <Input
              label="Пароль"
              placeholder="Введите пароль"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              {...register('password')}
            />
            {errors.password && <p className={s['admin-login__error']}>{errors.password.message}</p>}
          </div>

          {errors.root?.serverError && <p className={s['admin-login__error']}>{errors.root.serverError.message}</p>}

          <AdminButton type="submit" disabled={isSubmitting} className={s['admin-login__submit']}>
            {isSubmitting ? 'Вход...' : 'Войти'}
          </AdminButton>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;

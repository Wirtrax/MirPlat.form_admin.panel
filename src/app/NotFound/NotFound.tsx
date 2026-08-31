import s from './NotFoundPage.module.scss';

import mascot_404 from '../../assets/mascot/mascot_404.webp';

import { Link } from 'react-router-dom';

import AdminButton from '../../components/AdminButton/AdminButton';

export default function NotFound() {
  return (
    <main className={s.error}>
      <h1 className={s.error__title}>404</h1>

      <p className={s.error__text}>Страница не найдена</p>

      <Link to={'/admin_panel/users'}>
        <AdminButton>НА ГЛАВНУЮ</AdminButton>
      </Link>
      <img className={s.error__image} src={mascot_404} alt="mascot" />
    </main>
  );
}

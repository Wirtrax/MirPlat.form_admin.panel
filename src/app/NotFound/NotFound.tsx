import s from './NotFoundPage.module.scss';

import mascot_404 from '../../assets/mascot/mascot_404.webp';

import AdminButton from '../../components/AdminButton/AdminButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className={s.error}>
      <h1 className={s.error__title}>404</h1>

      <p className={s.error__text}>Страница не найдена</p>

      <AdminButton
        onClick={() => {
          navigate(ROUTES.USER);
        }}>
        НА ГЛАВНУЮ
      </AdminButton>

      <img className={s.error__image} src={mascot_404} alt="mascot" />
    </main>
  );
}

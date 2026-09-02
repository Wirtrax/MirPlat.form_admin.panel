// 1. Сторонние библиотеки
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// 2. Локальные модули — компоненты
import AdminButton from '../../components/AdminButton/AdminButton';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import SelectAdmin from '../../components/Select/SelectAdmin';
import StatusBadge from '../../components/StatusBadge/StatusBadge';

// 3. Локальные модули — сервисы и утилиты
import { getAttempt, updateAttepmt } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';
import { attemptStatusOptions } from '../../constants/attemptStatusOptions';
import { useAppDispatch } from '../../hooks/redux';
import { decreaseWaitingAttempts } from '../../service/features/attemptStatistic/attemptStatisticSlice';

// 4. Локальные модули — типы
import type { AttemptsTypeFullInformation, AttemptStatus } from '../../types/apiType';

// 5. Ассеты
import Coin from '../../assets/ico/interface/currency.svg?react';

// 6. Стили
import s from './AttemptPage.module.scss';

function AttemptPage() {
  const { id } = useParams();
  const attemptId = Number(id);
  const dispatch = useAppDispatch();

  const [attempt, setAttempt] = useState<AttemptsTypeFullInformation | null>(null);
  const [status, setStatus] = useState<AttemptStatus>('waiting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accepted = attempt?.attemptStatus === 'accepted' || attempt?.attemptStatus === 'declined';

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const data = await getAttempt(attemptId);
        setAttempt(data);
        setStatus(data.attemptStatus);
      } catch (error) {
        toast.error('не удалось загрузить попытку');
        setAttempt(null);
      }
    };

    fetchAttempt();
  }, [attemptId]);

  if (!attempt) {
    return <div>Попытка не найдена</div>;
  }

  const handleStatusChange = (e: { target: { name: string; value: string } }) => {
    setStatus(e.target.value as AttemptStatus);
  };

  const handleSave = async () => {
    if (attempt.attemptStatus === status) {
      toast.info('Статус не изменился');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateAttepmt(attempt.attemptId, { attemptStatus: status });
      if (response.success) {
        toast.success('статус попытки успешно обновлен');
        setAttempt((prev) => {
          if (prev === null) return prev;
          return { ...prev, attemptStatus: status };
        });
        dispatch(decreaseWaitingAttempts());
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>{getFirstLetters(attempt.userFullName, 2)}</dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__full-name']}>{attempt.userFullName}</dt>
              <dd className={s['substrate__details']}>
                <span>ID #{attempt.attemptId}</span>
              </dd>
            </dl>
          </dd>
        </dl>
      </SubstrateForUser>

      <div className={s['content']}>
        <SubstrateForFrom title="Результат игры">
          <div className={s['game-result']}>
            {attempt.link && (
              <>
                <img src={attempt.link} alt="Скриншот поля Tetris" className={s['game-result__image']} />
                <span className={s['game-result__caption']}>скриншот поля Tetris · попытка #{attempt.attemptId}</span>
              </>
            )}
          </div>
        </SubstrateForFrom>

        <SubstrateForFrom title="Информация о попытке">
          <div className={s['attempt-info']}>
            <span className={s['attempt-info__label']}>Активность</span>
            <p className={s['attempt-info__value']}>{attempt.activityName}</p>

            <span className={s['attempt-info__label']}>Статус</span>
            <StatusBadge
              variant={
                attempt.attemptStatus == 'accepted'
                  ? 'received'
                  : attempt.attemptStatus == 'declined'
                    ? 'cancelled'
                    : 'pending'
              }
            />

            <span className={s['attempt-info__label']}>Награда</span>
            <p className={s['attempt-info__value']}>
              +{attempt.reward} <Coin />
            </p>

            <SelectAdmin
              label="Изменить статус"
              name="status"
              value={status}
              onChange={handleStatusChange}
              options={attemptStatusOptions}
              disabled={accepted}
            />

            <AdminButton onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </AdminButton>
          </div>
        </SubstrateForFrom>

        <SubstrateForFrom title="Участник">
          <div className={s['participant']}>
            <span className={s['participant__avatar']} style={{ background: generateBlueGray() }}>
              {getFirstLetters(attempt.userFullName, 2)}
            </span>
            <dl className={s['participant__details']}>
              <dt className={s['participant__name']}>{attempt.userFullName}</dt>
              <dd className={s['participant__contact']}>
                {attempt.userEmail} {attempt.userPhoneNumber}
              </dd>
            </dl>
          </div>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default AttemptPage;

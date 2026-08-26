import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import SelectAdmin from '../../components/Select/SelectAdmin';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { useEffect, useState } from 'react';
import type { AttemptsTypeFullInformation, AttemptStatus } from '../../types/apiType';
import { getAttempt } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';
import { attemptStatusOptions } from '../../constants/attemptStatusOptions';
import s from './AttemptPage.module.scss';

function AttemptPage() {
  const { id } = useParams();
  const attemptId = Number(id);

  const [attempt, setAttempt] = useState<AttemptsTypeFullInformation | null>(null);
  const [status, setStatus] = useState<AttemptStatus>('waiting');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const data = await getAttempt(attemptId);
        setAttempt(data);
        setStatus(data.status);
      } catch (error) {
        console.log('попытка не найдена');
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
    setIsSubmitting(true);
    try {
      console.log('сохранение статуса попытки', attempt.id, status);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>{getFirstLetters(attempt.full_name)}</dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__full-name']}>{attempt.full_name}</dt>
              <dd className={s['substrate__details']}>
                <span>ID #{attempt.id}</span>
              </dd>
            </dl>
          </dd>
        </dl>
      </SubstrateForUser>

      <div className={s['content']}>
        <SubstrateForFrom title="Результат игры">
          <div className={s['game-result']}>
            <img src={attempt.link} alt="Скриншот поля Tetris" className={s['game-result__image']} />
            <span className={s['game-result__caption']}>скриншот поля Tetris · попытка #{attempt.id}</span>
          </div>
        </SubstrateForFrom>

        <SubstrateForFrom title="Информация о попытке">
          <div className={s['attempt-info']}>
            <span className={s['attempt-info__label']}>Активность</span>
            <p className={s['attempt-info__value']}>{attempt.activity}</p>

            <span className={s['attempt-info__label']}>Статус</span>
            {/* <StatusBadge status={attempt.status} /> */}

            <span className={s['attempt-info__label']}>Награда</span>
            <p className={s['attempt-info__value']}>+{attempt.reward} ★</p>

            <SelectAdmin
              label="Изменить статус"
              name="status"
              value={status}
              onChange={handleStatusChange}
              options={attemptStatusOptions}
            />

            <AdminButton onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </AdminButton>
          </div>
        </SubstrateForFrom>

        <SubstrateForFrom title="Участник">
          <div className={s['participant']}>
            <span className={s['participant__avatar']} style={{ background: generateBlueGray() }}>
              {getFirstLetters(attempt.full_name)}
            </span>
            <dl className={s['participant__details']}>
              <dt className={s['participant__name']}>{attempt.full_name}</dt>
              <dd className={s['participant__contact']}>{attempt.userEmail}</dd>
              <dd className={s['participant__contact']}>{attempt.userPhoneNumber}</dd>
            </dl>
          </div>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default AttemptPage;

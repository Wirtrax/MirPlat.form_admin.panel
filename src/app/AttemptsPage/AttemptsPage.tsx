// 1. Сторонние библиотеки
import { useEffect, useState, type ChangeEvent } from 'react';

// 2. Локальные модули — компоненты
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Loader from '../../components/Loader/Loader';

// 3. Локальные модули — сервисы и утилиты
import { getAttempts } from '../../service/api';
import debounce from '../../utils/debounse';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';

// 4. Локальные модули — типы
import type { TableColumn } from '../../components/Table/tableProps';
import type { AttemptsType } from '../../types/apiType';

// 5. Ассеты
import Coin from '../../assets/ico/interface/currency.svg?react';

// 6. Стили
import s from './AttemptsPage.module.scss';
import pageStyle from '../Page.module.scss';
import { ROUTES } from '../../constants/routes';

function AttemptsPage() {
  const [attempts, setAttempts] = useState<AttemptsType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchattempts = async () => {
      try {
        setIsLoading(true);
        const data = await getAttempts();
        setAttempts(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchattempts();
  }, []);

  const debouncedSetSearch = debounce((value: string) => {
    setDebouncedSearchValue(value);
  }, 300);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSetSearch(value);
  };

  const filteredAttempts = attempts.filter((item) =>
    item.userFullName.toLocaleLowerCase().includes(debouncedSearchValue.toLocaleLowerCase())
  );

  const columns: TableColumn<AttemptsType>[] = [
    {
      key: 'userFullName',
      title: 'Участник',
      render: (_, item) => {
        return (
          <span className={s['table__name']}>
            <span style={{ background: generateBlueGray() }} className={s['table__name-initial']}>
              {getFirstLetters(`${item.userFullName}`, 2)}
            </span>
            <span className={s['table__full-name']}>{item.userFullName}</span>
          </span>
        );
      },
    },
    {
      key: 'activityName',
      title: 'Активность',
    },
    {
      key: 'attemptStatus',
      title: 'Статус',
      render: (_, item) => {
        return (
          <StatusBadge
            variant={
              item.attemptStatus == 'accepted' ? 'received' : item.attemptStatus == 'declined' ? 'cancelled' : 'pending'
            }
          />
        );
      },
    },
    {
      key: 'reward',
      title: 'Награда',
      render: (_, item) => {
        return (
          <span className={s['table__reward']}>
            +{item.reward} <Coin />
          </span>
        );
      },
    },
  ];

  return (
    <section>
      <div className={pageStyle['header']}>
        <Title
          title="Участники игр"
          subtitle="Попытки прохождения активностей — нажмите для просмотра результата игры"
        />
        <div className={pageStyle['search']}>
          <Input placeholder="поиск по названию" type="search" value={searchValue} onChange={handleSearch} />
        </div>
      </div>
      {isLoading && <Loader />}
      <Table
        title="Каталог"
        countElements={`${attempts.length} позиций`}
        columns={columns}
        data={filteredAttempts}
        link={(attempts) => `${ROUTES.ATTEMPTS}/${attempts.attemptId}`}
      />
    </section>
  );
}

export default AttemptsPage;

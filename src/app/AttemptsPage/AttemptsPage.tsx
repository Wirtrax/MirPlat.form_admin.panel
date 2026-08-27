import { useEffect, useState, type ChangeEvent } from 'react';
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { getAttempts } from '../../service/api';
import type { TableColumn } from '../../components/Table/tableProps';
import s from './AttemptsPage.module.scss';
import pageStyle from '../Page.module.scss';
import { useNavigate } from 'react-router-dom';
import debounce from '../../utils/debounse';
import type { AttemptsType } from '../../types/apiType';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';
import Coin from '../../assets/ico/interface/currency.svg?react';

function AttemptsPage() {
  const [attempts, setAttempts] = useState<AttemptsType[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchattempts = async () => {
      setLoading(true);
      try {
        const data = await getAttempts();
        console.log(data);
        setAttempts(data);
      } catch (error) {
      } finally {
        setLoading(false);
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
      <Table
        title="Каталог"
        countElements={`${attempts.length} позиций`}
        columns={columns}
        data={filteredAttempts}
        link={(attempts) => `/admin/attempts/${attempts.attemptId}`}
      />
    </section>
  );
}

export default AttemptsPage;

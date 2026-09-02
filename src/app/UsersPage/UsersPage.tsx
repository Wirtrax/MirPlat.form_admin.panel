// 1. Сторонние библиотеки
import { useEffect, useState, useMemo, type ChangeEvent } from 'react';
import clsx from 'clsx';

// 2. Локальные модули — компоненты
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import Loader from '../../components/Loader/Loader';

// 3. Локальные модули — сервисы и утилиты
import { getUsers } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';
import debounce from '../../utils/debounse';

// 4. Локальные модули — типы
import type { User } from '../../types/apiType';
import type { TableColumn } from '../../components/Table/tableProps';

// 5. Стили
import s from './UsersPage.module.scss';
import pageStyle from '../Page.module.scss';
import { ROUTES } from '../../constants/routes';

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const debouncedSetSearch = debounce((value: string) => {
    setDebouncedSearchValue(value);
  }, 300);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    debouncedSetSearch(value);
  };

  const filteredUsers = useMemo(() => {
    const searchValue = debouncedSearchValue.toLocaleLowerCase().trim();

    if (!searchValue) return users;

    return users.filter((user) => {
      const fields = [user.last_name, user.first_name, user.patronym, user.phone_number, user.email];
      return fields.some((field) => field?.toLocaleLowerCase().includes(searchValue));
    });
  }, [users, debouncedSearchValue]);

  const columns: TableColumn<User>[] = [
    {
      key: 'first_name',
      title: 'ФИО',
      render: (_, item) => {
        return (
          <span className={s['table__initials']}>
            <span style={{ backgroundColor: generateBlueGray() }} className={s['table__initials-letter']}>
              {getFirstLetters(`${item.last_name} ${item.first_name}`)}
            </span>
            <span>
              <span className={s['table__initials-name']}>
                {item.last_name} {item.first_name}
              </span>
              <span className={s['table__initials-patronym']}> {item.patronym}</span>
            </span>
          </span>
        );
      },
    },
    {
      key: 'specialization',
      title: 'Специализация',
    },
    {
      key: 'programming_level',
      title: 'Уровень',
      render: (_, item) => {
        return <span className={s['table__programming-level']}>{item.programming_level}</span>;
      },
    },
    {
      key: 'email',
      title: 'Контакты',
      render: (_, item) => {
        return (
          <span>
            <span className={s['table__contacts-email']}>{item.email}</span>
            <span className={s['table__contacts-phone']}> {item.phone_number}</span>
          </span>
        );
      },
    },
    {
      key: 'balance',
      title: 'Баланс',
      render: (_, item) => {
        return <span className={s['table__balance']}>{item.balance}</span>;
      },
    },
    {
      key: 'is_admin',
      title: 'Роль',
      render: (_, item) => {
        return (
          <span className={clsx(s['table__role'], item.is_admin && s['table__role--admin'])}>
            {item.is_admin ? 'Admin' : 'User'}
          </span>
        );
      },
    },
  ];

  return (
    <section>
      <div className={pageStyle['header']}>
        <Title title="Пользователи" subtitle="Нажмите на участника, чтобы открыть его страницу и изменить данные" />
        <div className={pageStyle['search']}>
          <Input placeholder="поиск по имени, email, телефон..." type="search" onChange={handleSearch} />
        </div>
      </div>
      {isLoading && <Loader />}
      <Table
        title="Список пользователей"
        countElements={`${users.length} записей`}
        columns={columns}
        data={filteredUsers}
        link={(user) => `${ROUTES.USER}/${user.id}`}
      />
    </section>
  );
}

export default UsersPage;

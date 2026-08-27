import { useEffect, useState, useMemo, type ChangeEvent } from 'react';
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import type { User } from '../../types/apiType';
import { getUsers } from '../../service/api';
import type { TableColumn } from '../../components/Table/tableProps';
import s from './UsersPage.module.scss';
import pageStyle from '../Page.module.scss';
import clsx from 'clsx';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';
import debounce from '../../utils/debounse';

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
      } finally {
        setLoading(false);
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
      const fields = [user.patronym, user.phone_number, user.email];
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
      <Table
        title="Список пользователей"
        countElements={`${users.length} записей`}
        columns={columns}
        data={filteredUsers}
        link={(user) => `/admin/user/${user.id}`}
      />
    </section>
  );
}

export default UsersPage;

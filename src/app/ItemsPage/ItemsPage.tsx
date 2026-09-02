// 1. Сторонние библиотеки
import { useEffect, useState, type ChangeEvent } from 'react';

// 2. Локальные модули — компоненты
import AdminButton from '../../components/AdminButton/AdminButton';
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import Loader from '../../components/Loader/Loader';

// 3. Локальные модули — страницы
import CreateItemModal from '../CreateItemModal/CreateItemModal';

// 4. Локальные модули — сервисы и утилиты
import { getItems } from '../../service/api';
import debounce from '../../utils/debounse';

// 5. Локальные модули — типы
import type { TableColumn } from '../../components/Table/tableProps';
import type { Product } from '../../types/apiType';

// 6. Стили
import s from './ItemsPage.module.scss';
import pageStyle from '../Page.module.scss';
import { ROUTES } from '../../constants/routes';

function ItemsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await getItems();
        setItems(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleItemCreated = (newItem: Product) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const debouncedSetSearch = debounce((value: string) => {
    setDebouncedSearchValue(value);
  }, 300);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchValue(value);
    debouncedSetSearch(value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLocaleLowerCase().includes(debouncedSearchValue.toLocaleLowerCase())
  );

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      title: 'Название',
      render: (_, item) => {
        return <span className={s['table__name']}>{item.name}</span>;
      },
    },
    {
      key: 'description',
      title: 'Описание',
    },
    {
      key: 'quantity',
      title: 'Количество на складе',
      render: (_, item) => {
        return <span className={s['table__quantity']}>{item.quantity > 0 ? item.quantity : 'нет в наличии'}</span>;
      },
    },
    {
      key: 'price',
      title: 'Цена',
      render: (_, item) => {
        return <span className={s['table__price']}>{item.price}</span>;
      },
    },
    {
      key: 'is_active',
      title: 'Статус активности',
      render: (_, item) => {
        return <StatusBadge variant={item.is_active ? 'active' : 'hidden'} />;
      },
    },
  ];

  return (
    <section>
      <div className={pageStyle['header']}>
        <Title title="Товары" subtitle="Каталог наград, доступных за баллы — нажмите на товар для редактирования" />
        <div className={pageStyle['search']}>
          <Input placeholder="поиск по названию" type="search" value={searchValue} onChange={handleSearch} />
          <AdminButton withPlus onClick={() => setIsCreateModalOpen(true)}>
            добавить товар
          </AdminButton>
        </div>
      </div>
      {isLoading && <Loader />}
      <Table
        title="Каталог"
        countElements={`${items.length} позиций`}
        columns={columns}
        data={filteredItems}
        link={(items) => `${ROUTES.ITEMS}/${items.id}`}
      />

      {isCreateModalOpen && (
        <CreateItemModal onClose={() => setIsCreateModalOpen(false)} onCreated={handleItemCreated} />
      )}
    </section>
  );
}

export default ItemsPage;

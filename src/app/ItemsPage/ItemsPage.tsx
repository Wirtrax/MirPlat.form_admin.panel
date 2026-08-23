import { useEffect, useState, type ChangeEvent } from 'react';
import AdminButton from '../../components/AdminButton/AdminButton';
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { getItems } from '../../service/api';
import type { TableColumn } from '../../components/Table/tableProps';
import s from './ItemsPage.module.scss';
import pageStyle from '../Page.module.scss';
import type { Product } from '../../types/apiType';
import { useNavigate } from 'react-router-dom';
import CreateItemModal from '../CreateItemModal/CreateItemModal';
import debounce from '../../utils/debounse';

function ItemsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
      } finally {
        setLoading(false);
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
        return (
          <span className={s['table__name']} onClick={() => navigate(`/admin/items/${item.id}`)}>
            {item.name}
          </span>
        );
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
      <Table title="Каталог" countElements={`${items.length} позиций`} columns={columns} data={filteredItems} />

      {isCreateModalOpen && (
        <CreateItemModal onClose={() => setIsCreateModalOpen(false)} onCreated={handleItemCreated} />
      )}
    </section>
  );
}

export default ItemsPage;

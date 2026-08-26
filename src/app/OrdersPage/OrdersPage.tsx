import { useEffect, useState } from 'react';
import Input from '../../components/Input/AdminInput';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import { getOrders } from '../../service/api';
import type { TableColumn } from '../../components/Table/tableProps';
import s from './OrdersPage.module.scss';
import pageStyle from '../Page.module.scss';
import type { OrdersType } from '../../types/apiType';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { getFirstLetters } from '../../utils/firstLetters';
import { generateBlueGray } from '../../utils/generateBlueGray';

function OrdersPage() {
  const [orders, setOrders] = useState<OrdersType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const columns: TableColumn<OrdersType>[] = [
    {
      key: 'orderId',
      title: '№ заказа',
      render: (_, item) => {
        return <span className={s['table__order-id']}>#{item.orderId}</span>;
      },
    },
    {
      key: 'itemName',
      title: 'Товар',
      render: (_, item) => {
        return <span className={s['table__product-name']}>{item.itemName}</span>;
      },
    },
    {
      key: 'userFullName',
      title: 'Участник',
      render: (_, item) => {
        return (
          <div className={s['table__participant']}>
            <span style={{ backgroundColor: generateBlueGray() }} className={s['table__initials']}>
              {getFirstLetters(item.userFullName, 2)}
            </span>
            <span>
              <span className={s['table__participant-name']}>{item.userFullName}</span>
              <span className={s['table__participant-contacts']}>
                {item.userEmail} · {item.userPhoneNumber}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      title: 'Статус',
      render: (_, item) => {
        return (
          <StatusBadge
            variant={item.status == 'waiting' ? 'pending' : item.status == 'received' ? 'received' : 'cancelled'}
          />
        );
      },
    },
  ];

  return (
    <section>
      <div className={pageStyle['header']}>
        <Title
          title="Все заказы"
          subtitle="Каждая строка — отдельная покупка (участник может купить только 1 товар за раз)"
        />
        <div className={pageStyle['search']}>
          <Input placeholder="Поиск по участнику или товару..." type="search" />
        </div>
      </div>
      <Table
        title="Каталог"
        countElements={`${orders.length} позиций`}
        columns={columns}
        data={orders}
        link={(order) => `/admin/orders/${order.orderId}`}
      />
    </section>
  );
}

export default OrdersPage;

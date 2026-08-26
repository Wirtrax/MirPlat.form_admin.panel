import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import { useEffect, useState } from 'react';
import type { OrdersType } from '../../types/apiType';
import { getOrder, updateOrder } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import s from './OrderPage.module.scss';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { generateBlueGray } from '../../utils/generateBlueGray';

function OrderPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const [order, setOrder] = useState<OrdersType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
      } catch (error) {
        console.log('продукт не найден');
        setOrder(null);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return <div>Продукт не найден</div>;
  }

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>
            <img src="" alt="" />
          </dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__name']}>Заказ #{order.orderId}</dt>
              <dd className={s['substrate__details']}>
                {order.itemName} · {order.status}
              </dd>
            </dl>
          </dd>
        </dl>
      </SubstrateForUser>
      <div className={s['Order-info']}>
        <SubstrateForFrom title="Параметры товара">
          <AdminButton type="submit" disabled={isSubmitting} className={s['form__button']}>
            {isSubmitting ? 'Обновление...' : 'Обновить статус'}
          </AdminButton>
        </SubstrateForFrom>

        <SubstrateForFrom title="Покупатель">
          <ul className={s['orders-list']}>
            <li className={s['orders-list__Order']}>
              <div className={s['orders-list__info']}>
                <span className={s['orders-list__initials']} style={{ background: generateBlueGray() }}>
                  {getFirstLetters('покупатель первый')}
                </span>
                <p className={s['orders-list__customer']}>
                  Покупатель <span className={s['orders-list__order-number']}>#номер заказа</span>
                </p>
              </div>
              <span className={s['orders-list__status']}>
                <StatusBadge variant={true ? 'pending' : 'received'} />
              </span>
            </li>
          </ul>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default OrderPage;

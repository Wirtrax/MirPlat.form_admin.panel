import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import SelectAdmin from '../../components/Select/SelectAdmin';
import { useEffect, useState } from 'react';
import type { OneOrderType, PurchaseStatus } from '../../types/apiType';
import { orderStatusOptions } from '../../constants/orderStatusOptions';
import { getOrder, updateOrder } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import s from './OrderPage.module.scss';
import { generateBlueGray } from '../../utils/generateBlueGray';
import { toast } from 'sonner';
import { useAppDispatch } from '../../hooks/redux';
import { decreaseWaitingOrder } from '../../service/features/orderStatistic/orderStatisticSlice';

function OrderPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const dispatch = useAppDispatch();
  const [order, setOrder] = useState<OneOrderType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<PurchaseStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accepted = order?.status === 'received' || order?.status === 'canceled';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data);
        setSelectedStatus(data.status);
      } catch (error) {
        toast.error('не удалось загрузить товар');
        setOrder(null);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = (e: { target: { name: string; value: string } }) => {
    setSelectedStatus(e.target.value as PurchaseStatus);
  };

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;

    setIsSubmitting(true);
    try {
      const response = await updateOrder(order.orderId, { status: selectedStatus });
      if (response.success) {
        toast.success('статус успешно обновлен');
        setOrder((prev) => {
          if (prev === null) return prev;
          return { ...prev, status: selectedStatus };
        });
        dispatch(decreaseWaitingOrder());
      }
    } catch (error) {
      toast.error('ошибка при обновлении статуса');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order || !selectedStatus) {
    return <div>Продукт не найден</div>;
  }

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>
            <img src={order.image} alt="" />
          </dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__name']}>Заказ #{order.orderId}</dt>
              <dd className={s['substrate__details']}>
                {order.itemName} · {orderStatusOptions.find((option) => option.value === order.status)?.label}
              </dd>
            </dl>
          </dd>
        </dl>
      </SubstrateForUser>

      <div className={s['order-info']}>
        <SubstrateForFrom title="Параметры товара">
          <div className={s['product']}>
            <div className={s['product__image']}>
              <img src={order.image} alt="" />
            </div>
            <p className={s['product__name']}>{order.itemName}</p>
          </div>

          <div className={s['status-block']}>
            <span className={s['status-block__label']}>Статус заказа</span>
            <div className={s['status-block__controls']}>
              <SelectAdmin
                options={orderStatusOptions}
                name="status"
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={accepted}
              />
              <AdminButton
                type="submit"
                disabled={isSubmitting}
                className={s['status-block__button']}
                onClick={handleUpdateStatus}>
                {isSubmitting ? 'Обновление...' : 'Обновить статус'}
              </AdminButton>
            </div>
            <span className={s['status-block__endpoint']}>PATCH /admin/orders/{order.orderId}/status</span>
          </div>
        </SubstrateForFrom>

        <SubstrateForFrom title="Покупатель">
          <div className={s['buyer']}>
            <span className={s['buyer__avatar']} style={{ background: generateBlueGray() }}>
              {getFirstLetters(order.userFullName, 2)}
            </span>
            <div className={s['buyer__info']}>
              <p className={s['buyer__name']}>{order.userFullName}</p>
              <p className={s['buyer__contact']}>{order.userEmail}</p>
              <p className={s['buyer__contact']}>{order.userPhoneNumber}</p>
            </div>
          </div>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default OrderPage;

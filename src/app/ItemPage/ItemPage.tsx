import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import { useEffect, useState } from 'react';
import type { OrdersType, Product } from '../../types/apiType';
import { getAllOrdersByItem, getItem, hideItem, updateItem } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import s from './ItemPage.module.scss';
import ChekboxAdmin from '../../components/Chekbox/ChekboxAdmin';
import AdminTextarea from '../../components/AdminTextarea/AdminTextarea';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { generateBlueGray } from '../../utils/generateBlueGray';

function ItemPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [item, setItem] = useState<Product | null>(null);
  const [ordersByItem, setOrdersByItem] = useState<OrdersType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    quantity: 0,
    price: 0,
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItem(productId);
        setItem(data);
        setFormData({
          name: data.name,
          description: data.description,
          image: data.image,
          quantity: data.quantity,
          price: data.price,
          is_active: data.is_active,
        });
      } catch (error) {
        console.log('продукт не найден');
        setItem(null);
      }
    };

    fetchItem();
  }, [productId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllOrdersByItem(productId);
        setOrdersByItem(response);
      } catch (error) {}
    };
    fetchUsers();
  }, []);

  if (!item) {
    return <div>Продукт не найден</div>;
  }

  const handleHiddenItem = async (active: boolean) => {
    try {
      const response = await hideItem(item.id, { is_active: active });
      if (response.success) {
        setItem((prev) => (prev ? { ...prev, is_active: active } : prev));
        setFormData((prev) => ({ ...prev, is_active: active }));
      }
    } catch (error) {
      console.log('ошибка обновления', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = 'type' in e.target ? e.target.type : undefined;
    const checked = 'checked' in e.target ? e.target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedItemData: Product = {
        ...item,
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      const response = await updateItem(item.id, updatedItemData);
      console.log('данные обновлены успешно', response);
      setItem(updatedItemData);
    } catch (error) {
      console.log('ошибка обновления', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <SubstrateForUser className={s['substrate']}>
        <dl className={s['substrate__info-wrapper']}>
          <dt className={s['substrate__avatar']}>
            <img src={item.image} alt="" className={s['substrate__avatar-image']} />
          </dt>
          <dd className={s['substrate__info-container']}>
            <dl className={s['substrate__user-details']}>
              <dt className={s['substrate__name']}>{item.name}</dt>
              <dd className={s['substrate__details']}>
                ID: {item.id} {item.is_active ? 'Активен в каталоге' : 'скрыт'}
              </dd>
            </dl>
          </dd>
        </dl>
        <AdminButton className={s['substrate__hidden-btn']} onClick={() => handleHiddenItem(!item.is_active)}>
          {item.is_active ? 'скрыть' : 'вернуть в продажу'}
        </AdminButton>
      </SubstrateForUser>
      <div className={s['item-info']}>
        <SubstrateForFrom title="Параметры товара">
          <form className={s['form']}>
            <AdminInput
              label="Название"
              value={formData.name}
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="Название"
            />
            <AdminTextarea
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание товара"
            />
            <div className={s['form__input-split']}>
              <AdminInput
                label="Цена"
                value={formData.price}
                onChange={handleChange}
                name="price"
                type="text"
                placeholder="Цена"
              />
              <AdminInput
                label="Остаток на складе"
                value={formData.quantity}
                onChange={handleChange}
                name="quantity"
                type="text"
                placeholder="Остаток на складе"
              />
            </div>
            <AdminInput
              label="Изображение"
              value={formData.image}
              onChange={handleChange}
              name="image"
              type="text"
              placeholder="https://..."
            />
            <div className={s['form__checkbox-panel']}>
              <ChekboxAdmin
                label="Товар активен"
                subtitle="Показывать в каталоге для участников"
                name="is_active"
                isCheck={formData.is_active}
                onChange={handleChange}
              />
            </div>
          </form>
          <AdminButton type="submit" disabled={isSubmitting} className={s['form__button']} onClick={handleSubmit}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </AdminButton>
        </SubstrateForFrom>

        <SubstrateForFrom title="Последние покупки/Куплено раз" count={ordersByItem.length}>
          <ul className={s['orders-list']}>
            {ordersByItem.length > 0 ? (
              ordersByItem.slice(0, 7).map((order) => (
                <li className={s['orders-list__item']}>
                  <div className={s['orders-list__info']}>
                    <span className={s['orders-list__initials']} style={{ background: generateBlueGray() }}>
                      {getFirstLetters(`${order.userFullName}`, 2)}
                    </span>
                    <p className={s['orders-list__customer']}>
                      {order.userFullName}
                      <span className={s['orders-list__order-number']}>#{order.orderId}</span>
                    </p>
                  </div>
                  <span className={s['orders-list__status']}>
                    <StatusBadge
                      variant={
                        order.status == 'waiting' ? 'pending' : order.status == 'received' ? 'received' : 'cancelled'
                      }
                    />
                  </span>
                </li>
              ))
            ) : (
              <p> товар еще не покупали </p>
            )}
          </ul>
        </SubstrateForFrom>
      </div>
    </section>
  );
}

export default ItemPage;

import { useParams } from 'react-router-dom';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import { useEffect, useState } from 'react';
import type { Product } from '../../types/apiType';
import { deleteItem, getItem, hideItem, updateItem } from '../../service/api';
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

  if (!item) {
    return <div>Продукт не найден</div>;
  }

  const handleDeleteItem = async (id: number) => {
    try {
      const response = await deleteItem(id);
      if (response.success) {
        console.log('продукт был удален');
      }
    } catch (error) {
      console.log('ошибка удаления', error);
    }
  };

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
          <dt className={s['substrate__avatar']}>{getFirstLetters(`${item.name}`)}</dt>
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
        <AdminButton className={s['substrate__delete-btn']} onClick={() => handleDeleteItem(item.id)}>
          удалить
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

        <SubstrateForFrom title="Куплено раз" count={7}>
          <ul className={s['orders-list']}>
            <li className={s['orders-list__item']}>
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

export default ItemPage;

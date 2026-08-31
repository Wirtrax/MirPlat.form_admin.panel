import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import SubstrateForUser from '../../components/SubstrateAdmin/SubstrateForUser/SubstrateForUser';
import { useEffect, useState } from 'react';
import type { OrdersType, Product } from '../../types/apiType';
import { getAllOrdersByItem, getItem, hideItem, updateItem } from '../../service/api';
import { getFirstLetters } from '../../utils/firstLetters';
import s from './ItemPage.module.scss';
import ChekboxAdmin from '../../components/Chekbox/CheckboxAdmin';
import AdminTextarea from '../../components/AdminTextarea/AdminTextarea';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { generateBlueGray } from '../../utils/generateBlueGray';
import { toast } from 'sonner';

const schema = yup.object({
  name: yup.string().trim().required('Укажите название товара'),
  description: yup.string().trim().required('Укажите описание товара'),
  image: yup.string().trim().url('Введите корректную ссылку на изображение').required('Укажите изображение'),
  price: yup.number().typeError('Введите число').positive('Цена должна быть больше нуля').required('Укажите цену'),
  quantity: yup
    .number()
    .typeError('Введите число')
    .integer('Целое число')
    .min(0, 'Не может быть отрицательным')
    .required('Укажите остаток на складе'),
  is_active: yup.boolean().required(),
});

type FormValues = yup.InferType<typeof schema>;

const emptyValues: FormValues = {
  name: '',
  description: '',
  image: '',
  quantity: 0,
  price: 0,
  is_active: true,
};

function ItemPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [item, setItem] = useState<Product | null>(null);
  const [ordersByItem, setOrdersByItem] = useState<OrdersType[]>([]);

  const {
    register,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItem(productId);
        setItem(data);
        reset({
          name: data.name,
          description: data.description,
          image: data.image,
          quantity: data.quantity,
          price: data.price,
          is_active: data.is_active,
        });
      } catch (error) {
        toast.error('продукт не найден');
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
  }, [productId]);

  if (!item) {
    return <div>Продукт не найден</div>;
  }

  const handleHiddenItem = async (active: boolean) => {
    try {
      const response = await hideItem(item.id, { is_active: active });
      if (response.success) {
        setItem((prev) => (prev ? { ...prev, is_active: active } : prev));
        setValue('is_active', active, { shouldDirty: false });
        toast.success('видимость товара была изменена');
      }
    } catch (error) {
      toast.error('ошибка при обновлении товара');
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const updatedItemData: Product = { ...item, ...values };

      const response = await updateItem(item.id, updatedItemData);
      if (response.success) {
        toast.success('данные обновлены успешно');
        setItem(updatedItemData);
        reset(values);
      }
    } catch (error) {
      toast.error('ошибка обновления');
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
          <form className={s['form']} onSubmit={handleSubmit(onSubmit)}>
            <div>
              <AdminInput label="Название" type="text" placeholder="Название" {...register('name')} />
              {errors.name && <p className={s['form__error']}>{errors.name.message}</p>}
            </div>

            <div>
              <AdminTextarea label="Описание" placeholder="Описание товара" {...register('description')} />
              {errors.description && <p className={s['form__error']}>{errors.description.message}</p>}
            </div>

            <div className={s['form__input-split']}>
              <div>
                <AdminInput label="Цена" type="text" placeholder="Цена" {...register('price')} />
                {errors.price && <p className={s['form__error']}>{errors.price.message}</p>}
              </div>
              <div>
                <AdminInput
                  label="Остаток на складе"
                  type="text"
                  placeholder="Остаток на складе"
                  {...register('quantity')}
                />
                {errors.quantity && <p className={s['form__error']}>{errors.quantity.message}</p>}
              </div>
            </div>

            <div>
              <AdminInput label="Изображение" type="text" placeholder="https://..." {...register('image')} />
              {errors.image && <p className={s['form__error']}>{errors.image.message}</p>}
            </div>

            <div className={s['form__checkbox-panel']}>
              <ChekboxAdmin
                label="Товар активен"
                subtitle="Показывать в каталоге для участников"
                isCheck={watch('is_active')}
                {...register('is_active')}
              />
            </div>
          </form>
          <AdminButton
            type="submit"
            disabled={isSubmitting}
            className={s['form__button']}
            onClick={handleSubmit(onSubmit)}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
          </AdminButton>
        </SubstrateForFrom>

        <SubstrateForFrom title="Последние покупки/Куплено раз" count={ordersByItem.length}>
          <ul className={s['orders-list']}>
            {ordersByItem.length > 0 ? (
              ordersByItem.slice(0, 7).map((order) => (
                <li className={s['orders-list__item']} key={order.orderId}>
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

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Modal from '../../components/Modal/Modal';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import AdminTextarea from '../../components/AdminTextarea/AdminTextarea';
import ChekboxAdmin from '../../components/Chekbox/ChekboxAdmin';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';
import { craeteItem } from '../../service/api';
import type { Product } from '../../types/apiType';
import s from './CreateItemModal.module.scss';
import type { CreateItemModalProps } from './CreateItemModalProps';

const initialFormData = {
  name: '',
  description: '',
  image: '',
  quantity: 0,
  price: 0,
  is_active: true,
};

function CreateItemModal({ onClose, onCreated }: CreateItemModalProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = 'type' in e.target ? e.target.type : undefined;
    const checked = 'checked' in e.target ? e.target.checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Укажите название товара');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newItemData: Omit<Product, 'id'> = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };

      const response = await craeteItem(newItemData);

      onCreated({ ...newItemData, id: response.id });
      onClose();
    } catch (err) {
      console.log('ошибка создания товара', err);
      setError('не удалось создтаь товар');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <SubstrateForFrom title="Новый товар">
        <form className={s['form']} onSubmit={handleSubmit}>
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

          {error && <p className={s['form__error']}>{error}</p>}

          <AdminButton type="submit" disabled={isSubmitting} className={s['form__button']}>
            {isSubmitting ? 'Создание...' : 'Создать товар'}
          </AdminButton>
        </form>
      </SubstrateForFrom>
    </Modal>
  );
}

export default CreateItemModal;

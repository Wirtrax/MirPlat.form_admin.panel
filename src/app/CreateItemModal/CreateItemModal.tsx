// 1. Сторонние библиотеки
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';

// 2. Локальные модули — компоненты
import Modal from '../../components/Modal/Modal';
import AdminButton from '../../components/AdminButton/AdminButton';
import AdminInput from '../../components/Input/AdminInput';
import AdminTextarea from '../../components/AdminTextarea/AdminTextarea';
import ChekboxAdmin from '../../components/Chekbox/CheckboxAdmin';
import SubstrateForFrom from '../../components/SubstrateAdmin/SubstrateForFrom/SubstrateForFrom';

// 3. Локальные модули — сервисы и утилиты
import { craeteItem } from '../../service/api';
import { useAppDispatch } from '../../hooks/redux';
import { increaseTotalItem } from '../../service/features/itemStatistic/itemStatisticSlice';

// 4. Локальные модули — типы
import type { CreateItemModalProps } from './CreateItemModalProps';

// 5. Стили
import s from './CreateItemModal.module.scss';

const schema = yup.object({
  name: yup.string().trim().required('Укажите название товара'),
  description: yup.string().trim().required('Укажите описание товара'),
  image: yup.mixed<File>().required('Выберите изображение'),
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

const defaultValues = {
  name: '',
  description: '',
  image: undefined,
  quantity: 0,
  price: 0,
  is_active: true,
};

function CreateItemModal({ onClose, onCreated }: CreateItemModalProps) {
  const dispatch = useAppDispatch();

  const {
    control,
    clearErrors,
    register,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const watchedImage = watch('image');
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (watchedImage instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(watchedImage);
    } else {
      setImagePreview('');
    }
  }, [watchedImage]);

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', String(values.price));
      formData.append('quantity', String(values.quantity));
      formData.append('is_active', String(values.is_active));
      if (values.image) {
        formData.append('image', values.image);
      }
      console.log(typeof values.image);

      const response = await craeteItem(formData);
      if (response) {
        onCreated({
          ...values,
          image: response.image,
          id: response.id,
        });
        onClose();
        toast.success('Товар был успешно создан');
        dispatch(increaseTotalItem());
      }
    } catch (err) {
      setError('root.serverError', {
        type: 'server',
        message: 'Не удалось создать товар',
      });
    }
  };

  return (
    <Modal onClose={onClose}>
      <SubstrateForFrom title="Новый товар">
        <form className={s['form']} onSubmit={handleSubmit(onSubmit)}>
          <AdminInput label="Название" type="text" placeholder="Название" {...register('name')} />
          {errors.name && <p className={s['form__error']}>{errors.name.message}</p>}

          <AdminTextarea label="Описание" {...register('description')} placeholder="Описание товара" />
          {errors.description && <p className={s['form__error']}>{errors.description.message}</p>}

          <div className={s['form__input-split']}>
            <div>
              <AdminInput label="Цена" {...register('price')} type="number" placeholder="Цена" />
              {errors.price && <p className={s['form__error']}>{errors.price.message}</p>}
            </div>

            <div>
              <AdminInput
                label="Остаток на складе"
                {...register('quantity')}
                type="number"
                placeholder="Остаток на складе"
              />
              {errors.quantity && <p className={s['form__error']}>{errors.quantity.message}</p>}
            </div>
          </div>

          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <>
                <AdminInput
                  label="Изображение"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        setError('image', { type: 'manual', message: 'Файл слишком большой (макс. 5MB)' });
                        return;
                      }

                      if (!['image/jpeg', 'image/png'].includes(file.type)) {
                        setError('image', {
                          type: 'manual',
                          message: 'Поддерживаются только JPEG, PNG и WebP',
                        });
                        return;
                      }
                      clearErrors('image');
                      field.onChange(file);
                    }
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />

                {errors.image && <p className={s['form__error']}>{errors.image.message}</p>}
              </>
            )}
          />

          {imagePreview && (
            <div className={s['image-preview']}>
              <p className={s['image-preview__label']}>загруженное изображение: </p>
              <img src={imagePreview} alt="Предпросмотр" />
            </div>
          )}

          <div className={s['form__checkbox-panel']}>
            <ChekboxAdmin
              label="Товар активен"
              subtitle="Показывать в каталоге для участников"
              isCheck={watch('is_active')}
              {...register('is_active')}
            />
          </div>

          {errors.root?.serverError && <p className={s['form__error']}>{errors.root.serverError.message}</p>}

          <AdminButton type="submit" disabled={isSubmitting} className={s['form__button']}>
            {isSubmitting ? 'Создание...' : 'Создать товар'}
          </AdminButton>
        </form>
      </SubstrateForFrom>
    </Modal>
  );
}

export default CreateItemModal;

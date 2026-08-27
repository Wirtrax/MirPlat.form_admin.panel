import type { PurchaseStatus } from '../types/apiType';

export const orderStatusOptions: { value: PurchaseStatus; label: string }[] = [
  { value: 'waiting', label: 'Ожидание' },
  { value: 'received', label: 'Получен' },
  { value: 'canceled', label: 'Отменён' },
];

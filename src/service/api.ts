import type {
  User,
  Product,
  AttemptsType,
  AttemptsTypeFullInformation,
  OrdersType,
  AttemptStatus,
  PurchaseStatus,
  OrderResponseByUserId,
  OneOrderType,
} from '../types/apiType';
import { request } from './utils/query';
import { getAuthToken, setAuthToken } from './utils/authToken';

interface adminLoginReaponse {
  token: string;
}
export const adminLogin = async (login: string, password: string) => {
  const data = await request<adminLoginReaponse>(
    '/auth/login',
    {
      method: 'POST',
      data: { login, password },
    },
    'admin'
  );
  setAuthToken(data.token);
  return data;
};

// товары - item/product
export const getItems = () => {
  return request<Product[]>(
    '/items',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getItem = (id: number) => {
  return request<Product>(`/item/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
};

export const updateItem = (
  id: number,
  data: Partial<Product>
): Promise<{
  success: boolean;
}> => {
  return request(
    `/items/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};

export const craeteItem = (formData: FormData): Promise<Product> => {
  return request(
    `/items`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data: formData,
    },
    'admin'
  );
};

export const hideItem = (
  id: number,
  data: { is_active: boolean }
): Promise<{
  success: boolean;
}> => {
  return request(
    `/items/${id}/hide`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};

// пользователи - user
export const getUsers = () => {
  return request<User[]>(
    '/users',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getUser = (id: number) => {
  return request<User>(
    `/users/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getAllUsersByItem = (id: number) => {
  return request<User[]>(
    `/users/by-item/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const updateUser = (
  id: number,
  data: Partial<User>
): Promise<{
  success: boolean;
}> => {
  return request(
    `/users/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};

export const updateUserRole = (
  id: number,
  data: { isAdmin: boolean }
): Promise<{
  success: boolean;
}> => {
  return request(
    `/users/${id}/role`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};

// заказы - order
export const getOrders = () => {
  return request<OrdersType[]>(
    '/orders',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};
export const getOrder = (id: number) => {
  return request<OneOrderType>(
    `/orders/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getAllOrdersByItem = (id: number) => {
  return request<OrdersType[]>(
    `/orders/by-item/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getAllOrdersByUser = (id: number) => {
  return request<OrderResponseByUserId[]>(
    `/orders/by-user/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const updateOrder = (
  id: number,
  data: { status: PurchaseStatus }
): Promise<{
  success: boolean;
}> => {
  return request(
    `/orders/${id}/status`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};
// попытки в играх - attempts
export const getAttempts = () => {
  return request<AttemptsType[]>(
    '/attempts',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getAttempt = (id: number) => {
  return request<AttemptsTypeFullInformation>(
    `/attempts/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const getAllAttemptsByUser = (id: number) => {
  return request<AttemptsTypeFullInformation[]>(
    `/attempts/by-user/${id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

export const updateAttepmt = (
  id: number,
  data: { status: AttemptStatus }
): Promise<{
  success: boolean;
}> => {
  return request(
    `/attempts/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      data,
    },
    'admin'
  );
};

// скачивание файла - Download

export const downloadXLSXFile = () => {
  return request<Blob>(
    '/excel/download',
    {
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};

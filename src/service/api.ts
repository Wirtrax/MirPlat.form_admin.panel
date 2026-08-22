import type { User, Product, OrdersTypeOlder } from '../types/apiType';
import { getAuthToken, setAuthToken, request } from './utils/query';

interface adminLoginReaponse {
  access_token: string;
}

export const getUser = () => {
  return request<User>('/user', {
    method: 'GET',
  });
};

export const getProducts = () => {
  return request<Product[]>('/item', {
    method: 'GET',
  });
};

export const adminLogin = async (login: string, password: string) => {
  const data = await request<adminLoginReaponse>(
    '/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    },
    'admin'
  );
  setAuthToken(data.access_token);
  console.log(data);
  return data;
};

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

export const getOrders = () => {
  return request<OrdersTypeOlder[]>(
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

export const deleteUser = (id: number) => {
  return request(
    `/users/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    },
    'admin'
  );
};
export const updateUser = (id: number, data: User) => {
  return request(
    `/users/${id}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
    'admin'
  );
};

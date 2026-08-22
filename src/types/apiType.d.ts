export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  is_active: boolean;
};

export type createOrderResponse = {
  code: string;
  id: number;
  item: Product;
  status: string;
  user: User;
};

export interface CreateUser {
  first_name: string;
  last_name: string;
  patronym: string;
  specialization: string;
  programming_level: string;
  email: string;
  phone_number: string;
  send_notifications: boolean;
}

export interface User extends CreateUser {
  id: number;
  telegram_id: string;
  balance: number;
  is_admin: boolean;
  profile_picture: string;
  purchases: createOrderResponse[];
  attempts: any[];
}

export interface OrdersTypeOlder {
  user_id: number;
  item_id: number;
  name: string;
  full_name: string;
  count: number;
}

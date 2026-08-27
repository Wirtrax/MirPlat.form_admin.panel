export type Product = {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
  is_active: boolean;
};

type PurchaseStatus = 'waiting' | 'received' | 'canceled';

export type createOrderResponse = {
  code: string;
  id: number;
  item: Product;
  status: string;
  user: User;
};

export interface OrdersType {
  orderId: number;
  itemName: string;
  status: PurchaseStatus;
  userEmail: string;
  userFullName: string;
  userPhoneNumber: string;
}
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

type AttemptStatus = 'accepted' | 'waiting' | 'declined';

export type AttemptsType = {
  attemptId: number;
  userFullName: string;
  activityName: number;
  attemptStatus: AttemptStatus;
  reward: number;
};
export interface AttemptsTypeFullInformation extends AttemptsType {
  userPhoneNumber: string;
  userEmail: string;
  reward: number;
  link: string;
}

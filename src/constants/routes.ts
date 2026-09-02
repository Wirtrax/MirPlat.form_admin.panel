export const ROOT_PATH = '/admin_panel';

export const ROUTES = {
  REGISTRATION: `${ROOT_PATH}/registration`,

  USER: `${ROOT_PATH}/users`,
  USER_BY_ID: `${ROOT_PATH}/users/:id`,

  ITEMS: `${ROOT_PATH}/items`,
  ITEMS_BY_ID: `${ROOT_PATH}/items/:id`,

  ORDERS: `${ROOT_PATH}/orders`,
  ORDERS_BY_ID: `${ROOT_PATH}/orders/:id`,

  ATTEMPTS: `${ROOT_PATH}/attempts`,
  ATTEMPTS_BY_ID: `${ROOT_PATH}/attempts/:id`,
} as const;

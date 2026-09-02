// 1. Сторонние библиотеки
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// 2. Локальные модули — компоненты
import AdminLayout from './app/AdminLayout';
import UsersPage from './app/UsersPage/UsersPage';
import AdminLoginForm from './app/AdminLoginForm/AdminLoginForm';
import ItemsPage from './app/ItemsPage/ItemsPage';
import OrdersPage from './app/OrdersPage/OrdersPage';
import UserPage from './app/UserPage/UserPage';
import ItemPage from './app/ItemPage/ItemPage';
import AttemptsPage from './app/AttemptsPage/AttemptsPage';
import AttemptPage from './app/AttemptPage/AttemptPage';
import OrderPage from './app/OrderPage/OrderPage';
import NotFound from './app/NotFound/NotFound';

// 3. Локальные модули — маршруты
import AdminRoute from './routes/AdminRoute';

// 4. Локальные модули — константы
import { ROOT_PATH, ROUTES } from './constants/routes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to={ROUTES.REGISTRATION} replace />} />

      {/* Публичный роут для входа админа */}
      <Route element={<AdminRoute requireAuth={false} />}>
        <Route path={ROUTES.REGISTRATION} element={<AdminLoginForm />} />
      </Route>

      {/* Защищённые роуты админки */}
      <Route element={<AdminRoute requireAuth />}>
        <Route path={ROOT_PATH} element={<AdminLayout />}>
          <Route path={ROUTES.USER} element={<UsersPage />} />
          <Route path={ROUTES.USER_BY_ID} element={<UserPage />} />

          <Route path={ROUTES.ITEMS} element={<ItemsPage />} />
          <Route path={ROUTES.ITEMS_BY_ID} element={<ItemPage />} />

          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.ORDERS_BY_ID} element={<OrderPage />} />

          <Route path={ROUTES.ATTEMPTS} element={<AttemptsPage />} />
          <Route path={ROUTES.ATTEMPTS_BY_ID} element={<AttemptPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;

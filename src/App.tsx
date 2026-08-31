import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import PublicAdminRoute from './routes/PublicAdminRoute';
import AdminLayout from './app/AdminLayout';
import UsersPage from './app/UsersPage/UsersPage';
import AdminLoginForm from './app/AdminLoginForm/AdminLoginForm';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ItemsPage from './app/ItemsPage/ItemsPage';
import OrdersPage from './app/OrdersPage/OrdersPage';
import UserPage from './app/UserPage/UserPage';
import ItemPage from './app/ItemPage/ItemPage';
import AttemptsPage from './app/AttemptsPage/AttemptsPage';
import AttemptPage from './app/AttemptPage/AttemptPage';
import OrderPage from './app/OrderPage/OrderPage';
import NotFound from './app/NotFound/NotFound';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/admin_panel/registration" replace />} />
      {/* Публичный роут для входа админа */}
      <Route element={<PublicAdminRoute />}>
        <Route path="/admin_panel/registration" element={<AdminLoginForm />} />
      </Route>

      {/* Защищённые роуты админки */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin_panel" element={<AdminLayout />}>
          <Route path="/admin_panel/users" element={<UsersPage />} />
          <Route path="/admin_panel/user/:id" element={<UserPage />} />

          <Route path="/admin_panel/items" element={<ItemsPage />} />
          <Route path="/admin_panel/items/:id" element={<ItemPage />} />

          <Route path="/admin_panel/orders" element={<OrdersPage />} />
          <Route path="/admin_panel/orders/:id" element={<OrderPage />} />

          <Route path="/admin_panel/attempts" element={<AttemptsPage />} />
          <Route path="/admin_panel/attempts/:id" element={<AttemptPage />} />
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

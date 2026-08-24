import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import PublicAdminRoute from './routes/PublicAdminRoute';
import AdminLayout from './app/AdminLayout';
import UsersPage from './app/UsersPage/UsersPage';
import AdminLoginForm from './app/AdminLoginForm/AdminLoginForm';
import ProtectedAdminRoute from './routes/ProtectedAdminRoute';
import ItemsPage from './app/ItemsPage/ItemsPage';
import OrdersPage from './app/OrdersPage/OrdersPage';
import UserPage from './app/UserPage/UserPage';
import ItemPage from './app/ItemPage/ItemPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to="/admin/registration" replace />} />
      {/* Публичный роут для входа админа — отдельный guard, не зависит от обычного user */}
      <Route element={<PublicAdminRoute />}>
        <Route path="/admin/registration" element={<AdminLoginForm />} />
      </Route>

      {/* Защищённые роуты админки */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/items" element={<ItemsPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/user/:id" element={<UserPage />} />
          <Route path="/admin/items/:id" element={<ItemPage />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;

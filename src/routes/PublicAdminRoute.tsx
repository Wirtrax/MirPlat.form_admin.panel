import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../hooks/redux';

export default function PublicAdminRoute() {
  const { superAdmin } = useAppSelector((state) => state.superAdmin);

  const isAdmin = superAdmin === true;

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  return <Outlet />;
}

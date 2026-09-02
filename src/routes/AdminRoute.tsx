import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../hooks/redux';
import { ROUTES } from '../constants/routes';

type AdminRouteProps = {
  requireAuth: boolean;
};

export default function AdminRoute({ requireAuth }: AdminRouteProps) {
  const { superAdmin } = useAppSelector((state) => state.superAdmin);
  const isAdmin = superAdmin === true;

  if (requireAuth && !isAdmin) {
    return <Navigate to={ROUTES.REGISTRATION} replace />;
  }

  if (!requireAuth && isAdmin) {
    return <Navigate to={ROUTES.USER} replace />;
  }

  return <Outlet />;
}

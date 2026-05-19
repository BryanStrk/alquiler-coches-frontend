import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { Role } from '@/types/auth.types';

interface ProtectedRouteProps {
  /** If set, the user must have this role to pass. */
  requiredRole?: Role;
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const toast = useToast();

  const roleMismatch =
    requiredRole !== undefined && user?.role !== requiredRole;

  // Fire the "no autorizado" toast as an effect — never during render.
  useEffect(() => {
    if (isAuthenticated && roleMismatch) {
      toast.error('No autorizado');
    }
  }, [isAuthenticated, roleMismatch, toast]);

  if (!isAuthenticated) {
    // Remember where the user wanted to go so login can send them back.
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roleMismatch) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

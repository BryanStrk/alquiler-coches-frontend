import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import type { AuthRequest, AuthResponse, Usuario } from '@/types/auth.types';

interface LocationState {
  from?: string;
}

/**
 * Login mutation. On success it hydrates the auth store and redirects to
 * wherever the user was headed (ProtectedRoute stashes it in location.state),
 * defaulting to /coches.
 *
 * NOTE: the backend's login response only carries { token, username, role }.
 * We build a minimal Usuario from it. TODO: when the backend exposes
 * GET /api/auth/me, hydrate the full profile (id, email, nombre, apellidos).
 */
function toUsuario(res: AuthResponse): Usuario {
  return {
    id: 0,
    username: res.username,
    email: '',
    nombre: '',
    apellidos: '',
    role: res.role,
  };
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  return useMutation({
    mutationFn: (req: AuthRequest) => authApi.login(req),
    onSuccess: (res) => {
      login(res.token, toUsuario(res));
      toast.success('Sesión iniciada');
      const from = (location.state as LocationState | null)?.from;
      navigate(from ?? '/coches', { replace: true });
    },
  });
}

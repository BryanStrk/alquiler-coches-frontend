import { useAuthStore } from '@/stores/authStore';
import { Role } from '@/types/auth.types';

/**
 * Convenience view over the auth store for components.
 * `logout` here only clears client state — there is no server logout endpoint
 * (the JWT simply expires).
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    token,
    isAuthenticated: token !== null,
    isAdmin: user?.role === Role.ADMIN,
    logout,
  };
}

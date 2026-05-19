import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, type Usuario } from '@/types/auth.types';

interface AuthState {
  token: string | null;
  user: Usuario | null;
  login: (token: string, user: Usuario) => void;
  logout: () => void;
  updateUser: (user: Usuario) => void;
}

/**
 * Auth store persisted to localStorage under `auth-storage`.
 *
 * `isAuthenticated` is intentionally NOT stored — it's derived from `token`
 * via the `useIsAuthenticated` selector so it can never drift out of sync.
 * Non-React code (Axios interceptors) reads/writes via `useAuthStore.getState()`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);

/** True when a token is present. */
export const useIsAuthenticated = () =>
  useAuthStore((s) => s.token !== null);

/** True when the logged-in user has the ADMIN role. */
export const useIsAdmin = () =>
  useAuthStore((s) => s.user?.role === Role.ADMIN);

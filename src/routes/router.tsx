import { createBrowserRouter, Navigate } from 'react-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { NotFoundPage } from '@/components/NotFoundPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { CocheListPage } from '@/features/coches/pages/CocheListPage';
import { CocheDetailPage } from '@/features/coches/pages/CocheDetailPage';
import { CocheCreatePage } from '@/features/coches/pages/CocheCreatePage';
import { CocheEditPage } from '@/features/coches/pages/CocheEditPage';
// TODO: temporal — borrar esta ruta y la página cuando la subida esté
// integrada en CocheCreatePage / CocheEditPage.
import { TestUploadPage } from '@/features/coches/pages/TestUploadPage';
import { Role } from '@/types/auth.types';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/coches" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'coches', element: <CocheListPage /> },
      { path: 'coches/:id', element: <CocheDetailPage /> },
      {
        path: 'admin',
        element: <ProtectedRoute requiredRole={Role.ADMIN} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: 'coches/nuevo',
                element: <CocheCreatePage />,
              },
              {
                path: 'coches/:id/editar',
                element: <CocheEditPage />,
              },
            ],
          },
        ],
      },
      {
        // Misma protección que /admin: solo ADMIN. Reutilizamos
        // <ProtectedRoute> en vez de duplicar la lógica de auth.
        element: <ProtectedRoute requiredRole={Role.ADMIN} />,
        children: [
          { path: 'test-upload', element: <TestUploadPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

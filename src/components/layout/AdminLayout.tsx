import { Outlet, Link } from 'react-router';
import { ShieldCheck } from 'lucide-react';

/**
 * Thin admin chrome rendered inside <ProtectedRoute role=ADMIN>.
 * Shares the public Navbar/Footer (mounted one level up) and just adds
 * an "admin context" strip so it's obvious you're in the back office.
 */
export function AdminLayout() {
  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-3 lg:px-10">
          <ShieldCheck className="size-4 text-accent" />
          <span className="text-sm font-medium text-text">
            Panel de administración
          </span>
          <Link
            to="/coches"
            className="ml-auto text-sm text-muted transition-colors duration-150 hover:text-text"
          >
            ← Volver al sitio
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

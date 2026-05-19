import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { CarFront, Menu, X, Plus, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const links = [
  { to: '/coches', label: 'Coches' },
  { to: '/coches?soloDisponibles=true', label: 'Disponibles' },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'nav-underline text-sm font-medium transition-colors duration-150',
    isActive
      ? 'nav-underline--active text-text'
      : 'text-muted hover:text-text',
  );
}

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the avatar dropdown on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/coches');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link
          to="/coches"
          className="press flex items-center gap-2"
          aria-label="Garage Premium — inicio"
        >
          <CarFront className="size-6 text-accent" />
          <span className="font-display text-lg font-semibold tracking-tight text-text">
            Garage <span className="text-accent">Premium</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.label} to={l.to} className={navLinkClass} end>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <Button
              size="sm"
              onClick={() => navigate('/admin/coches/nuevo')}
            >
              <Plus className="size-4" />
              Nuevo coche
            </Button>
          )}

          {!isAuthenticated ? (
            <Button
              variant="accent-outline"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="press grid size-9 place-items-center rounded-full bg-accent font-display font-bold text-bg"
              >
                {user?.username?.[0]?.toUpperCase() ?? '?'}
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className={cn(
                    'absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border bg-surface p-1 shadow-xl',
                    'opacity-100 scale-100 transition-[opacity,transform] duration-150 ease-out-strong',
                    'starting:opacity-0 starting:scale-95',
                  )}
                >
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-medium text-text">
                      {user?.nombre
                        ? `${user.nombre} ${user.apellidos}`
                        : user?.username}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="press mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-text hover:bg-surface-hover"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="press md:hidden"
          aria-label="Abrir menú"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? (
            <X className="size-6" />
          ) : (
            <Menu className="size-6" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
                end
              >
                {l.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              {isAdmin && (
                <Button
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/admin/coches/nuevo');
                  }}
                >
                  <Plus className="size-4" />
                  Nuevo coche
                </Button>
              )}
              {!isAuthenticated ? (
                <Button
                  variant="accent-outline"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/login');
                  }}
                >
                  Iniciar sesión
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Cerrar sesión ({user?.username})
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

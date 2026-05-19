import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center gap-6 px-6 py-24 text-center lg:px-10">
      <p className="font-display text-[12rem] leading-none text-text-dim md:text-[16rem]">
        404
      </p>
      <p className="max-w-md text-balance text-muted">
        La página que buscas se ha salido de la pista. Volvamos al
        circuito.
      </p>
      <Link
        to="/coches"
        className="press rounded-sm bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-bg transition-colors duration-150 hover:bg-accent-hover"
      >
        Volver a la flota
      </Link>
    </div>
  );
}

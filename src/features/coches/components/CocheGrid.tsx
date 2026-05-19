import { CarFront, RotateCcw } from 'lucide-react';
import type { Coche } from '@/types/coche.types';
import { Button } from '@/components/ui/Button';
import { CocheCard } from './CocheCard';

interface CocheGridProps {
  coches: Coche[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const GRID =
  'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3';

function CardSkeleton() {
  return (
    <div className="card-premium">
      <div className="aspect-4/3 animate-pulse bg-surface-hover" />
      <div className="flex flex-col gap-3 p-6">
        <div className="h-3 w-1/4 animate-pulse rounded bg-surface-hover" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-surface-hover" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-hover" />
        <div className="mt-3 h-8 w-1/3 animate-pulse rounded bg-surface-hover" />
      </div>
    </div>
  );
}

export function CocheGrid({
  coches,
  isLoading,
  isError,
  onRetry,
}: CocheGridProps) {
  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card-premium flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted">
          No se pudieron cargar los coches.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (!coches || coches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
        <CarFront className="size-12 text-muted" />
        <p className="font-display text-lg text-text">
          No hay coches que coincidan
        </p>
        <p className="text-sm text-muted">
          Prueba a cambiar o limpiar los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {coches.map((c, i) => (
        <CocheCard key={c.id} coche={c} index={i} />
      ))}
    </div>
  );
}

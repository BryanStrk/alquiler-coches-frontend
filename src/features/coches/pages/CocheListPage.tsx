import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  CocheFilters,
  type FiltersValue,
} from '@/features/coches/components/CocheFilters';
import { CocheGrid } from '@/features/coches/components/CocheGrid';
import { CocheHero } from '@/features/coches/components/CocheHero';
import { useCoches } from '@/features/coches/hooks/useCoches';
import {
  EstadoCoche,
  TipoCombustible,
  type CocheFilters as CocheFiltersType,
} from '@/types/coche.types';

const isCombustible = (v: string): v is TipoCombustible =>
  v in TipoCombustible;
const isEstado = (v: string): v is EstadoCoche => v in EstadoCoche;

export function CocheListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the single source of truth for filters (shareable / back-button).
  const filtersValue: FiltersValue = {
    marca: searchParams.get('marca') ?? '',
    tipoCombustible: searchParams.get('tipoCombustible') ?? '',
    estado: searchParams.get('estado') ?? '',
    soloDisponibles: searchParams.get('soloDisponibles') === 'true',
  };

  const hasActiveFilters =
    filtersValue.marca !== '' ||
    filtersValue.tipoCombustible !== '' ||
    filtersValue.estado !== '' ||
    filtersValue.soloDisponibles;

  const patchFilters = (patch: Partial<FiltersValue>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(patch)) {
          if (
            value === '' ||
            value === false ||
            value === undefined
          ) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }
        return next;
      },
      { replace: true },
    );
  };

  const clearFilters = () => setSearchParams({}, { replace: true });

  // Map UI filters → backend query params. "Solo disponibles" is expressed
  // as estado=DISPONIBLE so a single /api/coches call covers every combo.
  const apiFilters = useMemo<CocheFiltersType>(() => {
    const f: CocheFiltersType = {};
    if (filtersValue.marca) f.marca = filtersValue.marca;
    if (
      filtersValue.tipoCombustible &&
      isCombustible(filtersValue.tipoCombustible)
    ) {
      f.tipoCombustible = filtersValue.tipoCombustible;
    }
    if (filtersValue.soloDisponibles) {
      f.estado = EstadoCoche.DISPONIBLE;
    } else if (
      filtersValue.estado &&
      isEstado(filtersValue.estado)
    ) {
      f.estado = filtersValue.estado;
    }
    return f;
  }, [
    filtersValue.marca,
    filtersValue.tipoCombustible,
    filtersValue.estado,
    filtersValue.soloDisponibles,
  ]);

  const { data, isLoading, isError, refetch } = useCoches(apiFilters);

  // Presentational-only derivations for the hero stat chips.
  const disponibles =
    data?.filter((c) => c.estado === EstadoCoche.DISPONIBLE).length ??
    0;
  const marcas = new Set(data?.map((c) => c.marca)).size;

  return (
    <div>
      <CocheHero disponibles={disponibles} marcas={marcas} />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="-mt-20 relative mb-10">
          <CocheFilters
            value={filtersValue}
            onChange={patchFilters}
            onClear={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        <CocheGrid
          coches={data}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  );
}

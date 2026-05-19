import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import { EstadoCoche, TipoCombustible } from '@/types/coche.types';

export interface FiltersValue {
  marca: string;
  tipoCombustible: string;
  estado: string;
  soloDisponibles: boolean;
}

interface CocheFiltersProps {
  value: FiltersValue;
  onChange: (patch: Partial<FiltersValue>) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const combustibleOptions = Object.values(TipoCombustible).map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

const estadoOptions = Object.values(EstadoCoche).map((v) => ({
  value: v,
  label: v.charAt(0) + v.slice(1).toLowerCase(),
}));

export function CocheFilters({
  value,
  onChange,
  onClear,
  hasActiveFilters,
}: CocheFiltersProps) {
  return (
    <div className="card-premium glow-accent p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:items-end">
        <Input
          label="Buscar por marca"
          placeholder="Audi, BMW, Tesla..."
          icon={<Search className="size-4" />}
          value={value.marca}
          onChange={(e) => onChange({ marca: e.target.value })}
        />

        <Select
          label="Combustible"
          placeholder="Todos"
          options={combustibleOptions}
          value={value.tipoCombustible}
          onChange={(e) =>
            onChange({ tipoCombustible: e.target.value })
          }
        />

        <Select
          label="Estado"
          placeholder="Todos"
          options={estadoOptions}
          value={value.estado}
          onChange={(e) => onChange({ estado: e.target.value })}
          disabled={value.soloDisponibles}
        />

        {/* Toggle switch — same onChange contract as before. */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">
            Disponibilidad
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={value.soloDisponibles}
            onClick={() =>
              onChange({ soloDisponibles: !value.soloDisponibles })
            }
            className="press flex h-11 items-center justify-between gap-3 rounded-lg border border-border bg-surface-hover px-3 text-sm text-text"
          >
            <span
              className={
                value.soloDisponibles ? 'text-text' : 'text-muted'
              }
            >
              Solo disponibles
            </span>
            <span
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-sm transition-colors duration-200 ease-out-strong',
                value.soloDisponibles
                  ? 'bg-accent'
                  : 'bg-border',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 size-5 rounded-sm bg-text transition-transform duration-200 ease-out-strong',
                  value.soloDisponibles && 'translate-x-5',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClear}
            className="press inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-text"
          >
            <X className="size-4" />
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}

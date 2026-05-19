import { Fuel, Zap, Leaf, Droplet } from 'lucide-react';
import { Badge, type BadgeColor } from '@/components/ui/Badge';
import { TipoCombustible } from '@/types/coche.types';

const map: Record<
  TipoCombustible,
  { color: BadgeColor; label: string; icon: typeof Fuel }
> = {
  // Tipos de combustible: todos neutrales (datos no jerárquicos, sobrios).
  ELECTRICO: { color: 'neutral', label: 'Eléctrico', icon: Zap },
  HIBRIDO: { color: 'neutral', label: 'Híbrido', icon: Leaf },
  DIESEL: { color: 'neutral', label: 'Diésel', icon: Droplet },
  GASOLINA: { color: 'neutral', label: 'Gasolina', icon: Fuel },
};

export function CombustibleBadge({
  tipo,
}: {
  tipo: TipoCombustible;
}) {
  const { color, label, icon: Icon } = map[tipo];
  return (
    <Badge color={color}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}

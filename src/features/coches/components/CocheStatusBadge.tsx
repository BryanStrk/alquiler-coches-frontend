import { CheckCircle2, Clock, Wrench } from 'lucide-react';
import { Badge, type BadgeColor } from '@/components/ui/Badge';
import { EstadoCoche } from '@/types/coche.types';

const map: Record<
  EstadoCoche,
  { color: BadgeColor; label: string; icon: typeof CheckCircle2 }
> = {
  DISPONIBLE: { color: 'success', label: 'Disponible', icon: CheckCircle2 },
  ALQUILADO: { color: 'warning', label: 'Alquilado', icon: Clock },
  MANTENIMIENTO: { color: 'danger', label: 'Mantenimiento', icon: Wrench },
};

export function CocheStatusBadge({
  estado,
}: {
  estado: EstadoCoche;
}) {
  const { color, label, icon: Icon } = map[estado];
  return (
    <Badge color={color}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}

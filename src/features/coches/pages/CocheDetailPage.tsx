import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  ChevronRight,
  Gauge,
  Calendar,
  Fuel,
  Activity,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useCoche } from '@/features/coches/hooks/useCoche';
import { useDeleteCoche } from '@/features/coches/hooks/useDeleteCoche';
import { CocheGallery } from '@/features/coches/components/CocheGallery';
import { CombustibleBadge } from '@/features/coches/components/CombustibleBadge';
import { CocheStatusBadge } from '@/features/coches/components/CocheStatusBadge';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { getApiErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PriceTag } from '@/components/ui/PriceTag';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';

export function CocheDetailPage() {
  const { id } = useParams();
  const cocheId = Number(id);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const toast = useToast();

  const { data: coche, isLoading, isError } = useCoche(cocheId);
  const deleteCoche = useDeleteCoche();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner size="size-8" className="text-accent" />
      </div>
    );
  }

  if (isError || !coche) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 text-center">
        <p className="text-muted">No se encontró el coche.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/coches')}
        >
          Volver a la flota
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteCoche.mutate(coche.id, {
      onSuccess: () => {
        toast.success('Coche eliminado');
        navigate('/coches');
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  };

  const specs = [
    {
      icon: Gauge,
      label: 'Kilómetros',
      value: `${coche.kilometros.toLocaleString('es-ES')} km`,
    },
    { icon: Fuel, label: 'Combustible', value: coche.tipoCombustible },
    { icon: Calendar, label: 'Año', value: String(coche.anio) },
    { icon: Activity, label: 'Estado', value: coche.estado },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted">
        <Link
          to="/coches"
          className="transition-colors duration-150 hover:text-accent"
        >
          Coches
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-text">
          {coche.marca} {coche.modelo}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
        <CocheGallery coche={coche} />

        <div className="stagger-children flex flex-col gap-6">
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-muted">
              {coche.marca}
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-balance text-text">
              {coche.modelo}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <CombustibleBadge tipo={coche.tipoCombustible} />
            <CocheStatusBadge estado={coche.estado} />
            <span className="inline-flex items-center rounded-sm border border-border-strong px-2.5 py-1 text-xs uppercase tracking-wider text-muted">
              {coche.anio}
            </span>
            <span className="inline-flex items-center rounded-sm border border-border-strong px-2.5 py-1 font-mono text-xs text-muted">
              {coche.matricula}
            </span>
          </div>

          <PriceTag value={coche.precioPorDia} size="text-5xl" />

          <p className="max-w-prose leading-relaxed text-muted">
            {coche.descripcion}
          </p>

          <Card className="p-6">
            <h2 className="mb-5 font-display font-semibold text-text">
              Especificaciones
            </h2>
            <div className="grid grid-cols-2 gap-5">
              {specs.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-accent/10">
                    <s.icon className="size-4 text-accent" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted">
                      {s.label}
                    </p>
                    <p className="text-sm font-medium text-text">
                      {s.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <span
              title="Próximamente — funcionalidad de reservas en desarrollo"
              className="flex-1 sm:flex-none"
            >
              <Button size="lg" disabled className="w-full">
                Reservar ahora
              </Button>
            </span>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" />
              Volver
            </Button>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-3 border-t border-border pt-6">
              <Button
                variant="accent-outline"
                onClick={() =>
                  navigate(`/admin/coches/${coche.id}/editar`)
                }
              >
                <Edit3 className="size-4" />
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Eliminar coche"
        maxWidth="max-w-sm"
      >
        <p className="text-sm text-muted">
          ¿Seguro que quieres eliminar{' '}
          <span className="font-medium text-text">
            {coche.marca} {coche.modelo}
          </span>
          ? Esta acción no se puede deshacer.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => setConfirmOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            isLoading={deleteCoche.isPending}
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}

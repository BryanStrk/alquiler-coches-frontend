import { useNavigate, useParams } from 'react-router';
import { CocheForm } from '@/features/coches/components/CocheForm';
import { useCoche } from '@/features/coches/hooks/useCoche';
import { useUpdateCoche } from '@/features/coches/hooks/useUpdateCoche';
import type { CocheFormValues } from '@/features/coches/schemas/cocheSchema';
import { useToast } from '@/hooks/useToast';
import { getApiErrorMessage } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export function CocheEditPage() {
  const { id } = useParams();
  const cocheId = Number(id);
  const navigate = useNavigate();
  const toast = useToast();

  const { data: coche, isLoading, isError } = useCoche(cocheId);
  const updateCoche = useUpdateCoche();

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Spinner size="size-8" className="text-accent" />
      </div>
    );
  }

  if (isError || !coche) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 lg:px-10 text-center">
        <p className="text-muted">No se encontró el coche a editar.</p>
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

  // Coche → form values (drop server-owned fields).
  const defaultValues: CocheFormValues = {
    marca: coche.marca,
    modelo: coche.modelo,
    matricula: coche.matricula,
    anio: coche.anio,
    precioPorDia: coche.precioPorDia,
    tipoCombustible: coche.tipoCombustible,
    estado: coche.estado,
    kilometros: coche.kilometros,
    descripcion: coche.descripcion,
    // Las imágenes existentes del coche se muestran como miniaturas
    // editables; si no tuviera ninguna, el array arranca vacío (sin
    // el antiguo placeholder '') y <UploadImage> permite añadir.
    imageUrls: coche.imageUrls,
  };

  const onSubmit = (values: CocheFormValues) => {
    updateCoche.mutate(
      { id: coche.id, data: values },
      {
        onSuccess: () => {
          toast.success('Coche actualizado');
          navigate(`/coches/${coche.id}`);
        },
        onError: (err) => toast.error(getApiErrorMessage(err)),
      },
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-text">
        Editar {coche.marca} {coche.modelo}
      </h1>
      <CocheForm
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        isSubmitting={updateCoche.isPending}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}

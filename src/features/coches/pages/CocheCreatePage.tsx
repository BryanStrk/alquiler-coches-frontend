import { useNavigate } from 'react-router';
import { CocheForm } from '@/features/coches/components/CocheForm';
import { useCreateCoche } from '@/features/coches/hooks/useCreateCoche';
import type { CocheFormValues } from '@/features/coches/schemas/cocheSchema';
import { EstadoCoche, TipoCombustible } from '@/types/coche.types';
import { useToast } from '@/hooks/useToast';
import { getApiErrorMessage } from '@/lib/api';

const emptyCoche: CocheFormValues = {
  marca: '',
  modelo: '',
  matricula: '',
  anio: new Date().getFullYear(),
  precioPorDia: 0,
  tipoCombustible: TipoCombustible.GASOLINA,
  estado: EstadoCoche.DISPONIBLE,
  kilometros: 0,
  descripcion: '',
  // Empezamos sin imágenes: el admin las añade subiéndolas con
  // <UploadImage> dentro del formulario. La validación zod (min 1)
  // mostrará el aviso hasta que suba al menos una.
  imageUrls: [],
};

export function CocheCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const createCoche = useCreateCoche();

  const onSubmit = (values: CocheFormValues) => {
    createCoche.mutate(values, {
      onSuccess: (coche) => {
        toast.success('Coche creado');
        navigate(`/coches/${coche.id}`);
      },
      onError: (err) => toast.error(getApiErrorMessage(err)),
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-text">
        Nuevo coche
      </h1>
      <CocheForm
        defaultValues={emptyCoche}
        onSubmit={onSubmit}
        isSubmitting={createCoche.isPending}
        submitLabel="Crear coche"
      />
    </div>
  );
}

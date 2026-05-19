import type { Coche } from '@/types/coche.types';
import { ImageGallery } from '@/components/ui/ImageGallery';

/** Domain wrapper around the generic <ImageGallery> for a coche. */
export function CocheGallery({ coche }: { coche: Coche }) {
  return (
    <ImageGallery
      images={coche.imageUrls ?? []}
      alt={`${coche.marca} ${coche.modelo}`}
    />
  );
}

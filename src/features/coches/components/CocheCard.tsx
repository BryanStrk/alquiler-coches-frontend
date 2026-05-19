import { Link } from 'react-router';
import { Images } from 'lucide-react';
import type { Coche } from '@/types/coche.types';
import { optimizeImage } from '@/lib/cloudinary';
import { PriceTag } from '@/components/ui/PriceTag';
import { CombustibleBadge } from './CombustibleBadge';
import { CocheStatusBadge } from './CocheStatusBadge';

const PLACEHOLDER =
  'https://placehold.co/800x600/141414/888888?text=Sin+imagen';

interface CocheCardProps {
  coche: Coche;
  /** Index in the grid — drives the 40ms stagger entrance delay. */
  index?: number;
}

export function CocheCard({ coche, index = 0 }: CocheCardProps) {
  const cover = coche.imageUrls?.[0] ?? PLACEHOLDER;
  const count = coche.imageUrls?.length ?? 0;

  return (
    <Link
      to={`/coches/${coche.id}`}
      // card-premium = gradient surface; --interactive adds the lift / glow /
      // image push-in / CTA nudge (transform·opacity·box-shadow·border only,
      // pointer-gated, reduced-motion-safe — all in index.css).
      // enter-up + 40ms·index = staggered grid entrance.
      className="card-premium card-premium--interactive enter-up flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="card-image relative aspect-4/3 overflow-hidden">
        <img
          src={optimizeImage(cover, { width: 800, height: 600 })}
          alt={`${coche.marca} ${coche.modelo}`}
          loading="lazy"
          className="size-full object-cover"
        />
        {/* Bottom→top scrim for badge / edge legibility. */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <CombustibleBadge tipo={coche.tipoCombustible} />
          <CocheStatusBadge estado={coche.estado} />
        </div>
        {count > 1 && (
          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-sm bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-md">
            <Images className="size-3" />+{count} fotos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <span className="text-xs font-medium uppercase tracking-widest text-muted">
            {coche.marca}
          </span>
          <h3 className="font-display text-2xl font-bold text-text">
            {coche.modelo}
          </h3>
        </div>

        <p className="text-sm text-muted">
          {coche.anio} ·{' '}
          {coche.kilometros.toLocaleString('es-ES')} km
        </p>

        <div className="mt-auto flex items-end justify-between border-t border-border pt-4">
          <PriceTag value={coche.precioPorDia} />
          <span className="card-cta text-sm font-medium text-accent">
            Ver detalles →
          </span>
        </div>
      </div>
    </Link>
  );
}

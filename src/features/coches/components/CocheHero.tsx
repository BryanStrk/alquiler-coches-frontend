import { Car, Award, Headset } from 'lucide-react';

const HERO_IMG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=85';

interface CocheHeroProps {
  disponibles: number;
  marcas: number;
}

export function CocheHero({ disponibles, marcas }: CocheHeroProps) {
  const stats = [
    { icon: Car, label: `${disponibles} vehículos disponibles` },
    { icon: Award, label: `${marcas} marcas premium` },
    { icon: Headset, label: '24/7 atención cliente' },
  ];

  return (
    <section className="relative h-[480px] w-full overflow-hidden">
      <img
        src={HERO_IMG}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      {/* Dark→light scrim, strongest at the bottom for text legibility. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 45%, rgba(10,10,10,0.4) 100%)',
        }}
      />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10">
        <div className="hero-fade max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Premium Car Rental
          </p>
          <h1 className="mt-4 font-display text-6xl font-bold leading-tight text-balance text-text md:text-7xl">
            Conduce el coche de tus{' '}
            <span className="text-accent">sueños</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Una flota cuidadosamente seleccionada de vehículos
            premium. Reserva online en menos de 2 minutos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-surface/70 px-4 py-2 text-sm text-text backdrop-blur-md"
              >
                <s.icon className="size-4 text-accent" />
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

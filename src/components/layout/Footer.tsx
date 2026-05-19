import { Link } from 'react-router';
// lucide-react 1.x ships no brand glyphs (licensing) — use generic icons.
import {
  CarFront,
  Camera,
  AtSign,
  Video,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

const quickLinks = [
  { to: '/coches', label: 'Coches' },
  { to: '/coches?soloDisponibles=true', label: 'Disponibles' },
  { to: '/coches', label: 'Sobre nosotros' },
  { to: '/coches', label: 'Contacto' },
];

const legalLinks = ['Términos', 'Privacidad', 'Cookies'];

const socials = [
  { icon: Camera, label: 'Instagram' },
  { icon: AtSign, label: 'Twitter' },
  { icon: Video, label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="relative mt-20 bg-surface">
      {/* Subtle accent → transparent top border. */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(201,168,106,0.45), transparent)',
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <CarFront className="size-5 text-accent" />
              <span className="font-display text-lg font-semibold tracking-tight text-text">
                Garage <span className="text-accent">Premium</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Alquiler de vehículos premium. Una flota seleccionada,
              reservas en minutos.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="press grid size-9 place-items-center rounded-sm border border-border text-muted transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">
              Enlaces rápidos
            </h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l, i) => (
                <li key={i}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted transition-colors duration-150 hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">
              Información
            </h3>
            <ul className="flex flex-col gap-2.5">
              {legalLinks.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-muted transition-colors duration-150 hover:text-accent"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent" />
                hola@garagepremium.es
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-accent" />
                +34 600 123 456
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                Madrid, España
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <p className="text-center text-sm text-muted">
          © {new Date().getFullYear()} Garage Premium · Alquiler de
          coches
        </p>
      </div>
    </footer>
  );
}

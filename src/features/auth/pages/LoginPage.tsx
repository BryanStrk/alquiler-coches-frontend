import { CarFront } from 'lucide-react';
import { LoginForm } from '@/features/auth/components/LoginForm';

const BG_IMG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=2000&q=85';

export function LoginPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      {/* Same hero shot, heavily blurred & darkened. */}
      <img
        src={BG_IMG}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full scale-105 object-cover blur-lg"
      />
      <div className="absolute inset-0 bg-bg/85" />

      <div className="relative w-full max-w-105">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-md bg-accent/10">
            <CarFront className="size-8 text-accent" />
          </span>
          <h1 className="font-display text-3xl tracking-tight text-text">
            Garage <span className="text-accent">Premium</span>
          </h1>
          <p className="text-sm text-muted">
            Inicia sesión para gestionar la flota
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface/95 p-8 backdrop-blur-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

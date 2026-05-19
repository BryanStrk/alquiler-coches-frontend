import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/loginSchema';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
  const [showPassword, setShowPassword] = useState(false);
  const mutation = useLogin();

  const status =
    mutation.error instanceof AxiosError
      ? mutation.error.response?.status
      : undefined;
  const is401 = status === 401;

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {mutation.isError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-sm border border-danger/40 bg-danger/10 px-3 py-2.5 text-sm text-danger"
        >
          <AlertCircle className="size-4 shrink-0" />
          {is401
            ? 'Credenciales incorrectas'
            : 'No se pudo iniciar sesión. Inténtalo de nuevo.'}
        </div>
      )}

      <Input
        label="Usuario"
        autoComplete="username"
        placeholder="admin"
        error={errors.username?.message}
        {...register('username')}
      />

      <div className="relative">
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          className="press absolute top-9 right-3 text-muted hover:text-text"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>

      <Button
        type="submit"
        className="mt-2 w-full"
        isLoading={mutation.isPending}
      >
        Iniciar sesión
      </Button>
    </form>
  );
}

export const Role = {
  ADMIN: 'ADMIN',
  CLIENTE: 'CLIENTE',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellidos: string;
  role: Role;
}

export interface AuthRequest {
  username: string;
  password: string;
}

/** Backend may also register new users with extra profile fields. */
export interface RegisterRequest extends AuthRequest {
  email: string;
  nombre: string;
  apellidos: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: Role;
  expiresIn: number;
}

import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import type {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
} from '@/types/auth.types';
import type {
  ErrorResponse,
  UploadResponse,
  DeleteResponse,
} from '@/types/api.types';
import type {
  Coche,
  CocheFilters,
  CocheRequest,
} from '@/types/coche.types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT from the auth store if present.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: on 401 clear session and bounce to /login (once).
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Best-effort extraction of a human message from a backend error, for toasts.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Algo salió mal. Inténtalo de nuevo.',
): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return fallback;
}

export const authApi = {
  login: (req: AuthRequest) =>
    api
      .post<AuthResponse>('/api/auth/login', req)
      .then((r) => r.data),
  register: (req: RegisterRequest) =>
    api
      .post<AuthResponse>('/api/auth/register', req)
      .then((r) => r.data),
};

export const cochesApi = {
  list: (filters?: CocheFilters) =>
    api
      .get<Coche[]>('/api/coches', { params: filters })
      .then((r) => r.data),
  disponibles: () =>
    api
      .get<Coche[]>('/api/coches/disponibles')
      .then((r) => r.data),
  byId: (id: number) =>
    api.get<Coche>(`/api/coches/${id}`).then((r) => r.data),
  create: (req: CocheRequest) =>
    api.post<Coche>('/api/coches', req).then((r) => r.data),
  update: (id: number, req: CocheRequest) =>
    api.put<Coche>(`/api/coches/${id}`, req).then((r) => r.data),
  delete: (id: number) =>
    api.delete<void>(`/api/coches/${id}`).then((r) => r.data),
};

// ───────────────────────────────────────────────────────────────────────────
// Media (Cloudinary vía backend)
//
// OJO: el resto del fichero usa la instancia `api` de axios, que tiene
// `Content-Type: application/json` fijado por defecto. Para subir ficheros
// usamos `fetch` a propósito: así el navegador genera él mismo la cabecera
// `multipart/form-data; boundary=...`. Si reutilizásemos la instancia axios
// tendríamos que "apagar" su Content-Type para no pisar el boundary; con
// fetch el problema simplemente no existe. Es la solución más clara de
// entender, que es justo lo que buscamos aquí.
// ───────────────────────────────────────────────────────────────────────────

// Misma variable de entorno que usa la instancia axios de arriba. No creamos
// una nueva (`VITE_API_BASE_URL`) para no duplicar configuración: una sola
// fuente de verdad para "dónde vive el backend".
const API_BASE =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

/**
 * Sube un fichero (imagen o vídeo) al backend, que a su vez lo sube a
 * Cloudinary con las credenciales seguras. El frontend NUNCA habla
 * directamente con la API de Cloudinary: si la clave secreta viajara al
 * navegador, cualquiera podría leerla en las DevTools.
 *
 * Requiere JWT con rol ADMIN.
 *
 * @param file fichero seleccionado por el usuario en un <input type="file">
 * @returns objeto con el publicId y la URL pública del recurso subido
 * @throws Error si el usuario no está autenticado o si la petición falla
 */
export async function uploadImage(
  file: File,
): Promise<UploadResponse> {
  // 1) Tomamos el JWT del authStore (Zustand). `getState()` permite leerlo
  //    FUERA de un componente React, sin hooks. Si no hay token, fallamos
  //    rápido sin tocar la red: mejor experiencia y no gastamos una petición
  //    que el backend rechazaría igualmente con 401.
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('No autenticado: inicia sesión primero');

  // 2) FormData construye un cuerpo multipart/form-data. El nombre "file"
  //    debe coincidir EXACTAMENTE con el @RequestPart("file") del
  //    MediaController de Spring; si no coincide, el backend no encuentra
  //    el archivo y responde 400.
  const formData = new FormData();
  formData.append('file', file);

  // 3) NOTA CRÍTICA: NO ponemos 'Content-Type' a mano. El navegador genera
  //    'multipart/form-data; boundary=----WebKit...' con el boundary
  //    correcto. Si lo forzáramos nosotros, el boundary faltaría y Spring
  //    devolvería 400 Bad Request. Esta es la trampa más típica al subir
  //    ficheros: dejar que el navegador haga su trabajo.
  const res = await fetch(`${API_BASE}/api/media/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // (Sin Content-Type a propósito — ver comentario de arriba.)
    },
    body: formData,
  });

  // 4) Si no es 2xx, intentamos leer el `message` del ErrorResponse del
  //    backend. El `.catch(() => null)` cubre el caso de que la respuesta
  //    no sea JSON parseable (ej: un 500 con HTML): así nunca lanzamos un
  //    error feo de parseo, siempre un mensaje legible.
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as
      | ErrorResponse
      | null;
    throw new Error(
      err?.message ?? `Error ${res.status} al subir el archivo`,
    );
  }

  return (await res.json()) as UploadResponse;
}

/**
 * Elimina una imagen o vídeo de Cloudinary a partir de su public_id.
 * Requiere JWT con rol ADMIN.
 *
 * @param publicId identificador único devuelto por uploadImage
 *                 (ej: "alquiler-coches/3f4a-bc12-...")
 */
export async function deleteImage(
  publicId: string,
): Promise<DeleteResponse> {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error('No autenticado');

  // El publicId contiene "/" (carpeta/uuid). En una URL, "/" significa
  // "nuevo segmento de ruta": el backend buscaría /api/media/carpeta/uuid
  // y no encontraría el endpoint. encodeURIComponent convierte "/" en
  // "%2F", de modo que viaja como UN solo parámetro de ruta.
  const encoded = encodeURIComponent(publicId);

  const res = await fetch(`${API_BASE}/api/media/${encoded}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as
      | ErrorResponse
      | null;
    throw new Error(
      err?.message ?? `Error ${res.status} al borrar el archivo`,
    );
  }

  return (await res.json()) as DeleteResponse;
}

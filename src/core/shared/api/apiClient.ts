import { BASE_URL } from '../config/api';
import { fetchAuth } from '../utils/auth';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
}

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseResponse<T>(response: Response): Promise<ApiResponse<T> | null> {
  if (response.status === 204) return null;
  return response.json().catch(() => null) as Promise<ApiResponse<T> | null>;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const response = authenticated
    ? await fetchAuth(buildUrl(path), options)
    : await fetch(buildUrl(path), options);

  const body = await parseResponse<T>(response);
  if (!response.ok || (body && !body.success)) {
    throw new Error(body?.message ?? `Error HTTP ${response.status}`);
  }

  return body?.data as T;
}

export async function apiVoid(
  path: string,
  options: RequestInit = {},
  authenticated = true,
): Promise<void> {
  await apiRequest<unknown>(path, options, authenticated);
}

export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const apiUrl = new URL(BASE_URL);
  return `${apiUrl.origin}${path.startsWith('/') ? path : `/${path}`}`;
}

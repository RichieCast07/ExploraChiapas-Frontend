export function logout(): void {
  localStorage.clear();
  window.location.href = '/login';
}

export async function fetchAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('token');
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token ?? ''}`,
    },
  });
  if (res.status === 401) {
    logout();
    throw new Error('Sesión expirada');
  }
  return res;
}

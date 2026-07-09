import type {
  User,
  UserType,
} from "../../../features/Auth/data/models/User";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";
const USER_NAME_KEY = "user_name";
const USER_ROLE_KEY = "user_role";

export function saveSession(user: User): void {
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(USER_NAME_KEY, user.name);
  localStorage.setItem(USER_ROLE_KEY, user.userType);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    clearSession();
    return null;
  }
}

export function getUserRole(): UserType | null {
  return getStoredUser()?.userType ?? null;
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

export function logout(): void {
  clearSession();
  window.location.href = "/login";
}

export async function fetchAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  if (!token) {
    throw new Error("No hay una sesión activa");
  }

  const headers = new Headers(options.headers);

  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
    window.location.href = "/login";
    throw new Error("La sesión expiró");
  }

  return response;
}
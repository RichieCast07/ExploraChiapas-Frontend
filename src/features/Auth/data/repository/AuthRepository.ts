import type {
  ApiUser,
  User,
} from "../models/User";

import { BASE_URL } from "../../../../core/shared/config/api";
import { fetchAuth } from "../../../../core/shared/utils/auth";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    message?: string;
  }>;
}

interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string | null;
  password?: string;
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  getProfile(): Promise<ApiUser>;
  updateProfile(data: UpdateProfileInput): Promise<ApiUser>;
  deleteProfile(): Promise<void>;
}

function getErrorMessage<T>(
  body: ApiResponse<T> | null,
  fallback: string
): string {
  const validationMessage = body?.errors?.[0]?.message;

  return validationMessage ?? body?.message ?? fallback;
}

async function readApiResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const body = (await response
    .json()
    .catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !body?.success || body.data === undefined) {
    throw new Error(
      getErrorMessage(body, fallbackMessage)
    );
  }

  return body.data;
}

export class AuthRepository implements IAuthRepository {
  async login(
    email: string,
    password: string
  ): Promise<User> {
    const response = await fetch(
      `${BASE_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const result = await readApiResponse<LoginResponse>(
      response,
      "No se pudo iniciar sesión"
    );

    return {
      ...result.user,
      token: result.token,
    };
  }

  async getProfile(): Promise<ApiUser> {
    const response = await fetchAuth(
      `${BASE_URL}/users/profile`
    );

    return readApiResponse<ApiUser>(
      response,
      "No se pudo obtener el perfil"
    );
  }

  async updateProfile(
    data: UpdateProfileInput
  ): Promise<ApiUser> {
    const response = await fetchAuth(
      `${BASE_URL}/users/profile`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );

    return readApiResponse<ApiUser>(
      response,
      "No se pudo actualizar el perfil"
    );
  }

  async deleteProfile(): Promise<void> {
    const response = await fetchAuth(
      `${BASE_URL}/users/profile`,
      {
        method: "DELETE",
      }
    );

    const body = (await response
      .json()
      .catch(() => null)) as ApiResponse<unknown> | null;

    if (!response.ok || !body?.success) {
      throw new Error(
        getErrorMessage(
          body,
          "No se pudo eliminar la cuenta"
        )
      );
    }
  }
}
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

export type AdminUserType =
  | 'turista_nacional'
  | 'turista_extranjero'
  | 'habitante_local'
  | 'admin_negocio'
  | 'admin_plataforma';

export interface AdminUser {
  id: string;
  nombre: string;
  email: string;
  tipoUsuario: AdminUserType;
  activo: boolean;
  fechaRegistro: string;
}

interface UpdateUserResult {
  id: string;
  activo: boolean;
  tipoUsuario: AdminUserType;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    message?: string;
  }>;
}

interface UpdateUserInput {
  activo?: boolean;
  tipoUsuarioNombre?: AdminUserType;
}

function getErrorMessage<T>(
  body: ApiResponse<T> | null,
  fallback: string,
): string {
  return (
    body?.errors?.[0]?.message ??
    body?.message ??
    fallback
  );
}

export function useAdminUsersViewModel() {
  const [usuarios, setUsuarios] =
    useState<AdminUser[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [updatingUserId, setUpdatingUserId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const cargarUsuarios = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAuth(
        `${BASE_URL}/admin/users?limit=200&offset=0`,
      );

      const body =
        (await response.json()) as ApiResponse<AdminUser[]>;

      if (!response.ok || !body.success) {
        throw new Error(
          getErrorMessage(
            body,
            'No se pudieron cargar los usuarios',
          ),
        );
      }

      setUsuarios(body.data ?? []);
    } catch (requestError) {
      setUsuarios([]);

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error de conexión con el servidor',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarUsuario = async (
    userId: string,
    input: UpdateUserInput,
  ): Promise<boolean> => {
    setUpdatingUserId(userId);
    setError(null);

    try {
      const response = await fetchAuth(
        `${BASE_URL}/admin/users/${userId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(input),
        },
      );

      const body =
        (await response.json()) as ApiResponse<UpdateUserResult>;

      if (
        !response.ok ||
        !body.success ||
        !body.data
      ) {
        throw new Error(
          getErrorMessage(
            body,
            'No se pudo actualizar el usuario',
          ),
        );
      }

      const updatedUser = body.data;

      setUsuarios((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? {
                ...user,
                activo: updatedUser.activo,
                tipoUsuario:
                  updatedUser.tipoUsuario,
              }
            : user,
        ),
      );

      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error al actualizar el usuario',
      );

      return false;
    } finally {
      setUpdatingUserId(null);
    }
  };

  const cambiarEstado = (
    user: AdminUser,
  ): Promise<boolean> =>
    actualizarUsuario(user.id, {
      activo: !user.activo,
    });

  const cambiarTipoUsuario = (
    userId: string,
    tipoUsuario: AdminUserType,
  ): Promise<boolean> =>
    actualizarUsuario(userId, {
      tipoUsuarioNombre: tipoUsuario,
    });

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  return {
    usuarios,
    isLoading,
    updatingUserId,
    error,
    cargarUsuarios,
    cambiarEstado,
    cambiarTipoUsuario,
  };
}
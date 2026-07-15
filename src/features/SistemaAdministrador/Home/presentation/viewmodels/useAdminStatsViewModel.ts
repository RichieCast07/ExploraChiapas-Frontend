import { useCallback, useEffect, useState } from 'react';

import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface SystemStats {
  totalUsuarios: number;
  totalDestinos: number;
  totalNegocios: number;
  negociosVerificados: number;
  totalEventos: number;
  totalResenas: number;
  totalRutas: number;
  totalFavoritosDestinos: number;
  totalFavoritosNegocios: number;
}

export function useAdminStatsViewModel() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAuth(
        `${BASE_URL}/stats/system`,
      );

      const body =
        (await response.json()) as ApiResponse<SystemStats>;

      if (
        !response.ok ||
        !body.success ||
        !body.data
      ) {
        throw new Error(
          body.message ??
            'No se pudieron cargar las estadísticas',
        );
      }

      setStats(body.data);
    } catch (requestError) {
      setStats(null);

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error de conexión con el servidor',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  return {
    stats,
    isLoading,
    error,
    recargar: cargar,
  };
}
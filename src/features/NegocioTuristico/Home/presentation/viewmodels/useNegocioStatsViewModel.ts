import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface Negocio {
  id: string;
  name: string;
  isVerified: boolean;
}

interface ApiNegocioStats {
  negocioId: string;
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
}

interface NegocioStats {
  negocioNombre: string;
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
  isVerified: boolean;
}

export function useNegocioStatsViewModel() {
  const [stats, setStats] = useState<NegocioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const negociosResponse = await fetchAuth(`${BASE_URL}/businesses/mine`);
        const negociosBody = (await negociosResponse.json()) as ApiResponse<Negocio[]>;

        if (!negociosResponse.ok || !negociosBody.success) {
          throw new Error(negociosBody.message ?? 'No se pudieron cargar tus negocios');
        }

        const negocio = negociosBody.data?.[0];

        if (!negocio) {
          setError('No tienes negocios registrados');
          return;
        }

        const statsResponse = await fetchAuth(`${BASE_URL}/stats/businesses/${negocio.id}`);
        const statsBody = (await statsResponse.json()) as ApiResponse<ApiNegocioStats>;

        if (!statsBody.success || !statsBody.data) {
          throw new Error(statsBody.message ?? 'Error al cargar estadísticas');
        }

        setStats({
          negocioNombre: negocio.name,
          totalFavoritos: statsBody.data.totalFavoritos,
          calificacionPromedio: statsBody.data.calificacionPromedio,
          totalResenas: statsBody.data.totalResenas,
          isVerified: Boolean(negocio.isVerified),
        });
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Error de conexión con el servidor',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void cargarEstadisticas();
  }, []);

  return { stats, isLoading, error };
}

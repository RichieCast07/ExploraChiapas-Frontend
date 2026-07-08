import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

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
    fetchAuth(`${BASE_URL}/businesses/mine`)
      .then(res => res.json())
      .then(async body => {
        if (!body.success || !body.data?.length) {
          setError('No tienes negocios registrados');
          setIsLoading(false);
          return;
        }

        const negocio = body.data[0];

        const statsRes = await fetchAuth(`${BASE_URL}/stats/businesses/${negocio.id}`);
        const statsBody = await statsRes.json();

        if (statsBody.success) {
          setStats({
            negocioNombre: negocio.name,
            totalFavoritos: statsBody.data.totalFavoritos,
            calificacionPromedio: statsBody.data.calificacionPromedio,
            totalResenas: statsBody.data.totalResenas,
            isVerified: Boolean(negocio.isVerified),
          });
        } else {
          setError(statsBody.message ?? 'Error al cargar estadísticas');
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
}

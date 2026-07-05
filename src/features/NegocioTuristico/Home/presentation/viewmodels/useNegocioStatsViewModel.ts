import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface NegocioStats {
  negocioNombre: string;
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
}

export function useNegocioStatsViewModel() {
  const [stats, setStats] = useState<NegocioStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${BASE_URL}/businesses/mine`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    })
      .then(res => res.json())
      .then(async body => {
        if (!body.success || !body.data?.length) {
          setError('No tienes negocios registrados');
          setIsLoading(false);
          return;
        }

        const negocio = body.data[0];

        const statsRes = await fetch(`${BASE_URL}/stats/businesses/${negocio.id}`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        const statsBody = await statsRes.json();

        if (statsBody.success) {
          setStats({
            negocioNombre: negocio.name,
            totalFavoritos: statsBody.data.totalFavoritos,
            calificacionPromedio: statsBody.data.calificacionPromedio,
            totalResenas: statsBody.data.totalResenas,
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

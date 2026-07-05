import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface SystemStats {
  totalUsuarios: number;
  totalDestinos: number;
  totalNegocios: number;
  negociosVerificados: number;
}

export function useAdminStatsViewModel() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${BASE_URL}/stats/system`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    })
      .then(res => res.json())
      .then(body => {
        if (body.success) {
          setStats(body.data);
        } else {
          setError(body.message ?? 'Error al cargar estadísticas');
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
}

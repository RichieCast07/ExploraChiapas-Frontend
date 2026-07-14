import { useCallback, useEffect, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';

export interface AdminAnalyticsData {
  summary: {
    totalUsuarios: number;
    totalDestinos: number;
    totalNegocios: number;
    negociosVerificados: number;
    totalEventos: number;
    totalResenas: number;
    totalRutas: number;
    totalFavoritosDestinos: number;
    totalFavoritosNegocios: number;
    promedioCalificacionDestinos: number;
    afluenciaDestinos: number;
    visualizacionesNegocios: number;
    clicsReservaNegocios: number;
  };
  monthly: Array<{
    monthKey: string;
    month: string;
    users: number;
    routes: number;
    events: number;
  }>;
  topDestinations: Array<{
    id: string;
    name: string;
    municipality: string | null;
    category: string | null;
    visits: number;
    reviews: number;
    rating: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    total: number;
  }>;
}

export function useAdminAnalyticsViewModel() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await apiRequest<AdminAnalyticsData>('/stats/analytics'));
    } catch (requestError) {
      setData(null);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar los datos analíticos',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, reload: load };
}

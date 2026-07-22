import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  apiRequest,
} from '../../../../../core/shared/api/apiClient';

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

export interface AdminAnalyticsData {
  summary: SystemStats;

  /*
   * El backend actual todavía no expone
   * series históricas ni rankings globales.
   *
   * Se mantienen estas colecciones vacías
   * para no simular información.
   */
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
  const [
    data,
    setData,
  ] = useState<
    AdminAnalyticsData | null
  >(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const load =
    useCallback(
      async () => {
        setIsLoading(true);
        setError(null);

        try {
          const summary =
            await apiRequest<SystemStats>(
              '/stats/system',
            );

          setData({
            summary,

            /*
             * No inventar datos.
             *
             * Estas métricas se mostrarán
             * cuando exista un endpoint real
             * que las proporcione.
             */
            monthly: [],
            topDestinations: [],
            categoryDistribution: [],
          });
        } catch (
          requestError
        ) {
          setData(null);

          setError(
            requestError
              instanceof Error
              ? requestError.message
              : 'No se pudieron cargar las estadísticas del sistema',
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  return {
    data,
    isLoading,
    error,
    reload: load,
  };
}

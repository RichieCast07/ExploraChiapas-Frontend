import { useCallback, useEffect, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';

interface Business {
  id: string;
  name: string;
  isVerified: boolean;
}

interface BusinessStatsApi {
  negocioId: string;
  totalVisualizaciones: number;
  vecesEnRutas: number;
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
  totalServicios: number;
  promocionesActivas: number;
}

export interface RecentBusinessReview {
  id: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface NegocioStats extends BusinessStatsApi {
  negocioNombre: string;
  isVerified: boolean;
}

function emptyStats(business: Business): NegocioStats {
  return {
    negocioId: business.id,
    negocioNombre: business.name,
    isVerified: business.isVerified,
    totalVisualizaciones: 0,
    vecesEnRutas: 0,
    totalFavoritos: 0,
    calificacionPromedio: 0,
    totalResenas: 0,
    totalServicios: 0,
    promocionesActivas: 0,
  };
}

export function useNegocioStatsViewModel() {
  const [stats, setStats] = useState<NegocioStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<
    RecentBusinessReview[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const businesses = await apiRequest<Business[]>(
        '/businesses/mine',
      );

      const business = businesses[0];

      if (!business) {
        setStats(null);
        setRecentReviews([]);
        setError('No tienes un negocio registrado');
        return;
      }

      /*
       * El backend únicamente permite consultar estadísticas
       * cuando el negocio ya está aprobado y verificado.
       */
      if (!business.isVerified) {
        setStats(emptyStats(business));
        setRecentReviews([]);
        return;
      }

      const [businessStats, reviews] = await Promise.all([
        apiRequest<BusinessStatsApi>(
          `/stats/businesses/${business.id}`,
        ),
        apiRequest<RecentBusinessReview[]>(
          `/reviews?targetType=business&targetId=${encodeURIComponent(
            business.id,
          )}`,
        ),
      ]);

      const orderedReviews = [...reviews]
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        )
        .slice(0, 3);

      setStats({
        ...businessStats,
        negocioNombre: business.name,
        isVerified: business.isVerified,
      });

      setRecentReviews(orderedReviews);
    } catch (requestError) {
      setStats(null);
      setRecentReviews([]);

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
    void load();
  }, [load]);

  return {
    stats,
    recentReviews,
    isLoading,
    error,
    reload: load,
  };
}
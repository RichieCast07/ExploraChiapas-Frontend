import { useCallback, useEffect, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';

interface Business {
  id: string;
  name: string;
}

interface BusinessStatsApi {
  negocioId: string;
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
  visualizaciones: number;
  clicsReserva: number;
  vecesEnRutas: number;
}

interface Promotion {
  id: string;
  activo: boolean;
  fechaInicio: string;
  fechaFin: string | null;
}

export interface RecentBusinessReview {
  id: string;
  userName: string;
  rating: number;
  comment: string | null;
  response: string | null;
  createdAt: string;
}

export interface NegocioStats extends BusinessStatsApi {
  negocioNombre: string;
  promocionesActivas: number;
}

function isActivePromotion(promotion: Promotion): boolean {
  if (!promotion.activo) return false;
  const now = new Date();
  const start = new Date(`${promotion.fechaInicio}T00:00:00`);
  const end = promotion.fechaFin ? new Date(`${promotion.fechaFin}T23:59:59`) : null;
  return start <= now && (!end || end >= now);
}

export function useNegocioStatsViewModel() {
  const [stats, setStats] = useState<NegocioStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<RecentBusinessReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const businesses = await apiRequest<Business[]>('/businesses/mine');
      const business = businesses[0];
      if (!business) {
        setStats(null);
        setRecentReviews([]);
        setError('No tienes negocios registrados');
        return;
      }

      const [businessStats, promotions, reviews] = await Promise.all([
        apiRequest<BusinessStatsApi>(`/stats/businesses/${business.id}`),
        apiRequest<Promotion[]>(`/promotions?negocioId=${encodeURIComponent(business.id)}`, {}, false),
        apiRequest<RecentBusinessReview[]>(`/reviews/business/${business.id}`),
      ]);

      setStats({
        ...businessStats,
        negocioNombre: business.name,
        promocionesActivas: promotions.filter(isActivePromotion).length,
      });
      setRecentReviews(reviews.slice(0, 3));
    } catch (requestError) {
      setStats(null);
      setRecentReviews([]);
      setError(requestError instanceof Error ? requestError.message : 'Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, recentReviews, isLoading, error, reload: load };
}

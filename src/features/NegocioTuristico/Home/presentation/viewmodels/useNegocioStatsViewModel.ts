import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

interface Business {
  id: string;
  name: string;
  isVerified: boolean;
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
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
  isVerified: boolean;
}

export function useNegocioStatsViewModel() {
  const [stats, setStats] = useState<NegocioStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<RecentBusinessReview[]>([]);
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

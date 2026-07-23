import {
  useEffect,
  useState,
} from 'react';

import {
  BASE_URL,
} from '../../../../../core/shared/config/api';

import {
  fetchAuth,
} from '../../../../../core/shared/utils/auth';

export interface Resena {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  calificacion: number;
  comentario: string | null;
  fecha: string;
}

interface ResenasStats {
  promedio: number;
  total: number;
  distribucion: {
    estrellas: number;
    porcentaje: number;
  }[];
}

interface ReviewApiItem {
  id: string;
  userId: string;
  businessId: string;
  businessName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export function useReseñasViewModel() {
  const [resenas, setResenas] =
    useState<Resena[]>([]);

  const [stats, setStats] =
    useState<ResenasStats | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response =
          await fetchAuth(
            `${BASE_URL}/reviews/business/mine`,
          );

        const body =
          await response.json();

        if (!response.ok || !body.success) {
          throw new Error(
            body.message ??
            'Error al cargar reseñas',
          );
        }

        const items =
          (body.data ?? []) as ReviewApiItem[];

        const data =
          items.map((review) => ({
            id: review.id,
            userId: review.userId,
            businessId: review.businessId,
            businessName: review.businessName,
            calificacion: Number(review.rating),
            comentario: review.comment,
            fecha: new Date(
              review.createdAt,
            ).toLocaleDateString(
              'es-MX',
              {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              },
            ),
          }));

        if (cancelled) return;

        setResenas(data);

        const promedio =
          data.length > 0
            ? data.reduce(
                (sum, review) =>
                  sum + review.calificacion,
                0,
              ) / data.length
            : 0;

        const distribucion =
          [5, 4, 3, 2, 1].map(
            (estrellas) => ({
              estrellas,
              porcentaje:
                data.length > 0
                  ? Math.round(
                      (
                        data.filter(
                          (review) =>
                            review.calificacion ===
                            estrellas,
                        ).length /
                        data.length
                      ) * 100,
                    )
                  : 0,
            }),
          );

        setStats({
          promedio:
            Math.round(promedio * 10) / 10,
          total: data.length,
          distribucion,
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Error de conexión',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    resenas,
    stats,
    isLoading,
    error,
  };
}

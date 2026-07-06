import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

export interface Resena {
  id: string;
  userId: string;
  calificacion: number;
  comentario: string | null;
  fecha: string;
}

interface ResenasStats {
  promedio: number;
  total: number;
  distribucion: { estrellas: number; porcentaje: number }[];
}

export function useReseñasViewModel() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [stats, setStats] = useState<ResenasStats | null>(null);
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

        const negocioId = body.data[0].id;

        const res = await fetch(`${BASE_URL}/reviews?targetType=business&targetId=${negocioId}`);
        const reviewBody = await res.json();

        if (!reviewBody.success) {
          setError(reviewBody.message ?? 'Error al cargar reseñas');
          setIsLoading(false);
          return;
        }

        const data: Resena[] = reviewBody.data.map((r: any) => ({
          id: r.id,
          userId: r.userId,
          calificacion: r.rating,
          comentario: r.comment,
          fecha: new Date(r.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
        }));

        setResenas(data);

        if (data.length > 0) {
          const promedio = data.reduce((sum, r) => sum + r.calificacion, 0) / data.length;
          const counts = [5, 4, 3, 2, 1].map(estrellas => ({
            estrellas,
            porcentaje: Math.round((data.filter(r => r.calificacion === estrellas).length / data.length) * 100),
          }));
          setStats({ promedio: Math.round(promedio * 10) / 10, total: data.length, distribucion: counts });
        } else {
          setStats({ promedio: 0, total: 0, distribucion: [5, 4, 3, 2, 1].map(e => ({ estrellas: e, porcentaje: 0 })) });
        }
      })
      .catch(() => setError('Error de conexión'))
      .finally(() => setIsLoading(false));
  }, []);

  return { resenas, stats, isLoading, error };
}

import { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface Negocio {
  id: string;
  name: string;
}

export interface Promocion {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number | null;
  negocioId: string;
  negocioNombre: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  activo: boolean;
  fechaCreacion: string;
}

export function usePromocionesViewModel() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [negocioNombre, setNegocioNombre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
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
        setPromociones([]);
        setError('No tienes negocios registrados');
        return;
      }

      setNegocioNombre(negocio.name);

      const promocionesResponse = await fetchAuth(
        `${BASE_URL}/promotions?negocioId=${encodeURIComponent(negocio.id)}`,
      );
      const promocionesBody = (await promocionesResponse.json()) as ApiResponse<Promocion[]>;

      if (!promocionesResponse.ok || !promocionesBody.success) {
        throw new Error(promocionesBody.message ?? 'No se pudieron cargar las promociones');
      }

      setPromociones(promocionesBody.data ?? []);
    } catch (requestError) {
      setPromociones([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error de conexión con el servidor',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const eliminar = async (id: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await fetchAuth(`${BASE_URL}/promotions/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as ApiResponse<unknown> | null;
        throw new Error(body?.message ?? 'No se pudo eliminar la promoción');
      }

      setPromociones(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error al eliminar la promoción',
      );
      return false;
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  return { promociones, negocioNombre, isLoading, error, eliminar, recargar: cargar };
}

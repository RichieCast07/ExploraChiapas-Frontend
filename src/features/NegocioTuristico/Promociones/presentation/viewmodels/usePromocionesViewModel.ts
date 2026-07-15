import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

export interface Promocion {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number | null;
  negocioNombre: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  activo: boolean;
}

export function usePromocionesViewModel() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setIsLoading(true);
    try {
      const negocioRes = await fetchAuth(`${BASE_URL}/businesses/mine`);
      const negocioBody = await negocioRes.json();

      if (!negocioBody.success || !negocioBody.data?.length) {
        setError('No tienes negocios registrados');
        return;
      }

      const negocioId = negocioBody.data[0].id;
      const res = await fetch(`${BASE_URL}/promotions?negocioId=${negocioId}`);
      const body = await res.json();

      if (body.success) {
        setPromociones(body.data);
      } else {
        setError(body.message ?? 'Error al cargar promociones');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const eliminar = async (id: string) => {
    const res = await fetchAuth(`${BASE_URL}/promotions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPromociones(prev => prev.filter(p => p.id !== id));
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return { promociones, isLoading, error, eliminar };
}

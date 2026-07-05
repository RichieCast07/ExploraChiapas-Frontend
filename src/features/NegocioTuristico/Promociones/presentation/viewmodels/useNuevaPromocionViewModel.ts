import { useState, useEffect } from 'react';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { fetchAuth } from '../../../../../core/shared/utils/auth';

export function useNuevaPromocionViewModel() {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [negocioId, setNegocioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuth(`${BASE_URL}/businesses/mine`)
      .then(res => res.json())
      .then(body => {
        if (body.success && body.data?.length) {
          setNegocioId(body.data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const publicar = async (): Promise<boolean> => {
    if (!negocioId) {
      setError('No tienes un negocio registrado');
      return false;
    }
    if (!titulo.trim() || !fechaInicio) {
      setError('El título y la fecha de inicio son requeridos');
      return false;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetchAuth(`${BASE_URL}/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo,
          descripcion: descripcion || null,
          precio: precio ? Number(precio) : null,
          negocioId,
          fechaInicio,
          fechaFin: fechaFin || null,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.message ?? 'Error al publicar la promoción');
        return false;
      }

      return true;
    } catch {
      setError('Error de conexión con el servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    titulo, setTitulo,
    precio, setPrecio,
    descripcion, setDescripcion,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    negocioId,
    isLoading,
    error,
    publicar,
  };
}

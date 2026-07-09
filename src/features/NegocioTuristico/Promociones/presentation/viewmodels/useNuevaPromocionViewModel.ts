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

export function useNuevaPromocionViewModel() {
  const [titulo, setTitulo] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [negocioId, setNegocioId] = useState<string | null>(null);
  const [negocioNombre, setNegocioNombre] = useState<string | null>(
    null,
  );

  const [isLoadingBusiness, setIsLoadingBusiness] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarNegocio = async () => {
      setIsLoadingBusiness(true);
      setError(null);

      try {
        const response = await fetchAuth(
          `${BASE_URL}/businesses/mine`,
        );

        const body =
          (await response.json()) as ApiResponse<Negocio[]>;

        if (!response.ok || !body.success) {
          throw new Error(
            body.message ??
              'No se pudo obtener el negocio',
          );
        }

        const negocio = body.data?.[0];

        if (!negocio) {
          setError('No tienes un negocio registrado');
          return;
        }

        setNegocioId(negocio.id);
        setNegocioNombre(negocio.name);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Error de conexión con el servidor',
        );
      } finally {
        setIsLoadingBusiness(false);
      }
    };

    void cargarNegocio();
  }, []);

  const publicar = async (): Promise<boolean> => {
    const tituloLimpio = titulo.trim();
    const descripcionLimpia = descripcion.trim();

    if (!negocioId) {
      setError('No tienes un negocio registrado');
      return false;
    }

    if (!tituloLimpio) {
      setError('El título es obligatorio');
      return false;
    }

    if (!fechaInicio) {
      setError('La fecha de inicio es obligatoria');
      return false;
    }

    if (
      fechaFin &&
      new Date(fechaFin).getTime() <
        new Date(fechaInicio).getTime()
    ) {
      setError(
        'La fecha final no puede ser anterior a la fecha de inicio',
      );
      return false;
    }

    const precioNumerico =
      precio.trim() === '' ? null : Number(precio);

    if (
      precioNumerico !== null &&
      (!Number.isFinite(precioNumerico) ||
        precioNumerico < 0)
    ) {
      setError('El precio debe ser un número válido');
      return false;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetchAuth(
        `${BASE_URL}/promotions`,
        {
          method: 'POST',
          body: JSON.stringify({
            titulo: tituloLimpio,
            descripcion:
              descripcionLimpia === ''
                ? null
                : descripcionLimpia,
            precio: precioNumerico,
            negocioId,
            fechaInicio,
            fechaFin: fechaFin || null,
          }),
        },
      );

      const body = (await response
        .json()
        .catch(() => null)) as ApiResponse<unknown> | null;

      if (!response.ok || !body?.success) {
        throw new Error(
          body?.message ??
            'No se pudo publicar la promoción',
        );
      }

      return true;
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Error de conexión con el servidor',
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    titulo,
    setTitulo,
    precio,
    setPrecio,
    descripcion,
    setDescripcion,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    negocioId,
    negocioNombre,
    isLoadingBusiness,
    isLoading,
    error,
    publicar,
  };
}
import {
  ImagePlus,
  Save,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  apiRequest,
  apiVoid,
  resolveMediaUrl,
} from '../../../../../core/shared/api/apiClient';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import './FormularioPromociones.css';

interface Business {
  id: string;
}

interface Promotion {
  id: string;
  titulo: string;
  descripcion: string | null;
  precio: number | null;
  imagenUrl: string | null;
  fechaInicio: string;
  fechaFin: string | null;
}

function inputDate(
  value: string | null,
): string {
  if (!value) return '';

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date
    .toISOString()
    .slice(0, 10);
}

export function EditarPromocionPage() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const [
    titulo,
    setTitulo,
  ] = useState('');

  const [
    descripcion,
    setDescripcion,
  ] = useState('');

  const [
    precio,
    setPrecio,
  ] = useState('');

  const [
    fechaInicio,
    setFechaInicio,
  ] = useState('');

  const [
    fechaFin,
    setFechaFin,
  ] = useState('');

  const [
    originalInicio,
    setOriginalInicio,
  ] = useState('');

  const [
    originalFin,
    setOriginalFin,
  ] = useState('');

  const [
    imageUrl,
    setImageUrl,
  ] = useState<string | null>(
    null,
  );

  const [
    imageFile,
    setImageFile,
  ] = useState<File | null>(
    null,
  );

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError(
          'Promoción inválida',
        );
        setLoading(false);
        return;
      }

      try {
        const businesses =
          await apiRequest<
            Business[]
          >(
            '/businesses/mine',
          );

        const business =
          businesses[0];

        if (!business) {
          throw new Error(
            'No tienes un negocio registrado',
          );
        }

        const promotions =
          await apiRequest<
            Promotion[]
          >(
            `/promotions?negocioId=${
              encodeURIComponent(
                business.id,
              )
            }`,
            {},
            false,
          );

        const promotion =
          promotions.find(
            (item) =>
              item.id === id,
          );

        if (!promotion) {
          throw new Error(
            'Promoción no encontrada',
          );
        }

        const start =
          inputDate(
            promotion.fechaInicio,
          );

        const end =
          inputDate(
            promotion.fechaFin,
          );

        setTitulo(
          promotion.titulo,
        );

        setDescripcion(
          promotion.descripcion ?? '',
        );

        setPrecio(
          promotion.precio
            ?.toString() ??
          '',
        );

        setFechaInicio(start);
        setFechaFin(end);

        setOriginalInicio(start);
        setOriginalFin(end);

        setImageUrl(
          resolveMediaUrl(
            promotion.imagenUrl,
          ),
        );
      } catch (
        requestError
      ) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo cargar la promoción',
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(
          previewUrl,
        );
      }
    },
    [previewUrl],
  );

  const selectImage = (
    event:
      React.ChangeEvent<
        HTMLInputElement
      >,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      ![
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(file.type)
    ) {
      setError(
        'La imagen debe ser JPG, PNG o WEBP.',
      );
      return;
    }

    if (
      file.size >
      12 * 1024 * 1024
    ) {
      setError(
        'La imagen no puede superar 12 MB.',
      );
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(
        previewUrl,
      );
    }

    setImageFile(file);

    setPreviewUrl(
      URL.createObjectURL(file),
    );

    setError(null);
  };

  const submit = async (
    event:
      React.FormEvent,
  ) => {
    event.preventDefault();

    if (!id) return;

    setSaving(true);
    setError(null);

    try {
      const numericPrice =
        precio.trim() === ''
          ? null
          : Number(precio);

      const payload:
        Record<
          string,
          unknown
        > = {
          titulo:
            titulo.trim(),

          descripcion:
            descripcion.trim() ||
            null,

          precio:
            numericPrice,
        };

      /*
       * No reenviamos fechas históricas
       * sin cambios.
       *
       * El backend permite editar eventos
       * antiguos mientras no intentemos
       * reemplazar una fecha por otra pasada.
       */
      if (
        fechaInicio !==
        originalInicio
      ) {
        payload.fechaInicio =
          fechaInicio;
      }

      if (
        fechaFin !==
        originalFin
      ) {
        payload.fechaFin =
          fechaFin || null;
      }

      await apiRequest(
        `/promotions/${id}`,
        {
          method: 'PATCH',

          body:
            JSON.stringify(
              payload,
            ),
        },
      );

      if (imageFile) {
        const formData =
          new FormData();

        formData.append(
          'imagen',
          imageFile,
        );

        await apiVoid(
          `/uploads/promociones/${id}`,
          {
            method: 'POST',
            body: formData,
          },
        );
      }

      navigate(
        '/negocio/promociones',
      );
    } catch (
      requestError
    ) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo actualizar la promoción',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PanelShell kind="business">
        <div className="ec-note">
          Cargando promoción...
        </div>
      </PanelShell>
    );
  }

  return (
    <PanelShell kind="business">
      <div className="ec-page">
        <div className="ec-page-header">
          <div>
            <div className="ec-breadcrumb">
              Promociones
              <span>›</span>
              Editar
            </div>

            <h1 className="ec-page-title">
              Editar promoción
            </h1>

            <p className="ec-page-subtitle">
              Modifica los datos,
              fechas o imagen de la
              promoción.
            </p>
          </div>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        <form
          className="ec-card new-promotion-form"
          onSubmit={submit}
        >
          <div className="ec-card__body ec-form-grid">
            <div className="ec-field">
              <label>
                Título
              </label>

              <input
                className="ec-input"
                value={titulo}
                minLength={3}
                required
                onChange={
                  (event) =>
                    setTitulo(
                      event.target.value,
                    )
                }
              />
            </div>

            <div className="ec-field">
              <label>
                Precio promocional
                (MXN)
              </label>

              <input
                className="ec-input"
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={
                  (event) =>
                    setPrecio(
                      event.target.value,
                    )
                }
              />
            </div>

            <div className="ec-field ec-field--full">
              <label>
                Descripción
              </label>

              <textarea
                className="ec-textarea"
                value={descripcion}
                onChange={
                  (event) =>
                    setDescripcion(
                      event.target.value,
                    )
                }
              />
            </div>

            <div className="ec-field">
              <label>
                Fecha de inicio
              </label>

              <input
                className="ec-input"
                type="date"
                value={fechaInicio}
                onChange={
                  (event) =>
                    setFechaInicio(
                      event.target.value,
                    )
                }
              />
            </div>

            <div className="ec-field">
              <label>
                Fecha de fin
              </label>

              <input
                className="ec-input"
                type="date"
                value={fechaFin}
                onChange={
                  (event) =>
                    setFechaFin(
                      event.target.value,
                    )
                }
              />
            </div>

            <div className="ec-field ec-field--full">
              <label>
                Imagen
              </label>

              <label className="promotion-upload">
                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    selectImage
                  }
                />

                {(
                  previewUrl ??
                  imageUrl
                ) ? (
                  <img
                    src={
                      previewUrl ??
                      imageUrl ??
                      undefined
                    }
                    alt="Imagen de promoción"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={28}
                    />

                    <strong>
                      Seleccionar imagen
                    </strong>
                  </>
                )}
              </label>
            </div>
          </div>

          <footer className="new-promotion-actions">
            <button
              className="ec-button"
              type="button"
              onClick={() =>
                navigate(
                  '/negocio/promociones',
                )
              }
            >
              Cancelar
            </button>

            <button
              className="ec-button ec-button--primary"
              type="submit"
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? 'Guardando...'
                : 'Guardar cambios'}
            </button>
          </footer>
        </form>
      </div>
    </PanelShell>
  );
}

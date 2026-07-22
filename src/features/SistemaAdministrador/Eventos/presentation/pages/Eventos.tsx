
import {
  CalendarDays,
  ChevronRight,
  ImagePlus,
  Info,
  MapPinned,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  apiRequest,
  apiVoid,
} from '../../../../../core/shared/api/apiClient';
import {
  LocationPickerMap,
  type MapCoordinates,
} from '../../../../../core/shared/components/LocationPickerMap';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';

import './Eventos.css';

interface Category {
  id: string;
  nombre: string;
}

interface Location {
  id: string;
}

interface CreatedEvent {
  id: string;
}

export function Eventos() {
  const navigate =
    useNavigate();

  const [
    categories,
    setCategories,
  ] =
    useState<Category[]>([]);

  const [
    imageFile,
    setImageFile,
  ] =
    useState<File | null>(null);

  const [
    imagePreview,
    setImagePreview,
  ] =
    useState<string | null>(null);

  const [
    form,
    setForm,
  ] =
    useState({
      title: '',
      categoryId: '',
      description: '',
      municipality: '',
      address: '',
      date: '',
      startTime: '10:00',
      endTime: '18:00',
      latitude: '16.7538',
      longitude: '-93.1159',
    });

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  useEffect(() => {
    apiRequest<Category[]>(
      '/categories?scope=eventos',
      {},
      false,
    )
      .then((data) => {
        setCategories(data);

        if (data[0]) {
          setForm(
            (current) => ({
              ...current,
              categoryId:
                data[0].id,
            }),
          );
        }
      })
      .catch(
        (
          requestError: unknown,
        ) =>
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No se pudieron cargar las categorías',
          ),
      );
  }, []);

  useEffect(
    () => () => {
      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview,
        );
      }
    },
    [imagePreview],
  );

  const coordinates: MapCoordinates = {
    lat:
      Number(form.latitude) ||
      16.7538,
    lng:
      Number(form.longitude) ||
      -93.1159,
  };

  const updateCoordinates = (
    next: MapCoordinates,
  ) => {
    setForm(
      (current) => ({
        ...current,
        latitude:
          String(next.lat),
        longitude:
          String(next.lng),
      }),
    );
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowed = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowed.includes(file.type)) {
      setError(
        'La imagen debe ser JPG, PNG o WEBP.',
      );
      event.target.value = '';
      return;
    }

    if (
      file.size >
      12 * 1024 * 1024
    ) {
      setError(
        'La imagen no puede superar 12 MB.',
      );
      event.target.value = '';
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview,
      );
    }

    setError(null);
    setImageFile(file);
    setImagePreview(
      URL.createObjectURL(file),
    );
  };

  const submit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const location =
        await apiRequest<Location>(
          '/locations',
          {
            method: 'POST',
            body: JSON.stringify({
              latitude:
                Number(
                  form.latitude,
                ),
              longitude:
                Number(
                  form.longitude,
                ),
              address:
                form.address.trim() ||
                null,
              municipality:
                form.municipality.trim() ||
                null,
              state: 'Chiapas',
              mapProvider:
                'manual',
            }),
          },
        );

      const start =
        new Date(
          `${form.date}T${form.startTime}:00`,
        );

      const end =
        new Date(
          `${form.date}T${form.endTime}:00`,
        );

      const createdEvent =
        await apiRequest<CreatedEvent>(
          '/events',
          {
            method: 'POST',
            body: JSON.stringify({
              titulo:
                form.title.trim(),
              descripcion:
                form.description.trim() ||
                null,
              fechaInicio:
                start.toISOString(),
              fechaFin:
                end.toISOString(),
              ubicacionId:
                location.id,
              categoriaId:
                form.categoryId ||
                null,
            }),
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
          `/uploads/eventos/${createdEvent.id}`,
          {
            method: 'POST',
            body: formData,
          },
        );
      }

      navigate(
        '/admin/eventos',
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo crear el evento',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-event-form-page">
        <div className="ec-breadcrumb">
          Panel Administrativo
          <ChevronRight size={13} />
          Eventos
          <ChevronRight size={13} />
          Nuevo Evento
        </div>

        <div className="ec-page-header">
          <div>
            <h1 className="ec-page-title">
              Crear evento
            </h1>

            <p className="ec-page-subtitle">
              Registra el evento, selecciona su ubicación
              en el mapa y agrega una imagen pública.
            </p>
          </div>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <section className="ec-card admin-event-form-card">
            <div className="ec-card__header admin-event-section-title">
              <h2>
                <Info size={18} />
                Información General
              </h2>
            </div>

            <div className="ec-card__body ec-form-grid">
              <div className="ec-field ec-field--full">
                <label>
                  Nombre del evento
                </label>

                <input
                  className="ec-input"
                  required
                  minLength={3}
                  value={
                    form.title
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Ej. Festival del Café"
                />
              </div>

              <div className="ec-field">
                <label>
                  Categoría
                </label>

                <select
                  className="ec-select"
                  required
                  value={
                    form.categoryId
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      categoryId:
                        event.target
                          .value,
                    })
                  }
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.nombre
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="ec-field ec-field--full">
                <label>
                  Descripción detallada
                </label>

                <textarea
                  className="ec-textarea"
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target
                          .value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          <section className="ec-card admin-event-form-card">
            <div className="ec-card__header admin-event-section-title">
              <h2>
                <MapPinned size={18} />
                Logística y Ubicación
              </h2>
            </div>

            <div className="ec-card__body ec-form-grid ec-form-grid--3">
              <div className="ec-field">
                <label>
                  Municipio
                </label>

                <input
                  className="ec-input"
                  required
                  value={
                    form.municipality
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      municipality:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field">
                <label>
                  Fecha del evento
                </label>

                <input
                  className="ec-input"
                  type="date"
                  required
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field">
                <label>
                  Hora de inicio
                </label>

                <input
                  className="ec-input"
                  type="time"
                  required
                  value={
                    form.startTime
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      startTime:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field">
                <label>
                  Hora de fin
                </label>

                <input
                  className="ec-input"
                  type="time"
                  required
                  value={
                    form.endTime
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      endTime:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field ec-field--full">
                <label>
                  Dirección o punto de encuentro
                </label>

                <input
                  className="ec-input"
                  value={
                    form.address
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      address:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field">
                <label>
                  Latitud
                </label>

                <input
                  className="ec-input"
                  type="number"
                  step="any"
                  value={
                    form.latitude
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      latitude:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field">
                <label>
                  Longitud
                </label>

                <input
                  className="ec-input"
                  type="number"
                  step="any"
                  value={
                    form.longitude
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      longitude:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="ec-field ec-field--full">
                <LocationPickerMap
                  coordinates={
                    coordinates
                  }
                  onChange={
                    updateCoordinates
                  }
                />
              </div>
            </div>
          </section>

          <section className="ec-card admin-event-form-card">
            <div className="ec-card__header admin-event-section-title">
              <h2>
                <ImagePlus size={18} />
                Imagen
              </h2>
            </div>

            <div className="ec-card__body">
              <label className="admin-event-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Vista previa del evento"
                  />
                ) : (
                  <>
                    <ImagePlus
                      size={28}
                    />

                    <strong>
                      Seleccionar imagen del evento
                    </strong>

                    <span>
                      JPG, PNG o WEBP. Máximo 12 MB.
                    </span>
                  </>
                )}
              </label>
            </div>
          </section>

          <div className="admin-event-form-actions">
            <button
              className="ec-button"
              type="button"
              onClick={() =>
                navigate(
                  '/admin/eventos',
                )
              }
            >
              Cancelar
            </button>

            <button
              className="ec-button ec-button--primary"
              type="submit"
              disabled={isSaving}
            >
              <CalendarDays
                size={17}
              />

              {isSaving
                ? 'Guardando...'
                : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </div>
    </PanelShell>
  );
}

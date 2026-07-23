import { Camera, Clock3, Eye, ImagePlus, Images, Plus, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import hero from '../../../../../assets/hero.png';
import { apiRequest, apiVoid, resolveMediaUrl } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './BusinessProfilePage.css';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

interface Business {
  id: string;
  name: string;
  description: string | null;
  locationId: string;
  address: string | null;
  municipality: string | null;
  state: string | null;
  priceFrom: number | null;
  imageUrl: string | null;
  isVerified: boolean;
  requestStatus: string | null;
}

interface Schedule {
  dayOfWeek: number;
  openingTime: string | null;
  closingTime: string | null;
  closed: boolean;
}

interface Service {
  id: string;
  name: string;
}

interface BusinessLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  municipality: string | null;
  state: string | null;
}


interface BusinessGalleryImage {
  id: string;
  businessId: string;
  imageUrl: string;
  description: string | null;
  order: number;
  isCover: boolean;
  createdAt: string;
}

const initialSchedules: Schedule[] = days.map((_, index) => ({
  dayOfWeek: index + 1,
  openingTime: null,
  closingTime: null,
  closed: true,
}));

function hhmm(value: string | null): string {
  return value?.slice(0, 5) ?? '09:00';
}

export function BusinessProfilePage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [state, setState] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [persistedServices, setPersistedServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [gallery, setGallery] = useState<BusinessGalleryImage[]>([]);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);
  const [deletingGalleryImageId, setDeletingGalleryImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const coverUrl = useMemo(
    () => coverPreview ?? resolveMediaUrl(business?.imageUrl) ?? hero,
    [business?.imageUrl, coverPreview],
  );

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const businesses = await apiRequest<Business[]>('/businesses/mine');
      const selected = businesses[0] ?? null;
      setBusiness(selected);
      if (!selected) return;

      setName(selected.name);
      setDescription(selected.description ?? '');
      setPrice(selected.priceFrom?.toString() ?? '');

      const [
        loadedLocation,
        loadedSchedules,
        loadedServices,
        loadedGallery,
      ] = await Promise.all([
        apiRequest<BusinessLocation>(
          `/locations/${selected.locationId}`,
          {},
          false,
        ),

        apiRequest<Schedule[]>(
          `/businesses/${selected.id}/schedules`,
        ),

        apiRequest<Service[]>(
          `/businesses/${selected.id}/services`,
          {},
          false,
        ),

        apiRequest<BusinessGalleryImage[]>(
          `/businesses/${selected.id}/gallery`,
          {},
          false,
        ),
      ]);

      setAddress(loadedLocation.address ?? '');
      setMunicipality(loadedLocation.municipality ?? '');
      setState(loadedLocation.state ?? '');

      if (loadedSchedules.length) {
        setSchedules(loadedSchedules);
      }

      setPersistedServices(loadedServices);
      setGallery(loadedGallery);
      setServices(
        loadedServices.map(
          (service) => service.name,
        ),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadProfile(); }, []);

  const updateSchedule = (dayOfWeek: number, patch: Partial<Schedule>) => {
    setSchedules((current) => current.map((schedule) => (
      schedule.dayOfWeek === dayOfWeek ? { ...schedule, ...patch } : schedule
    )));
  };

  const addService = () => {
    const clean = newService.trim();
    if (!clean || services.some((service) => service.toLowerCase() === clean.toLowerCase())) return;
    setServices((current) => [...current, clean]);
    setNewService('');
  };

  const handleCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const uploadGalleryImages = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!business) return;

    const files = Array.from(event.target.files ?? []);

    event.target.value = '';

    if (!files.length) return;

    if (files.length > 10) {
      setError('Puedes subir hasta 10 fotografías a la vez.');
      return;
    }

    const allowedTypes = new Set([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]);

    const invalidFile = files.find(
      (file) => !allowedTypes.has(file.type),
    );

    if (invalidFile) {
      setError('La galería acepta únicamente imágenes JPG, PNG o WEBP.');
      return;
    }

    setIsGalleryUploading(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append('imagenes', file);
      });

      const updatedGallery =
        await apiRequest<BusinessGalleryImage[]>(
          `/businesses/${business.id}/gallery`,
          {
            method: 'POST',
            body: formData,
          },
        );

      setGallery(updatedGallery);

      setMessage(
        files.length === 1
          ? 'Fotografía agregada a la galería.'
          : `${files.length} fotografías agregadas a la galería.`,
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron subir las fotografías',
      );
    } finally {
      setIsGalleryUploading(false);
    }
  };

  const deleteGalleryImage = async (
    image: BusinessGalleryImage,
  ) => {
    if (!business) return;

    const confirmed = window.confirm(
      '¿Eliminar esta fotografía de la galería?',
    );

    if (!confirmed) return;

    setDeletingGalleryImageId(image.id);
    setError(null);
    setMessage(null);

    try {
      const updatedGallery =
        await apiRequest<BusinessGalleryImage[]>(
          `/businesses/${business.id}/gallery/${image.id}`,
          {
            method: 'DELETE',
          },
        );

      setGallery(updatedGallery);
      setMessage('Fotografía eliminada de la galería.');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo eliminar la fotografía',
      );
    } finally {
      setDeletingGalleryImageId(null);
    }
  };

  const save = async () => {
    if (!business) return;
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await apiRequest<Business>(`/businesses/${business.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          priceFrom: price.trim() === '' ? null : Number(price),
        }),
      });

      await apiRequest(`/locations/${business.locationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          address: address.trim() || null,
          municipality: municipality.trim() || null,
          state: state.trim() || null,
        }),
      });

      await apiVoid(`/businesses/${business.id}/schedules`, {
        method: 'PUT',
        body: JSON.stringify({
          schedules: schedules.map((schedule) => ({
            dayOfWeek: schedule.dayOfWeek,
            openingTime: schedule.closed ? null : `${hhmm(schedule.openingTime)}:00`,
            closingTime: schedule.closed ? null : `${hhmm(schedule.closingTime)}:00`,
            closed: schedule.closed,
          })),
        }),
      });

      const normalizedServices = services
        .map((service) => service.trim())
        .filter(
          (service, index, all) =>
            service.length > 0 &&
            all.findIndex(
              (candidate) =>
                candidate.toLowerCase() ===
                service.toLowerCase(),
            ) === index,
        );

      const desiredServiceNames = new Set(
        normalizedServices.map(
          (service) => service.toLowerCase(),
        ),
      );

      const persistedServiceNames = new Set(
        persistedServices.map(
          (service) => service.name.toLowerCase(),
        ),
      );

      const servicesToCreate =
        normalizedServices.filter(
          (service) =>
            !persistedServiceNames.has(
              service.toLowerCase(),
            ),
        );

      const servicesToDelete =
        persistedServices.filter(
          (service) =>
            !desiredServiceNames.has(
              service.name.toLowerCase(),
            ),
        );

      await Promise.all([
        ...servicesToCreate.map(
          (service) =>
            apiRequest<Service>(
              `/businesses/${business.id}/services`,
              {
                method: 'POST',
                body: JSON.stringify({
                  name: service,
                }),
              },
            ),
        ),

        ...servicesToDelete.map(
          (service) =>
            apiVoid(
              `/businesses/${business.id}/services/${service.id}`,
              {
                method: 'DELETE',
              },
            ),
        ),
      ]);

      if (coverFile) {
        const formData = new FormData();
        formData.append('imagen', coverFile);
        await apiVoid(`/uploads/negocios/${business.id}`, { method: 'POST', body: formData });
      }

      setMessage('Perfil, ubicación, horarios, servicios e imagen actualizados correctamente.');
      await loadProfile();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PanelShell kind="business">
      <div className="ec-page business-profile-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Negocios
              <span>›</span>
              Mis negocios
            </div>

            <h1 className="ec-page-title">
              Mis negocios
            </h1>

            <p className="ec-page-subtitle">
              Registra y administra los negocios
              asociados a tu cuenta.
            </p>
          </div>

          <div className="ec-actions">
            <Link
              className="ec-button ec-button--primary"
              to="/negocio/registrar"
            >
              <Plus size={16} />
              Registrar negocio
            </Link>
          </div>
        </div>

        <div className="ec-note">
          <strong>
            Verificación de negocios
          </strong>

          <div style={{ marginTop: 5 }}>
            Cada negocio registrado será evaluado
            por la administración de ExploraChiapas
            para comprobar su existencia y validar
            su información antes de mostrarse
            públicamente en la plataforma.
          </div>
        </div>
        {message && <div className="ec-note">{message}</div>}
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}
        {isLoading && <div className="ec-note">Cargando perfil del negocio...</div>}
        {!isLoading && !business && (
          <div className="ec-card ec-card__body">
            <h2>Aún no tienes un negocio registrado</h2>
            <p>Registra el establecimiento para poder editar su perfil.</p>
            <Link className="ec-button ec-button--primary" to="/negocio/registrar">Registrar negocio</Link>
          </div>
        )}

        {business && (
          <>
            <section className="business-profile-cover"><img src={coverUrl ?? hero} alt="Paisaje del negocio" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = hero; }} /><label className="ec-button" style={{ cursor: 'pointer' }}><input type="file" accept="image/*" hidden onChange={handleCover} /><Camera size={15} /> Editar Portada</label></section>

            <div className="business-profile-grid">
              <div className="business-profile-main">
                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Eye size={17} /> Información General</h2><span className={`ec-badge ${business.isVerified ? 'ec-badge--green' : 'ec-badge--orange'}`}>{business.requestStatus ?? (business.isVerified ? 'aprobado' : 'pendiente')}</span></div><div className="ec-card__body ec-form-grid"><div className="ec-field ec-field--full"><label>Nombre del Negocio</label><input className="ec-input" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="ec-field ec-field--full"><label>Descripción</label><textarea className="ec-textarea" value={description} onChange={(event) => setDescription(event.target.value)} /></div><div className="ec-field ec-field--full"><label>Dirección</label><input className="ec-input" value={address} onChange={(event) => setAddress(event.target.value)} /></div><div className="ec-field"><label>Municipio</label><input className="ec-input" value={municipality} onChange={(event) => setMunicipality(event.target.value)} /></div><div className="ec-field"><label>Estado</label><input className="ec-input" value={state} onChange={(event) => setState(event.target.value)} /></div></div></section>

                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Clock3 size={17} /> Gestión de Horarios</h2></div><div className="ec-card__body business-hours-list">{days.map((day, index) => { const schedule = schedules.find((item) => item.dayOfWeek === index + 1) ?? initialSchedules[index]; return <div key={day}><button className={`profile-toggle ${!schedule.closed ? 'active' : ''}`} type="button" onClick={() => updateSchedule(index + 1, { closed: !schedule.closed })}><span /></button><strong>{day}</strong><input type="time" value={hhmm(schedule.openingTime)} disabled={schedule.closed} onChange={(event) => updateSchedule(index + 1, { openingTime: event.target.value })} /><span>a</span><input type="time" value={hhmm(schedule.closingTime)} disabled={schedule.closed} onChange={(event) => updateSchedule(index + 1, { closingTime: event.target.value })} /></div>; })}</div></section>

                <section className="ec-card business-media-card">
                  <div className="ec-card__header business-profile-section-title business-media-header">
                    <div>
                      <h2>
                        <Images size={17} />
                        Fotografías del negocio
                      </h2>

                      <p>
                        Mantén una portada clara y una galería que muestre la experiencia real del establecimiento.
                      </p>
                    </div>

                    <span className="business-gallery-count">
                      {gallery.length}/20
                    </span>
                  </div>

                  <div className="business-media-body">
                    <div className="business-cover-editor">
                      <div className="business-media-label">
                        <strong>Portada</strong>
                        <span>Imagen principal mostrada en el perfil del negocio.</span>
                      </div>

                      <div className="business-cover-preview">
                        <img
                          src={coverUrl ?? hero}
                          alt="Portada del negocio"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = hero;
                          }}
                        />

                        <label
                          className="business-cover-action"
                          title="Cambiar portada"
                        >
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            hidden
                            onChange={handleCover}
                          />

                          <Camera size={17} />
                          Cambiar portada
                        </label>
                      </div>
                    </div>

                    <div className="business-gallery-divider" />

                    <div className="business-gallery-heading">
                      <div className="business-media-label">
                        <strong>Galería</strong>
                        <span>
                          Añade fotografías de habitaciones, platillos, instalaciones, productos o experiencias.
                        </span>
                      </div>
                    </div>

                    <div className="business-real-gallery">
                      {gallery.map((image) => {
                        const imageUrl =
                          resolveMediaUrl(image.imageUrl) ?? hero;

                        return (
                          <article
                            className="business-gallery-item"
                            key={image.id}
                          >
                            <img
                              src={imageUrl}
                              alt="Fotografía del negocio"
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src = hero;
                              }}
                            />

                            <div className="business-gallery-overlay">
                              <span>
                                Foto {image.order + 1}
                              </span>

                              <button
                                type="button"
                                title="Eliminar fotografía"
                                disabled={
                                  deletingGalleryImageId === image.id
                                }
                                onClick={() =>
                                  void deleteGalleryImage(image)
                                }
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </article>
                        );
                      })}

                      {gallery.length < 20 && (
                        <label
                          className={`business-gallery-upload ${
                            isGalleryUploading ? 'is-loading' : ''
                          }`}
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            hidden
                            disabled={isGalleryUploading}
                            onChange={(event) =>
                              void uploadGalleryImages(event)
                            }
                          />

                          <span className="business-gallery-upload-icon">
                            <ImagePlus size={23} />
                          </span>

                          <strong>
                            {isGalleryUploading
                              ? 'Subiendo...'
                              : 'Añadir fotos'}
                          </strong>

                          <small>
                            JPG, PNG o WEBP
                          </small>
                        </label>
                      )}
                    </div>

                    {!gallery.length && !isGalleryUploading && (
                      <div className="business-gallery-empty">
                        <Images size={20} />

                        <div>
                          <strong>Tu galería está vacía</strong>
                          <span>
                            Agrega imágenes para que los visitantes conozcan mejor tu negocio.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <aside className="business-profile-aside">
                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2>Rango de Precios</h2></div><div className="ec-card__body profile-price-box"><small>Costo Promedio (MXN)</small><div><span>$</span><input type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></div><p>Este valor ayuda a los usuarios a filtrar por presupuesto.</p></div></section>
                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Tag size={16} /> Servicios y Etiquetas</h2></div><div className="ec-card__body"><div className="profile-service-tags">{services.map((service) => <span key={service}>{service}<button type="button" onClick={() => setServices((current) => current.filter((item) => item !== service))}><X size={11} /></button></span>)}</div><div className="profile-add-tag"><input value={newService} onChange={(event) => setNewService(event.target.value)} placeholder="Agregar servicio..." /><button type="button" onClick={addService}><Plus size={15} /></button></div><small className="profile-suggestions">Sugeridos: <button type="button" onClick={() => setNewService('Desayuno')}>Desayuno</button><button type="button" onClick={() => setNewService('Piscina')}>Piscina</button><button type="button" onClick={() => setNewService('Spa')}>Spa</button></small></div></section>
                <div className={`business-visibility ${business.isVerified ? 'active' : ''}`}><Eye size={18} /><span><strong>Visibilidad del Perfil</strong><small>{business.isVerified ? 'Público y aprobado' : 'Pendiente de aprobación'}</small></span><i><b /></i></div>
                <button className="ec-button ec-button--primary business-profile-save" type="button" onClick={() => void save()} disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar cambios'}</button>
              </aside>
            </div>
          </>
        )}
      </div>
    </PanelShell>
  );
}

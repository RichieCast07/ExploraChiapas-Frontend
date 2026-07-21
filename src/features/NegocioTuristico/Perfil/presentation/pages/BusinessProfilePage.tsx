import { Camera, Clock3, Eye, ImagePlus, Plus, Tag, X } from 'lucide-react';
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

interface Service { id: string; name: string; }

const initialSchedules: Schedule[] = days.map((_, index) => ({
  dayOfWeek: index + 1,
  openingTime: '09:00',
  closingTime: '18:00',
  closed: index === 6,
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
  const [state, setState] = useState('Chiapas');
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
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
      setAddress(selected.address ?? '');
      setMunicipality(selected.municipality ?? '');
      setState(selected.state ?? 'Chiapas');

      const [loadedSchedules, loadedServices] = await Promise.all([
        apiRequest<Schedule[]>(`/businesses/${selected.id}/schedules`).catch(() => initialSchedules),
        apiRequest<Service[]>(`/businesses/${selected.id}/services`, {}, false).catch(() => []),
      ]);
      if (loadedSchedules.length) setSchedules(loadedSchedules);
      setServices(loadedServices.map((service) => service.name));
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

      await apiVoid(`/businesses/${business.id}/services`, {
        method: 'PUT',
        body: JSON.stringify({ services: services.map((service) => ({ name: service })) }),
      });

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
            <section className="business-profile-cover"><img src={coverUrl ?? hero} alt="Paisaje del negocio" /><label className="ec-button" style={{ cursor: 'pointer' }}><input type="file" accept="image/*" hidden onChange={handleCover} /><Camera size={15} /> Editar Portada</label></section>

            <div className="business-profile-grid">
              <div className="business-profile-main">
                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Eye size={17} /> Información General</h2><span className={`ec-badge ${business.isVerified ? 'ec-badge--green' : 'ec-badge--orange'}`}>{business.requestStatus ?? (business.isVerified ? 'aprobada' : 'pendiente')}</span></div><div className="ec-card__body ec-form-grid"><div className="ec-field ec-field--full"><label>Nombre del Negocio</label><input className="ec-input" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="ec-field ec-field--full"><label>Descripción</label><textarea className="ec-textarea" value={description} onChange={(event) => setDescription(event.target.value)} /></div><div className="ec-field ec-field--full"><label>Dirección</label><input className="ec-input" value={address} onChange={(event) => setAddress(event.target.value)} /></div><div className="ec-field"><label>Municipio</label><input className="ec-input" value={municipality} onChange={(event) => setMunicipality(event.target.value)} /></div><div className="ec-field"><label>Estado</label><input className="ec-input" value={state} onChange={(event) => setState(event.target.value)} /></div></div></section>

                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Clock3 size={17} /> Gestión de Horarios</h2></div><div className="ec-card__body business-hours-list">{days.map((day, index) => { const schedule = schedules.find((item) => item.dayOfWeek === index + 1) ?? initialSchedules[index]; return <div key={day}><button className={`profile-toggle ${!schedule.closed ? 'active' : ''}`} type="button" onClick={() => updateSchedule(index + 1, { closed: !schedule.closed })}><span /></button><strong>{day}</strong><input type="time" value={hhmm(schedule.openingTime)} disabled={schedule.closed} onChange={(event) => updateSchedule(index + 1, { openingTime: event.target.value })} /><span>a</span><input type="time" value={hhmm(schedule.closingTime)} disabled={schedule.closed} onChange={(event) => updateSchedule(index + 1, { closingTime: event.target.value })} /></div>; })}</div></section>

                <section className="ec-card"><div className="ec-card__header business-profile-section-title"><h2><Camera size={17} /> Imagen principal</h2></div><div className="business-profile-gallery"><div className="gallery-photo" style={{ overflow: 'hidden' }}>{coverUrl ? <img src={coverUrl} alt="Portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🌿'}</div><label><input type="file" accept="image/*" hidden onChange={handleCover} /><ImagePlus size={22} /><small>Nueva portada</small></label></div></section>
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

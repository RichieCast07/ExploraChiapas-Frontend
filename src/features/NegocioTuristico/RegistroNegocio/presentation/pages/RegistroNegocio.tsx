import { Camera, ImagePlus, Info, MapPin, Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiRequest, apiVoid } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './RegistroNegocio.css';

type Category = 'restaurante' | 'hotel' | 'actividad';

interface LocationResponse { id: string; }
interface BusinessResponse { id: string; name: string; requestStatus?: string | null; }

const serviceOptions: Record<Category, string[]> = {
  restaurante: ['Wi-Fi Gratis', 'Estacionamiento', 'Pet Friendly'],
  hotel: ['Desayuno incluido', 'Piscina', 'Room Service', 'Wi-Fi Gratis', 'Estacionamiento'],
  actividad: ['Guía incluido', 'Equipo incluido', 'Transporte', 'Seguro'],
};

const businessTypeByCategory: Record<Category, string> = {
  restaurante: 'Restaurante',
  hotel: 'Hotel',
  actividad: 'Operador turístico',
};

function normalizeTime(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

export function RegistroNegocio() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>('restaurante');
  const [services, setServices] = useState(serviceOptions.restaurante);
  const [newService, setNewService] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 16.7371, lng: -92.6375 });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [municipality, setMunicipality] = useState('Tuxtla Gutiérrez');
  const [state, setState] = useState('Chiapas');
  const [price, setPrice] = useState('');
  const [opening, setOpening] = useState('08:00');
  const [closing, setClosing] = useState('22:00');
  const [roomCount, setRoomCount] = useState('');
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState('4 horas');
  const [capacity, setCapacity] = useState('12');
  const [difficulty, setDifficulty] = useState('Media');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const descriptionForBackend = useMemo(() => {
    const details: string[] = [];
    if (description.trim()) details.push(description.trim());
    if (category === 'hotel') {
      if (roomCount) details.push(`Habitaciones: ${roomCount}`);
      if (roomTypes.length) details.push(`Tipos: ${roomTypes.join(', ')}`);
    }
    if (category === 'actividad') {
      details.push(`Duración: ${duration}`);
      details.push(`Capacidad: ${capacity} personas`);
      details.push(`Dificultad: ${difficulty}`);
    }
    return details.join('\n') || null;
  }, [capacity, category, description, difficulty, duration, roomCount, roomTypes]);

  const changeCategory = (next: Category) => {
    setCategory(next);
    setServices(serviceOptions[next]);
    if (next === 'hotel') {
      setOpening('15:00');
      setClosing('23:00');
    } else if (next === 'actividad') {
      setOpening('08:00');
      setClosing('12:00');
    } else {
      setOpening('08:00');
      setClosing('22:00');
    }
  };

  const addPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const accepted = files.slice(0, 3 - photoFiles.length);
    setPhotoFiles((current) => [...current, ...accepted].slice(0, 3));
    setPhotoUrls((current) => [
      ...current,
      ...accepted.map((file) => URL.createObjectURL(file)),
    ].slice(0, 3));
  };

  const addService = () => {
    const clean = newService.trim();
    if (!clean || services.some((service) => service.toLowerCase() === clean.toLowerCase())) return;
    setServices((current) => [...current, clean]);
    setNewService('');
  };

  const toggleRoomType = (roomType: string) => {
    setRoomTypes((current) => current.includes(roomType)
      ? current.filter((item) => item !== roomType)
      : [...current, roomType]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const location = await apiRequest<LocationResponse>('/locations', {
        method: 'POST',
        body: JSON.stringify({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          address: address.trim() || null,
          municipality: municipality.trim() || null,
          state: state.trim() || null,
          mapProvider: 'manual',
        }),
      });

      const business = await apiRequest<BusinessResponse>('/businesses', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          description: descriptionForBackend,
          businessTypeName: businessTypeByCategory[category],
          locationId: location.id,
          priceFrom: price.trim() === '' ? null : Number(price),
        }),
      });

      const schedules = Array.from({ length: 7 }, (_, index) => ({
        dayOfWeek: index + 1,
        openingTime: normalizeTime(opening),
        closingTime: normalizeTime(closing),
        closed: false,
      }));

      await apiVoid(`/businesses/${business.id}/schedules`, {
        method: 'PUT',
        body: JSON.stringify({ schedules }),
      });

      if (photoFiles[0]) {
        const formData = new FormData();
        formData.append('imagen', photoFiles[0]);

        await apiVoid(`/uploads/negocios/${business.id}`, {
          method: 'POST',
          body: formData,
        });
      }

      for (const service of services) {
        await apiVoid(`/businesses/${business.id}/services`, {
          method: 'POST',
          body: JSON.stringify({
            name: service,
          }),
        });
      }

      setMessage(`Negocio “${business.name}” registrado. La solicitud quedó pendiente de aprobación.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.setTimeout(() => navigate('/negocio/perfil'), 1200);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo registrar el negocio');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PanelShell kind="business">
      <div className="ec-page business-register-page">
        <div className="ec-page-header"><div><h1 className="ec-page-title">Detalles del Negocio</h1><p className="ec-page-subtitle">Comencemos con la información básica de tu establecimiento en Chiapas.</p></div></div>
        {message && <div className="ec-note">{message}</div>}
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}

        <form className="business-register-form" onSubmit={handleSubmit}>
          <div className="business-register-left">
            <section className="ec-card ec-card__body ec-field"><label>Nombre del Negocio</label><input className="ec-input" required minLength={3} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Restaurante Las Nubes" /></section>
            <section className="ec-card ec-card__body ec-field"><label>Descripción</label><textarea className="ec-textarea" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe el establecimiento, sus especialidades y lo que lo hace diferente." /></section>
            <section className="ec-card ec-card__body"><div className="ec-field"><label>Categoría</label><div className="business-category-options">{(['restaurante', 'hotel', 'actividad'] as Category[]).map((item) => <button key={item} className={category === item ? 'active' : ''} type="button" onClick={() => changeCategory(item)}>{item.charAt(0).toUpperCase() + item.slice(1)}</button>)}</div></div></section>

            {category === 'hotel' ? (
              <>
                <section className="ec-card ec-card__body ec-form-grid"><div className="ec-field"><label>Número de habitaciones</label><input className="ec-input" type="number" min="1" value={roomCount} onChange={(event) => setRoomCount(event.target.value)} placeholder="Ej. 25" /></div><div className="ec-field"><label>Tipo de habitaciones</label><div className="room-types">{['Sencilla', 'Doble', 'Suite'].map((roomType) => <label key={roomType}><input type="checkbox" checked={roomTypes.includes(roomType)} onChange={() => toggleRoomType(roomType)} /> {roomType}</label>)}</div></div></section>
                <section className="ec-card ec-card__body"><div className="ec-field"><label>Horarios de Check-in y Check-out</label><div className="ec-form-grid"><div className="ec-field"><small>CHECK-IN</small><input className="ec-input" type="time" value={opening} onChange={(event) => setOpening(event.target.value)} /></div><div className="ec-field"><small>CHECK-OUT</small><input className="ec-input" type="time" value={closing} onChange={(event) => setClosing(event.target.value)} /></div></div></div></section>
              </>
            ) : category === 'actividad' ? (
              <section className="ec-card ec-card__body ec-form-grid"><div className="ec-field"><label>Duración aproximada</label><input className="ec-input" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="Ej. 4 horas" /></div><div className="ec-field"><label>Capacidad por grupo</label><input className="ec-input" type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} /></div><div className="ec-field"><label>Hora de inicio</label><input className="ec-input" type="time" value={opening} onChange={(event) => setOpening(event.target.value)} /></div><div className="ec-field"><label>Hora de fin</label><input className="ec-input" type="time" value={closing} onChange={(event) => setClosing(event.target.value)} /></div><div className="ec-field"><label>Nivel de dificultad</label><select className="ec-select" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option>Baja</option><option>Media</option><option>Alta</option></select></div></section>
            ) : (
              <section className="ec-card ec-card__body"><div className="ec-field"><label>Horario de Operación</label><div className="ec-form-grid"><div className="ec-field"><small>APERTURA</small><input className="ec-input" type="time" value={opening} onChange={(event) => setOpening(event.target.value)} /></div><div className="ec-field"><small>CIERRE</small><input className="ec-input" type="time" value={closing} onChange={(event) => setClosing(event.target.value)} /></div></div></div></section>
            )}

            <section className="ec-card ec-card__body ec-field"><label>{category === 'hotel' ? 'Precio promedio por noche' : category === 'actividad' ? 'Precio por persona' : 'Consumo promedio'}</label><div className="business-price-input"><span>$</span><input className="ec-input" type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Ej. 500" /></div></section>
            <section className="ec-card ec-card__body"><div className="ec-field"><label>Servicios Disponibles</label><div className="business-service-tags">{services.map((service) => <span key={service}>{service}<button type="button" onClick={() => setServices((current) => current.filter((item) => item !== service))}><X size={12} /></button></span>)}</div><div style={{ display: 'flex', gap: 8 }}><input className="ec-input" value={newService} onChange={(event) => setNewService(event.target.value)} placeholder="Nuevo servicio" /><button className="business-add-service" type="button" onClick={addService}><Plus size={14} /> Agregar</button></div></div></section>
          </div>

          <div className="business-register-right">
            <section className="ec-card ec-card__body"><div className="business-map-heading"><strong>Ubicación Exacta</strong><button type="button" onClick={() => setCoordinates({ lat: coordinates.lat + 0.001, lng: coordinates.lng + 0.001 })}>AJUSTAR PIN</button></div><div className="ec-field"><label>Dirección</label><input className="ec-input" required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Calle, número y colonia" /></div><div className="ec-form-grid"><div className="ec-field"><label>Municipio</label><input className="ec-input" required value={municipality} onChange={(event) => setMunicipality(event.target.value)} /></div><div className="ec-field"><label>Estado</label><input className="ec-input" required value={state} onChange={(event) => setState(event.target.value)} /></div></div><div className="business-map-placeholder"><div className="map-road map-road--one" /><div className="map-road map-road--two" /><span><MapPin size={36} /></span></div><p className="business-map-hint"><Info size={13} /> Usa “Ajustar pin” para simular la selección del punto durante las pruebas.</p><small className="business-coordinates">{coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</small></section>
            <section className="ec-card ec-card__body"><strong className="business-gallery-title">Galería del Negocio</strong><div className="business-gallery-grid">{[0, 1, 2].map((index) => <label className={index === 0 ? 'main' : ''} key={index}><input type="file" accept="image/*" hidden onChange={addPhoto} />{photoUrls[index] ? <img src={photoUrls[index]} alt={`Negocio ${index + 1}`} /> : <><span>{index === 0 ? <Camera size={25} /> : <ImagePlus size={19} />}</span>{index === 0 && <small>PRINCIPAL</small>}</>}</label>)}</div><p className="business-gallery-hint">La primera imagen se guarda como portada. Las imágenes adicionales quedan listas para una futura galería.</p></section>
            <aside className="business-golden-tip"><MapPin size={18} /><div><strong>Consejo de Oro</strong><p>Los negocios con fotos y horarios precisos generan mayor confianza en los usuarios.</p></div></aside>
          </div>
          <button className="ec-button ec-button--primary business-register-submit" type="submit" disabled={isSaving}>{isSaving ? 'Registrando negocio...' : 'Continuar Registro'}</button>
        </form>
      </div>
    </PanelShell>
  );
}

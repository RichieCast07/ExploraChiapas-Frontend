import {
  CheckCircle2,
  Compass,
  FolderPlus,
  MapPin,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Settings2,
  Star,
  Tags,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { apiRequest, apiVoid } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './AdminGeneralPages.css';

interface Destination {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string | null;
  locationId: string;
  municipality: string | null;
  state: string | null;
  averageRating: number;
  totalReviews: number;
  active: boolean;
}

interface Category {
  id: string;
  nombre: string;
  icono: string | null;
  aplicaAEventos: boolean;
  aplicaADestinos: boolean;
  totalEventosActivos: number;
}

interface Location { id: string; }

interface Review {
  id: string;
  userName: string;
  targetType: 'destination' | 'business' | 'location';
  targetName: string | null;
  rating: number;
  comment: string | null;
  response: string | null;
  createdAt: string;
}

function ErrorNote({ message }: { message: string | null }) {
  return message ? <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{message}</div> : null;
}

export function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', description: '', categoryName: '', address: '', municipality: '',
    state: 'Chiapas', latitude: '16.7538', longitude: '-93.1159',
  });

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [destinationData, categoryData] = await Promise.all([
        apiRequest<Destination[]>('/destinations?limit=100', {}, false),
        apiRequest<Category[]>('/categories?scope=destinos', {}, false),
      ]);
      setDestinations(destinationData);
      setCategories(categoryData);
      if (!form.categoryName && categoryData[0]) {
        setForm((current) => ({ ...current, categoryName: categoryData[0].nombre }));
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los destinos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => destinations.filter((destination) => (
    `${destination.name} ${destination.categoryName ?? ''} ${destination.municipality ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )), [destinations, search]);

  const createDestination = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const location = await apiRequest<Location>('/locations', {
        method: 'POST',
        body: JSON.stringify({
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          address: form.address.trim() || null,
          municipality: form.municipality.trim() || null,
          state: form.state.trim() || null,
          mapProvider: 'manual',
        }),
      });
      await apiRequest('/destinations', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          categoryName: form.categoryName,
          locationId: location.id,
        }),
      });
      setForm({ name: '', description: '', categoryName: categories[0]?.nombre ?? '', address: '', municipality: '', state: 'Chiapas', latitude: '16.7538', longitude: '-93.1159' });
      setShowForm(false);
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo crear el destino');
    } finally {
      setIsSaving(false);
    }
  };

  const removeDestination = async (destination: Destination) => {
    if (!window.confirm(`¿Eliminar el destino “${destination.name}”?`)) return;
    try {
      await apiVoid(`/destinations/${destination.id}`, { method: 'DELETE' });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el destino');
    }
  };

  const municipalities = new Set(destinations.map((destination) => destination.municipality).filter(Boolean)).size;

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header"><div><div className="ec-breadcrumb">Gestión turística <span>›</span> Destinos</div><h1 className="ec-page-title">Gestión de Destinos</h1><p className="ec-page-subtitle">Administra los puntos de interés que se muestran en ExploraChiapas.</p></div><button className="ec-button ec-button--primary" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? <X size={16} /> : <Plus size={16} />}{showForm ? 'Cerrar formulario' : 'Nuevo destino'}</button></div>
        <ErrorNote message={error} />
        {showForm && <form className="ec-card ec-card__body ec-form-grid" onSubmit={createDestination}><div className="ec-field"><label>Nombre</label><input className="ec-input" required minLength={3} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div><div className="ec-field"><label>Categoría</label><select className="ec-select" required value={form.categoryName} onChange={(event) => setForm({ ...form, categoryName: event.target.value })}>{categories.map((category) => <option key={category.id}>{category.nombre}</option>)}</select></div><div className="ec-field ec-field--full"><label>Descripción</label><textarea className="ec-textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div><div className="ec-field ec-field--full"><label>Dirección</label><input className="ec-input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></div><div className="ec-field"><label>Municipio</label><input className="ec-input" value={form.municipality} onChange={(event) => setForm({ ...form, municipality: event.target.value })} /></div><div className="ec-field"><label>Estado</label><input className="ec-input" value={form.state} onChange={(event) => setForm({ ...form, state: event.target.value })} /></div><div className="ec-field"><label>Latitud</label><input className="ec-input" type="number" step="any" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} /></div><div className="ec-field"><label>Longitud</label><input className="ec-input" type="number" step="any" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} /></div><button className="ec-button ec-button--primary" type="submit" disabled={isSaving}>{isSaving ? 'Guardando...' : 'Guardar destino'}</button></form>}
        <section className="ec-stat-grid ec-stat-grid--3"><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Compass size={18} /></span></div><div><div className="ec-stat-card__label">Destinos publicados</div><div className="ec-stat-card__value">{destinations.length}</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><FolderPlus size={18} /></span></div><div><div className="ec-stat-card__label">Reseñas acumuladas</div><div className="ec-stat-card__value">{destinations.reduce((sum, destination) => sum + destination.totalReviews, 0)}</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><MapPin size={18} /></span></div><div><div className="ec-stat-card__label">Municipios cubiertos</div><div className="ec-stat-card__value">{municipalities}</div></div></article></section>
        <section className="ec-toolbar"><label className="ec-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar destino, categoría o municipio" /></label><button className="ec-button" type="button" onClick={() => void load()}>Actualizar</button></section>
        <section className="ec-card"><div className="ec-table-wrap"><table className="ec-table"><thead><tr><th>Destino</th><th>Categoría</th><th>Municipio</th><th>Reseñas</th><th>Calificación</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((destination) => <tr key={destination.id}><td><div className="ec-identity"><span className="destination-icon"><MapPin size={16} /></span><strong>{destination.name}</strong></div></td><td><span className="ec-badge">{destination.categoryName ?? 'Sin categoría'}</span></td><td>{destination.municipality ?? 'Sin municipio'}</td><td>{destination.totalReviews}</td><td><strong className="general-rating">★ {destination.averageRating.toFixed(1)}</strong></td><td><span className="ec-badge ec-badge--green">Publicado</span></td><td><button className="panel-icon-button" type="button" title="Eliminar" onClick={() => void removeDestination(destination)}><Trash2 size={17} /></button></td></tr>)}</tbody></table></div>{isLoading && <div className="ec-note">Cargando destinos...</div>}{!isLoading && filtered.length === 0 && <div className="ec-note">No hay destinos registrados.</div>}</section>
      </div>
    </PanelShell>
  );
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('✨');
  const [events, setEvents] = useState(true);
  const [destinations, setDestinations] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setCategories(await apiRequest<Category[]>('/categories?scope=todos', {}, false));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las categorías');
    }
  };
  useEffect(() => { void load(); }, []);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await apiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify({ nombre: name.trim(), icono: icon.trim() || null, aplicaAEventos: events, aplicaADestinos: destinations }),
      });
      setName(''); setIcon('✨'); setShowForm(false); await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo crear la categoría');
    }
  };

  const edit = async (category: Category) => {
    const nextName = window.prompt('Nombre de la categoría', category.nombre);
    if (!nextName?.trim()) return;
    const nextIcon = window.prompt('Icono', category.icono ?? '✨');
    try {
      await apiRequest(`/categories/${category.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ nombre: nextName.trim(), icono: nextIcon?.trim() || null }),
      });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la categoría');
    }
  };

  const remove = async (category: Category) => {
    if (!window.confirm(`¿Eliminar la categoría “${category.nombre}”?`)) return;
    try {
      await apiVoid(`/categories/${category.id}`, { method: 'DELETE' });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la categoría');
    }
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header"><div><div className="ec-breadcrumb">Gestión turística <span>›</span> Categorías</div><h1 className="ec-page-title">Categorías Turísticas</h1><p className="ec-page-subtitle">Organiza destinos y eventos mediante categorías reutilizables.</p></div><button className="ec-button ec-button--primary" type="button" onClick={() => setShowForm((value) => !value)}><Plus size={16} /> Nueva categoría</button></div>
        <ErrorNote message={error} />
        {showForm && <form className="ec-card ec-card__body ec-form-grid" onSubmit={create}><div className="ec-field"><label>Nombre</label><input className="ec-input" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} /></div><div className="ec-field"><label>Icono</label><input className="ec-input" value={icon} onChange={(event) => setIcon(event.target.value)} /></div><label><input type="checkbox" checked={events} onChange={(event) => setEvents(event.target.checked)} /> Disponible para eventos</label><label><input type="checkbox" checked={destinations} onChange={(event) => setDestinations(event.target.checked)} /> Disponible para destinos</label><button className="ec-button ec-button--primary" type="submit">Guardar categoría</button></form>}
        <section className="category-card-grid">{categories.map((category) => <article className="ec-card category-card" key={category.id}><div className="category-card__icon category-card__icon--green">{category.icono ?? '✨'}</div><div><h2>{category.nombre}</h2><p>{category.totalEventosActivos} eventos activos · {category.aplicaADestinos ? 'Destinos' : 'Sin destinos'}</p></div><div className="category-card__actions"><button type="button" onClick={() => void edit(category)}><Settings2 size={16} /></button><button type="button" onClick={() => void remove(category)}><Trash2 size={16} /></button></div></article>)}</section>
        <section className="ec-note"><Tags size={15} /> Las categorías se utilizan en los filtros de la aplicación móvil y en los formularios web.</section>
      </div>
    </PanelShell>
  );
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | Review['targetType']>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      setReviews(await apiRequest<Review[]>(`/reviews/admin/all?targetType=${filter}`));
      setError(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las reseñas');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { void load(); }, [filter]);

  const remove = async (review: Review) => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    try {
      await apiVoid(`/reviews/admin/${review.id}`, { method: 'DELETE' });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar la reseña');
    }
  };

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header"><div><div className="ec-breadcrumb">Operaciones <span>›</span> Comentarios y reseñas</div><h1 className="ec-page-title">Comentarios y Reseñas</h1><p className="ec-page-subtitle">Supervisa las opiniones publicadas y elimina contenido cuando corresponda.</p></div><select className="ec-select general-select" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">Todas</option><option value="business">Negocios</option><option value="destination">Destinos</option><option value="location">Ubicaciones</option></select></div>
        <ErrorNote message={error} />
        <section className="ec-stat-grid ec-stat-grid--3"><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><MessageSquareText size={18} /></span></div><div><div className="ec-stat-card__label">Reseñas mostradas</div><div className="ec-stat-card__value">{reviews.length}</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Star size={18} /></span></div><div><div className="ec-stat-card__label">Calificación promedio</div><div className="ec-stat-card__value">{average.toFixed(1)}</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--red"><MessageSquareText size={18} /></span></div><div><div className="ec-stat-card__label">Con respuesta</div><div className="ec-stat-card__value">{reviews.filter((review) => review.response).length}</div></div></article></section>
        <section className="ec-card"><div className="ec-card__header"><h2>Reseñas recientes</h2><button className="ec-button ec-button--sm" type="button" onClick={() => void load()}>Actualizar</button></div><div className="admin-review-list">{reviews.map((review) => <article key={review.id}><span className="ec-avatar">{review.userName.charAt(0).toUpperCase()}</span><div><div className="admin-review-top"><strong>{review.userName}</strong><span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><small>{review.targetName ?? review.targetType}</small><p>{review.comment || 'Sin comentario'}</p></div><span className="ec-badge">{review.targetType}</span><button className="panel-icon-button" type="button" onClick={() => void remove(review)} title="Eliminar"><Trash2 size={16} /></button></article>)}</div>{isLoading && <div className="ec-note">Cargando reseñas...</div>}{!isLoading && reviews.length === 0 && <div className="ec-note">No hay reseñas registradas.</div>}</section>
      </div>
    </PanelShell>
  );
}

export function AdminSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-settings-page">
        <div className="ec-page-header"><div><h1 className="ec-page-title">Configuración</h1><p className="ec-page-subtitle">Ajusta preferencias locales del panel administrativo.</p></div><button className="ec-button ec-button--primary" type="button" onClick={() => { localStorage.setItem('admin_settings', JSON.stringify({ notifications, maintenance })); setSaved(true); }}><CheckCircle2 size={16} /> Guardar configuración</button></div>
        {saved && <div className="ec-note">Preferencias guardadas en este navegador.</div>}
        <section className="ec-grid-2--equal ec-grid-2">
          <article className="ec-card"><div className="ec-card__header"><h2>Preferencias del sistema</h2></div><div className="ec-card__body settings-list"><label><div><strong>Notificaciones operativas</strong><small>Alertas de reportes, solicitudes y eventos.</small></div><input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} /></label><label><div><strong>Modo mantenimiento visual</strong><small>Preferencia local; no desactiva la API.</small></div><input type="checkbox" checked={maintenance} onChange={(event) => setMaintenance(event.target.checked)} /></label><label><div><strong>Revisión manual de negocios</strong><small>Los perfiles requieren aprobación administrativa.</small></div><input type="checkbox" checked readOnly /></label></div></article>
          <article className="ec-card"><div className="ec-card__header"><h2>Integraciones</h2></div><div className="ec-card__body ec-form-grid"><div className="ec-field ec-field--full"><label>URL de la API</label><input className="ec-input" value={import.meta.env.VITE_API_BASE_URL ?? ''} readOnly /></div><div className="ec-field ec-field--full"><label>Correo de soporte</label><input className="ec-input" defaultValue="soporte@explorachiapas.com" /></div></div></article>
        </section>
      </div>
    </PanelShell>
  );
}

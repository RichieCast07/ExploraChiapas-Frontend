import { CalendarDays, CalendarRange, Grid2X2, List, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { apiRequest, apiVoid } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './HomeEventos.css';

interface EventItem {
  id: string;
  titulo: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  categoriaNombre: string | null;
  municipio: string | null;
  activo: boolean;
}

export function HomeEventos() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEvents(await apiRequest<EventItem[]>('/events', {}, false));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => events.filter((event) => (
    `${event.titulo} ${event.descripcion ?? ''} ${event.municipio ?? ''} ${event.categoriaNombre ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )), [events, search]);

  const remove = async (event: EventItem) => {
    if (!window.confirm(`¿Eliminar el evento “${event.titulo}”?`)) return;
    try {
      await apiVoid(`/events/${event.id}`, { method: 'DELETE' });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo eliminar el evento');
    }
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-events-page">
        <div className="ec-page-header"><div className="ec-page-header__copy"><div className="ec-breadcrumb">Inicio <span>›</span> Eventos</div><h1 className="ec-page-title">Gestión de Eventos Turísticos</h1></div><Link className="ec-button ec-button--primary" to="/admin/eventos/nuevo"><PlusCircle size={17} /> Crear Evento</Link></div>
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}

        <section className="ec-card admin-events-filters"><div className="admin-events-filter-row"><input className="ec-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar evento, municipio o categoría" /><button className="ec-button" type="button" onClick={() => void load()}><CalendarRange size={16} /> Actualizar</button></div><div className="admin-events-view-switch"><button className="active" type="button"><List size={15} /> Vista Tabla</button><button type="button" disabled><Grid2X2 size={15} /> Vista Tarjetas</button><button type="button" disabled><CalendarDays size={15} /> Calendario</button></div></section>

        <section className="ec-card"><div className="ec-table-wrap"><table className="ec-table admin-events-table"><thead><tr><th>Evento</th><th>Categoría</th><th>Municipio</th><th>Fecha y hora</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((event) => <tr key={event.id}><td><div className="ec-identity"><span className="admin-event-thumb">🎉</span><div><strong>{event.titulo}</strong><small>{event.descripcion ?? 'Sin descripción'}</small></div></div></td><td>{event.categoriaNombre ?? 'Sin categoría'}</td><td>{event.municipio ?? 'Sin municipio'}</td><td>{new Date(event.fechaInicio).toLocaleString('es-MX')}</td><td><span className={`ec-badge ${event.activo ? 'ec-badge--green' : 'ec-badge--red'}`}>{event.activo ? 'Publicado' : 'Inactivo'}</span></td><td><div className="admin-event-actions"><button type="button" className="danger" title="Eliminar" onClick={() => void remove(event)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>{isLoading && <div className="ec-note">Cargando eventos...</div>}{!isLoading && filtered.length === 0 && <div className="ec-note">No hay eventos registrados.</div>}</section>
      </div>
    </PanelShell>
  );
}

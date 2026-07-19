import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Search, Bell, Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';
import './HomeEventos.css';

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  municipio: string | null;
  categoriaNombre: string | null;
  activo: boolean;
}

const SERVER_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/v1/api', '') ?? '';

function resolveUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${SERVER_BASE}${url}`;
}

function estadoEvento(evento: Evento): 'programado' | 'publicado' | 'finalizado' {
  const ahora = new Date();
  const inicio = new Date(evento.fechaInicio);
  const fin = evento.fechaFin ? new Date(evento.fechaFin) : null;
  if (!evento.activo || (fin && fin < ahora)) return 'finalizado';
  if (inicio > ahora) return 'programado';
  return 'publicado';
}

const estadoLabel: Record<string, string> = {
  publicado: 'Publicado',
  programado: 'Programado',
  finalizado: 'Finalizado',
};

const usuario = { nombre: localStorage.getItem('user_name') ?? 'Admin', rol: 'SUPER ADMINISTRADOR' };

export function HomeEventos() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/events`);
      const body = await res.json() as { success: boolean; data?: Evento[]; message?: string };
      if (!res.ok || !body.success) throw new Error(body.message ?? 'Error al cargar eventos');
      setEventos(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  const eliminar = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este evento?')) return;
    setDeletingId(id);
    try {
      const res = await fetchAuth(`${BASE_URL}/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEventos(prev => prev.filter(e => e.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="gestion-eventos-layout">
      <Sidebar config={adminNavConfig} onLogout={logout} />

      <div className="gestion-eventos-layout__main">
        <header className="ge-header">
          <div className="ge-header__search">
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Buscar eventos..." />
          </div>
          <div className="ge-header__right">
            <button className="ge-header__bell">
              <Bell size={20} />
            </button>
            <div className="ge-header__user">
              <div className="ge-header__user-info">
                <span className="ge-header__user-name">{usuario.nombre}</span>
                <span className="ge-header__user-role">{usuario.rol}</span>
              </div>
              <div className="ge-header__avatar">{usuario.nombre.charAt(0)}</div>
            </div>
          </div>
        </header>

        <main className="ge-content">
          <div className="ge-breadcrumb">
            <span>Inicio</span>
            <span className="ge-breadcrumb__sep">›</span>
            <span className="active">Eventos</span>
          </div>

          <div className="ge-title-row">
            <h1>Gestión de Eventos Turísticos</h1>
            <button className="btn-crear-evento" onClick={() => navigate('/admin/eventos/nuevo')}>
              <Plus size={18} /> Crear Evento
            </button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#b91c1c' }}>
              {error}
              <button onClick={() => void cargar()} style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontWeight: 600 }}>Reintentar</button>
            </div>
          )}

          <div className="ge-table-card">
            {isLoading ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Cargando eventos...</div>
            ) : eventos.length === 0 && !error ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                <Calendar size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
                <p>No hay eventos registrados. Crea el primero.</p>
              </div>
            ) : (
              <table className="ge-table">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Municipio</th>
                    <th>Fecha inicio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {eventos.map((evento) => {
                    const estado = estadoEvento(evento);
                    const thumb = resolveUrl(evento.imagenUrl);
                    return (
                      <tr key={evento.id}>
                        <td>
                          <div className="ge-evento-cell">
                            {thumb ? (
                              <img src={thumb} alt={evento.titulo} className="ge-evento-thumb" />
                            ) : (
                              <div className="ge-evento-thumb" style={{ background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 11 }}>
                                Sin img
                              </div>
                            )}
                            <div>
                              <span className="ge-evento-nombre">{evento.titulo}</span>
                              <span className="ge-evento-desc">{evento.descripcion?.slice(0, 60) ?? ''}</span>
                            </div>
                          </div>
                        </td>
                        <td>{evento.municipio ?? '—'}</td>
                        <td>{new Date(evento.fechaInicio).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <span className={`ge-badge ge-badge--${estado}`}>
                            {estadoLabel[estado]}
                          </span>
                        </td>
                        <td>
                          <div className="ge-actions">
                            {estado !== 'finalizado' && (
                              <button
                                className="icon-btn"
                                onClick={() => navigate(`/admin/eventos/editar/${evento.id}`)}
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                            <button
                              className="icon-btn icon-btn--danger"
                              disabled={deletingId === evento.id}
                              onClick={() => void eliminar(evento.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </PanelShell>
  );
}

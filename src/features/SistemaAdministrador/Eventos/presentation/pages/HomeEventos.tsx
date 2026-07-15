// features/SistemaAdministrador/Eventos/presentation/pages/HomeEventos.tsx
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Search, Bell, Plus, List, LayoutGrid, Calendar, ChevronDown, Pencil, Trash2, BarChart2 } from 'lucide-react';
import './HomeEventos.css';

const usuario = { nombre: 'Admin Explora', rol: 'SUPER ADMINISTRADOR' };

// ---- Datos ficticios (mock) ----
const eventos = [
  {
    id: '1',
    nombre: 'Fiesta Grande de Enero',
    descripcion: 'Tradición milenaria de los...',
    municipio: 'Chiapa de Corzo',
    fechaHora: '15 Ene, 2024 - 10:00 AM',
    estado: 'publicado' as const,
    imagen: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200',
  },
  {
    id: '2',
    nombre: 'Eco-Tour Selva Lacandona',
    descripcion: 'Exploración profunda en...',
    municipio: 'Ocosingo',
    fechaHora: '22 Feb, 2024 - 07:00 AM',
    estado: 'borrador' as const,
    imagen: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
  },
  {
    id: '3',
    nombre: 'Taller de Telares Mayas',
    descripcion: 'Aprende la técnica...',
    municipio: 'San Cristóbal',
    fechaHora: '05 Dic, 2023 - 11:00 AM',
    estado: 'finalizado' as const,
    imagen: 'https://images.unsplash.com/photo-1528650301516-3d9dbd11f4a5?w=200',
  },
];

const estadoLabel: Record<string, string> = {
  publicado: 'Publicado',
  borrador: 'Borrador',
  finalizado: 'Finalizado',
};

export function HomeEventos() {
  const navigate = useNavigate();

  return (
    <div className="gestion-eventos-layout">
      <Sidebar config={adminNavConfig} onLogout={() => console.log('logout')} />

      <div className="gestion-eventos-layout__main">
        {/* Header */}
        <header className="ge-header">
          <div className="ge-header__search">
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Buscar destinos, negocios o usuarios..." />
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

        {/* Contenido */}
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

          {/* Filtros */}
          <div className="ge-filters-card">
            <div className="ge-filters-row">
              <button className="filter-select">
                Todos los Municipios <ChevronDown size={14} />
              </button>
              <button className="filter-select">
                <Calendar size={14} /> Fecha: Rango de fechas
              </button>
              <button className="filter-select">
                Categoría: Todas <ChevronDown size={14} />
              </button>
            </div>

            <div className="ge-view-toggle">
              <button className="view-btn view-btn--active">
                <List size={15} /> Vista Tabla
              </button>
              <button className="view-btn">
                <LayoutGrid size={15} /> Vista Tarjetas
              </button>
              <button className="view-btn">
                <Calendar size={15} /> Calendario
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="ge-table-card">
            <table className="ge-table">
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Municipio</th>
                  <th>Fecha &amp; Hora</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento.id}>
                    <td>
                      <div className="ge-evento-cell">
                        <img src={evento.imagen} alt={evento.nombre} className="ge-evento-thumb" />
                        <div>
                          <span className="ge-evento-nombre">{evento.nombre}</span>
                          <span className="ge-evento-desc">{evento.descripcion}</span>
                        </div>
                      </div>
                    </td>
                    <td>{evento.municipio}</td>
                    <td>{evento.fechaHora}</td>
                    <td>
                      <span className={`ge-badge ge-badge--${evento.estado}`}>
                        {estadoLabel[evento.estado]}
                      </span>
                    </td>
                    <td>
                      <div className="ge-actions">
                        {evento.estado === 'finalizado' ? (
                          <button className="icon-btn">
                            <BarChart2 size={16} />
                          </button>
                        ) : (
                          <>
                            <button className="icon-btn" onClick={() => navigate(`/admin/eventos/editar/${evento.id}`)}>
                              <Pencil size={16} />
                            </button>
                            <button className="icon-btn icon-btn--danger">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
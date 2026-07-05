// features/SistemaAdministrador/Home/presentation/pages/AdminHomePage.tsx
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import {
  Search,
  Bell,
  Users,
  Store,
  MapPin,
  CheckCircle,
  ArrowUp,
  MoreVertical,
  MapPinPlus,
  UserCheck,
  CalendarPlus,
} from 'lucide-react';
import { LineChart, Line, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './ AdminHome.css';
import { useAdminStatsViewModel } from '../viewmodels/useAdminStatsViewModel';

const usuariosPorMes = [
  { mes: 'ENE', actual: 12000, anterior: 9000 },
  { mes: 'FEB', actual: 14500, anterior: 10500 },
  { mes: 'MAR', actual: 17800, anterior: 12000 },
  { mes: 'ABR', actual: 21000, anterior: 13500 },
  { mes: 'MAY', actual: 18500, anterior: 15000 },
  { mes: 'JUN', actual: 19800, anterior: 16200 },
];

const destinosMasVisitados = [
  { nombre: 'Cañón del Sumidero', visitas: '12.5k', porcentaje: 100 },
  { nombre: 'Palenque', visitas: '10.2k', porcentaje: 82 },
  { nombre: 'San Cristóbal de las Casas', visitas: '9.8k', porcentaje: 78 },
  { nombre: 'Cascadas de Agua Azul', visitas: '7.4k', porcentaje: 59 },
];

const actividadReciente = [
  {
    titulo: 'Hotel Selva Verde ha registrado un nuevo negocio.',
    descripcion: 'Hace 15 minutos • Categoría: Alojamiento',
    tipo: 'negocio' as const,
    accionLabel: 'Revisar',
  },
  {
    titulo: 'Usuario @carlos88 reportó un destino como "Inaccesible".',
    descripcion: 'Hace 2 horas • Lagos de Montebello',
    tipo: 'reporte' as const,
    prioridadAlta: true,
  },
  {
    titulo: 'Guía Maya Adventure ha sido verificado.',
    descripcion: 'Hace 4 horas • Perfil Profesional',
    tipo: 'verificacion' as const,
  },
];

const accionesRapidas = [
  { titulo: 'Registrar Destino', descripcion: 'Añadir punto de interés', icono: <MapPinPlus size={18} /> },
  { titulo: 'Aprobar Negocio', descripcion: 'Gestionar cola de espera', icono: <UserCheck size={18} /> },
  { titulo: 'Crear Evento', descripcion: 'Promocionar cultura local', icono: <CalendarPlus size={18} /> },
];

export function AdminHomePage() {
  const { stats, isLoading } = useAdminStatsViewModel();

  const val = (n: number | undefined) => isLoading ? '...' : (n?.toLocaleString() ?? '0');

  return (
    <div className="admin-layout">
      <Sidebar config={adminNavConfig} onLogout={() => console.log('logout')} />

      <div className="admin-layout__main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header__search">
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Buscar destinos, negocios o usuarios..." />
          </div>
          <div className="admin-header__right">
            <button className="admin-header__bell">
              <Bell size={20} />
            </button>
            <div className="admin-header__user">
              <div className="admin-header__user-info">
                <span className="admin-header__user-name">Admin Explora</span>
                <span className="admin-header__user-role">SUPER ADMINISTRADOR</span>
              </div>
              <div className="admin-header__avatar">A</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="admin-content">
          <div className="admin-content__header">
            <div>
              <h1>Dashboard General</h1>
              <p>Bienvenido de nuevo. Aquí tienes el resumen de hoy en Chiapas.</p>
            </div>
            <div className="admin-content__header-actions">
              <button className="btn btn--outline">📅 Últimos 30 días</button>
              <button className="btn btn--primary">+ Nuevo Listado</button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card">
              <div className="stats-card__top">
                <div className="stats-card__icon stats-card__icon--green"><Users size={20} /></div>
                <span className="stats-card__change positive"><ArrowUp size={12} /> activos</span>
              </div>
              <p className="stats-card__label">USUARIOS REGISTRADOS</p>
              <p className="stats-card__value">{val(stats?.totalUsuarios)}</p>
              <p className="stats-card__footer">usuarios activos en la plataforma</p>
            </div>

            <div className="stats-card">
              <div className="stats-card__top">
                <div className="stats-card__icon stats-card__icon--orange"><Store size={20} /></div>
                <span className="stats-card__change positive"><ArrowUp size={12} /> total</span>
              </div>
              <p className="stats-card__label">NEGOCIOS TURÍSTICOS</p>
              <p className="stats-card__value">{val(stats?.totalNegocios)}</p>
              <p className="stats-card__footer">registrados en la plataforma</p>
            </div>

            <div className="stats-card">
              <div className="stats-card__top">
                <div className="stats-card__icon stats-card__icon--blue"><MapPin size={20} /></div>
                <span className="stats-card__change positive"><ArrowUp size={12} /> total</span>
              </div>
              <p className="stats-card__label">DESTINOS TURÍSTICOS</p>
              <p className="stats-card__value">{val(stats?.totalDestinos)}</p>
              <p className="stats-card__footer">destinos activos</p>
            </div>

            <div className="stats-card">
              <div className="stats-card__top">
                <div className="stats-card__icon stats-card__icon--green"><CheckCircle size={20} /></div>
              </div>
              <p className="stats-card__label">NEGOCIOS VERIFICADOS</p>
              <p className="stats-card__value">{val(stats?.negociosVerificados)}</p>
              <p className="stats-card__footer">con verificación activa</p>
            </div>
          </div>

          {/* Chart + Destinos */}
          <div className="mid-grid">
            <div className="card">
              <div className="card__header">
                <h3>Usuarios Registrados por Mes</h3>
                <div className="chart-legend">
                  <span><i className="dot dot--green" /> 2024</span>
                  <span><i className="dot dot--gray" /> 2023</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={usuariosPorMes}>
                  <XAxis dataKey="mes" tickLine={false} axisLine={false} fontSize={12} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#16a34a" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="anterior" stroke="#d1d5db" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card__header">
                <h3>Destinos más Visitados</h3>
                <MoreVertical size={18} color="#9ca3af" />
              </div>
              {destinosMasVisitados.map((d) => (
                <div key={d.nombre} className="destino-item">
                  <div className="destino-item__top">
                    <span>{d.nombre}</span>
                    <span>{d.visitas}</span>
                  </div>
                  <div className="destino-item__bar-bg">
                    <div className="destino-item__bar-fill" style={{ width: `${d.porcentaje}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad + Acciones */}
          <div className="bottom-grid">
            <div className="card">
              <div className="card__header">
                <h3>Actividad Reciente</h3>
                <button className="link-btn">Ver todo</button>
              </div>
              {actividadReciente.map((a, i) => (
                <div key={i} className="actividad-item">
                  <div className={`actividad-item__icon ${a.tipo === 'reporte' ? 'icon--red' : 'icon--green'}`}>
                    {a.tipo === 'negocio' && <Store size={18} />}
                    {a.tipo === 'reporte' && <AlertTriangle size={18} />}
                    {a.tipo === 'verificacion' && <UserCheck size={18} />}
                  </div>
                  <div className="actividad-item__content">
                    <p>{a.titulo}</p>
                    <span>{a.descripcion}</span>
                  </div>
                  {a.accionLabel && <button className="btn btn--small">{a.accionLabel}</button>}
                  {a.prioridadAlta && <span className="badge-priority">PRIORIDAD ALTA</span>}
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>Acciones Rápidas</h3>
              {accionesRapidas.map((a) => (
                <button key={a.titulo} className="accion-item">
                  <span className="accion-item__icon">{a.icono}</span>
                  <span>
                    <strong>{a.titulo}</strong>
                    <p>{a.descripcion}</p>
                  </span>
                </button>
              ))}
              <div className="estado-sistema">
                <span className="estado-sistema__label">ESTADO DEL SISTEMA</span>
                <p><i className="dot dot--green" /> Todos los servicios activos</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
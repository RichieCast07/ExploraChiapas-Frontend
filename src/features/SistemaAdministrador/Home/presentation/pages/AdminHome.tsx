import {
  AlertTriangle,
  ArrowUp,
  Bell,
  CalendarDays,
  CalendarPlus,
  CheckCircle,
  Heart,
  MapPin,
  MapPinPlus,
  MessageSquareText,
  MoreVertical,
  Route,
  Search,
  Store,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout } from '../../../../../core/shared/utils/auth';
import { useAdminStatsViewModel } from '../viewmodels/useAdminStatsViewModel';

import './AdminHome.css';

const usuariosPorMes = [
  { mes: 'ENE', actual: 12000, anterior: 9000 },
  { mes: 'FEB', actual: 14500, anterior: 10500 },
  { mes: 'MAR', actual: 17800, anterior: 12000 },
  { mes: 'ABR', actual: 21000, anterior: 13500 },
  { mes: 'MAY', actual: 18500, anterior: 15000 },
  { mes: 'JUN', actual: 19800, anterior: 16200 },
];

const destinosMasVisitados = [
  {
    nombre: 'Cañón del Sumidero',
    visitas: '12.5k',
    porcentaje: 100,
  },
  {
    nombre: 'Palenque',
    visitas: '10.2k',
    porcentaje: 82,
  },
  {
    nombre: 'San Cristóbal de las Casas',
    visitas: '9.8k',
    porcentaje: 78,
  },
  {
    nombre: 'Cascadas de Agua Azul',
    visitas: '7.4k',
    porcentaje: 59,
  },
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
    descripcion: 'Hace 4 horas • Perfil profesional',
    tipo: 'verificacion' as const,
  },
];

const accionesRapidas = [
  {
    titulo: 'Registrar Destino',
    descripcion: 'Añadir punto de interés',
    icono: <MapPinPlus size={18} />,
  },
  {
    titulo: 'Aprobar Negocio',
    descripcion: 'Gestionar cola de espera',
    icono: <UserCheck size={18} />,
  },
  {
    titulo: 'Crear Evento',
    descripcion: 'Promocionar cultura local',
    icono: <CalendarPlus size={18} />,
  },
];

export function AdminHomePage() {
  const { stats, isLoading, error, recargar } = useAdminStatsViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Admin';

  const formatValue = (value: number | undefined) => {
    return value?.toLocaleString('es-MX') ?? '0';
  };

  const statsCards = [
    {
      label: 'USUARIOS REGISTRADOS',
      value: stats?.totalUsuarios,
      footer: 'usuarios registrados en la plataforma',
      icon: <Users size={20} />,
      iconClass: 'stats-card__icon--green',
    },
    {
      label: 'NEGOCIOS TURÍSTICOS',
      value: stats?.totalNegocios,
      footer: 'negocios registrados',
      icon: <Store size={20} />,
      iconClass: 'stats-card__icon--orange',
    },
    {
      label: 'DESTINOS TURÍSTICOS',
      value: stats?.totalDestinos,
      footer: 'destinos registrados',
      icon: <MapPin size={20} />,
      iconClass: 'stats-card__icon--blue',
    },
    {
      label: 'NEGOCIOS VERIFICADOS',
      value: stats?.negociosVerificados,
      footer: 'negocios con verificación activa',
      icon: <CheckCircle size={20} />,
      iconClass: 'stats-card__icon--green',
    },
    {
      label: 'EVENTOS',
      value: stats?.totalEventos,
      footer: 'eventos registrados',
      icon: <CalendarDays size={20} />,
      iconClass: 'stats-card__icon--orange',
    },
    {
      label: 'RESEÑAS',
      value: stats?.totalResenas,
      footer: 'reseñas publicadas',
      icon: <MessageSquareText size={20} />,
      iconClass: 'stats-card__icon--blue',
    },
    {
      label: 'RUTAS',
      value: stats?.totalRutas,
      footer: 'rutas creadas',
      icon: <Route size={20} />,
      iconClass: 'stats-card__icon--green',
    },
    {
      label: 'FAVORITOS EN DESTINOS',
      value: stats?.totalFavoritosDestinos,
      footer: 'destinos guardados como favoritos',
      icon: <Heart size={20} />,
      iconClass: 'stats-card__icon--orange',
    },
    {
      label: 'FAVORITOS EN NEGOCIOS',
      value: stats?.totalFavoritosNegocios,
      footer: 'negocios guardados como favoritos',
      icon: <Heart size={20} />,
      iconClass: 'stats-card__icon--blue',
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar
        config={adminNavConfig}
        onLogout={logout}
      />

      <div className="admin-layout__main">
        <header className="admin-header">
          <div className="admin-header__search">
            <Search size={18} color="#9ca3af" />
            <input
              type="text"
              placeholder="Buscar destinos, negocios o usuarios..."
            />
          </div>

          <div className="admin-header__right">
            <button
              type="button"
              className="admin-header__bell"
              aria-label="Ver notificaciones"
            >
              <Bell size={20} />
            </button>

            <div className="admin-header__user">
              <div className="admin-header__user-info">
                <span className="admin-header__user-name">{userName}</span>
                <span className="admin-header__user-role">SUPER ADMINISTRADOR</span>
              </div>
              <div className="admin-header__avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-content__header">
            <div>
              <h1>Dashboard General</h1>
              <p>
                Bienvenido de nuevo. Aquí tienes el resumen general de
                Explora Chiapas.
              </p>
            </div>

            <div className="admin-content__header-actions">
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => void recargar()}
                disabled={isLoading}
              >
                Actualizar datos
              </button>

              <button
                type="button"
                className="btn btn--primary"
              >
                + Nuevo listado
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-dashboard__error">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => void recargar()}
              >
                Reintentar
              </button>
            </div>
          )}

          <div className="stats-grid">
            {statsCards.map((card) => (
              <div
                key={card.label}
                className="stats-card"
              >
                <div className="stats-card__top">
                  <div
                    className={`stats-card__icon ${card.iconClass}`}
                  >
                    {card.icon}
                  </div>

                  <span className="stats-card__change positive">
                    <ArrowUp size={12} /> total
                  </span>
                </div>

                <p className="stats-card__label">
                  {card.label}
                </p>
                <p className="stats-card__value">
                  {formatValue(card.value)}
                </p>
                <p className="stats-card__footer">
                  {card.footer}
                </p>
              </div>
            ))}
          </div>

          <div className="mid-grid">
            <div className="card">
              <div className="card__header">
                <div>
                  <h3>Usuarios registrados por mes</h3>
                  <small>Datos demostrativos</small>
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="dot dot--green" /> Periodo actual
                  </span>
                  <span>
                    <i className="dot dot--gray" /> Periodo anterior
                  </span>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={usuariosPorMes}>
                  <XAxis
                    dataKey="mes"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="#9ca3af"
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="anterior"
                    stroke="#d1d5db"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card__header">
                <div>
                  <h3>Destinos más visitados</h3>
                  <small>Datos demostrativos</small>
                </div>
                <MoreVertical size={18} color="#9ca3af" />
              </div>

              {destinosMasVisitados.map((destino) => (
                <div
                  key={destino.nombre}
                  className="destino-item"
                >
                  <div className="destino-item__top">
                    <span>{destino.nombre}</span>
                    <span>{destino.visitas}</span>
                  </div>

                  <div className="destino-item__bar-bg">
                    <div
                      className="destino-item__bar-fill"
                      style={{
                        width: `${destino.porcentaje}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="card__header">
                <div>
                  <h3>Actividad reciente</h3>
                  <small>Datos demostrativos</small>
                </div>

                <button
                  type="button"
                  className="link-btn"
                >
                  Ver todo
                </button>
              </div>

              {actividadReciente.map((actividad) => (
                <div
                  key={`${actividad.tipo}-${actividad.titulo}`}
                  className="actividad-item"
                >
                  <div
                    className={`actividad-item__icon ${
                      actividad.tipo === 'reporte'
                        ? 'icon--red'
                        : 'icon--green'
                    }`}
                  >
                    {actividad.tipo === 'negocio' && (
                      <Store size={18} />
                    )}
                    {actividad.tipo === 'reporte' && (
                      <AlertTriangle size={18} />
                    )}
                    {actividad.tipo === 'verificacion' && (
                      <UserCheck size={18} />
                    )}
                  </div>

                  <div className="actividad-item__content">
                    <p>{actividad.titulo}</p>
                    <span>{actividad.descripcion}</span>
                  </div>

                  {actividad.accionLabel && (
                    <button
                      type="button"
                      className="btn btn--small"
                    >
                      {actividad.accionLabel}
                    </button>
                  )}

                  {actividad.prioridadAlta && (
                    <span className="badge-priority">
                      PRIORIDAD ALTA
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>
                Acciones rápidas
              </h3>

              {accionesRapidas.map((accion) => (
                <button
                  key={accion.titulo}
                  type="button"
                  className="accion-item"
                >
                  <span className="accion-item__icon">
                    {accion.icono}
                  </span>
                  <span>
                    <strong>{accion.titulo}</strong>
                    <p>{accion.descripcion}</p>
                  </span>
                </button>
              ))}

              <div className="estado-sistema">
                <span className="estado-sistema__label">
                  ESTADO DEL SISTEMA
                </span>
                <p>
                  <i className="dot dot--green" /> Todos los servicios
                  activos
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

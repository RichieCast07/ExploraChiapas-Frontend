// features/NegocioTuristico/Home/presentation/pages/NegocioHomePage.tsx
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Eye, Route, MousePointerClick, Star, ArrowUp, ArrowDown } from 'lucide-react';
import './NegocioHomePage.css'; 

// ---- Datos ficticios (mock) ----
const stats = {
  totalVisualizaciones: { valor: '12,480', cambio: 12, tipo: 'positivo' as const },
  vecesEnRutas: { valor: '842', cambio: -5, tipo: 'negativo' as const },
  clicksReserva: { valor: '3,120', cambio: 18, tipo: 'positivo' as const, extra: 'Tasa de conversión 25%' },
  puntajePerfil: { valor: '4.8/5', estrellas: 3 },
};

const usuario = {
  nombre: 'Selva Verde Resort',
  rol: 'Administrador',
  avatarUrl: '', // deja vacío para usar el placeholder con inicial
};

export function NegocioHomePage() {
  return (
    <div className="negocio-layout">
      <Sidebar config={negocioNavConfig} onLogout={() => console.log('logout')} />

      <div className="negocio-layout__main">
        {/* Header */}
        <header className="negocio-header">
          <h1 className="negocio-header__brand">ExploraChiapas</h1>

          <div className="negocio-header__right">
            <button className="negocio-header__bell">
              <Bell size={20} />
            </button>
            <div className="negocio-header__divider" />
            <div className="negocio-header__user">
              <div className="negocio-header__user-info">
                <span className="negocio-header__user-name">{usuario.nombre}</span>
                <span className="negocio-header__user-role">{usuario.rol}</span>
              </div>
              {usuario.avatarUrl ? (
                <img src={usuario.avatarUrl} alt={usuario.nombre} className="negocio-header__avatar" />
              ) : (
                <div className="negocio-header__avatar negocio-header__avatar--placeholder">
                  {usuario.nombre.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="negocio-content">
          <div className="negocio-stats-grid">
            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">
                  Total<br />Visualizaciones
                </span>
                <div className="negocio-stat-card__icon icon--green">
                  <Eye size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{stats.totalVisualizaciones.valor}</span>
                <span className="negocio-stat-card__change positive">
                  <ArrowUp size={12} /> {stats.totalVisualizaciones.cambio}%
                </span>
              </div>
              <p className="negocio-stat-card__footer">Vs. mes anterior</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Veces en Rutas</span>
                <div className="negocio-stat-card__icon icon--blue">
                  <Route size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{stats.vecesEnRutas.valor}</span>
                <span className="negocio-stat-card__change negative">
                  <ArrowDown size={12} /> {Math.abs(stats.vecesEnRutas.cambio)}%
                </span>
              </div>
              <p className="negocio-stat-card__footer">Vs. mes anterior</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">
                  Clicks en Botón<br />"Reserva"
                </span>
                <div className="negocio-stat-card__icon icon--orange">
                  <MousePointerClick size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{stats.clicksReserva.valor}</span>
                <span className="negocio-stat-card__change positive">
                  <ArrowUp size={12} /> {stats.clicksReserva.cambio}%
                </span>
              </div>
              <p className="negocio-stat-card__footer">{stats.clicksReserva.extra}</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Puntaje del Perfil</span>
                <div className="negocio-stat-card__icon icon--yellow">
                  <Star size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{stats.puntajePerfil.valor}</span>
              </div>
              <div className="negocio-stat-card__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < stats.puntajePerfil.estrellas ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
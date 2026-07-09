import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Heart, MessageSquare, Star } from 'lucide-react';
import './NegocioHomePage.css';
import { useNegocioStatsViewModel } from '../viewmodels/useNegocioStatsViewModel';
import { logout } from '../../../../../core/shared/utils/auth';

export function NegocioHomePage() {
  const { stats, isLoading, error } = useNegocioStatsViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

  const val = (n: number | undefined) => isLoading ? '...' : (n?.toLocaleString() ?? '0');

  return (
    <div className="negocio-layout">
      <Sidebar config={negocioNavConfig} onLogout={logout} />

      <div className="negocio-layout__main">
        <header className="negocio-header">
          <h1 className="negocio-header__brand">ExploraChiapas</h1>

          <div className="negocio-header__right">
            <button className="negocio-header__bell">
              <Bell size={20} />
            </button>
            <div className="negocio-header__divider" />
            <div className="negocio-header__user">
              <div className="negocio-header__user-info">
                <span className="negocio-header__user-name">{stats?.negocioNombre ?? userName}</span>
                <span className="negocio-header__user-role">Administrador</span>
              </div>
              <div className="negocio-header__avatar negocio-header__avatar--placeholder">
                {(stats?.negocioNombre ?? userName).charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="negocio-content">
          {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}

          <div className="negocio-stats-grid">
            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Favoritos del Negocio</span>
                <div className="negocio-stat-card__icon icon--green">
                  <Heart size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{val(stats?.totalFavoritos)}</span>
              </div>
              <p className="negocio-stat-card__footer">usuarios lo han marcado como favorito</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Total de Reseñas</span>
                <div className="negocio-stat-card__icon icon--blue">
                  <MessageSquare size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{val(stats?.totalResenas)}</span>
              </div>
              <p className="negocio-stat-card__footer">reseñas recibidas</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Calificación Promedio</span>
                <div className="negocio-stat-card__icon icon--yellow">
                  <Star size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">
                  {isLoading ? '...' : `${stats?.calificacionPromedio?.toFixed(1) ?? '0.0'}/5`}
                </span>
              </div>
              <div className="negocio-stat-card__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(stats?.calificacionPromedio ?? 0) ? '#f59e0b' : 'none'}
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
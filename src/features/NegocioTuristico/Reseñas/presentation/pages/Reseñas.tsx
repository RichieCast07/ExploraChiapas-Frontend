import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Star, Filter, MessageSquare } from 'lucide-react';
import './Reseñas.css';
import { useReseñasViewModel } from '../viewmodels/useReseñasViewModel';
import { logout } from '../../../../../core/shared/utils/auth';

export function ReseñasPage() {
  const { resenas, stats, isLoading, error } = useReseñasViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

  return (
    <div className="resenas-layout">
      <Sidebar config={negocioNavConfig} onLogout={logout} />

      <div className="resenas-layout__main">
        <header className="resenas-header">
          <h1 className="resenas-header__brand">ExploraChiapas</h1>
          <div className="resenas-header__right">
            <button className="resenas-header__bell">
              <Bell size={20} />
            </button>
            <div className="resenas-header__divider" />
            <div className="resenas-header__user">
              <div className="resenas-header__user-info">
                <span className="resenas-header__user-name">{userName}</span>
                <span className="resenas-header__user-role">Administrador</span>
              </div>
              <div className="resenas-header__avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>

        <main className="resenas-content">
          <div className="resenas-content__top">
            <div>
              <h2>Reseñas y Comentarios</h2>
              <p>Gestiona y responde a las opiniones de tus huéspedes en Chiapas.</p>
            </div>
            <button className="btn-filter">
              <Filter size={16} /> Filtrar
            </button>
          </div>

          {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}
          {isLoading && <p style={{ padding: '1rem' }}>Cargando reseñas...</p>}

          {!isLoading && stats && (
            <div className="resenas-summary-grid">
              <div className="resumen-card">
                <span className="resumen-card__label">Calificación General</span>
                <div className="resumen-card__score">
                  <span className="resumen-card__number">{stats.promedio}</span>
                  <span className="resumen-card__max">/5</span>
                </div>
                <div className="resumen-card__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(stats.promedio) ? '#f59e0b' : 'none'}
                      color="#f59e0b"
                    />
                  ))}
                </div>
                <span className="resumen-card__change">{stats.total} reseñas en total</span>
              </div>

              <div className="resumen-card resumen-card--dist">
                <div className="resumen-card__dist-header">
                  <span className="resumen-card__label">Distribución de Calificaciones</span>
                  <span className="resumen-card__total">{stats.total} reseñas</span>
                </div>
                {stats.distribucion.map((d) => (
                  <div key={d.estrellas} className="dist-row">
                    <span className="dist-row__label">{d.estrellas} <Star size={12} fill="#f59e0b" color="#f59e0b" /></span>
                    <div className="dist-row__bar-bg">
                      <div className="dist-row__bar-fill" style={{ width: `${d.porcentaje}%` }} />
                    </div>
                    <span className="dist-row__percent">{d.porcentaje}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="resenas-list">
            <div className="resenas-list__header">
              <h3>Reseñas Recientes</h3>
            </div>

            {!isLoading && resenas.length === 0 && !error && (
              <p style={{ padding: '1rem', color: '#9ca3af' }}>Aún no tienes reseñas.</p>
            )}

            {resenas.map((r) => (
              <div key={r.id} className="resena-item">
                <div className="resena-item__avatar">{r.userId.charAt(0).toUpperCase()}</div>

                <div className="resena-item__body">
                  <div className="resena-item__top">
                    <div>
                      <span className="resena-item__nombre">Usuario</span>
                      <div className="resena-item__stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < r.calificacion ? '#f59e0b' : 'none'}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="resena-item__fecha">{r.fecha}</span>
                  </div>

                  {r.comentario && <p className="resena-item__comentario">{r.comentario}</p>}

                  <button className="resena-item__responder">
                    <MessageSquare size={14} />
                    Responder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

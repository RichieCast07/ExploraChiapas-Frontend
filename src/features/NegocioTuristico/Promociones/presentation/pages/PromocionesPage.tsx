import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Plus, Calendar, Trash2 } from 'lucide-react';
import './PromocionesPage.css';
import { usePromocionesViewModel } from '../viewmodels/usePromocionesViewModel';
import { logout } from '../../../../../core/shared/utils/auth';

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function PromocionesPage() {
  const navigate = useNavigate();
  const { promociones, isLoading, error, eliminar } = usePromocionesViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

  return (
    <div className="promo-layout">
      <Sidebar config={negocioNavConfig} onLogout={logout} />

      <div className="promo-layout__main">
        <header className="promo-header">
          <h1 className="promo-header__brand">ExploraChiapas</h1>
          <div className="promo-header__right">
            <button className="promo-header__bell">
              <Bell size={20} />
            </button>
            <div className="promo-header__divider" />
            <div className="promo-header__user">
              <div className="promo-header__user-info">
                <span className="promo-header__user-name">{userName}</span>
                <span className="promo-header__user-role">Administrador</span>
              </div>
              <div className="promo-header__avatar promo-header__avatar--placeholder">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="promo-content">
          <div className="promo-content__top">
            <p className="promo-content__subtitle">Gestiona tus ofertas activas y atrae a más exploradores.</p>
            <button className="btn-primary" onClick={() => navigate('/negocio/promociones/nueva')}>
              <Plus size={18} /> Nueva Promoción
            </button>
          </div>

          {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}
          {isLoading && <p style={{ padding: '1rem' }}>Cargando promociones...</p>}

          <div className="promo-grid">
            {promociones.map((promo) => (
              <div key={promo.id} className="promo-card">
                <div className="promo-card__body">
                  <h3>{promo.titulo}</h3>
                  {promo.precio != null && (
                    <span className="promo-card__badge">${promo.precio.toFixed(2)}</span>
                  )}
                  <p className="promo-card__desc">{promo.descripcion ?? ''}</p>

                  <div className="promo-card__vigencia">
                    <Calendar size={14} />
                    <span>
                      {formatFecha(promo.fechaInicio)}
                      {promo.fechaFin ? ` — ${formatFecha(promo.fechaFin)}` : ''}
                    </span>
                  </div>

                  <hr className="promo-card__divider" />

                  <div className="promo-card__footer">
                    <span className={`promo-card__status promo-card__status--${promo.activo ? 'activa' : 'inactiva'}`}>
                      <i className="dot" /> {promo.activo ? 'Activa' : 'Inactiva'}
                    </span>
                    <div className="promo-card__actions">
                      <button
                        className="icon-btn icon-btn--danger"
                        onClick={() => eliminar(promo.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              className="promo-card promo-card--create"
              onClick={() => navigate('/negocio/promociones/nueva')}
            >
              <div className="promo-card__create-icon">
                <Plus size={24} />
              </div>
              <h3>Crear Nueva Oferta</h3>
              <p>Llega a más clientes con descuentos exclusivos por temporada.</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
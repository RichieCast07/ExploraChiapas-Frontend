import { CalendarDays, Pencil, Plus, RefreshCw, Tag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { type Promocion, usePromocionesViewModel } from '../viewmodels/usePromocionesViewModel';
import './PromocionesPage.css';

const fallbackPromotions: Promocion[] = [
  { id: 'demo-1', titulo: 'Temporada Verde', descripcion: '15% de descuento en reservaciones de lunes a jueves.', precio: 15, negocioId: 'demo', negocioNombre: 'Selva Verde Resort', fechaInicio: '2026-07-01', fechaFin: '2026-08-31', activo: true, fechaCreacion: '2026-06-25' },
  { id: 'demo-2', titulo: 'Experiencia en Pareja', descripcion: 'Recorrido guiado y desayuno incluidos para dos personas.', precio: 20, negocioId: 'demo', negocioNombre: 'Selva Verde Resort', fechaInicio: '2026-07-15', fechaFin: '2026-09-15', activo: true, fechaCreacion: '2026-07-01' },
  { id: 'demo-3', titulo: 'Escapada de Fin de Semana', descripcion: 'Promoción especial para estancias de dos noches.', precio: 10, negocioId: 'demo', negocioNombre: 'Selva Verde Resort', fechaInicio: '2026-06-01', fechaFin: '2026-07-10', activo: false, fechaCreacion: '2026-05-20' },
];

function formatDate(value: string | null) {
  if (!value) return 'Sin límite';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

type EstadoPromo = 'programada' | 'activa' | 'vencida' | 'inactiva';

function estadoPromocion(promo: { activo: boolean; fechaInicio: string; fechaFin: string | null }): EstadoPromo {
  if (!promo.activo) return 'inactiva';
  const ahora = new Date();
  const inicio = new Date(promo.fechaInicio);
  if (inicio > ahora) return 'programada';
  if (promo.fechaFin && new Date(promo.fechaFin) < ahora) return 'vencida';
  return 'activa';
}

const estadoLabel: Record<EstadoPromo, string> = {
  programada: 'Programada',
  activa: 'Activa',
  vencida: 'Vencida',
  inactiva: 'Inactiva',
};

export function PromocionesPage() {
  const { promociones, isLoading, error, eliminar, recargar } = usePromocionesViewModel();
  const list = promociones.length > 0 ? promociones : fallbackPromotions;
  const isDemo = promociones.length === 0;

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
                    {(() => {
                      const estado = estadoPromocion(promo);
                      return (
                        <span className={`promo-card__status promo-card__status--${estado}`}>
                          <i className="dot" /> {estadoLabel[estado]}
                        </span>
                      );
                    })()}
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
    </PanelShell>
  );
}

import { Eye, LayoutDashboard, Plus, Route, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useNegocioStatsViewModel } from '../viewmodels/useNegocioStatsViewModel';
import './NegocioHomePage.css';

function relativeDate(dateValue: string): string {
  const date = new Date(dateValue);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return date.toLocaleDateString('es-MX');
}

export function NegocioHomePage() {
  const { stats, recentReviews, isLoading, error, reload } = useNegocioStatsViewModel();

  return (
    <PanelShell kind="business">
      <div className="ec-page business-home-page">
        <div className="business-home-actions"><button className="ec-button" type="button" onClick={() => void reload()} disabled={isLoading}>Actualizar</button><Link className="ec-button ec-button--primary" to="/negocio/promociones/nueva"><Plus size={16}/> Nueva promoción</Link></div>
        {error && <div className="ec-alert">{error}</div>}

        <section className="ec-stat-grid ec-stat-grid--3 business-home-stats">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Eye size={18}/></span><span className="ec-stat-card__trend">Acumulado</span></div><div><div className="ec-stat-card__label">Visualizaciones</div><div className="ec-stat-card__value">{isLoading ? '…' : (stats?.visualizaciones ?? 0).toLocaleString('es-MX')}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Star size={18}/></span><span className="ec-badge">{stats?.totalResenas ?? 0} reseñas</span></div><div><div className="ec-stat-card__label">Calificación promedio</div><div className="ec-stat-card__value">{isLoading ? '…' : (stats?.calificacionPromedio ?? 0).toFixed(1)} <small>/5.0</small></div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Tag size={18}/></span><Link className="business-stat-link" to="/negocio/promociones">Ver todas</Link></div><div><div className="ec-stat-card__label">Promociones activas</div><div className="ec-stat-card__value">{isLoading ? '…' : stats?.promocionesActivas ?? 0}</div></div></article>
        </section>

        <section className="ec-stat-grid ec-stat-grid--3 business-home-stats">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Route size={18}/></span></div><div><div className="ec-stat-card__label">Incluido en rutas</div><div className="ec-stat-card__value">{isLoading ? '…' : (stats?.vecesEnRutas ?? 0).toLocaleString('es-MX')}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Eye size={18}/></span></div><div><div className="ec-stat-card__label">Clics en reservar</div><div className="ec-stat-card__value">{isLoading ? '…' : (stats?.clicsReserva ?? 0).toLocaleString('es-MX')}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Star size={18}/></span></div><div><div className="ec-stat-card__label">Favoritos</div><div className="ec-stat-card__value">{isLoading ? '…' : (stats?.totalFavoritos ?? 0).toLocaleString('es-MX')}</div></div></article>
        </section>

        <section className="business-shortcuts">
          <Link to="/negocio/dashboard" className="business-shortcut"><span><LayoutDashboard size={20}/></span><h2>Dashboard</h2><p>Consulta tráfico, interacción y conversión.</p></Link>
          <Link to="/negocio/promociones" className="business-shortcut"><span><Tag size={20}/></span><h2>Promociones</h2><p>Crea y gestiona tus ofertas especiales.</p></Link>
          <Link to="/negocio/resenas" className="business-shortcut"><span><Star size={20}/></span><h2>Reseñas</h2><p>Responde a tus clientes y mejora tu reputación.</p></Link>
        </section>

        <section className="ec-card business-activity-card">
          <div className="ec-card__header"><h2>Reseñas recientes</h2><Link className="ec-button ec-button--ghost ec-button--sm" to="/negocio/resenas">Ver todas ›</Link></div>
          <div className="business-activity-list">
            {recentReviews.map((item)=><article key={item.id}><span className="ec-avatar">{item.userName.charAt(0).toUpperCase()}</span><div><div className="business-activity-top"><strong>{item.userName}</strong><small>{relativeDate(item.createdAt)}</small></div><span className="business-stars">{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</span><p>“{item.comment || 'Sin comentario'}”</p>{item.response && <small>Respuesta enviada: {item.response}</small>}</div></article>)}
          </div>
          {!isLoading && recentReviews.length === 0 && <div className="ec-note">Todavía no hay reseñas para este negocio.</div>}
        </section>
      </div>
    </PanelShell>
  );
}

import { Activity, BrainCircuit, CalendarDays, Download, FileText, MapPinned, Route, Sparkles, Store, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useAdminAnalyticsViewModel } from '../viewmodels/useAdminAnalyticsViewModel';
import './AdminIntelligenceProPage.css';

function number(value: number | undefined): string {
  return (value ?? 0).toLocaleString('es-MX');
}

export function AdminIntelligenceProPage() {
  const { data, isLoading, error, reload } = useAdminAnalyticsViewModel();
  const summary = data?.summary;
  const monthly = data?.monthly ?? [];
  const topDestinations = data?.topDestinations ?? [];
  const highest = topDestinations[0];
  const least = topDestinations.length ? topDestinations[topDestinations.length - 1] : null;

  const exportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `explora-chiapas-analitica-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page intelligence-pro-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy"><h1 className="ec-page-title">Inteligencia Turística Pro <span className="ec-badge ec-badge--green">PRO</span></h1><p className="ec-page-subtitle">Vista ampliada de los indicadores disponibles en la API.</p></div>
          <div className="ec-actions"><Link className="ec-button" to="/admin/analitica">Vista básica</Link><button className="ec-button" type="button" onClick={exportJson} disabled={!data}><Download size={15} /> Exportar JSON</button><button className="ec-button ec-button--primary" type="button" onClick={() => void reload()} disabled={isLoading}><FileText size={15} /> Actualizar</button></div>
        </div>

        {error && <div className="ec-note ec-note--danger">{error}</div>}
        <section className="intelligence-filter-strip"><button type="button">Chiapas</button><button type="button">Últimos 6 meses</button><button type="button">Todos los municipios</button><span /><strong><i /> Datos desde MariaDB</strong></section>

        <section className="ec-stat-grid ec-stat-grid--6 intelligence-pro-stats">
          {[
            ['Afluencia destinos', number(summary?.afluenciaDestinos), MapPinned, 'green'],
            ['Usuarios activos', number(summary?.totalUsuarios), Users, 'orange'],
            ['Visualizaciones negocio', number(summary?.visualizacionesNegocios), Activity, 'blue'],
            ['Clics en reservar', number(summary?.clicsReservaNegocios), Sparkles, 'green'],
            ['Rutas creadas', number(summary?.totalRutas), Route, 'blue'],
            ['Negocios verificados', number(summary?.negociosVerificados), Store, 'orange'],
          ].map(([label, value, Icon, tone]) => {
            const IconComponent = Icon as typeof Users;
            return <article className="ec-stat-card" key={String(label)}><div className="ec-stat-card__top"><span className={`ec-stat-card__icon ${tone === 'orange' ? 'ec-stat-card__icon--orange' : tone === 'blue' ? 'ec-stat-card__icon--blue' : ''}`}><IconComponent size={16} /></span></div><div><div className="ec-stat-card__label">{label}</div><div className="ec-stat-card__value">{isLoading ? '…' : value}</div></div></article>;
          })}
        </section>

        <section className="intelligence-main-grid">
          <article className="ec-card intelligence-attendance"><div className="ec-card__header"><div><h2>Actividad mensual</h2><small>Usuarios registrados, rutas y eventos</small></div></div><div className="intelligence-chart"><ResponsiveContainer width="100%" height={330}><AreaChart data={monthly}><defs><linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#167a39" stopOpacity={0.55}/><stop offset="95%" stopColor="#167a39" stopOpacity={0.06}/></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10}/><YAxis allowDecimals={false}/><Tooltip/><Area dataKey="users" name="Usuarios" type="monotone" stroke="#167a39" strokeWidth={3} fill="url(#attendanceFill)"/><Area dataKey="routes" name="Rutas" type="monotone" stroke="#e87528" strokeWidth={2} fillOpacity={0}/><Area dataKey="events" name="Eventos" type="monotone" stroke="#317bb5" strokeWidth={2} fillOpacity={0}/></AreaChart></ResponsiveContainer></div></article>
          <aside className="intelligence-insights">
            <article className="ec-card"><div className="ec-card__header"><h2><BrainCircuit size={17} /> Resumen automático</h2><span className="ec-badge ec-badge--green">REAL</span></div><div className="ec-card__body intelligence-insight-list"><div><strong>Destino con mayor afluencia</strong><p>{highest ? `${highest.name} registra ${number(highest.visits)} visitas.` : 'Todavía no existen métricas de afluencia.'}</p><span>Calculado por la API</span></div><div><strong>Cobertura comercial</strong><p>{number(summary?.negociosVerificados)} de {number(summary?.totalNegocios)} negocios están verificados.</p><span>Validación de negocios</span></div><div><strong>Contenido disponible</strong><p>{number(summary?.totalDestinos)} destinos y {number(summary?.totalEventos)} eventos activos.</p><span>Inventario actual</span></div></div></article>
          </aside>
        </section>

        <section className="intelligence-secondary-grid">
          <article className="ec-card"><div className="ec-card__header"><h2>Distribución Geográfica</h2></div><div className="intelligence-map"><MapPinned size={46}/><span>Las ubicaciones provienen de los destinos registrados</span><div className="map-hotspot map-hotspot--one"/><div className="map-hotspot map-hotspot--two"/><div className="map-hotspot map-hotspot--three"/></div></article>
          <article className="ec-card"><div className="ec-card__header"><h2>Top destinos</h2><span className="ec-stat-card__trend">Por afluencia</span></div><div className="ec-card__body intelligence-ranking">{topDestinations.slice(0, 10).map((destination, index)=><div key={destination.id}><strong>#{index + 1} {destination.name}</strong><span>{number(destination.visits)}</span></div>)}{!isLoading && !topDestinations.length && <p>Sin métricas disponibles.</p>}</div></article>
        </section>

        <section className="intelligence-cards-grid">
          <article className="ec-card"><div className="ec-card__header"><h2>Contenido registrado</h2></div><div className="ec-card__body demographic-bars"><div><span>Destinos</span><i style={{height:`${Math.max(15, Math.min(100, summary?.totalDestinos ?? 0))}%`}}/><strong>{number(summary?.totalDestinos)}</strong></div><div><span>Negocios</span><i style={{height:`${Math.max(15, Math.min(100, summary?.totalNegocios ?? 0))}%`}}/><strong>{number(summary?.totalNegocios)}</strong></div><div><span>Eventos</span><i style={{height:`${Math.max(15, Math.min(100, summary?.totalEventos ?? 0))}%`}}/><strong>{number(summary?.totalEventos)}</strong></div><div><span>Reseñas</span><i style={{height:`${Math.max(15, Math.min(100, summary?.totalResenas ?? 0))}%`}}/><strong>{number(summary?.totalResenas)}</strong></div></div></article>
          <article className="ec-card"><div className="ec-card__header"><h2>Interacción de negocio</h2></div><div className="ec-card__body budget-grid"><div><small>Favoritos totales</small><strong>{number((summary?.totalFavoritosDestinos ?? 0) + (summary?.totalFavoritosNegocios ?? 0))}</strong></div><div><small>Visualizaciones</small><strong>{number(summary?.visualizacionesNegocios)}</strong></div><div><small>Clics reserva</small><strong>{number(summary?.clicsReservaNegocios)}</strong></div></div></article>
          <article className="ec-card"><div className="ec-card__header"><h2>Categorías activas</h2></div><div className="ec-card__body interest-tags">{(data?.categoryDistribution ?? []).map(category=><span key={category.name}>{category.name}: {category.total}</span>)}{!isLoading && !data?.categoryDistribution.length && <span>Sin categorías</span>}</div></article>
        </section>

        <section className="ec-card sustainability-card"><div className="ec-card__header"><div><h2>Observaciones basadas en datos</h2><p>Sin proyecciones ni información inventada</p></div><button className="ec-button ec-button--primary" type="button" onClick={exportJson} disabled={!data}><FileText size={16}/> Descargar datos</button></div><div className="sustainability-grid"><div><span className="ec-stat-card__icon"><Sparkles size={17}/></span><strong>Destino prioritario</strong><p>{highest ? `Dar seguimiento a ${highest.name}, actualmente encabeza la afluencia.` : 'Registra afluencia para identificar destinos prioritarios.'}</p></div><div><span className="ec-stat-card__icon ec-stat-card__icon--orange"><TrendingUp size={17}/></span><strong>Destino con menor registro</strong><p>{least ? `${least.name} tiene ${number(least.visits)} visitas registradas.` : 'No existen datos suficientes.'}</p></div><div><span className="ec-stat-card__icon ec-stat-card__icon--blue"><CalendarDays size={17}/></span><strong>Agenda turística</strong><p>Actualmente hay {number(summary?.totalEventos)} eventos activos disponibles en la plataforma.</p></div></div></section>
      </div>
    </PanelShell>
  );
}

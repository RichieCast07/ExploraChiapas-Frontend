import { BarChart3, CalendarDays, MapPinned, Route, Star, Store, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useAdminAnalyticsViewModel } from '../viewmodels/useAdminAnalyticsViewModel';
import './AdminAnalyticsPage.css';

function number(value: number | undefined): string {
  return (value ?? 0).toLocaleString('es-MX');
}

export function AdminAnalyticsPage() {
  const { data, isLoading, error, reload } = useAdminAnalyticsViewModel();
  const summary = data?.summary;
  const categoryTotal = data?.categoryDistribution.reduce((total, item) => total + item.total, 0) ?? 0;

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-analytics-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">Dashboard <span>›</span> Analítica e Inteligencia Turística</div>
            <h1 className="ec-page-title">Inteligencia Turística</h1>
            <p className="ec-page-subtitle">Indicadores consolidados directamente desde la base de datos de ExploraChiapas.</p>
          </div>
          <div className="ec-actions">
            <button className="ec-button" type="button" onClick={() => void reload()} disabled={isLoading}>Actualizar</button>
            <Link className="ec-button ec-button--primary" to="/admin/analitica/pro">Abrir vista Pro</Link>
          </div>
        </div>

        {error && <div className="ec-note ec-note--danger">{error}</div>}

        <section className="ec-stat-grid ec-stat-grid--6 analytics-stats">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Users size={17} /></span></div><div><div className="ec-stat-card__label">Usuarios activos</div><div className="ec-stat-card__value">{isLoading ? '…' : number(summary?.totalUsuarios)}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Route size={17} /></span></div><div><div className="ec-stat-card__label">Rutas generadas</div><div className="ec-stat-card__value">{isLoading ? '…' : number(summary?.totalRutas)}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Star size={17} /></span></div><div><div className="ec-stat-card__label">Promedio destinos</div><div className="ec-stat-card__value">{isLoading ? '…' : (summary?.promedioCalificacionDestinos ?? 0).toFixed(2)}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><MapPinned size={17} /></span></div><div><div className="ec-stat-card__label">Afluencia registrada</div><div className="ec-stat-card__value">{isLoading ? '…' : number(summary?.afluenciaDestinos)}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Store size={17} /></span></div><div><div className="ec-stat-card__label">Negocios verificados</div><div className="ec-stat-card__value">{isLoading ? '…' : number(summary?.negociosVerificados)}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><CalendarDays size={17} /></span></div><div><div className="ec-stat-card__label">Eventos activos</div><div className="ec-stat-card__value">{isLoading ? '…' : number(summary?.totalEventos)}</div></div></article>
        </section>

        <section className="ec-card analytics-chart-card">
          <div className="ec-card__header"><div><h2>Altas, rutas y eventos por mes</h2><small>Últimos seis meses, calculados desde los registros reales</small></div></div>
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.monthly ?? []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2ee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} fontSize={10} />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Usuarios" fill="#18783a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="routes" name="Rutas" fill="#e78842" radius={[4, 4, 0, 0]} />
                <Bar dataKey="events" name="Eventos" fill="#317bb5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="ec-grid-2 analytics-bottom-grid">
          <article className="ec-card">
            <div className="ec-card__header"><h2>Ranking de Destinos</h2><span className="ec-badge">Afluencia registrada</span></div>
            <div className="ec-table-wrap">
              <table className="ec-table">
                <thead><tr><th>Pos</th><th>Destino</th><th>Municipio</th><th>Categoría</th><th>Visitas</th><th>Reseñas</th><th>Calif.</th></tr></thead>
                <tbody>
                  {(data?.topDestinations ?? []).map((destination, index) => (
                    <tr key={destination.id}>
                      <td><strong className="ranking-number">#{index + 1}</strong></td>
                      <td><strong>{destination.name}</strong></td>
                      <td>{destination.municipality ?? 'Sin municipio'}</td>
                      <td>{destination.category ?? 'Sin categoría'}</td>
                      <td>{number(destination.visits)}</td>
                      <td>{number(destination.reviews)}</td>
                      <td><strong className="ranking-rating">★ {destination.rating.toFixed(1)}</strong></td>
                    </tr>
                  ))}
                  {!isLoading && !data?.topDestinations.length && <tr><td colSpan={7}>Todavía no hay destinos con métricas.</td></tr>}
                </tbody>
              </table>
            </div>
          </article>

          <aside className="ec-card popular-categories">
            <div className="ec-card__header"><h2>Categorías de destinos</h2></div>
            <div className="ec-card__body">
              {(data?.categoryDistribution ?? []).map((category, index) => {
                const percentage = categoryTotal ? Math.round((category.total / categoryTotal) * 100) : 0;
                const colors = ['#16803b', '#e87528', '#317bb5', '#e33e34', '#7b5dbb'];
                return <div className="popular-category" key={category.name}><div><span>{category.name}</span><strong>{category.total} ({percentage}%)</strong></div><div><i style={{ width: `${percentage}%`, background: colors[index % colors.length] }} /></div></div>;
              })}
              {!isLoading && !data?.categoryDistribution.length && <p>No hay categorías de destinos registradas.</p>}
              <div className="analytics-insight"><span>DATOS DISPONIBLES</span><p>Las cifras se calculan desde usuarios, rutas, eventos, destinos, reseñas y métricas guardadas en MariaDB. No se muestran predicciones inventadas.</p></div>
            </div>
          </aside>
        </section>

        <footer className="analytics-footer"><span>Fuente: base de datos ExploraChiapas</span><strong><i /> Conexión API activa</strong></footer>
      </div>
    </PanelShell>
  );
}

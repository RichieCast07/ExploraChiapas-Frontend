import {
  AlertTriangle,
  ArrowUpRight,
  CalendarPlus,
  CheckCircle2,
  MapPinPlus,
  Store,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useAdminAnalyticsViewModel } from '../../../Analitica/presentation/viewmodels/useAdminAnalyticsViewModel';
import './AdminHome.css';

interface PendingBusiness {
  id: string;
  name: string;
  businessTypeName: string;
  requestStatus: string;
  createdAt: string;
}

interface AlertItem {
  id: string;
  typeName: string;
  description: string;
  statusName: string;
  generatedAt: string;
}

function relativeDate(value: string): string {
  const date = new Date(value);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return date.toLocaleDateString('es-MX');
}

export function AdminHomePage() {
  const { stats, isLoading, error, recargar } = useAdminStatsViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Admin';

  const formatValue = (value: number | undefined) => {
    return value?.toLocaleString('es-MX') ?? '0';
  };

  useEffect(() => {
    void loadActivity();
  }, []);

  const refresh = async () => {
    await Promise.all([reload(), loadActivity()]);
  };

            <div className="admin-header__user">
              <div className="admin-header__user-info">
                <span className="admin-header__user-name">{userName}</span>
                <span className="admin-header__user-role">SUPER ADMINISTRADOR</span>
              </div>
              <div className="admin-header__avatar">{userName.charAt(0).toUpperCase()}</div>
            </div>
          </div>
          <div className="ec-actions">
            <button className="ec-button" type="button" onClick={() => void refresh()} disabled={isLoading}>Actualizar datos</button>
            <Link className="ec-button ec-button--primary" to="/admin/destinos"><MapPinPlus size={16} /> Nuevo destino</Link>
          </div>
        </div>

        {(error || activityError) && <div className="ec-alert">{error ?? activityError}</div>}

        <section className="ec-stat-grid">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Users size={18} /></span></div><div><div className="ec-stat-card__label">Usuarios activos</div><div className="ec-stat-card__value">{isLoading ? '…' : (summary?.totalUsuarios ?? 0).toLocaleString('es-MX')}</div><div className="ec-stat-card__hint">Cuentas activas en la plataforma</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Store size={18} /></span></div><div><div className="ec-stat-card__label">Negocios turísticos</div><div className="ec-stat-card__value">{isLoading ? '…' : (summary?.totalNegocios ?? 0).toLocaleString('es-MX')}</div><div className="ec-stat-card__hint">{summary?.negociosVerificados ?? 0} verificados</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><MapPinPlus size={18} /></span></div><div><div className="ec-stat-card__label">Destinos turísticos</div><div className="ec-stat-card__value">{isLoading ? '…' : (summary?.totalDestinos ?? 0).toLocaleString('es-MX')}</div><div className="ec-stat-card__hint">{data?.categoryDistribution.length ?? 0} categorías con destinos</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--red"><AlertTriangle size={18} /></span>{pendingReports > 0 && <span className="ec-badge ec-badge--red">Pendiente</span>}</div><div><div className="ec-stat-card__label">Reportes pendientes</div><div className="ec-stat-card__value">{pendingReports}</div><div className="ec-stat-card__hint">Cargados desde moderación</div></div></article>
        </section>

        <section className="admin-dashboard-charts">
          <article className="ec-card">
            <div className="ec-card__header"><div><h2>Actividad por mes</h2><small>Últimos seis meses</small></div><div className="admin-chart-legend"><span><i className="legend-dot legend-dot--green" />Usuarios</span><span><i className="legend-dot" />Rutas</span></div></div>
            <div className="admin-chart-area"><ResponsiveContainer width="100%" height={250}><LineChart data={data?.monthly ?? []} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={11} /><YAxis allowDecimals={false} /><Tooltip /><Line dataKey="routes" name="Rutas" type="monotone" stroke="#c88946" strokeDasharray="4 4" strokeWidth={2} dot={false} /><Line dataKey="users" name="Usuarios" type="monotone" stroke="#19813c" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header"><h2>Destinos con mayor afluencia</h2><Link to="/admin/analitica">Analítica</Link></div>
            <div className="ec-card__body destination-ranking">
              {(data?.topDestinations ?? []).slice(0, 4).map((destination) => (
                <div className="destination-bar" key={destination.id}><div><strong>{destination.name}</strong><span>{destination.visits.toLocaleString('es-MX')}</span></div><div className="destination-bar__track"><span style={{ width: `${Math.round((destination.visits / maxVisits) * 100)}%` }} /></div></div>
              ))}
              {!isLoading && !data?.topDestinations.length && <div className="ec-note">Aún no hay métricas de destinos.</div>}
            </div>
          </article>
        </section>

        <section className="admin-dashboard-bottom">
          <article className="ec-card">
            <div className="ec-card__header"><h2>Actividad reciente</h2><Link className="ec-button ec-button--ghost ec-button--sm" to="/admin/moderacion">Ver todo</Link></div>
            <div className="activity-feed">
              {pendingBusinesses.slice(0, 2).map((business) => <div className="activity-feed__item" key={business.id}><span className="activity-icon"><Store size={16} /></span><div><strong>{business.name} solicitó registrar un negocio.</strong><small>{relativeDate(business.createdAt)} · {business.businessTypeName}</small></div><Link to="/admin/negocios" className="ec-button ec-button--sm">Revisar</Link></div>)}
              {alerts.slice(0, 3).map((alert) => <div className="activity-feed__item" key={alert.id}><span className="activity-icon activity-icon--red"><AlertTriangle size={16} /></span><div><strong>{alert.description}</strong><small>{relativeDate(alert.generatedAt)} · {alert.typeName}</small></div><Link to="/admin/moderacion" className="ec-badge ec-badge--red">Revisar</Link></div>)}
              {!pendingBusinesses.length && !alerts.length && <div className="ec-note">No hay actividad pendiente.</div>}
            </div>
          </article>

          <aside className="ec-card">
            <div className="ec-card__header"><h2>Acciones rápidas</h2></div>
            <div className="quick-actions">
              <Link to="/admin/destinos" className="quick-action"><MapPinPlus size={18} /><span><strong>Registrar destino</strong><small>Añadir punto de interés</small></span><ArrowUpRight size={15} /></Link>
              <Link to="/admin/negocios" className="quick-action"><CheckCircle2 size={18} /><span><strong>Aprobar negocio</strong><small>{pendingBusinesses.length} pendientes</small></span><ArrowUpRight size={15} /></Link>
              <Link to="/admin/eventos/nuevo" className="quick-action"><CalendarPlus size={18} /><span><strong>Crear evento</strong><small>Promocionar cultura local</small></span><ArrowUpRight size={15} /></Link>
            </div>
            <div className="system-status"><span>ESTADO DEL SISTEMA</span><p><i /> API y base de datos disponibles</p></div>
          </aside>
        </section>
      </div>
    </PanelShell>
  );
}

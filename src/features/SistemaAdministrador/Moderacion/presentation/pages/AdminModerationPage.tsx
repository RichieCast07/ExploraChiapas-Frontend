import { Ban, CheckCircle2, FileCheck2, Search, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './AdminModerationPage.css';

interface Alert {
  id: string;
  typeName: string;
  description: string;
  statusName: 'pendiente' | 'atendida' | 'descartada';
  scopeName: string;
  entityTypeName: string | null;
  entityId: string | null;
  generatedAt: string;
}

export function AdminModerationPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [state, setState] = useState<'todos' | Alert['statusName']>('todos');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAlerts(await apiRequest<Alert[]>('/alerts?limit=100'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las alertas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => alerts.filter((alert) => {
    const term = search.trim().toLowerCase();
    return (state === 'todos' || alert.statusName === state)
      && (!term || `${alert.typeName} ${alert.description} ${alert.entityTypeName ?? ''} ${alert.entityId ?? ''}`.toLowerCase().includes(term));
  }), [alerts, search, state]);

  const changeStatus = async (alert: Alert, action: 'attend' | 'discard') => {
    setUpdatingId(alert.id);
    setError(null);
    try {
      await apiRequest(`/alerts/${alert.id}/${action}`, { method: 'PATCH' });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar el reporte');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page moderation-page">
        <div className="ec-page-header"><div className="ec-page-header__copy"><h1 className="ec-page-title">Panel de Moderación</h1><p className="ec-page-subtitle">Gestiona las alertas registradas por la plataforma.</p></div></div>
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}

        <section className="ec-stat-grid">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--red"><ShieldAlert size={18} /></span></div><div><div className="ec-stat-card__label">Reportes pendientes</div><div className="ec-stat-card__value">{alerts.filter((alert) => alert.statusName === 'pendiente').length}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><CheckCircle2 size={18} /></span></div><div><div className="ec-stat-card__label">Atendidos</div><div className="ec-stat-card__value">{alerts.filter((alert) => alert.statusName === 'atendida').length}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Ban size={18} /></span></div><div><div className="ec-stat-card__label">Descartados</div><div className="ec-stat-card__value">{alerts.filter((alert) => alert.statusName === 'descartada').length}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><FileCheck2 size={18} /></span></div><div><div className="ec-stat-card__label">Alertas totales</div><div className="ec-stat-card__value">{alerts.length}</div></div></article>
        </section>

        <section className="ec-card">
          <div className="ec-card__header moderation-table-header"><h2>Cola de revisión</h2><div className="moderation-filters"><select value={state} onChange={(event) => setState(event.target.value as typeof state)}><option value="todos">Todos</option><option value="pendiente">Pendientes</option><option value="atendida">Atendidos</option><option value="descartada">Descartados</option></select><button className="ec-button ec-button--sm" type="button" onClick={() => void load()}>Actualizar</button></div></div>
          <div className="moderation-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar tipo, descripción o entidad" /></div>
          <div className="ec-table-wrap"><table className="ec-table moderation-table"><thead><tr><th>Tipo</th><th>Entidad</th><th>Descripción</th><th>Ámbito</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filtered.map((alert) => <tr key={alert.id}><td><div className="ec-identity"><span className="ec-avatar">{alert.typeName.charAt(0).toUpperCase()}</span><div><strong>{alert.typeName}</strong><small>{alert.id.slice(0, 8)}</small></div></div></td><td>{alert.entityTypeName ?? 'General'}<br /><small>{alert.entityId?.slice(0, 8) ?? ''}</small></td><td className="moderation-comment">“{alert.description}”</td><td><span className="ec-badge">{alert.scopeName}</span></td><td>{new Date(alert.generatedAt).toLocaleDateString('es-MX')}</td><td><span className={`ec-badge ${alert.statusName === 'pendiente' ? 'ec-badge--orange' : alert.statusName === 'atendida' ? 'ec-badge--green' : 'ec-badge--red'}`}>{alert.statusName}</span></td><td><div className="moderation-actions"><button type="button" disabled={updatingId === alert.id || alert.statusName === 'atendida'} title="Marcar atendida" onClick={() => void changeStatus(alert, 'attend')}><CheckCircle2 size={15} /></button><button type="button" disabled={updatingId === alert.id || alert.statusName === 'descartada'} className="danger" title="Descartar" onClick={() => void changeStatus(alert, 'discard')}><Ban size={15} /></button></div></td></tr>)}</tbody></table></div>
          {isLoading && <div className="ec-note">Cargando alertas...</div>}
          {!isLoading && filtered.length === 0 && <div className="ec-note">No hay alertas con los filtros seleccionados.</div>}
          <footer className="moderation-footer">Mostrando {filtered.length} de {alerts.length} reportes</footer>
        </section>
      </div>
    </PanelShell>
  );
}

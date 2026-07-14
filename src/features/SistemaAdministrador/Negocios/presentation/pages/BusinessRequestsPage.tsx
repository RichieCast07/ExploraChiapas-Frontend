import { Check, Clock3, Eye, Search, Timer, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './BusinessRequestsPage.css';

type RequestStatus = 'Pendiente' | 'Aprobado' | 'Rechazado';

interface BusinessRequest {
  id: string;
  name: string;
  description: string | null;
  businessTypeName: string;
  address: string | null;
  municipality: string | null;
  state: string | null;
  imageUrl: string | null;
  requestStatus: 'pendiente' | 'aprobada' | 'rechazada';
  createdAt: string;
  owner: { name: string | null; email: string | null };
}

const apiStatus: Record<RequestStatus, BusinessRequest['requestStatus']> = {
  Pendiente: 'pendiente',
  Aprobado: 'aprobada',
  Rechazado: 'rechazada',
};

function completeness(request: BusinessRequest): number {
  const values = [request.name, request.description, request.businessTypeName, request.address, request.municipality, request.imageUrl, request.owner.email];
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function BusinessRequestsPage() {
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [tab, setTab] = useState<RequestStatus>('Pendiente');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRequests(await apiRequest<BusinessRequest[]>('/businesses/admin/requests?status=todas'));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => requests.filter((request) =>
    request.requestStatus === apiStatus[tab]
      && `${request.name} ${request.owner.name ?? ''} ${request.municipality ?? ''}`.toLowerCase().includes(search.trim().toLowerCase()),
  ), [requests, search, tab]);

  const updateStatus = async (request: BusinessRequest, action: 'approve' | 'reject') => {
    setUpdatingId(request.id);
    setError(null);
    try {
      await apiRequest(`/businesses/${request.id}/validate`, {
        method: 'PATCH',
        body: JSON.stringify({ action }),
      });
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la solicitud');
    } finally {
      setUpdatingId(null);
    }
  };

  const approved = requests.filter((request) => request.requestStatus === 'aprobada').length;
  const decided = approved + requests.filter((request) => request.requestStatus === 'rechazada').length;
  const approvalRate = decided ? (approved / decided) * 100 : 0;

  return (
    <PanelShell kind="admin">
      <div className="ec-page business-requests-page">
        <div className="ec-page-header"><div className="ec-page-header__copy"><h1 className="ec-page-title">Validación de Solicitudes</h1><p className="ec-page-subtitle">Revisa y gestiona las solicitudes reales de registro de negocios.</p></div></div>
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}

        <section className="ec-stat-grid ec-stat-grid--3">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Clock3 size={19} /></span></div><div><div className="ec-stat-card__label">Solicitudes pendientes</div><div className="ec-stat-card__value">{requests.filter((request) => request.requestStatus === 'pendiente').length}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><TrendingUp size={19} /></span></div><div><div className="ec-stat-card__label">Tasa de aprobación</div><div className="ec-stat-card__value">{approvalRate.toFixed(1)}%</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Timer size={19} /></span></div><div><div className="ec-stat-card__label">Solicitudes totales</div><div className="ec-stat-card__value">{requests.length}</div></div></article>
        </section>

        <section className="ec-card">
          <div className="business-requests-top"><div className="ec-tabs">{(['Pendiente', 'Aprobado', 'Rechazado'] as RequestStatus[]).map((status) => <button className={`ec-tab ${tab === status ? 'ec-tab--active' : ''}`} key={status} onClick={() => setTab(status)} type="button">{status === 'Pendiente' ? 'Pendientes' : `${status}s`} <span className="request-tab-count">{requests.filter((request) => request.requestStatus === apiStatus[status]).length}</span></button>)}</div><label className="business-request-search"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar negocio, propietario o municipio" /></label></div>

          <div className="ec-table-wrap"><table className="ec-table"><thead><tr><th>Negocio</th><th>Categoría</th><th>Fecha</th><th>Municipio</th><th>Completitud</th><th>Acciones</th></tr></thead><tbody>{filtered.map((request) => { const score = completeness(request); return <tr key={request.id}><td><div className="ec-identity"><span className="business-request-logo">🏨</span><div><strong>{request.name}</strong><small>{request.owner.name ?? 'Sin propietario'} · {request.owner.email ?? 'Sin correo'}</small></div></div></td><td><span className="ec-badge">{request.businessTypeName}</span></td><td>{new Date(request.createdAt).toLocaleDateString('es-MX')}</td><td>{request.municipality ?? 'Sin municipio'}</td><td><div className="request-score"><span><i style={{ width: `${score}%` }} /></span><strong>{score}%</strong></div></td><td><div className="request-actions">{request.requestStatus === 'pendiente' && <><button className="request-action request-action--approve" disabled={updatingId === request.id} title="Aprobar" type="button" onClick={() => void updateStatus(request, 'approve')}><Check size={16} /></button><button className="request-action request-action--reject" disabled={updatingId === request.id} title="Rechazar" type="button" onClick={() => void updateStatus(request, 'reject')}><X size={16} /></button></>}<button className="request-action" title="Ver detalle" type="button" onClick={() => window.alert(`${request.name}\nPropietario: ${request.owner.name ?? '-'}\nCorreo: ${request.owner.email ?? '-'}\nDirección: ${request.address ?? '-'}, ${request.municipality ?? '-'}, ${request.state ?? '-'}\n\n${request.description ?? 'Sin descripción'}`)}><Eye size={16} /></button></div></td></tr>; })}</tbody></table></div>
          {isLoading && <div className="ec-empty">Cargando solicitudes...</div>}
          {!isLoading && filtered.length === 0 && <div className="ec-empty">No hay solicitudes en este estado.</div>}
          <footer className="business-requests-footer"><span>Mostrando {filtered.length} de {requests.length} solicitudes</span><button className="ec-button ec-button--sm" type="button" onClick={() => void load()}>Actualizar</button></footer>
        </section>
      </div>
    </PanelShell>
  );
}

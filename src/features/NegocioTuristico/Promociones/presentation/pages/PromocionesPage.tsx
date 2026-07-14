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

export function PromocionesPage() {
  const { promociones, isLoading, error, eliminar, recargar } = usePromocionesViewModel();
  const list = promociones.length > 0 ? promociones : fallbackPromotions;
  const isDemo = promociones.length === 0;

  return (
    <PanelShell kind="business">
      <div className="ec-page promotions-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy"><div className="ec-breadcrumb">Servicios <span>›</span> Promociones</div><h1 className="ec-page-title">Promociones</h1><p className="ec-page-subtitle">Crea, publica y administra las ofertas visibles en tu perfil.</p></div>
          <div className="ec-actions"><button className="ec-button" type="button" onClick={() => void recargar()} disabled={isLoading}><RefreshCw size={16}/> Actualizar</button><Link className="ec-button ec-button--primary" to="/negocio/promociones/nueva"><Plus size={16}/> Nueva Promoción</Link></div>
        </div>
        {error && <div className="ec-alert">{error}. Se muestran promociones de referencia.</div>}
        <section className="ec-stat-grid ec-stat-grid--3"><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Tag size={18}/></span></div><div><div className="ec-stat-card__label">Promociones activas</div><div className="ec-stat-card__value">{list.filter((item)=>item.activo).length}</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><CalendarDays size={18}/></span></div><div><div className="ec-stat-card__label">Próximas a vencer</div><div className="ec-stat-card__value">1</div></div></article><article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Plus size={18}/></span></div><div><div className="ec-stat-card__label">Conversiones atribuidas</div><div className="ec-stat-card__value">214</div></div></article></section>
        <section className="promotion-grid">{list.map((promotion)=><article className="ec-card promotion-card" key={promotion.id}><div className="promotion-card__banner"><Tag size={25}/><span className={`ec-badge ${promotion.activo?'ec-badge--green':'ec-badge--orange'}`}>{promotion.activo?'Activa':'Finalizada'}</span></div><div className="promotion-card__content"><div className="promotion-card__heading"><h2>{promotion.titulo}</h2>{promotion.precio !== null && <strong>{promotion.precio}%</strong>}</div><p>{promotion.descripcion ?? 'Sin descripción'}</p><div className="promotion-card__dates"><CalendarDays size={14}/><span>{formatDate(promotion.fechaInicio)} — {formatDate(promotion.fechaFin)}</span></div></div><footer><button className="ec-button ec-button--sm" type="button"><Pencil size={14}/> Editar</button><button className="ec-button ec-button--sm promotion-delete" type="button" disabled={isDemo} onClick={()=>void eliminar(promotion.id)}><Trash2 size={14}/> Eliminar</button></footer></article>)}<Link to="/negocio/promociones/nueva" className="promotion-create-card"><span><Plus size={26}/></span><h2>Crear Nueva Oferta</h2><p>Llega a más clientes con descuentos exclusivos por temporada.</p></Link></section>
      </div>
    </PanelShell>
  );
}

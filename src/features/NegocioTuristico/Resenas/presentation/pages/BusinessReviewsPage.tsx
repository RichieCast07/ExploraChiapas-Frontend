import { Filter, MessageSquareText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './BusinessReviewsPage.css';

interface Business { id: string; name: string; }
interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string | null;
  response: string | null;
  responseDate: string | null;
  createdAt: string;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export function BusinessReviewsPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'todas' | 'respondidas' | 'pendientes'>('todas');
  const [replying, setReplying] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingReply, setSavingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const businesses = await apiRequest<Business[]>('/businesses/mine');
      const selected = businesses[0] ?? null;
      setBusiness(selected);
      if (!selected) {
        setReviews([]);
        return;
      }
      setReviews(await apiRequest<Review[]>(`/reviews/business/${selected.id}`));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar las reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(
    () => reviews.filter((review) => filter === 'todas' || (filter === 'respondidas' ? Boolean(review.response) : !review.response)),
    [filter, reviews],
  );

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const total = reviews.filter((review) => review.rating === rating).length;
    return reviews.length ? Math.round((total / reviews.length) * 100) : 0;
  });

  const saveReply = async (reviewId: string) => {
    if (!business || !reply.trim()) return;
    setSavingReply(true);
    setError(null);
    try {
      await apiRequest(`/reviews/business/${business.id}/${reviewId}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ response: reply.trim() }),
      });
      setReplying(null);
      setReply('');
      await load();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo publicar la respuesta');
    } finally {
      setSavingReply(false);
    }
  };

  return (
    <PanelShell kind="business">
      <div className="ec-page business-reviews-page">
        <div className="ec-page-header"><div><h1 className="ec-page-title">Reseñas y Comentarios</h1><p className="ec-page-subtitle">Gestiona y responde a las experiencias de tus huéspedes en Chiapas.</p></div><div className="reviews-filter-menu"><Filter size={15} /><select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="todas">Todas</option><option value="respondidas">Respondidas</option><option value="pendientes">Pendientes</option></select></div></div>
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}
        {isLoading && <div className="ec-note">Cargando reseñas...</div>}
        {!isLoading && !business && <div className="ec-note">Registra un negocio para consultar sus reseñas.</div>}

        <section className="business-review-summary-grid">
          <article className="ec-card review-score-card"><span>RENDIMIENTO GENERAL</span><div><strong>{average.toFixed(1)}</strong><small>/5</small></div><p>{'★'.repeat(Math.round(average))}{'☆'.repeat(5 - Math.round(average))}</p><small>Basado en {reviews.length} reseñas totales</small><em>{business?.name ?? 'Sin negocio seleccionado'}</em></article>
          <article className="ec-card"><div className="ec-card__header"><h2>Distribución de Calificaciones</h2><span className="review-verified"><i /> Reseñas registradas</span></div><div className="ec-card__body review-distribution">{distribution.map((percentage, index) => <div key={5 - index}><span>{5 - index} estrella{index < 4 ? 's' : ''}</span><div><i style={{ width: `${percentage}%` }} /></div><strong>{percentage}%</strong></div>)}</div></article>
        </section>

        <section className="ec-card">
          <div className="ec-card__header"><h2>Reseñas Recientes</h2><button className="ec-button ec-button--ghost ec-button--sm" type="button" onClick={() => void load()}>Actualizar</button></div>
          <div className="business-review-list">{filtered.map((review) => <article key={review.id}><span className="ec-avatar">{review.userName.charAt(0).toUpperCase()}</span><div className="business-review-body"><div className="business-review-heading"><div><strong>{review.userName}</strong><span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div><small>{formatDate(review.createdAt)}</small></div><p>{review.comment || 'El usuario no dejó comentario.'}</p>{review.response && <div className="business-review-response"><strong>Tu Respuesta</strong><p>{review.response}</p><small>{review.responseDate ? formatDate(review.responseDate) : ''}</small></div>}{replying === review.id ? <div className="business-reply-form"><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Escribe una respuesta profesional..." /><div><button className="ec-button ec-button--sm" type="button" onClick={() => setReplying(null)}>Cancelar</button><button className="ec-button ec-button--primary ec-button--sm" type="button" disabled={savingReply} onClick={() => void saveReply(review.id)}>{savingReply ? 'Publicando...' : 'Publicar respuesta'}</button></div></div> : <button className="business-review-reply" type="button" onClick={() => { setReplying(review.id); setReply(review.response ?? ''); }}><MessageSquareText size={13} />{review.response ? 'Editar Respuesta' : 'Responder'}</button>}</div></article>)}</div>
          {!isLoading && filtered.length === 0 && <div className="ec-note">No hay reseñas que coincidan con el filtro seleccionado.</div>}
          <button className="business-reviews-more" type="button" onClick={() => void load()}>Mostrar {reviews.length} reseñas</button>
        </section>
      </div>
    </PanelShell>
  );
}

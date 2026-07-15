import {
  BadgeCheck,
  Eye,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Plus,
  RefreshCw,
  Route,
  ShieldCheck,
  Star,
  Tag,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { BASE_URL } from '../../../../../core/shared/config/api';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { fetchAuth } from '../../../../../core/shared/utils/auth';
import { useNegocioStatsViewModel } from '../viewmodels/useNegocioStatsViewModel';
import './NegocioHomePage.css';

interface CheckoutResponse {
  success: boolean;
  url?: string;
  message?: string;
}

function relativeDate(dateValue: string): string {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Fecha no disponible';
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Hace ${hours} h`;

  return date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatNumber(
  value: number | null | undefined,
  isLoading: boolean,
): string {
  if (isLoading) return '…';
  return (value ?? 0).toLocaleString('es-MX');
}

export function NegocioHomePage() {
  const {
    stats,
    recentReviews,
    isLoading,
    error,
    reload,
  } = useNegocioStatsViewModel();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const userName = localStorage.getItem('user_name') ?? 'Administrador';
  const businessName = stats?.negocioNombre ?? userName;
  const averageRating = stats?.calificacionPromedio ?? 0;

  async function handleSuscribirse(): Promise<void> {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetchAuth(
        `${BASE_URL}/payments/checkout`,
        {
          method: 'POST',
        },
      );

      const body = (await response.json()) as CheckoutResponse;

      if (!response.ok || !body.success || !body.url) {
        throw new Error(
          body.message ?? 'No se pudo iniciar el proceso de suscripción',
        );
      }

      window.location.assign(body.url);
    } catch (requestError) {
      setCheckoutError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo conectar con el servicio de pagos',
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <PanelShell kind="business">
      <div className="ec-page negocio-home">
        <header className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Mi negocio <span>›</span> Inicio
            </div>

            <h1 className="ec-page-title">
              Bienvenido, {businessName}
            </h1>

            <p className="ec-page-subtitle">
              Consulta el rendimiento y la actividad reciente de tu negocio.
            </p>
          </div>

          <div className="ec-actions">
            <button
              className="ec-button"
              type="button"
              onClick={() => void reload()}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              Actualizar
            </button>

            <Link
              className="ec-button ec-button--primary"
              to="/negocio/promociones/nueva"
            >
              <Plus size={16} />
              Nueva promoción
            </Link>
          </div>
        </header>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        {checkoutError && (
          <div className="ec-alert">
            {checkoutError}
          </div>
        )}

        {!isLoading && stats && (
          stats.isVerified ? (
            <div className="negocio-verified-banner negocio-verified-banner--active">
              <BadgeCheck size={21} />

              <div className="negocio-verified-banner__text">
                <strong>Negocio verificado</strong>
                <span>
                  Tu negocio puede aparecer públicamente en la plataforma.
                </span>
              </div>
            </div>
          ) : (
            <div className="negocio-verified-banner">
              <ShieldCheck size={21} />

              <div className="negocio-verified-banner__text">
                <strong>Verifica tu negocio</strong>
                <span>
                  Suscríbete por $99 MXN al mes para obtener la insignia
                  de negocio verificado.
                </span>
              </div>

              <button
                className="negocio-verified-banner__btn"
                type="button"
                onClick={() => void handleSuscribirse()}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Cargando…' : 'Suscribirse'}
              </button>
            </div>
          )
        )}

        <section className="negocio-stats-grid">
          <article className="negocio-stat-card">
            <div className="negocio-stat-card__top">
              <span className="negocio-stat-card__label">
                Visualizaciones
              </span>

              <span className="negocio-stat-card__icon icon--blue">
                <Eye size={18} />
              </span>
            </div>

            <strong className="negocio-stat-card__value">
              {formatNumber(stats?.totalVisualizaciones, isLoading)}
            </strong>

            <p className="negocio-stat-card__footer">
              Visitas al perfil del negocio
            </p>
          </article>

          <article className="negocio-stat-card">
            <div className="negocio-stat-card__top">
              <span className="negocio-stat-card__label">
                Favoritos
              </span>

              <span className="negocio-stat-card__icon icon--green">
                <Heart size={18} />
              </span>
            </div>

            <strong className="negocio-stat-card__value">
              {formatNumber(stats?.totalFavoritos, isLoading)}
            </strong>

            <p className="negocio-stat-card__footer">
              Usuarios interesados en tu negocio
            </p>
          </article>

          <article className="negocio-stat-card">
            <div className="negocio-stat-card__top">
              <span className="negocio-stat-card__label">
                Apariciones en rutas
              </span>

              <span className="negocio-stat-card__icon icon--orange">
                <Route size={18} />
              </span>
            </div>

            <strong className="negocio-stat-card__value">
              {formatNumber(stats?.vecesEnRutas, isLoading)}
            </strong>

            <p className="negocio-stat-card__footer">
              Veces incluido en rutas turísticas
            </p>
          </article>

          <article className="negocio-stat-card">
            <div className="negocio-stat-card__top">
              <span className="negocio-stat-card__label">
                Reseñas
              </span>

              <span className="negocio-stat-card__icon icon--yellow">
                <MessageSquare size={18} />
              </span>
            </div>

            <strong className="negocio-stat-card__value">
              {formatNumber(stats?.totalResenas, isLoading)}
            </strong>

            <div className="negocio-stat-card__stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={15}
                  color="#f59e0b"
                  fill={
                    index < Math.round(averageRating)
                      ? '#f59e0b'
                      : 'none'
                  }
                />
              ))}

              <span>{averageRating.toFixed(1)}/5</span>
            </div>
          </article>
        </section>

        <section className="negocio-home__bottom">
          <article className="ec-card">
            <div className="ec-card__header">
              <div>
                <h2>Reseñas recientes</h2>
                <small>Últimas opiniones recibidas</small>
              </div>

              <Link
                className="ec-button ec-button--ghost ec-button--sm"
                to="/negocio/resenas"
              >
                Ver todas
              </Link>
            </div>

            <div className="negocio-review-list">
              {recentReviews.map((review) => (
                <div
                  className="negocio-review"
                  key={review.id}
                >
                  <div className="negocio-review__avatar">
                    V
                  </div>

                  <div className="negocio-review__content">
                    <div className="negocio-review__header">
                      <strong>Visitante</strong>

                      <span>
                        {relativeDate(review.createdAt)}
                      </span>
                    </div>

                    <div className="negocio-review__stars">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={14}
                          color="#f59e0b"
                          fill={
                            index < review.rating
                              ? '#f59e0b'
                              : 'none'
                          }
                        />
                      ))}
                    </div>

                    <p>
                      {review.comment ?? 'El visitante no dejó comentario.'}
                    </p>
                  </div>
                </div>
              ))}

              {!isLoading && recentReviews.length === 0 && (
                <div className="ec-note">
                  Todavía no hay reseñas para este negocio.
                </div>
              )}

              {isLoading && (
                <div className="ec-note">
                  Cargando reseñas…
                </div>
              )}
            </div>
          </article>

          <aside className="ec-card">
            <div className="ec-card__header">
              <h2>Acciones rápidas</h2>
            </div>

            <div className="negocio-quick-actions">
              <Link
                className="negocio-quick-action"
                to="/negocio/dashboard"
              >
                <LayoutDashboard size={18} />

                <span>
                  <strong>Ver dashboard</strong>
                  <small>Analiza tus estadísticas</small>
                </span>
              </Link>

              <Link
                className="negocio-quick-action"
                to="/negocio/promociones/nueva"
              >
                <Tag size={18} />

                <span>
                  <strong>Crear promoción</strong>
                  <small>
                    {stats?.promocionesActivas ?? 0} promociones activas
                  </small>
                </span>
              </Link>

              <Link
                className="negocio-quick-action"
                to="/negocio/resenas"
              >
                <Star size={18} />

                <span>
                  <strong>Consultar reseñas</strong>
                  <small>Revisa la opinión de tus visitantes</small>
                </span>
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </PanelShell>
  );
}
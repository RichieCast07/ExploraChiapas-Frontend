import {
  CalendarDays,
  Pencil,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import {
  type Promocion,
  usePromocionesViewModel,
} from '../viewmodels/usePromocionesViewModel';

import './PromocionesPage.css';

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Sin límite';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}

type PromotionStatus =
  | 'programada'
  | 'activa'
  | 'vencida'
  | 'inactiva';

function getPromotionStatus(
  promotion: Promocion,
): PromotionStatus {
  if (!promotion.activo) {
    return 'inactiva';
  }

  const now = new Date();

  const startDate =
    new Date(
      promotion.fechaInicio,
    );

  if (startDate > now) {
    return 'programada';
  }

  if (
    promotion.fechaFin &&
    new Date(
      promotion.fechaFin,
    ) < now
  ) {
    return 'vencida';
  }

  return 'activa';
}

const statusLabel: Record<
  PromotionStatus,
  string
> = {
  programada: 'Programada',
  activa: 'Activa',
  vencida: 'Vencida',
  inactiva: 'Inactiva',
};

export function PromocionesPage() {
  const {
    promociones,
    isLoading,
    error,
    eliminar,
    recargar,
  } = usePromocionesViewModel();

  const activePromotions =
    promociones.filter(
      (promotion) =>
        getPromotionStatus(
          promotion,
        ) === 'activa',
    ).length;

  const upcomingExpirations =
    promociones.filter(
      (promotion) => {
        if (
          !promotion.fechaFin
        ) {
          return false;
        }

        const endDate =
          new Date(
            promotion.fechaFin,
          );

        const now =
          new Date();

        const difference =
          endDate.getTime() -
          now.getTime();

        const days =
          difference /
          (
            1000 *
            60 *
            60 *
            24
          );

        return (
          days >= 0 &&
          days <= 7
        );
      },
    ).length;

  return (
    <PanelShell kind="business">
      <div className="ec-page promotions-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Servicios
              <span>›</span>
              Promociones
            </div>

            <h1 className="ec-page-title">
              Promociones
            </h1>

            <p className="ec-page-subtitle">
              Crea, publica y administra
              las ofertas visibles en tu
              perfil.
            </p>
          </div>

          <div className="ec-actions">
            <button
              className="ec-button"
              type="button"
              onClick={() =>
                void recargar()
              }
              disabled={isLoading}
            >
              <RefreshCw
                size={16}
              />

              Actualizar
            </button>

            <Link
              className="ec-button ec-button--primary"
              to="/negocio/promociones/nueva"
            >
              <Plus size={16} />

              Nueva Promoción
            </Link>
          </div>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        <section className="ec-stat-grid ec-stat-grid--3">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <Tag size={18} />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Promociones activas
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : activePromotions}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                <CalendarDays
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Próximas a vencer
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : upcomingExpirations}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--blue">
                <Plus size={18} />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Total registradas
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : promociones.length}
              </div>
            </div>
          </article>
        </section>

        {isLoading && (
          <div className="ec-note">
            Cargando promociones…
          </div>
        )}

        {!isLoading &&
          promociones.length ===
            0 && (
            <div className="ec-note">
              No tienes promociones
              registradas.
            </div>
          )}

        <section className="promotion-grid">
          {promociones.map(
            (promotion) => {
              const status =
                getPromotionStatus(
                  promotion,
                );

              return (
                <article
                  className="ec-card promotion-card"
                  key={
                    promotion.id
                  }
                >
                  <div className="promotion-card__banner">
                    <Tag
                      size={25}
                    />

                    <span
                      className={`ec-badge ${
                        status ===
                        'activa'
                          ? 'ec-badge--green'
                          : 'ec-badge--orange'
                      }`}
                    >
                      {
                        statusLabel[
                          status
                        ]
                      }
                    </span>
                  </div>

                  <div className="promotion-card__content">
                    <div className="promotion-card__heading">
                      <h2>
                        {
                          promotion.titulo
                        }
                      </h2>

                      {promotion.precio !==
                        null && (
                        <strong>
                          {
                            promotion.precio
                          }
                        </strong>
                      )}
                    </div>

                    <p>
                      {promotion.descripcion ??
                        'Sin descripción'}
                    </p>

                    <div className="promotion-card__dates">
                      <CalendarDays
                        size={14}
                      />

                      <span>
                        {formatDate(
                          promotion.fechaInicio,
                        )}

                        {' — '}

                        {formatDate(
                          promotion.fechaFin,
                        )}
                      </span>
                    </div>
                  </div>

                  <footer>
                    <button
                      className="ec-button ec-button--sm"
                      type="button"
                      disabled
                    >
                      <Pencil
                        size={14}
                      />

                      Editar
                    </button>

                    <button
                      className="ec-button ec-button--sm promotion-delete"
                      type="button"
                      onClick={() =>
                        void eliminar(
                          promotion.id,
                        )
                      }
                    >
                      <Trash2
                        size={14}
                      />

                      Eliminar
                    </button>
                  </footer>
                </article>
              );
            },
          )}

          <Link
            to="/negocio/promociones/nueva"
            className="promotion-create-card"
          >
            <span>
              <Plus size={26} />
            </span>

            <h2>
              Crear Nueva Oferta
            </h2>

            <p>
              Llega a más clientes con
              ofertas exclusivas por
              temporada.
            </p>
          </Link>
        </section>
      </div>
    </PanelShell>
  );
}
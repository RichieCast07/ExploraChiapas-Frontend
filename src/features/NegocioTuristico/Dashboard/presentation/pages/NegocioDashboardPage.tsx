import {
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import {
  useNegocioStatsViewModel,
} from '../../../Home/presentation/viewmodels/useNegocioStatsViewModel';

export function NegocioDashboardPage() {
  const {
    stats,
    isLoading,
  } =
    useNegocioStatsViewModel();

  const value = (
    numberValue:
      | number
      | undefined,
  ) =>
    isLoading
      ? '…'
      : (
          numberValue
            ?.toLocaleString(
              'es-MX',
            ) ??
          '0'
        );

  return (
    <PanelShell kind="business">
      <div className="ec-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Negocio
              <span>›</span>
              Dashboard
            </div>

            <h1 className="ec-page-title">
              Dashboard
            </h1>

            <p className="ec-page-subtitle">
              Resumen del rendimiento
              de tu negocio.
            </p>
          </div>
        </div>

        <section className="ec-grid-2 ec-grid-2--equal">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <div>
                <div className="ec-stat-card__label">
                  Favoritos
                </div>
              </div>

              <span className="ec-stat-card__icon">
                <Users
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__value">
                {value(
                  stats?.totalFavoritos,
                )}
              </div>

              <div className="ec-stat-card__hint">
                usuarios lo han guardado
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <div className="ec-stat-card__label">
                Reseñas
              </div>

              <span className="ec-stat-card__icon ec-stat-card__icon--blue">
                <MessageSquare
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__value">
                {value(
                  stats?.totalResenas,
                )}
              </div>

              <div className="ec-stat-card__hint">
                reseñas recibidas
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <div className="ec-stat-card__label">
                Calificación
              </div>

              <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                <Star
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : `${
                      stats
                        ?.calificacionPromedio
                        ?.toFixed(
                          1,
                        ) ??
                      '0.0'
                    }/5`}
              </div>

              <div
                style={{
                  display:
                    'flex',
                  gap: 3,
                  marginTop: 5,
                }}
              >
                {Array.from({
                  length: 5,
                }).map(
                  (
                    _,
                    index,
                  ) => (
                    <Star
                      key={index}
                      size={14}
                      color="currentColor"
                      fill={
                        index <
                        Math.round(
                          stats
                            ?.calificacionPromedio ??
                            0,
                        )
                          ? 'currentColor'
                          : 'none'
                      }
                      style={{
                        color:
                          'var(--ec-orange-600)',
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <div className="ec-stat-card__label">
                Estado
              </div>

              <span className="ec-stat-card__icon">
                <TrendingUp
                  size={18}
                />
              </span>
            </div>

            <div>
              <div
                className="ec-stat-card__value"
                style={{
                  fontSize: 18,
                  color:
                    'var(--ec-green-700)',
                }}
              >
                {stats?.isVerified
                  ? 'Negocio verificado'
                  : 'Sin verificar'}
              </div>

              <div className="ec-stat-card__hint">
                {stats?.isVerified
                  ? 'Mayor visibilidad en la plataforma'
                  : 'Pendiente de aprobación o verificación'}
              </div>
            </div>
          </article>
        </section>

        <section className="ec-callout">
          <h3>
            Estado de métricas
          </h3>

          <p>
            {stats?.isVerified
              ? 'Las métricas mostradas se consultan directamente desde la API del negocio.'
              : 'Las métricas completas estarán disponibles cuando el negocio esté aprobado y verificado.'}
          </p>
        </section>
      </div>
    </PanelShell>
  );
}

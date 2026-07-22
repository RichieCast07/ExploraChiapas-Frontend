import {
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  XCircle,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  apiRequest,
  apiVoid,
} from '../../../../../core/shared/api/apiClient';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

interface AlertItem {
  id: string;
  typeId: string;
  typeName: string;
  description: string;

  statusId: string;
  statusName:
    | 'pendiente'
    | 'atendida'
    | 'descartada';

  scopeId: string;
  scopeName:
    | 'negocio'
    | 'plataforma';

  entityTypeId:
    | string
    | null;

  entityTypeName:
    | 'destino'
    | 'negocio'
    | 'ubicacion'
    | 'resena_destino'
    | 'resena_negocio'
    | 'resena_ubicacion'
    | null;

  entityId:
    | string
    | null;

  generatedAt: string;

  attendedByUserId:
    | string
    | null;
}

function formatDate(
  value: string,
): string {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Sin fecha';
  }

  return date.toLocaleString(
    'es-MX',
  );
}

export function AdminModeracionPage() {
  const [
    alerts,
    setAlerts,
  ] = useState<
    AlertItem[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    actionId,
    setActionId,
  ] = useState<
    string | null
  >(null);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const load =
    useCallback(
      async () => {
        setIsLoading(
          true,
        );

        setError(
          null,
        );

        try {
          const data =
            await apiRequest<
              AlertItem[]
            >(
              '/alerts?scopeName=plataforma&limit=100&offset=0',
            );

          setAlerts(
            data ?? [],
          );
        } catch (
          requestError
        ) {
          setAlerts([]);

          setError(
            requestError
              instanceof Error
              ? requestError.message
              : 'No se pudieron cargar las alertas',
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  const pending =
    useMemo(
      () =>
        alerts.filter(
          (alert) =>
            alert.statusName ===
            'pendiente',
        ),
      [alerts],
    );

  const processed =
    useMemo(
      () =>
        alerts.filter(
          (alert) =>
            alert.statusName !==
            'pendiente',
        ),
      [alerts],
    );

  const attend = async (
    alertId: string,
  ) => {
    setActionId(
      alertId,
    );

    setError(null);

    try {
      await apiVoid(
        `/alerts/${alertId}/attend`,
        {
          method:
            'PATCH',
        },
      );

      await load();
    } catch (
      requestError
    ) {
      setError(
        requestError
          instanceof Error
          ? requestError.message
          : 'No se pudo atender la alerta',
      );
    } finally {
      setActionId(
        null,
      );
    }
  };

  const discard =
    async (
      alertId: string,
    ) => {
      setActionId(
        alertId,
      );

      setError(null);

      try {
        await apiVoid(
          `/alerts/${alertId}/discard`,
          {
            method:
              'PATCH',
          },
        );

        await load();
      } catch (
        requestError
      ) {
        setError(
          requestError
            instanceof Error
            ? requestError.message
            : 'No se pudo descartar la alerta',
        );
      } finally {
        setActionId(
          null,
        );
      }
    };

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Operaciones
              <span>›</span>
              Moderación
            </div>

            <h1 className="ec-page-title">
              Moderación y Alertas
            </h1>

            <p className="ec-page-subtitle">
              Consulta y gestiona
              alertas reales generadas
              por la plataforma.
            </p>
          </div>

          <button
            className="ec-button"
            type="button"
            disabled={
              isLoading
            }
            onClick={() =>
              void load()
            }
          >
            <RefreshCw
              size={16}
            />

            {isLoading
              ? 'Actualizando...'
              : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        <section className="ec-stat-grid">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                <AlertTriangle
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Pendientes
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : pending.length}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <CheckCircle2
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Procesadas
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : processed.length}
              </div>
            </div>
          </article>
        </section>

        <section className="ec-card">
          <div className="ec-card__header">
            <div>
              <h2>
                Alertas pendientes
              </h2>

              <small>
                Alertas de alcance
                plataforma recibidas
                desde la API.
              </small>
            </div>
          </div>

          <div className="ec-card__body">
            {isLoading && (
              <div className="ec-note">
                Consultando
                alertas...
              </div>
            )}

            {!isLoading &&
              !error &&
              pending.length ===
                0 && (
                <div className="ec-note">
                  No hay alertas
                  pendientes.
                </div>
              )}

            <div
              style={{
                display:
                  'flex',
                flexDirection:
                  'column',
                gap: 12,
              }}
            >
              {pending.map(
                (alert) => (
                  <article
                    key={
                      alert.id
                    }
                    className="ec-card"
                    style={{
                      padding:
                        16,
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'flex-start',
                        gap: 14,
                      }}
                    >
                      <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                        <AlertTriangle
                          size={
                            17
                          }
                        />
                      </span>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <strong>
                          {
                            alert.typeName
                          }
                        </strong>

                        <p
                          style={{
                            margin:
                              '6px 0',
                          }}
                        >
                          {
                            alert.description
                          }
                        </p>

                        <small>
                          {alert.entityTypeName ??
                            'plataforma'}

                          {' · '}

                          {formatDate(
                            alert.generatedAt,
                          )}
                        </small>
                      </div>

                      <div
                        style={{
                          display:
                            'flex',
                          gap: 8,
                          flexWrap:
                            'wrap',
                        }}
                      >
                        <button
                          className="ec-button ec-button--sm"
                          type="button"
                          disabled={
                            actionId ===
                            alert.id
                          }
                          onClick={() =>
                            void attend(
                              alert.id,
                            )
                          }
                        >
                          <CheckCircle2
                            size={
                              14
                            }
                          />

                          Atender
                        </button>

                        <button
                          className="ec-button ec-button--sm"
                          type="button"
                          disabled={
                            actionId ===
                            alert.id
                          }
                          onClick={() =>
                            void discard(
                              alert.id,
                            )
                          }
                        >
                          <XCircle
                            size={
                              14
                            }
                          />

                          Descartar
                        </button>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        {processed.length >
          0 && (
          <section className="ec-card">
            <div className="ec-card__header">
              <h2>
                Historial
              </h2>
            </div>

            <div className="ec-card__body">
              <div
                style={{
                  display:
                    'flex',
                  flexDirection:
                    'column',
                  gap: 8,
                }}
              >
                {processed.map(
                  (alert) => (
                    <div
                      key={
                        alert.id
                      }
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        gap: 16,
                        padding:
                          '10px 0',
                      }}
                    >
                      <div>
                        <strong>
                          {
                            alert.typeName
                          }
                        </strong>

                        <div>
                          <small>
                            {
                              alert.description
                            }
                          </small>
                        </div>
                      </div>

                      <span
                        className={`ec-badge ${
                          alert.statusName ===
                          'atendida'
                            ? 'ec-badge--green'
                            : 'ec-badge--red'
                        }`}
                      >
                        {
                          alert.statusName
                        }
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </PanelShell>
  );
}

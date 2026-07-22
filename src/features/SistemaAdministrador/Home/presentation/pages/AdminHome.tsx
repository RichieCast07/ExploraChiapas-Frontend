import {
  AlertTriangle,
  ArrowUpRight,
  CalendarPlus,
  CheckCircle2,
  MapPinPlus,
  Store,
  Users,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

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
  requestStatus:
    | 'pendiente'
    | 'aprobado'
    | 'rechazado';
  createdAt: string;
}

interface AlertItem {
  id: string;
  typeName: string;
  description: string;
  statusName:
    | 'pendiente'
    | 'atendida'
    | 'descartada';
  generatedAt: string;
}

function relativeDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  const difference =
    Date.now() - date.getTime();

  const minutes = Math.floor(
    difference / 60000,
  );

  if (minutes < 1) {
    return 'Ahora';
  }

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60,
  );

  if (hours < 24) {
    return `Hace ${hours} h`;
  }

  return date.toLocaleDateString(
    'es-MX',
  );
}

function formatNumber(
  value: number | undefined,
): string {
  return (
    value ?? 0
  ).toLocaleString('es-MX');
}

export function AdminHomePage() {
  const {
    data,
    isLoading,
    error,
    reload,
  } = useAdminAnalyticsViewModel();

  const [
    pendingBusinesses,
    setPendingBusinesses,
  ] = useState<PendingBusiness[]>([]);

  const [
    alerts,
    setAlerts,
  ] = useState<AlertItem[]>([]);

  const [
    isLoadingActivity,
    setIsLoadingActivity,
  ] = useState(true);

  const [
    activityError,
    setActivityError,
  ] = useState<string | null>(null);

  const summary = data?.summary;

  const pendingReports =
    alerts.filter(
      (alert) =>
        alert.statusName ===
        'pendiente',
    ).length;

  const maxVisits = Math.max(
    1,
    ...(data?.topDestinations ?? []).map(
      (destination) =>
        destination.visits,
    ),
  );

  const loadActivity =
    useCallback(async () => {
      setIsLoadingActivity(true);
      setActivityError(null);

      try {
        const [
          businessRequests,
          platformAlerts,
        ] = await Promise.all([
          apiRequest<PendingBusiness[]>(
            '/businesses/admin/requests?status=pendiente&limit=10',
          ),

          apiRequest<AlertItem[]>(
            '/alerts?statusName=pendiente&scopeName=plataforma&limit=10',
          ),
        ]);

        setPendingBusinesses(
          businessRequests,
        );

        setAlerts(platformAlerts);
      } catch (requestError) {
        setPendingBusinesses([]);
        setAlerts([]);

        setActivityError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudo cargar la actividad reciente',
        );
      } finally {
        setIsLoadingActivity(false);
      }
    }, []);

  useEffect(() => {
    void loadActivity();
  }, [loadActivity]);

  const refresh = async () => {
    await Promise.all([
      reload(),
      loadActivity(),
    ]);
  };

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-home-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Administración
              <span>›</span>
              Dashboard
            </div>

            <h1 className="ec-page-title">
              Dashboard General
            </h1>

            <p className="ec-page-subtitle">
              Resumen general de usuarios,
              negocios, destinos y actividad
              turística de ExploraChiapas.
            </p>
          </div>

          <div className="ec-actions">
            <button
              className="ec-button"
              type="button"
              onClick={() =>
                void refresh()
              }
              disabled={
                isLoading ||
                isLoadingActivity
              }
            >
              {isLoading ||
              isLoadingActivity
                ? 'Actualizando...'
                : 'Actualizar datos'}
            </button>

            <Link
              className="ec-button ec-button--primary"
              to="/admin/destinos"
            >
              <MapPinPlus size={16} />
              Ver destinos
            </Link>
          </div>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        {activityError && (
          <div className="ec-alert">
            {activityError}
          </div>
        )}

        <section className="ec-stat-grid">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <Users size={18} />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Usuarios activos
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : formatNumber(
                      summary?.totalUsuarios,
                    )}
              </div>

              <div className="ec-stat-card__hint">
                Cuentas activas en la
                plataforma
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                <Store size={18} />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Negocios turísticos
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : formatNumber(
                      summary?.totalNegocios,
                    )}
              </div>

              <div className="ec-stat-card__hint">
                {formatNumber(
                  summary?.negociosVerificados,
                )}{' '}
                verificados
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--blue">
                <MapPinPlus size={18} />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Destinos turísticos
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : formatNumber(
                      summary?.totalDestinos,
                    )}
              </div>

              <div className="ec-stat-card__hint">
                {data?.categoryDistribution
                  .length ?? 0}{' '}
                categorías con destinos
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--red">
                <AlertTriangle
                  size={18}
                />
              </span>

              {pendingReports > 0 && (
                <span className="ec-badge ec-badge--red">
                  Pendiente
                </span>
              )}
            </div>

            <div>
              <div className="ec-stat-card__label">
                Reportes pendientes
              </div>

              <div className="ec-stat-card__value">
                {isLoadingActivity
                  ? '…'
                  : pendingReports}
              </div>

              <div className="ec-stat-card__hint">
                Alertas de plataforma por
                revisar
              </div>
            </div>
          </article>
        </section>

        <section className="admin-dashboard-charts">
          <article className="ec-card">
            <div className="ec-card__header">
              <div>
                <h2>
                  Actividad por mes
                </h2>

                <small>
                  Últimos seis meses
                </small>
              </div>

              <div className="admin-chart-legend">
                <span>
                  <i className="legend-dot legend-dot--green" />
                  Usuarios
                </span>

                <span>
                  <i className="legend-dot" />
                  Rutas
                </span>
              </div>
            </div>

            <div className="admin-chart-area">
              <ResponsiveContainer
                width="100%"
                height={250}
              >
                <LineChart
                  data={
                    data?.monthly ?? []
                  }
                  margin={{
                    top: 15,
                    right: 15,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                  />

                  <Tooltip />

                  <Line
                    dataKey="routes"
                    name="Rutas"
                    type="monotone"
                    stroke="#c88946"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    dataKey="users"
                    name="Usuarios"
                    type="monotone"
                    stroke="#19813c"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header">
              <h2>
                Destinos con mayor
                afluencia
              </h2>

              <Link to="/admin/analitica">
                Analítica
              </Link>
            </div>

            <div className="ec-card__body destination-ranking">
              {(data?.topDestinations ?? [])
                .slice(0, 4)
                .map((destination) => {
                  const percentage =
                    Math.round(
                      (
                        destination.visits /
                        maxVisits
                      ) * 100,
                    );

                  return (
                    <div
                      className="destination-bar"
                      key={destination.id}
                    >
                      <div>
                        <strong>
                          {destination.name}
                        </strong>

                        <span>
                          {formatNumber(
                            destination.visits,
                          )}
                        </span>
                      </div>

                      <div className="destination-bar__track">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

              {!isLoading &&
                !data?.topDestinations
                  .length && (
                  <div className="ec-note">
                    Aún no hay métricas
                    de destinos.
                  </div>
                )}
            </div>
          </article>
        </section>

        <section className="admin-dashboard-bottom">
          <article className="ec-card">
            <div className="ec-card__header">
              <h2>
                Actividad reciente
              </h2>

              <Link
                className="ec-button ec-button--ghost ec-button--sm"
                to="/admin/moderacion"
              >
                Ver todo
              </Link>
            </div>

            <div className="activity-feed">
              {pendingBusinesses
                .slice(0, 2)
                .map((business) => (
                  <div
                    className="activity-feed__item"
                    key={business.id}
                  >
                    <span className="activity-icon">
                      <Store size={16} />
                    </span>

                    <div>
                      <strong>
                        {business.name}{' '}
                        solicitó registrar
                        un negocio.
                      </strong>

                      <small>
                        {relativeDate(
                          business.createdAt,
                        )}{' '}
                        ·{' '}
                        {
                          business.businessTypeName
                        }
                      </small>
                    </div>

                    <Link
                      to="/admin/negocios"
                      className="ec-button ec-button--sm"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}

              {alerts
                .slice(0, 3)
                .map((alert) => (
                  <div
                    className="activity-feed__item"
                    key={alert.id}
                  >
                    <span className="activity-icon activity-icon--red">
                      <AlertTriangle
                        size={16}
                      />
                    </span>

                    <div>
                      <strong>
                        {alert.description}
                      </strong>

                      <small>
                        {relativeDate(
                          alert.generatedAt,
                        )}{' '}
                        · {alert.typeName}
                      </small>
                    </div>

                    <Link
                      to="/admin/moderacion"
                      className="ec-badge ec-badge--red"
                    >
                      Revisar
                    </Link>
                  </div>
                ))}

              {!isLoadingActivity &&
                !pendingBusinesses.length &&
                !alerts.length && (
                  <div className="ec-note">
                    No hay actividad
                    pendiente.
                  </div>
                )}

              {isLoadingActivity && (
                <div className="ec-note">
                  Cargando actividad...
                </div>
              )}
            </div>
          </article>

          <aside className="ec-card">
            <div className="ec-card__header">
              <h2>
                Acciones rápidas
              </h2>
            </div>

            <div className="quick-actions">
              <Link
                to="/admin/destinos"
                className="quick-action"
              >
                <MapPinPlus size={18} />

                <span>
                  <strong>
                    Ver destinos
                  </strong>

                  <small>
                    Consultar registros
                  </small>
                </span>

                <ArrowUpRight
                  size={15}
                />
              </Link>

              <Link
                to="/admin/negocios"
                className="quick-action"
              >
                <CheckCircle2
                  size={18}
                />

                <span>
                  <strong>
                    Aprobar negocio
                  </strong>

                  <small>
                    {
                      pendingBusinesses.length
                    }{' '}
                    pendientes
                  </small>
                </span>

                <ArrowUpRight
                  size={15}
                />
              </Link>

              <Link
                to="/admin/eventos/nuevo"
                className="quick-action"
              >
                <CalendarPlus size={18} />

                <span>
                  <strong>
                    Crear evento
                  </strong>

                  <small>
                    Promocionar cultura local
                  </small>
                </span>

                <ArrowUpRight
                  size={15}
                />
              </Link>
            </div>

          </aside>
        </section>
      </div>
    </PanelShell>
  );
}
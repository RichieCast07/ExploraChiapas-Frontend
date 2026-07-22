import {
  BarChart3,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import {
  useAdminStatsViewModel,
} from '../../../Home/presentation/viewmodels/useAdminStatsViewModel';

interface ClusterInfo {
  cluster: number;
  label: string;
  count: number;
  descripcion: string;
}

const ML_URL = (
  import.meta.env.VITE_ML_BASE_URL ??
  'https://ml-explorachiapas.onrender.com'
).replace(/\/$/, '');

export function AdminAnaliticaPage() {
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    recargar: reloadStats,
  } = useAdminStatsViewModel();

  const [
    clusters,
    setClusters,
  ] = useState<
    ClusterInfo[]
  >([]);

  const [
    mlLoading,
    setMlLoading,
  ] = useState(false);

  const [
    mlError,
    setMlError,
  ] = useState<
    string | null
  >(null);

  const loadClusters =
    useCallback(
      async () => {
        setMlLoading(true);
        setMlError(null);

        try {
          const response =
            await fetch(
              `${ML_URL}/cluster-summary`,
            );

          if (!response.ok) {
            throw new Error(
              `El motor ML respondió HTTP ${response.status}`,
            );
          }

          const body =
            await response.json() as {
              clusters?: ClusterInfo[];
            };

          setClusters(
            body.clusters ??
              [],
          );
        } catch (
          requestError
        ) {
          setClusters([]);

          setMlError(
            requestError
              instanceof Error
              ? requestError.message
              : 'No se pudo conectar con el motor de análisis',
          );
        } finally {
          setMlLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadClusters();
  }, [loadClusters]);

  const refresh =
    async () => {
      await Promise.all([
        reloadStats(),
        loadClusters(),
      ]);
    };

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Operaciones
              <span>›</span>
              Analítica
            </div>

            <h1 className="ec-page-title">
              Analítica e Inteligencia
              Turística
            </h1>

            <p className="ec-page-subtitle">
              Estadísticas reales de
              ExploraChiapas y datos
              disponibles del motor ML.
            </p>
          </div>

          <button
            className="ec-button"
            type="button"
            disabled={
              statsLoading ||
              mlLoading
            }
            onClick={() =>
              void refresh()
            }
          >
            <RefreshCw
              size={16}
            />

            Actualizar
          </button>
        </div>

        {statsError && (
          <div className="ec-alert">
            {statsError}
          </div>
        )}

        <section className="ec-stat-grid ec-stat-grid--3">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <Users
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Usuarios activos
              </div>

              <div className="ec-stat-card__value">
                {statsLoading
                  ? '…'
                  : (
                    stats
                      ?.totalUsuarios ??
                    '—'
                  )}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--blue">
                <MapPin
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Destinos activos
              </div>

              <div className="ec-stat-card__value">
                {statsLoading
                  ? '…'
                  : (
                    stats
                      ?.totalDestinos ??
                    '—'
                  )}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--orange">
                <TrendingUp
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Favoritos de destinos
              </div>

              <div className="ec-stat-card__value">
                {statsLoading
                  ? '…'
                  : (
                    stats
                      ?.totalFavoritosDestinos ??
                    '—'
                  )}
              </div>
            </div>
          </article>
        </section>

        <section className="ec-card">
          <div className="ec-card__header">
            <div>
              <h2>
                <BarChart3
                  size={18}
                />
                Segmentación ML
              </h2>

              <small>
                Información recibida
                directamente del motor
                de análisis.
              </small>
            </div>
          </div>

          <div className="ec-card__body">
            {mlLoading && (
              <div className="ec-note">
                Consultando motor
                ML...
              </div>
            )}

            {mlError && (
              <div className="ec-alert">
                {mlError}
              </div>
            )}

            {!mlLoading &&
              !mlError &&
              clusters.length ===
                0 && (
              <div className="ec-note">
                El motor ML no
                devolvió datos de
                segmentación.
              </div>
            )}

            {!mlLoading &&
              clusters.length >
                0 && (
              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                }}
              >
                {clusters.map(
                  (
                    cluster,
                  ) => (
                    <article
                      className="ec-card"
                      key={
                        cluster.cluster
                      }
                    >
                      <div className="ec-card__body">
                        <strong>
                          {
                            cluster.label
                          }
                        </strong>

                        <p>
                          {
                            cluster.descripcion
                          }
                        </p>

                        <small>
                          {
                            cluster.count
                          }{' '}
                          usuarios
                        </small>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </PanelShell>
  );
}

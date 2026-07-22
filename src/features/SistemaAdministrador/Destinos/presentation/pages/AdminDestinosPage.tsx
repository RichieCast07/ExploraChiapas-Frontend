import {
  Compass,
  RefreshCw,
  Star,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  apiRequest,
  resolveMediaUrl,
} from '../../../../../core/shared/api/apiClient';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

interface Destination {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  locationId: string;
  active: boolean;
  createdAt: string;
  averageRating: number;
  totalReviews: number;
  isSaturated: boolean;
  imageUrl: string | null;
}

interface Category {
  id: string;
  nombre: string;
}

interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string | null;
  municipality: string | null;
  state: string | null;
}

interface DestinationView
  extends Destination {
  categoryName: string;
  municipality: string | null;
  state: string | null;
}

export function AdminDestinosPage() {
  const [
    destinations,
    setDestinations,
  ] = useState<
    DestinationView[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

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
          const [
            destinationData,
            categoryData,
          ] =
            await Promise.all([
              apiRequest<
                Destination[]
              >(
                '/destinations?limit=100&offset=0',
                {},
                false,
              ),

              apiRequest<
                Category[]
              >(
                '/categories?scope=destinos',
                {},
                false,
              ),
            ]);

          const categoryMap =
            new Map(
              categoryData.map(
                (
                  category,
                ) => [
                  category.id,
                  category.nombre,
                ],
              ),
            );

          const resolved =
            await Promise.all(
              destinationData.map(
                async (
                  destination,
                ): Promise<DestinationView> => {
                  let location:
                    | Location
                    | null =
                    null;

                  try {
                    location =
                      await apiRequest<Location>(
                        `/locations/${destination.locationId}`,
                        {},
                        false,
                      );
                  } catch {
                    /*
                     * No inventar ubicación.
                     * Si la API no puede
                     * resolverla, se muestra
                     * como no disponible.
                     */
                  }

                  return {
                    ...destination,

                    categoryName:
                      categoryMap.get(
                        destination.categoryId,
                      ) ??
                      'Sin categoría',

                    municipality:
                      location
                        ?.municipality ??
                      null,

                    state:
                      location
                        ?.state ??
                      null,
                  };
                },
              ),
            );

          setDestinations(
            resolved,
          );
        } catch (
          requestError
        ) {
          setDestinations(
            [],
          );

          setError(
            requestError
              instanceof Error
              ? requestError.message
              : 'No se pudieron cargar los destinos',
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

  const activeCount =
    useMemo(
      () =>
        destinations.filter(
          (
            destination,
          ) =>
            destination.active,
        ).length,
      [destinations],
    );

  const saturatedCount =
    useMemo(
      () =>
        destinations.filter(
          (
            destination,
          ) =>
            destination.isSaturated,
        ).length,
      [destinations],
    );

  return (
    <PanelShell kind="admin">
      <div className="ec-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Gestión Turística
              <span>›</span>
              Destinos
            </div>

            <h1 className="ec-page-title">
              Destinos Turísticos
            </h1>

            <p className="ec-page-subtitle">
              Consulta destinos
              registrados directamente
              desde la API de
              ExploraChiapas.
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
              <span className="ec-stat-card__icon">
                <Compass
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Destinos cargados
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : destinations.length}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div>
              <div className="ec-stat-card__label">
                Activos
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : activeCount}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div>
              <div className="ec-stat-card__label">
                Saturados
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : saturatedCount}
              </div>
            </div>
          </article>
        </section>

        <section className="ec-card">
          <div className="ec-table-wrap">
            <table className="ec-table">
              <thead>
                <tr>
                  <th>
                    Destino
                  </th>

                  <th>
                    Categoría
                  </th>

                  <th>
                    Municipio
                  </th>

                  <th>
                    Calificación
                  </th>

                  <th>
                    Reseñas
                  </th>

                  <th>
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {destinations.map(
                  (
                    destination,
                  ) => {
                    const imageUrl =
                      resolveMediaUrl(
                        destination.imageUrl,
                      );

                    return (
                      <tr
                        key={
                          destination.id
                        }
                      >
                        <td>
                          <div className="ec-identity">
                            {imageUrl ? (
                              <img
                                src={
                                  imageUrl
                                }
                                alt={
                                  destination.name
                                }
                                style={{
                                  width:
                                    46,
                                  height:
                                    46,
                                  borderRadius:
                                    8,
                                  objectFit:
                                    'cover',
                                }}
                              />
                            ) : (
                              <span className="ec-avatar">
                                {destination.name
                                  .charAt(
                                    0,
                                  )
                                  .toUpperCase()}
                              </span>
                            )}

                            <div>
                              <strong>
                                {
                                  destination.name
                                }
                              </strong>

                              <small>
                                {destination.state ??
                                  'Ubicación no disponible'}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          {
                            destination.categoryName
                          }
                        </td>

                        <td>
                          {destination.municipality ??
                            '—'}
                        </td>

                        <td>
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: 5,
                            }}
                          >
                            <Star
                              size={
                                14
                              }
                            />

                            {Number(
                              destination.averageRating ??
                                0,
                            ).toFixed(
                              1,
                            )}
                            /5
                          </div>
                        </td>

                        <td>
                          {
                            destination.totalReviews
                          }
                        </td>

                        <td>
                          <div
                            style={{
                              display:
                                'flex',
                              gap: 6,
                              flexWrap:
                                'wrap',
                            }}
                          >
                            <span
                              className={`ec-badge ${
                                destination.active
                                  ? 'ec-badge--green'
                                  : 'ec-badge--red'
                              }`}
                            >
                              {destination.active
                                ? 'Activo'
                                : 'Inactivo'}
                            </span>

                            {destination.isSaturated && (
                              <span className="ec-badge ec-badge--orange">
                                Saturado
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="ec-note">
              Consultando
              destinos...
            </div>
          )}

          {!isLoading &&
            !error &&
            destinations.length ===
              0 && (
              <div className="ec-note">
                No hay destinos
                registrados.
              </div>
            )}
        </section>
      </div>
    </PanelShell>
  );
}

import * as L from 'leaflet';

import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import 'leaflet/dist/leaflet.css';

import {
  apiRequest,
  resolveMediaUrl,
} from '../../../../../core/shared/api/apiClient';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import './AdminRecomendacionesPage.css';


type ProposalStatus =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada';

type ProposalFilter =
  | 'todas'
  | ProposalStatus;


interface ProposalImage {
  id: string;
  imageUrl: string;
  order: number;
  createdAt: string;
}


interface ProposalLocation {
  id: string;

  latitude: number;
  longitude: number;

  address: string | null;
  municipality: string | null;
  state: string | null;

  mapProvider: string | null;
}


interface DestinationProposal {
  id: string;

  userId: string | null;

  name: string;
  description: string | null;

  categoryId: string;
  categoryName: string;

  locationId: string;

  location: ProposalLocation;

  status: ProposalStatus;

  rejectionReason: string | null;

  reviewedBy: string | null;
  reviewedAt: string | null;

  createdDestinationId: string | null;

  createdAt: string;
  updatedAt: string;

  images: ProposalImage[];
}


const statusMeta: Record<
  ProposalStatus,
  {
    label: string;
    description: string;
  }
> = {
  pendiente: {
    label: 'Pendiente',
    description: 'Esperando revisión',
  },

  aprobada: {
    label: 'Aprobada',
    description: 'Convertida en destino oficial',
  },

  rechazada: {
    label: 'Rechazada',
    description: 'No fue publicada',
  },
};


function formatDate(
  value: string | null,
): string {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'es-MX',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(date);
}


function normalizeSearch(
  value: string,
): string {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      '',
    )
    .toLowerCase()
    .trim();
}


function ProposalStatusBadge({
  status,
}: {
  status: ProposalStatus;
}) {
  return (
    <span
      className={`proposal-status proposal-status--${status}`}
    >
      <span />

      {
        statusMeta[
          status
        ].label
      }
    </span>
  );
}


function ProposalLocationMap({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    if (
      !containerRef.current ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    const map =
      L.map(
        containerRef.current,
        {
          zoomControl: true,
          scrollWheelZoom: false,
        },
      ).setView(
        [
          latitude,
          longitude,
        ],
        15,
      );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,

        attribution:
          '&copy; OpenStreetMap contributors',
      },
    ).addTo(map);

    const icon =
      L.divIcon({
        className:
          'proposal-map-marker',

        html:
          '<span class="proposal-map-marker__outer"><span class="proposal-map-marker__inner"></span></span>',

        iconSize: [
          36,
          44,
        ],

        iconAnchor: [
          18,
          42,
        ],
      });

    L.marker(
      [
        latitude,
        longitude,
      ],
      {
        icon,
      },
    ).addTo(map);

    window.setTimeout(
      () => {
        map.invalidateSize();
      },
      0,
    );

    return () => {
      map.remove();
    };
  }, [
    latitude,
    longitude,
  ]);

  return (
    <div
      className="proposal-detail-map"
      ref={containerRef}
      aria-label="Ubicación propuesta en el mapa"
    />
  );
}


export function AdminRecomendacionesPage() {
  const [
    proposals,
    setProposals,
  ] =
    useState<
      DestinationProposal[]
    >([]);

  const [
    selected,
    setSelected,
  ] =
    useState<
      DestinationProposal | null
    >(null);

  const [
    filter,
    setFilter,
  ] =
    useState<ProposalFilter>(
      'pendiente',
    );

  const [
    query,
    setQuery,
  ] =
    useState('');

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isDetailLoading,
    setIsDetailLoading,
  ] =
    useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    actionMessage,
    setActionMessage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    rejectOpen,
    setRejectOpen,
  ] =
    useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] =
    useState('');


  const load =
    useCallback(
      async () => {
        setIsLoading(true);
        setError(null);

        try {
          const data =
            await apiRequest<
              DestinationProposal[]
            >(
              '/destination-proposals/admin?limit=100&offset=0',
            );

          setProposals(data);

          setSelected(
            (
              current,
            ) => {
              if (
                current
              ) {
                return (
                  data.find(
                    (
                      proposal,
                    ) =>
                      proposal.id ===
                      current.id,
                  ) ??
                  data[0] ??
                  null
                );
              }

              return (
                data.find(
                  (
                    proposal,
                  ) =>
                    proposal.status ===
                    'pendiente',
                ) ??
                data[0] ??
                null
              );
            },
          );
        } catch (
          requestError
        ) {
          setError(
            requestError
              instanceof Error
              ? requestError.message
              : 'No se pudieron cargar las recomendaciones',
          );

          setProposals([]);
          setSelected(null);
        } finally {
          setIsLoading(false);
        }
      },
      [],
    );


  useEffect(() => {
    void load();
  }, [load]);


  const counts =
    useMemo(
      () => ({
        total:
          proposals.length,

        pendiente:
          proposals.filter(
            (
              proposal,
            ) =>
              proposal.status ===
              'pendiente',
          ).length,

        aprobada:
          proposals.filter(
            (
              proposal,
            ) =>
              proposal.status ===
              'aprobada',
          ).length,

        rechazada:
          proposals.filter(
            (
              proposal,
            ) =>
              proposal.status ===
              'rechazada',
          ).length,
      }),
      [
        proposals,
      ],
    );


  const filtered =
    useMemo(
      () => {
        const normalized =
          normalizeSearch(
            query,
          );

        return proposals
          .filter(
            (
              proposal,
            ) =>
              filter ===
                'todas' ||
              proposal.status ===
                filter,
          )
          .filter(
            (
              proposal,
            ) => {
              if (
                !normalized
              ) {
                return true;
              }

              const location =
                [
                  proposal.location
                    .municipality,
                  proposal.location
                    .state,
                  proposal.location
                    .address,
                ]
                  .filter(Boolean)
                  .join(' ');

              return normalizeSearch(
                [
                  proposal.name,
                  proposal.categoryName,
                  location,
                ].join(' '),
              ).includes(
                normalized,
              );
            },
          );
      },
      [
        proposals,
        filter,
        query,
      ],
    );


  const openProposal =
    async (
      proposal:
        DestinationProposal,
    ) => {
      setSelected(
        proposal,
      );

      setIsDetailLoading(
        true,
      );

      setActionMessage(
        null,
      );

      try {
        const detail =
          await apiRequest<
            DestinationProposal
          >(
            `/destination-proposals/admin/${proposal.id}`,
          );

        setSelected(
          detail,
        );
      } catch {
        /*
         * La lista ya contiene la información
         * necesaria como fallback.
         */
      } finally {
        setIsDetailLoading(
          false,
        );
      }
    };


  const updateProposal =
    (
      updated:
        DestinationProposal,
    ) => {
      setProposals(
        (
          current,
        ) =>
          current.map(
            (
              proposal,
            ) =>
              proposal.id ===
              updated.id
                ? updated
                : proposal,
          ),
      );

      setSelected(
        updated,
      );
    };


  const approveSelected =
    async () => {
      if (
        !selected ||
        selected.status !==
          'pendiente'
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `¿Aprobar "${selected.name}" como destino oficial?\n\nEsta acción creará un destino público con la información y fotografías enviadas por el usuario.`,
        );

      if (
        !confirmed
      ) {
        return;
      }

      setActionLoading(
        true,
      );

      setActionMessage(
        null,
      );

      setError(null);

      try {
        const updated =
          await apiRequest<
            DestinationProposal
          >(
            `/destination-proposals/${selected.id}/review`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  action:
                    'approve',
                }),
            },
          );

        updateProposal(
          updated,
        );

        setActionMessage(
          'La recomendación fue aprobada y convertida en un destino oficial.',
        );
      } catch (
        requestError
      ) {
        setError(
          requestError
            instanceof Error
            ? requestError.message
            : 'No se pudo aprobar la recomendación',
        );
      } finally {
        setActionLoading(
          false,
        );
      }
    };


  const rejectSelected =
    async () => {
      if (
        !selected ||
        selected.status !==
          'pendiente'
      ) {
        return;
      }

      const reason =
        rejectionReason.trim();

      if (
        reason.length < 3
      ) {
        setError(
          'Escribe un motivo de rechazo claro para el usuario.',
        );

        return;
      }

      setActionLoading(
        true,
      );

      setActionMessage(
        null,
      );

      setError(null);

      try {
        const updated =
          await apiRequest<
            DestinationProposal
          >(
            `/destination-proposals/${selected.id}/review`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body:
                JSON.stringify({
                  action:
                    'reject',

                  reason,
                }),
            },
          );

        updateProposal(
          updated,
        );

        setRejectOpen(
          false,
        );

        setRejectionReason(
          '',
        );

        setActionMessage(
          'La recomendación fue rechazada y el motivo quedó registrado.',
        );
      } catch (
        requestError
      ) {
        setError(
          requestError
            instanceof Error
            ? requestError.message
            : 'No se pudo rechazar la recomendación',
        );
      } finally {
        setActionLoading(
          false,
        );
      }
    };


  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-proposals-page">
        <header className="admin-proposals-header">
          <div>
            <div className="ec-breadcrumb">
              Gestión Turística
              <span>›</span>
              Recomendaciones
            </div>

            <h1 className="ec-page-title">
              Recomendaciones de lugares
            </h1>

            <p className="ec-page-subtitle">
              Revisa los lugares propuestos por la comunidad antes de incorporarlos al catálogo oficial de ExploraChiapas.
            </p>
          </div>

          <button
            className="admin-proposals-refresh"
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
              className={
                isLoading
                  ? 'is-spinning'
                  : ''
              }
            />

            {isLoading
              ? 'Actualizando'
              : 'Actualizar'}
          </button>
        </header>


        {error && (
          <div className="admin-proposals-alert admin-proposals-alert--error">
            <XCircle size={18} />

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError(null)
              }
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>
          </div>
        )}


        {actionMessage && (
          <div className="admin-proposals-alert admin-proposals-alert--success">
            <CheckCircle2
              size={18}
            />

            <span>
              {
                actionMessage
              }
            </span>

            <button
              type="button"
              onClick={() =>
                setActionMessage(
                  null,
                )
              }
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>
          </div>
        )}


        <section className="proposal-stats-grid">
          <article className="proposal-stat-card proposal-stat-card--pending">
            <div className="proposal-stat-icon">
              <Clock3
                size={19}
              />
            </div>

            <div>
              <span>
                Pendientes
              </span>

              <strong>
                {isLoading
                  ? '…'
                  : counts.pendiente}
              </strong>

              <small>
                Requieren revisión
              </small>
            </div>
          </article>


          <article className="proposal-stat-card proposal-stat-card--approved">
            <div className="proposal-stat-icon">
              <ShieldCheck
                size={19}
              />
            </div>

            <div>
              <span>
                Aprobadas
              </span>

              <strong>
                {isLoading
                  ? '…'
                  : counts.aprobada}
              </strong>

              <small>
                Destinos incorporados
              </small>
            </div>
          </article>


          <article className="proposal-stat-card proposal-stat-card--rejected">
            <div className="proposal-stat-icon">
              <XCircle
                size={19}
              />
            </div>

            <div>
              <span>
                Rechazadas
              </span>

              <strong>
                {isLoading
                  ? '…'
                  : counts.rechazada}
              </strong>

              <small>
                No publicadas
              </small>
            </div>
          </article>


          <article className="proposal-stat-card">
            <div className="proposal-stat-icon">
              <MapPin
                size={19}
              />
            </div>

            <div>
              <span>
                Total recibido
              </span>

              <strong>
                {isLoading
                  ? '…'
                  : counts.total}
              </strong>

              <small>
                Historial completo
              </small>
            </div>
          </article>
        </section>


        <section className="proposal-workspace">
          <div className="proposal-list-panel">
            <div className="proposal-list-toolbar">
              <div className="proposal-tabs">
                {(
                  [
                    [
                      'pendiente',
                      'Pendientes',
                      counts.pendiente,
                    ],

                    [
                      'aprobada',
                      'Aprobadas',
                      counts.aprobada,
                    ],

                    [
                      'rechazada',
                      'Rechazadas',
                      counts.rechazada,
                    ],

                    [
                      'todas',
                      'Todas',
                      counts.total,
                    ],
                  ] as const
                ).map(
                  (
                    [
                      value,
                      label,
                      count,
                    ],
                  ) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        filter ===
                        value
                          ? 'is-active'
                          : ''
                      }
                      onClick={() =>
                        setFilter(
                          value,
                        )
                      }
                    >
                      {label}

                      <span>
                        {count}
                      </span>
                    </button>
                  ),
                )}
              </div>


              <label className="proposal-search">
                <Search
                  size={16}
                />

                <input
                  type="search"
                  value={query}
                  placeholder="Buscar lugar, categoría o municipio"
                  onChange={
                    (
                      event,
                    ) =>
                      setQuery(
                        event
                          .target
                          .value,
                      )
                  }
                />
              </label>
            </div>


            <div className="proposal-list">
              {isLoading && (
                <>
                  <div className="proposal-skeleton" />
                  <div className="proposal-skeleton" />
                  <div className="proposal-skeleton" />
                </>
              )}


              {!isLoading &&
                filtered.map(
                  (
                    proposal,
                  ) => {
                    const firstImage =
                      [
                        ...proposal.images,
                      ].sort(
                        (
                          a,
                          b,
                        ) =>
                          a.order -
                          b.order,
                      )[0];

                    const imageUrl =
                      firstImage
                        ? resolveMediaUrl(
                            firstImage.imageUrl,
                          )
                        : null;

                    const isSelected =
                      selected?.id ===
                      proposal.id;

                    return (
                      <button
                        type="button"
                        key={
                          proposal.id
                        }
                        className={`proposal-list-item ${
                          isSelected
                            ? 'is-selected'
                            : ''
                        }`}
                        onClick={() =>
                          void openProposal(
                            proposal,
                          )
                        }
                      >
                        <div className="proposal-list-thumb">
                          <ImageIcon
                            size={22}
                          />

                          {imageUrl && (
                            <img
                              src={
                                imageUrl
                              }
                              alt=""
                              loading="lazy"
                              onError={
                                (
                                  event,
                                ) => {
                                  event
                                    .currentTarget
                                    .style
                                    .display =
                                    'none';
                                }
                              }
                            />
                          )}
                        </div>


                        <div className="proposal-list-copy">
                          <div className="proposal-list-title">
                            <strong>
                              {
                                proposal.name
                              }
                            </strong>

                            <ProposalStatusBadge
                              status={
                                proposal.status
                              }
                            />
                          </div>

                          <p>
                            {
                              proposal.categoryName
                            }

                            <span>
                              ·
                            </span>

                            {proposal
                              .location
                              .municipality ??
                              'Municipio no indicado'}
                          </p>

                          <div className="proposal-list-meta">
                            <span>
                              <ImageIcon
                                size={13}
                              />

                              {
                                proposal.images
                                  .length
                              }{' '}
                              foto
                              {proposal
                                .images
                                .length ===
                              1
                                ? ''
                                : 's'}
                            </span>

                            <span>
                              {
                                formatDate(
                                  proposal.createdAt,
                                )
                              }
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className="proposal-list-chevron"
                          size={17}
                        />
                      </button>
                    );
                  },
                )}


              {!isLoading &&
                filtered.length ===
                  0 && (
                  <div className="proposal-empty">
                    <MapPin
                      size={28}
                    />

                    <strong>
                      No hay recomendaciones
                    </strong>

                    <p>
                      No encontramos registros que coincidan con este filtro.
                    </p>
                  </div>
                )}
            </div>
          </div>


          <aside className="proposal-detail-panel">
            {!selected ? (
              <div className="proposal-detail-empty">
                <Eye
                  size={30}
                />

                <strong>
                  Selecciona una recomendación
                </strong>

                <p>
                  Aquí podrás revisar fotografías, ubicación e información antes de aprobar o rechazar.
                </p>
              </div>
            ) : (
              <>
                <div className="proposal-detail-header">
                  <div>
                    <ProposalStatusBadge
                      status={
                        selected.status
                      }
                    />

                    <h2>
                      {
                        selected.name
                      }
                    </h2>

                    <p>
                      {
                        selected.categoryName
                      }
                    </p>
                  </div>

                  {isDetailLoading && (
                    <span className="proposal-detail-loading">
                      Actualizando…
                    </span>
                  )}
                </div>


                <div className="proposal-detail-scroll">
                  <section className="proposal-gallery-section">
                    <div className="proposal-section-heading">
                      <div>
                        <strong>
                          Fotografías
                        </strong>

                        <span>
                          {
                            selected.images
                              .length
                          }{' '}
                          archivo
                          {selected.images
                            .length ===
                          1
                            ? ''
                            : 's'}{' '}
                          enviados
                        </span>
                      </div>
                    </div>


                    {selected.images
                      .length >
                    0 ? (
                      <div className="proposal-gallery">
                        {[
                          ...selected.images,
                        ]
                          .sort(
                            (
                              a,
                              b,
                            ) =>
                              a.order -
                              b.order,
                          )
                          .map(
                            (
                              image,
                              index,
                            ) => {
                              const url =
                                resolveMediaUrl(
                                  image.imageUrl,
                                );

                              return (
                                <div
                                  key={
                                    image.id
                                  }
                                  className={`proposal-gallery-image ${
                                    index ===
                                    0
                                      ? 'proposal-gallery-image--featured'
                                      : ''
                                  }`}
                                >
                                  <ImageIcon
                                    size={24}
                                  />

                                  {url && (
                                    <img
                                      src={
                                        url
                                      }
                                      alt={`${selected.name} - fotografía ${index + 1}`}
                                      loading="lazy"
                                      onError={
                                        (
                                          event,
                                        ) => {
                                          event
                                            .currentTarget
                                            .style
                                            .display =
                                            'none';
                                        }
                                      }
                                    />
                                  )}

                                  {index ===
                                    0 && (
                                    <span>
                                      Portada propuesta
                                    </span>
                                  )}
                                </div>
                              );
                            },
                          )}
                      </div>
                    ) : (
                      <div className="proposal-no-images">
                        <ImageIcon
                          size={24}
                        />

                        <span>
                          No hay fotografías disponibles.
                        </span>
                      </div>
                    )}
                  </section>


                  <section className="proposal-detail-section">
                    <div className="proposal-section-heading">
                      <div>
                        <strong>
                          Descripción
                        </strong>

                        <span>
                          Información proporcionada por el usuario
                        </span>
                      </div>
                    </div>

                    <p className="proposal-description">
                      {selected.description ??
                        'Sin descripción.'}
                    </p>
                  </section>


                  <section className="proposal-detail-section">
                    <div className="proposal-section-heading">
                      <div>
                        <strong>
                          Ubicación
                        </strong>

                        <span>
                          Coordenadas registradas por la aplicación móvil
                        </span>
                      </div>
                    </div>


                    <div className="proposal-location-summary">
                      <MapPin
                        size={18}
                      />

                      <div>
                        <strong>
                          {selected
                            .location
                            .address ??
                            'Dirección no especificada'}
                        </strong>

                        <span>
                          {[
                            selected
                              .location
                              .municipality,

                            selected
                              .location
                              .state,
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(
                              ', ',
                            ) ||
                            'Ubicación administrativa no disponible'}
                        </span>

                        <small>
                          {Number(
                            selected
                              .location
                              .latitude,
                          ).toFixed(
                            6,
                          )}
                          ,{' '}
                          {Number(
                            selected
                              .location
                              .longitude,
                          ).toFixed(
                            6,
                          )}
                        </small>
                      </div>
                    </div>


                    <ProposalLocationMap
                      key={
                        selected.id
                      }
                      latitude={
                        Number(
                          selected
                            .location
                            .latitude,
                        )
                      }
                      longitude={
                        Number(
                          selected
                            .location
                            .longitude,
                        )
                      }
                    />
                  </section>


                  <section className="proposal-detail-section proposal-audit">
                    <div className="proposal-section-heading">
                      <div>
                        <strong>
                          Información de revisión
                        </strong>

                        <span>
                          Trazabilidad de la recomendación
                        </span>
                      </div>
                    </div>

                    <dl>
                      <div>
                        <dt>
                          Enviada
                        </dt>

                        <dd>
                          {
                            formatDate(
                              selected.createdAt,
                            )
                          }
                        </dd>
                      </div>

                      <div>
                        <dt>
                          Estado
                        </dt>

                        <dd>
                          {
                            statusMeta[
                              selected.status
                            ].label
                          }
                        </dd>
                      </div>

                      {selected.reviewedAt && (
                        <div>
                          <dt>
                            Revisada
                          </dt>

                          <dd>
                            {
                              formatDate(
                                selected.reviewedAt,
                              )
                            }
                          </dd>
                        </div>
                      )}
                    </dl>
                  </section>


                  {selected.status ===
                    'rechazada' &&
                    selected.rejectionReason && (
                    <section className="proposal-rejection-note">
                      <XCircle
                        size={19}
                      />

                      <div>
                        <strong>
                          Motivo de rechazo
                        </strong>

                        <p>
                          {
                            selected.rejectionReason
                          }
                        </p>
                      </div>
                    </section>
                  )}


                  {selected.status ===
                    'aprobada' && (
                    <section className="proposal-approved-note">
                      <CheckCircle2
                        size={20}
                      />

                      <div>
                        <strong>
                          Destino publicado
                        </strong>

                        <p>
                          Esta recomendación ya fue convertida en un destino oficial de ExploraChiapas.
                        </p>

                        {selected.createdDestinationId && (
                          <small>
                            ID:{' '}
                            {
                              selected.createdDestinationId
                            }
                          </small>
                        )}

                        <Link
                          to="/admin/destinos"
                        >
                          Ver destinos

                          <ExternalLink
                            size={14}
                          />
                        </Link>
                      </div>
                    </section>
                  )}
                </div>


                {selected.status ===
                  'pendiente' && (
                  <div className="proposal-review-actions">
                    <button
                      type="button"
                      className="proposal-reject-button"
                      disabled={
                        actionLoading
                      }
                      onClick={() => {
                        setError(
                          null,
                        );

                        setRejectOpen(
                          true,
                        );
                      }}
                    >
                      <XCircle
                        size={16}
                      />

                      Rechazar
                    </button>

                    <button
                      type="button"
                      className="proposal-approve-button"
                      disabled={
                        actionLoading
                      }
                      onClick={() =>
                        void approveSelected()
                      }
                    >
                      <CheckCircle2
                        size={16}
                      />

                      {actionLoading
                        ? 'Procesando…'
                        : 'Aprobar destino'}
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>
        </section>
      </div>


      {rejectOpen &&
        selected && (
        <div
          className="proposal-modal-backdrop"
          role="presentation"
          onMouseDown={
            (
              event,
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setRejectOpen(
                  false,
                );
              }
            }
          }
        >
          <div
            className="proposal-reject-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-title"
          >
            <div className="proposal-reject-modal__header">
              <div>
                <span className="proposal-reject-modal__icon">
                  <XCircle
                    size={20}
                  />
                </span>

                <div>
                  <h2 id="reject-title">
                    Rechazar recomendación
                  </h2>

                  <p>
                    {
                      selected.name
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setRejectOpen(
                    false,
                  )
                }
              >
                <X
                  size={18}
                />
              </button>
            </div>


            <div className="proposal-reject-modal__body">
              <label htmlFor="rejection-reason">
                Motivo del rechazo
              </label>

              <p>
                Este motivo quedará registrado y podrá mostrarse al usuario que realizó la recomendación.
              </p>

              <textarea
                id="rejection-reason"
                rows={5}
                maxLength={2000}
                autoFocus
                value={
                  rejectionReason
                }
                placeholder="Ej. El lugar ya se encuentra registrado en ExploraChiapas."
                onChange={
                  (
                    event,
                  ) =>
                    setRejectionReason(
                      event
                        .target
                        .value,
                    )
                }
              />

              <span>
                {
                  rejectionReason
                    .length
                }
                /2000
              </span>
            </div>


            <div className="proposal-reject-modal__footer">
              <button
                type="button"
                className="proposal-modal-cancel"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setRejectOpen(
                    false,
                  )
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="proposal-modal-reject"
                disabled={
                  actionLoading ||
                  rejectionReason
                    .trim()
                    .length <
                    3
                }
                onClick={() =>
                  void rejectSelected()
                }
              >
                <XCircle
                  size={16}
                />

                {actionLoading
                  ? 'Procesando…'
                  : 'Confirmar rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
